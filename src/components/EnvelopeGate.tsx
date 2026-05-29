import { useState, useEffect, useRef } from 'react';
import type { Guest } from '../types';
import guestsData from '../data/guests.json';
import heroBg from '../assets/1000238742.jpg';

interface Props {
  onOpen: (guest: Guest) => void;
}

export default function EnvelopeGate({ onOpen }: Props) {
  const [name, setName] = useState('');
  const [suggestions, setSuggestions] = useState<Guest[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  
  // Animation states
  const [isOpening, setIsOpening] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    if (value.trim().length > 0) {
      const query = value.toLowerCase();
      const filtered = (guestsData as Guest[]).filter(g => 
        g.name.toLowerCase().includes(query)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (guest: Guest) => {
    setName(guest.name);
    setShowSuggestions(false);
  };

  const handleOpen = (e: React.FormEvent) => {
    e.preventDefault();
    const guest = (guestsData as Guest[]).find(
      (g) => g.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (guest) {
      setError('');
      // 1. Break the seal and swing open the gatefold doors in 3D
      setIsOpening(true);
      
      // 2. Wait for doors animation to finish, then fade out the gate container
      setTimeout(() => {
        setIsFadingOut(true);
        // 3. Wait for fade out, then transition to main screen
        setTimeout(() => onOpen(guest), 1000);
      }, 1500); // 1.5s matches the duration-1500 of the doors opening
    } else {
      setError('Name not found. Please check spelling.');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#800020] transition-opacity duration-1000 overflow-hidden ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Background layer behind the doors (Revealed when opened) */}
      <div className="absolute inset-0 bg-[#800020] pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: `url(${heroBg})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#800020]/50 to-[#800020]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
      </div>
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1500 ease-in-out ${isOpening ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif mb-4 tracking-wider text-[#D4AF37] flex flex-col items-center gap-2 sm:gap-4 leading-tight">
          <span className="text-xl sm:text-2xl md:text-3xl font-light tracking-widest uppercase mb-2">A Love Letter From</span>
          <span>Hawwa</span>
          <span className="text-3xl sm:text-4xl md:text-5xl italic font-light text-[#D4AF37]/80">&amp;</span>
          <span>Hussain</span>
        </h1>
      </div>
      
      {/* 3D Gatefold Doors Container */}
      <div className="absolute inset-0 [perspective:2000px] pointer-events-none">
        
        {/* Left Door */}
        <div 
          className={`absolute top-0 left-0 bottom-0 w-1/2 bg-[#800020] origin-left transition-transform duration-1500 ease-in-out border-r border-[#D4AF37]/50 shadow-[15px_0_30px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden ${isOpening ? '[transform:rotateY(-110deg)]' : 'translate-x-0'}`}
        >
          {/* Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
          {/* Edge gradient for depth */}
          <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-black/20 to-transparent z-0"></div>
          
          {/* Elegant Frame Border (Left Half) */}
          <div className="absolute top-4 bottom-4 left-4 right-0 md:top-8 md:bottom-8 md:left-8 border-y-2 border-l-2 border-r-0 border-[#D4AF37]/60 pointer-events-none"></div>
          <div className="absolute top-5 bottom-5 left-5 right-0 md:top-9 md:bottom-9 md:left-9 border-y border-l border-r-0 border-[#D4AF37]/30 pointer-events-none"></div>
          
          {/* Corner accents for the frame (Left Side Only) */}
          <div className="absolute top-3 left-3 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none"></div>
          <div className="absolute bottom-3 left-3 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none"></div>
        </div>
        
        {/* Right Door */}
        <div 
          className={`absolute top-0 right-0 bottom-0 w-1/2 bg-[#800020] origin-right transition-transform duration-1500 ease-in-out border-l border-[#D4AF37]/50 shadow-[-15px_0_30px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden ${isOpening ? '[transform:rotateY(110deg)]' : 'translate-x-0'}`}
        >
          {/* Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
          {/* Edge gradient for depth */}
          <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-black/20 to-transparent z-0"></div>
          
          {/* Elegant Frame Border (Right Half) */}
          <div className="absolute top-4 bottom-4 right-4 left-0 md:top-8 md:bottom-8 md:right-8 border-y-2 border-r-2 border-l-0 border-[#D4AF37]/60 pointer-events-none"></div>
          <div className="absolute top-5 bottom-5 right-5 left-0 md:top-9 md:bottom-9 md:right-9 border-y border-r border-l-0 border-[#D4AF37]/30 pointer-events-none"></div>
          
          {/* Corner accents for the frame (Right Side Only) */}
          <div className="absolute top-3 right-3 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none"></div>
          <div className="absolute bottom-3 right-3 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none"></div>
        </div>

      </div>

      {/* Center Seal & Form */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ease-in-out pointer-events-auto ${isOpening ? 'scale-150 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        {/* Outer subtle glow */}
        <div className="absolute inset-[-10px] rounded-full bg-[#D4AF37]/20 blur-md pointer-events-none"></div>
        
        <div className="w-[220px] h-[220px] md:w-[260px] md:h-[260px] rounded-full bg-[#800020] shadow-[0_15px_35px_rgba(0,0,0,0.8)] border-[4px] border-[#D4AF37] flex flex-col items-center justify-center p-4 relative">
          
          {/* Subtle wax texture overlay */}
          <div className="absolute inset-0 rounded-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>
          
          {/* Inner embossed rings */}
          <div className="absolute inset-2 border border-[#D4AF37]/40 rounded-full pointer-events-none"></div>
          <div className="absolute inset-3 border-2 border-dashed border-[#D4AF37]/20 rounded-full pointer-events-none"></div>

          <h2 className="text-4xl md:text-4xl font-serif text-[#D4AF37] mb-4 font-normal tracking-widest relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" style={{ fontFamily: "'Playfair Display', serif" }}>H | H</h2>
          
          <form onSubmit={handleOpen} className="w-4/5 relative z-10 space-y-3">
            <div className="relative" ref={wrapperRef}>
              <input
                type="text"
                value={name}
                onChange={handleInputChange}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                placeholder="Enter your name"
                className="w-full px-3 py-1.5 md:py-2 bg-transparent border-b-2 border-[#D4AF37]/50 focus:border-[#D4AF37] rounded-none focus:outline-none text-center text-xs md:text-sm font-serif text-[#FAF9F6] placeholder:text-[#FAF9F6]/50 transition-colors"
              />
              
              {/* Auto-suggest Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-[140%] -left-[20%] bg-[#FAF9F6] border border-[#D4AF37] mt-3 max-h-40 overflow-y-auto shadow-2xl text-left rounded shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  {suggestions.map((guest) => (
                    <li 
                      key={guest.id}
                      onClick={() => handleSelectSuggestion(guest)}
                      className="px-4 py-2 hover:bg-[#800020] hover:text-[#D4AF37] cursor-pointer transition-colors border-b border-gray-200 last:border-0 font-serif text-[#800020] text-sm"
                    >
                      {guest.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {error && (
              <div className="w-full text-center absolute -bottom-6 left-0">
                <p className="text-[#FAF9F6] text-[10px] font-bold bg-[#800020] border border-[#D4AF37]/50 px-2 py-1 rounded shadow-sm inline-block leading-tight whitespace-nowrap">
                  {error}
                </p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full py-1.5 md:py-2 mt-2 bg-[#D4AF37] text-[#800020] font-bold tracking-widest uppercase rounded hover:bg-[#F3E5AB] transition-colors shadow-[0_4px_10px_rgba(0,0,0,0.3)] text-[10px] md:text-xs"
            >
              Open
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}