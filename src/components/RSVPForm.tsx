import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Guest, GuestEvent } from '../types';

type Attendance = { ladies: number; gents: number };
type AttendanceKind = 'all' | 'dual' | 'ladies' | 'gents' | 'guests';
type AttendancePayload = Attendance & { kind: AttendanceKind };

function eventKind(event: GuestEvent): AttendanceKind {
  if (event.maxInvitees === 'all') return 'all';
  if (event.ladies > 0 && event.gents > 0) return 'dual';
  if (event.ladies > 0 && event.gents === 0) return 'ladies';
  if (event.gents > 0 && event.ladies === 0) return 'gents';
  return 'guests';
}

function defaultAttendance(event: GuestEvent): Attendance {
  if (event.maxInvitees === 'all') {
    return { ladies: 1, gents: 0 }; // 1 = whole family attending
  }
  if (event.ladies > 0 || event.gents > 0) {
    return { ladies: event.ladies, gents: event.gents };
  }
  return { ladies: event.maxInvitees as number, gents: 0 };
}

function allowedLabel(event: GuestEvent): string {
  if (event.maxInvitees === 'all') return 'Allowed: All';
  if (event.ladies === 1 && event.gents === 1) return 'Allowed: 1 Lady & 1 Gent';
  if (event.ladies === 1 && event.gents === 0) return 'Allowed: Ladies (1)';
  if (event.gents === 1 && event.ladies === 0) return 'Allowed: Gents (1)';
  return `Allowed: up to ${event.maxInvitees}`;
}

function buildAttendancePayload(
  guest: Guest,
  eventAttendance: Record<string, Attendance>
): Record<string, AttendancePayload> {
  return guest.events.reduce((acc, event) => {
    const value = eventAttendance[event.name] ?? { ladies: 0, gents: 0 };
    acc[event.name] = { ...value, kind: eventKind(event) };
    return acc;
  }, {} as Record<string, AttendancePayload>);
}

function summarizeAttendance(entry: AttendancePayload): string {
  const { ladies, gents, kind } = entry;
  if (kind === 'all') return ladies > 0 ? 'All' : '0';
  if (kind === 'dual') {
    if (ladies === 0 && gents === 0) return '0';
    if (ladies === 1 && gents === 1) return '1L+1G';
    if (ladies === 1 && gents === 0) return '1 Lady';
    if (ladies === 0 && gents === 1) return '1 Gent';
    return `${ladies}L+${gents}G`;
  }
  if (kind === 'ladies') return ladies > 0 ? '1 Lady' : '0';
  if (kind === 'gents') return gents > 0 ? '1 Gent' : '0';
  const total = ladies + gents;
  if (total === 0) return '0';
  return `${total} Guest${total > 1 ? 's' : ''}`;
}

