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
    <div className="py-12 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto space-y-20 sm:space-y-32 text-center">
      {/* Welcome Section */}
        <section ref={(el) => { sectionsRef.current[0] = el; }} className="opacity-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#800020] mb-4 sm:mb-6 leading-relaxed">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </h2>
        <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6 sm:mb-8"></div>
        <div className="flex flex-col gap-5 sm:gap-6 font-arabic text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto" dir="rtl">
          
          <p className="text-justify">
            الداعي الاجل سيدنا محمد برهان الدين رض ایک بیان ما فرماوے چھے: فاطمة ني شادي ني حرمة سي دعاء كري لوں چھوں کہ خدا تعالیٰ مؤمنين انے مؤمنات نا جوڑا نے سلامة راکھے
          </p>

          <p className="text-justify">
            الداعي الاجل سيدنا محمد برهان الدين رض انے اپنے منصور الداعي الاجل سيدنا ومولانا مفضل سيف الدين طع نادعاء مبارک نا وسيلة سي
          </p>

          <div className="py-6 border-y border-[#D4AF37]/30 my-2 text-[#800020] text-center">
            <p className="mb-3">
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">(الابن العزيز)</span>
              <span className="text-2xl sm:text-3xl font-bold">حسين</span><br/>
              <span className="text-sm sm:text-base">بن برهان الدين بھائی لیس والا</span>
            </p>
            
            <p className="my-4 text-[#D4AF37] font-bold text-xl sm:text-2xl">ني شادي مع</p>
            
            <p>
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">(البنت الحبيبة)</span>
              <span className="text-2xl sm:text-3xl font-bold">حواء</span>
            </p>
          </div>

          <p className="text-justify">
            ساتھے مولانا المنعام طع نا دعاء مبارک انے رضا مبارک سي طے تھئي چھے ۔ تہ نواب مولی طع نے مع غاية الخشوع اذن عرض کريئے چھے
          </p>

        </div>
      </section>

      {/* Events Section */}
      <section ref={(el) => { sectionsRef.current[1] = el; }} className="opacity-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#800020] mb-8 sm:mb-12">Your Events</h2>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 justify-center">
          {guest.events.map((event) => (
            <div key={event.name} className="border border-[#D4AF37] p-6 sm:p-8 bg-white shadow-lg relative max-w-sm mx-auto w-full">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FAF9F6] px-4">
                <span className="text-3xl text-[#800020]">❦</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-[#800020] mb-2">{event.name}</h3>
              <p className="text-[#D4AF37] font-semibold mb-4 text-sm sm:text-base">{eventDetails[event.name]?.time}</p>
              <div className="bg-[#FAF9F6] py-1.5 sm:py-2 px-3 sm:px-4 rounded mb-4 inline-block border border-[#D4AF37]/30">
                <p className="text-[#800020] font-semibold text-sm sm:text-base">Admitting: {event.maxInvitees} Guest{event.maxInvitees > 1 ? 's' : ''}</p>
              </div>
              <p className="text-gray-800 font-medium mb-2 text-sm sm:text-base">{eventDetails[event.name]?.location}</p>
              <p className="text-gray-600 text-xs sm:text-sm">{eventDetails[event.name]?.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}