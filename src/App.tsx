import { useState, useEffect } from 'react';
import type { Guest } from './types';
import EnvelopeGate from './components/EnvelopeGate';
import InvitationDetails from './components/InvitationDetails';
import RSVPForm from './components/RSVPForm';
import heroBg from './assets/1000238742.jpg';

function App() {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [showGate, setShowGate] = useState(true);

  // Countdown logic for September 6th
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    // Target: September 6th, 00:00:00 Pakistan Time (UTC+5)
    const calculateTimeLeft = () => {
      const now = new Date();
      let targetYear = now.getFullYear();
      let targetDate = new Date(`${targetYear}-09-06T00:00:00+05:00`);
      
      if (now.getTime() > targetDate.getTime()) {
        targetYear++;
        targetDate = new Date(`${targetYear}-09-06T00:00:00+05:00`);
      }

      const distance = targetDate.getTime() - now.getTime();
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000 * 60); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans">
      {showGate && <EnvelopeGate onOpen={setGuest} onComplete={() => setShowGate(false)} />}
      
      {guest && (
        <main className="fade-in-up">
          {/* Hero Banner */}
          <header className="relative h-[70vh] md:h-[80vh] flex items-center justify-center bg-[#800020] text-[#D4AF37] overflow-hidden">
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 mix-blend-luminosity"
              style={{ backgroundImage: `url(${heroBg})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#800020]/50 to-[#800020]"></div>

            {/* Golden Border Accents */}
            <div className="absolute inset-4 md:inset-8 border-2 border-[#D4AF37]/80 rounded-lg pointer-events-none z-10 shadow-[0_0_15px_rgba(212,175,55,0.2)]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/woven.png')] opacity-40 mix-blend-overlay z-10"></div>
            
            {/* Bismillah in Arabic - Placed overlapping the top gold frame */}
            <div className="absolute top-2 md:top-6 left-1/2 -translate-x-1/2 z-20 w-32 md:w-48 drop-shadow-md">
              <img 
                src="/pngegg.png" 
                alt="Bismillah" 
                className="w-full h-auto object-contain"
                style={{
                  filter: 'invert(75%) sepia(35%) saturate(718%) hue-rotate(5deg) brightness(91%) contrast(88%) drop-shadow(0px 2px 4px rgba(0,0,0,0.3))'
                }}
              />
            </div>

            <div className="relative z-10 text-center p-6 sm:p-12 md:p-20 m-4 sm:m-6 max-w-[90vw] flex flex-col items-center">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif mb-2 sm:mb-4 tracking-wider text-[#D4AF37] flex flex-col items-center gap-2 sm:gap-4 leading-tight">
                {guest.side === 'bride' ? (
                  <>
                    <span style={{ fontFamily: "'Wasted Vindey', cursive" }}>HAWWA</span>
                    <span style={{ fontFamily: "'Wasted Vindey', cursive" }} className="text-3xl sm:text-4xl md:text-5xl text-[#D4AF37]/80">&amp;</span>
                    <span style={{ fontFamily: "'Wasted Vindey', cursive" }}>HUSSAIN</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontFamily: "'Wasted Vindey', cursive" }}>HUSSAIN</span>
                    <span style={{ fontFamily: "'Wasted Vindey', cursive" }} className="text-3xl sm:text-4xl md:text-5xl text-[#D4AF37]/80">&amp;</span>
                    <span style={{ fontFamily: "'Wasted Vindey', cursive" }}>HAWWA</span>
                  </>
                )}
              </h1>
              <p className="text-xs sm:text-sm md:text-xl tracking-widest uppercase mt-10 font-sans text-[#D4AF37] whitespace-nowrap">Invite you to witness their wedding</p>
            </div>

            {/* Countdown Timer */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 sm:gap-8 z-10 animate-fade-in-up">
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-serif text-[#FAF9F6] drop-shadow-lg">{timeLeft.days}</span>
                <span className="text-[10px] md:text-sm font-light tracking-[0.2em] uppercase text-[#D4AF37] mt-1 drop-shadow-md">Days</span>
              </div>
              <div className="text-2xl md:text-4xl font-serif text-[#D4AF37] -mt-5 opacity-70">:</div>
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-serif text-[#FAF9F6] drop-shadow-lg">{timeLeft.hours}</span>
                <span className="text-[10px] md:text-sm font-light tracking-[0.2em] uppercase text-[#D4AF37] mt-1 drop-shadow-md">Hours</span>
              </div>
              <div className="text-2xl md:text-4xl font-serif text-[#D4AF37] -mt-5 opacity-70">:</div>
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-serif text-[#FAF9F6] drop-shadow-lg">{timeLeft.minutes}</span>
                <span className="text-[10px] md:text-sm font-light tracking-[0.2em] uppercase text-[#D4AF37] mt-1 drop-shadow-md">Mins</span>
              </div>
            </div>
          </header>

          <InvitationDetails guest={guest} />
          <RSVPForm guest={guest} />
          
          <footer className="py-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} {guest.side === 'bride' ? 'Hawwa & Hussain' : 'Hussain & Hawwa'} Wedding. All rights reserved.</p>
          </footer>
        </main>
      )}
    </div>
  );
}

export default App;