export default function RSVPForm({ guest }: { guest: Guest }) {
  const [eventAttendance, setEventAttendance] = useState<Record<string, Attendance>>(
    guest.events.reduce((acc, event) => {
      acc[event.name] = defaultAttendance(event);
      return acc;
    }, {} as Record<string, Attendance>)
  );
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    if (formRef.current) observer.observe(formRef.current);
    return () => observer.disconnect();
  }, []);

  const allRegrets = Object.values(eventAttendance).every(
    (a) => a.ladies + a.gents === 0
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined;
    if (!formspreeEndpoint || formspreeEndpoint.includes('YOUR_FORM_ID')) {
      setError('RSVP is not configured yet. Please try again later.');
      return;
    }

    setSubmitting(true);
    try {
      const attendance = buildAttendancePayload(guest, eventAttendance);
      const eventFields = Object.fromEntries(
        Object.entries(attendance).map(([name, entry]) => [name, summarizeAttendance(entry)])
      );

      const payload = {
        _subject: `Wedding RSVP: ${guest.name}`,
        guestId: guest.id,
        guestName: guest.name,
        side: guest.side,
        status: allRegrets ? 'regrets' : 'attending',
        submittedAt: new Date().toISOString(),
        ...eventFields,
        attendanceJson: JSON.stringify(attendance),
      };

      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; errors?: Array<{ message?: string }> }
        | null;

      if (!response.ok) {
        const message =
          result?.error ||
          result?.errors?.[0]?.message ||
          'Could not save your RSVP. Please try again.';
        throw new Error(message);
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-12 sm:py-20 px-4 sm:px-6 text-center bg-[#800020] text-white fade-in-up">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4 sm:mb-6">Thank You!</h2>
        <p className="text-base sm:text-lg md:text-xl max-w-lg mx-auto">
          Your RSVP has been joyfully received. We can't wait to celebrate with you!
        </p>
        <div className="mt-6 sm:mt-8 text-5xl sm:text-6xl animate-bounce">✨</div>
      </section>
    );
  }

  return (
    <section ref={formRef} className="py-12 sm:py-20 px-4 sm:px-6 opacity-0 bg-[#FAF9F6]">
      <div className="max-w-2xl mx-auto border-4 border-[#D4AF37] p-6 sm:p-8 md:p-12 bg-white relative">
        <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-t-4 border-l-4 border-[#800020] -translate-x-2 -translate-y-2"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 border-b-4 border-r-4 border-[#800020] translate-x-2 translate-y-2"></div>
        
        <h2 className="text-3xl sm:text-4xl font-serif text-[#800020] text-center mb-6 sm:mb-8">RSVP</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6 text-left">
            <h3 className="text-lg sm:text-xl text-gray-800 font-semibold mb-2 sm:mb-4 text-center">Select Attendance per Event</h3>
            {guest.events.map((event) => {
              const isAll = event.maxInvitees === 'all';
              const isDual = event.ladies > 0 && event.gents > 0;
              const isLadiesOnly = event.ladies > 0 && event.gents === 0 && event.maxInvitees !== 'all';
              const isGentsOnly = event.gents > 0 && event.ladies === 0;
              const attendance = eventAttendance[event.name];

              return (
                <div key={event.name} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D4AF37]/30 pb-4 gap-3 sm:gap-0">
                  <div>
                    <span className="text-gray-800 text-base sm:text-lg font-medium block">{event.name}</span>
                    <span className="text-xs sm:text-sm text-gray-500">{allowedLabel(event)}</span>
                  </div>
                  {isAll ? (
                    <select
                      value={attendance.ladies}
                      disabled={submitting}
                      onChange={(e) =>
                        setEventAttendance((prev) => ({
                          ...prev,
                          [event.name]: { ladies: Number(e.target.value), gents: 0 },
                        }))
                      }
                      className="w-full sm:w-48 border-2 border-[#D4AF37] bg-transparent py-2 px-3 focus:outline-none focus:border-[#800020] rounded text-sm sm:text-base disabled:opacity-60"
                    >
                      <option value={0}>Not Attending</option>
                      <option value={1}>All Attending</option>
                    </select>
                  ) : isDual ? (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <select
                        value={attendance.ladies}
                        disabled={submitting}
                        onChange={(e) =>
                          setEventAttendance((prev) => ({
                            ...prev,
                            [event.name]: { ...prev[event.name], ladies: Number(e.target.value) },
                          }))
                        }
                        className="w-full sm:w-36 border-2 border-[#D4AF37] bg-transparent py-2 px-3 focus:outline-none focus:border-[#800020] rounded text-sm sm:text-base disabled:opacity-60"
                        aria-label={`${event.name} ladies`}
                      >
                        <option value={0}>Not Attending</option>
                        <option value={1}>1 Lady</option>
                      </select>
                      <select
                        value={attendance.gents}
                        disabled={submitting}
                        onChange={(e) =>
                          setEventAttendance((prev) => ({
                            ...prev,
                            [event.name]: { ...prev[event.name], gents: Number(e.target.value) },
                          }))
                        }
                        className="w-full sm:w-36 border-2 border-[#D4AF37] bg-transparent py-2 px-3 focus:outline-none focus:border-[#800020] rounded text-sm sm:text-base disabled:opacity-60"
                        aria-label={`${event.name} gents`}
                      >
                        <option value={0}>Not Attending</option>
                        <option value={1}>1 Gent</option>
                      </select>
                    </div>
                  ) : isLadiesOnly ? (
                    <select
                      value={attendance.ladies}
                      disabled={submitting}
                      onChange={(e) =>
                        setEventAttendance((prev) => ({
                          ...prev,
                          [event.name]: { ladies: Number(e.target.value), gents: 0 },
                        }))
                      }
                      className="w-full sm:w-48 border-2 border-[#D4AF37] bg-transparent py-2 px-3 focus:outline-none focus:border-[#800020] rounded text-sm sm:text-base disabled:opacity-60"
                    >
                      <option value={0}>Not Attending</option>
                      <option value={1}>1 Lady</option>
                    </select>
                  ) : isGentsOnly ? (
                    <select
                      value={attendance.gents}
                      disabled={submitting}
                      onChange={(e) =>
                        setEventAttendance((prev) => ({
                          ...prev,
                          [event.name]: { ladies: 0, gents: Number(e.target.value) },
                        }))
                      }
                      className="w-full sm:w-48 border-2 border-[#D4AF37] bg-transparent py-2 px-3 focus:outline-none focus:border-[#800020] rounded text-sm sm:text-base disabled:opacity-60"
                    >
                      <option value={0}>Not Attending</option>
                      <option value={1}>1 Gent</option>
                    </select>
                  ) : (
                    <select
                      value={attendance.ladies}
                      disabled={submitting}
                      onChange={(e) =>
                        setEventAttendance((prev) => ({
                          ...prev,
                          [event.name]: { ladies: Number(e.target.value), gents: 0 },
                        }))
                      }
                      className="w-full sm:w-48 border-2 border-[#D4AF37] bg-transparent py-2 px-3 focus:outline-none focus:border-[#800020] rounded text-sm sm:text-base disabled:opacity-60"
                    >
                      {[...Array((event.maxInvitees as number) + 1)].map((_, i) => (
                        <option key={i} value={i}>
                          {i === 0 ? 'Not Attending' : `${i} Guest${i > 1 ? 's' : ''}`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <p className="text-center text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 sm:py-4 bg-[#800020] text-[#D4AF37] font-serif text-lg sm:text-xl tracking-wider hover:bg-[#4A0404] transition-colors mt-6 sm:mt-8 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Sending…' : allRegrets ? 'Send Regrets' : 'Confirm Attendance'}
          </button>
        </form>
      </div>
    </section>
  );
}
