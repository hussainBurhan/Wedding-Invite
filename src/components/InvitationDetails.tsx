import { useEffect, useRef } from 'react';
import type { Guest } from '../types';

export default function InvitationDetails({ guest }: { guest: Guest }) {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const eventDetails: Record<string, { time: string; location: string; desc: string }> = {
    "Mehendi Night": { time: "6:00 PM - Friday", location: "The Royal Gardens", desc: "Join us for an evening of music, dance, and henna." },
    "Wedding Ceremony": { time: "10:00 AM - Saturday", location: "Grand Palace Hall", desc: "Witness the sacred union and vows." },
    "Grand Reception": { time: "7:00 PM - Saturday", location: "Crystal Ballroom", desc: "Dine and dance the night away to celebrate." }
  };

  return (
    <div className="py-20 px-6 max-w-4xl mx-auto space-y-32 text-center">
      {/* Welcome Section */}
      <section ref={(el) => { sectionsRef.current[0] = el; }} className="opacity-0">
        <h2 className="text-5xl md:text-7xl font-serif text-[#800020] mb-6">Welcome</h2>
        <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
          Dear {guest.name}
          {guest.events.some(e => e.maxInvitees > 1) ? ` & Family` : ''},
        </p>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          {guest.side === 'bride' 
            ? "Haider Ali Sabun wala requests the honor of your presence at the wedding ceremony of his beloved daughter Hawwa with Hussain."
            : "Burhanuddin Saifuddin Lace wala requests the honor of your presence at the wedding ceremony of his beloved son Hussain with Hawwa."}
        </p>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Your presence will add extra joy to our special day.
        </p>
      </section>

      {/* Events Section */}
      <section ref={(el) => { sectionsRef.current[1] = el; }} className="opacity-0">
        <h2 className="text-4xl md:text-5xl font-serif text-[#800020] mb-12">Your Events</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-auto justify-center">
          {guest.events.map((event) => (
            <div key={event.name} className="border border-[#D4AF37] p-8 bg-white shadow-lg relative max-w-sm mx-auto">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FAF9F6] px-4">
                <span className="text-3xl text-[#800020]">❦</span>
              </div>
              <h3 className="text-2xl font-serif text-[#800020] mb-2">{event.name}</h3>
              <p className="text-[#D4AF37] font-semibold mb-4">{eventDetails[event.name]?.time}</p>
              <div className="bg-[#FAF9F6] py-2 px-4 rounded mb-4 inline-block border border-[#D4AF37]/30">
                <p className="text-[#800020] font-semibold">Admitting: {event.maxInvitees} Guest{event.maxInvitees > 1 ? 's' : ''}</p>
              </div>
              <p className="text-gray-800 font-medium mb-2">{eventDetails[event.name]?.location}</p>
              <p className="text-gray-600 text-sm">{eventDetails[event.name]?.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}