import { useState } from 'react';
import type { Guest } from './types';
import EnvelopeGate from './components/EnvelopeGate';
import InvitationDetails from './components/InvitationDetails';
import RSVPForm from './components/RSVPForm';

function App() {
  const [guest, setGuest] = useState<Guest | null>(null);

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans">
      {!guest && <EnvelopeGate onOpen={setGuest} />}
      
      {guest && (
        <main className="fade-in-up">
          {/* Hero Banner */}
          <header className="relative h-[60vh] md:h-[80vh] flex items-center justify-center bg-[#800020] text-[#D4AF37] overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
            <div className="relative z-10 text-center border-4 border-[#D4AF37] p-12 md:p-20 m-6">
              <h1 className="text-5xl md:text-7xl font-serif mb-4 tracking-wider text-[#D4AF37]">
                {guest.side === 'bride' ? 'Hawwa & Hussain' : 'Hussain & Hawwa'}
              </h1>
              <p className="text-xl md:text-3xl font-light tracking-widest uppercase">Are getting married</p>
              <div className="mt-8 text-sm md:text-lg italic">Scroll to reveal your invitation</div>
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

