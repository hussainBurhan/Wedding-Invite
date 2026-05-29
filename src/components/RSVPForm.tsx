import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Guest } from '../types';

export default function RSVPForm({ guest }: { guest: Guest }) {
  const [eventAttendance, setEventAttendance] = useState<Record<string, number>>(
    guest.events.reduce((acc, event) => {
      acc[event.name] = event.maxInvitees;
      return acc;
    }, {} as Record<string, number>)
  );
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            {guest.events.map((event) => (
              <div key={event.name} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D4AF37]/30 pb-4 gap-3 sm:gap-0">
                <div>
                  <span className="text-gray-800 text-base sm:text-lg font-medium block">{event.name}</span>
                  <span className="text-xs sm:text-sm text-gray-500">Allowed: up to {event.maxInvitees}</span>
                </div>
                <select
                  value={eventAttendance[event.name]}
                  onChange={(e) => setEventAttendance(prev => ({ ...prev, [event.name]: Number(e.target.value) }))}
                  className="w-full sm:w-48 border-2 border-[#D4AF37] bg-transparent py-2 px-3 focus:outline-none focus:border-[#800020] rounded text-sm sm:text-base"
                >
                  {[...Array(event.maxInvitees + 1)].map((_, i) => (
                    <option key={i} value={i}>{i === 0 ? 'Not Attending' : `${i} Guest${i > 1 ? 's' : ''}`}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 sm:py-4 bg-[#800020] text-[#D4AF37] font-serif text-lg sm:text-xl tracking-wider hover:bg-[#4A0404] transition-colors mt-6 sm:mt-8"
          >
            {Object.values(eventAttendance).every(v => v === 0) ? 'Send Regrets' : 'Confirm Attendance'}
          </button>
        </form>
      </div>
    </section>
  );
}