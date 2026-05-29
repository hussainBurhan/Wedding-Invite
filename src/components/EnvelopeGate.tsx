import React, { useState, useEffect, useRef } from 'react';
import type { Guest } from '../types';
import guestsData from '../data/guests.json';

interface Props {
  onOpen: (guest: Guest) => void;
}

export default function EnvelopeGate({ onOpen }: Props) {
  const [name, setName] = useState('');
  const [suggestions, setSuggestions] = useState<Guest[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
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
      setIsOpen(true);
      setTimeout(() => onOpen(guest), 1000); // Wait for fade-out animation
    } else {
      setError('Name not found. Please check the spelling or contact the hosts.');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 ${isOpen ? 'opacity-0 pointer-events-none scale-110' : 'bg-[#800020]'}`}>
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
      
      <div className="relative z-10 p-8 md:p-12 max-w-md w-full bg-[#FAF9F6] rounded-sm shadow-2xl border-4 border-[#D4AF37] text-center transform transition-transform duration-700 hover:scale-105">
        {/* Golden seal representation */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#D4AF37] rotate-45 border-4 border-[#FAF9F6]"></div>
        
        <h1 className="text-4xl md:text-5xl font-serif text-[#800020] mb-2 mt-4">You're Invited</h1>
        <p className="text-gray-600 mb-8 italic">Please enter your full name to open</p>
        
        <form onSubmit={handleOpen} className="space-y-4">
          <div className="relative" ref={wrapperRef}>
            <input
              type="text"
              value={name}
              onChange={handleInputChange}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              placeholder="e.g., Ali Khan"
              className="w-full px-4 py-3 bg-transparent border-b-2 border-[#D4AF37] focus:outline-none focus:border-[#800020] text-center text-lg font-serif transition-colors"
            />
            
            {/* Auto-suggest Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-20 w-full bg-white border border-[#D4AF37] mt-1 max-h-48 overflow-y-auto shadow-lg text-left">
                {suggestions.map((guest) => (
                  <li 
                    key={guest.id}
                    onClick={() => handleSelectSuggestion(guest)}
                    className="px-4 py-2 hover:bg-[#800020] hover:text-[#D4AF37] cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                  >
                    {guest.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#800020] text-[#D4AF37] font-semibold tracking-widest uppercase hover:bg-[#4A0404] transition-colors border border-[#D4AF37]"
          >
            Open Invitation
          </button>
        </form>
      </div>
    </div>
  );
}