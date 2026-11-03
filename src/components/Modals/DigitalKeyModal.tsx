import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Reservation } from '../../types';
import { AppLogo } from '../Common/AppLogo';
import { 
  Key, 
  X, 
  Sparkles, 
  Wifi, 
  Lock, 
  Unlock, 
  Sun, 
  Moon, 
  Thermometer, 
  Bell, 
  ShieldCheck,
  CheckCircle2,
  Volume2
} from 'lucide-react';

interface DigitalKeyModalDialogProps {
  reservation: Reservation;
}

const DigitalKeyModalDialog: React.FC<DigitalKeyModalDialogProps> = ({ reservation }) => {
  const { closeDigitalKeyModal } = useHotel();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [temperature, setTemperature] = useState(20.5);
  const [lightScene, setLightScene] = useState<'Warm Sunset' | 'Romantic Dim' | 'Full Sanctuary' | 'Night Glow'>('Warm Sunset');
  const [dndActive, setDndActive] = useState(false);
  const [butlerCalled, setButlerCalled] = useState(false);

  // Play synthetic luxury lock chime using Web Audio API
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {}
  };

  const handleTapUnlock = () => {
    if (isUnlocking) return;
    setIsUnlocking(true);

    setTimeout(() => {
      setIsUnlocking(false);
      setIsUnlocked(!isUnlocked);
      playChime();
    }, 900);
  };

  const handleCallButler = () => {
    setButlerCalled(true);
    setTimeout(() => setButlerCalled(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1E2522]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-[#E3DCD1] rounded-[32px] max-w-lg w-full p-6 lg:p-7 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#1E2522] text-[#D4AF37]">
              Guest Mobile Pass
            </span>
            <span className="text-xs text-[#71827B]">Azure Digital Keycard</span>
          </div>

          <button 
            onClick={closeDigitalKeyModal}
            className="text-[#7A8C84] hover:text-[#1E2522] p-1.5 rounded-full hover:bg-[#FAF8F4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Digital Luxury Keycard Widget */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E2522] via-[#283530] to-[#121715] text-[#FBF9F5] p-6 border border-[#3A4B43] shadow-xl space-y-6">
          
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <AppLogo size={34} variant="gold" />
              <div>
                <span className="font-serif-heading font-bold text-sm tracking-wider uppercase block">The Azure Sanctuary</span>
                <span className="text-[10px] text-[#A2B5AC]">Verified NFC Mobile Token</span>
              </div>
            </div>

            <div className="text-right">
              <Wifi className="w-4 h-4 text-[#D4AF37] ml-auto animate-pulse" />
              <span className="text-[9px] text-[#A2B5AC] uppercase font-mono">NFC ACTIVE</span>
            </div>
          </div>

          {/* Keycard Center Graphic */}
          <div className="text-center py-4 space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold">
              Suite Assignment
            </span>
            <h2 className="font-serif-heading text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Suite {reservation.roomNumber}
            </h2>
            <p className="text-xs text-[#A8BBB2]">
              {reservation.roomType} • {reservation.guestName}
            </p>
            <span className="inline-block text-[10px] text-[#869A90] font-mono mt-1">
              VALID: {reservation.checkInDate} UNTIL {reservation.checkOutDate}
            </span>
          </div>

          {/* Interactive Tap to Unlock Button */}
          <div>
            <button
              onClick={handleTapUnlock}
              disabled={isUnlocking}
              className={`w-full py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                isUnlocking
                  ? 'bg-[#3A4B43] text-white animate-pulse'
                  : isUnlocked
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-[#D4AF37] hover:bg-[#C29E2E] text-[#1A2420] active:scale-95'
              }`}
            >
              {isUnlocking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating RFID Lock...</span>
                </>
              ) : isUnlocked ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Suite {reservation.roomNumber} Door Unlocked</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Hold Near Lock / Tap to Unlock</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* In-Suite Smart Room Automations */}
        <div className="space-y-3 text-xs">
          <span className="font-bold text-[#1E2522] uppercase tracking-wider block">
            Suite {reservation.roomNumber} Remote Controls
          </span>

          {/* Climate & Lighting Grid */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Climate Control */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E7DFD2] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#1E2522] flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-[#D4AF37]" /> Climate
                </span>
                <span className="font-bold text-sm text-[#1E2522]">{temperature}°C</span>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setTemperature(prev => Math.max(18, Number((prev - 0.5).toFixed(1))))}
                  className="w-8 h-8 rounded-lg bg-white border border-[#D5CCC0] text-sm font-bold text-[#1E2522] flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="range"
                  min="18"
                  max="26"
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="flex-1 accent-[#1E2522] cursor-pointer"
                />
                <button
                  onClick={() => setTemperature(prev => Math.min(26, Number((prev + 0.5).toFixed(1))))}
                  className="w-8 h-8 rounded-lg bg-white border border-[#D5CCC0] text-sm font-bold text-[#1E2522] flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Lighting Scenes */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E7DFD2] space-y-2">
              <span className="font-semibold text-[#1E2522] flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-[#D4AF37]" /> Light Ambience
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Warm Sunset', 'Romantic Dim', 'Full Sanctuary', 'Night Glow'] as const).map(sc => (
                  <button
                    key={sc}
                    onClick={() => setLightScene(sc)}
                    className={`py-1 px-2 rounded-lg text-[10px] font-semibold border transition-all ${
                      lightScene === sc 
                        ? 'bg-[#1E2522] text-white border-[#1E2522]' 
                        : 'bg-white text-[#55675F] border-[#E0D8CC]'
                    }`}
                  >
                    {sc}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Concierge & DND Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setDndActive(!dndActive)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                dndActive
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-[#FAF8F4] border-[#E0D8CC] text-[#2C3833] hover:bg-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{dndActive ? 'Privacy (DND) Active' : 'Do Not Disturb'}</span>
            </button>

            <button
              onClick={handleCallButler}
              className="flex-1 py-2.5 rounded-xl bg-[#1E2522] hover:bg-[#2C3B34] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Bell className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{butlerCalled ? 'Butler Alerted' : 'Request Butler'}</span>
            </button>
          </div>

          {butlerCalled && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bespoke Concierge & Valet has received your request for Suite {reservation.roomNumber}.</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export const DigitalKeyModal: React.FC = () => {
  const { isDigitalKeyModalOpen, selectedKeyReservation } = useHotel();

  if (!isDigitalKeyModalOpen || !selectedKeyReservation) return null;

  return <DigitalKeyModalDialog reservation={selectedKeyReservation} />;
};
