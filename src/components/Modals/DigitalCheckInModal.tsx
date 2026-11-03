import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Key, 
  CreditCard, 
  FileText, 
  User, 
  Lock, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DigitalCheckInModalProps {
  reservation: any;
  onClose: () => void;
}

export const DigitalCheckInModal: React.FC<DigitalCheckInModalProps> = ({ reservation, onClose }) => {
  const { submitDigitalCheckIn, openDigitalKeyModal, formatCurrency } = useHotel();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [passportNumber, setPassportNumber] = useState('P-98429182');
  const [companionName, setCompanionName] = useState('Lady Genevieve Sterling');
  const [estimatedArrival, setEstimatedArrival] = useState('14:30');
  const [signatureDone, setSignatureDone] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmitCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    submitDigitalCheckIn(reservation.id, {
      passportNumber,
      companionName,
      estimatedArrival
    });
    setIsCompleted(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#EAE3D6] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1E2522] text-[#D4AF37] flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-heading text-lg font-bold text-[#1E2522]">
                Contactless Digital Pre-Check-In
              </h2>
              <span className="text-[10px] text-[#7A8C84]">Frictionless Guest Registration & Digital Passport</span>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-[#7A8C84] hover:bg-[#FAF8F4]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isCompleted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif-heading text-xl font-bold text-[#1E2522]">Registration Complete!</h3>
            <p className="text-xs text-[#52645D] max-w-sm mx-auto">
              Welcome to The Azure Sanctuary, {reservation.guestName}. Suite {reservation.roomNumber} has been reserved and your contactless mobile key is active.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  openDigitalKeyModal(reservation);
                }}
                className="w-full py-3 bg-[#1E2522] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#2C3B34] transition-all flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>View & Activate Mobile Digital Key</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitCheckIn} className="space-y-4 text-xs">
            
            {/* Reservation Summary */}
            <div className="p-3 bg-[#FAF8F4] border border-[#EAE3D6] rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-[#1E2522] block">{reservation.guestName}</span>
                <span className="text-[10px] text-[#7A8C84]">Suite {reservation.roomNumber} ({reservation.roomType})</span>
              </div>
              <span className="text-xs font-bold text-[#9E7D23]">
                {reservation.checkInDate} to {reservation.checkOutDate}
              </span>
            </div>

            {/* Passport / Identification */}
            <div>
              <label className="block font-semibold text-[#1E2522] mb-1">Passport / Government ID Number</label>
              <input 
                type="text"
                value={passportNumber}
                onChange={e => setPassportNumber(e.target.value)}
                required
                className="w-full bg-[#FAF8F4] border border-[#D8CEBF] rounded-xl p-2.5 outline-none font-mono"
              />
            </div>

            {/* Companion / Additional Guest */}
            <div>
              <label className="block font-semibold text-[#1E2522] mb-1">Registered Companion / Additional Guest</label>
              <input 
                type="text"
                value={companionName}
                onChange={e => setCompanionName(e.target.value)}
                placeholder="Full name of accompanying guest"
                className="w-full bg-[#FAF8F4] border border-[#D8CEBF] rounded-xl p-2.5 outline-none"
              />
            </div>

            {/* Estimated Time of Arrival */}
            <div>
              <label className="block font-semibold text-[#1E2522] mb-1">Estimated Arrival Time</label>
              <input 
                type="time"
                value={estimatedArrival}
                onChange={e => setEstimatedArrival(e.target.value)}
                className="w-full bg-[#FAF8F4] border border-[#D8CEBF] rounded-xl p-2.5 outline-none"
              />
            </div>

            {/* Digital Signature Canvas Simulation */}
            <div>
              <label className="block font-semibold text-[#1E2522] mb-1">Registration Card Terms & Signature</label>
              <div 
                onClick={() => setSignatureDone(true)}
                className={`h-20 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
                  signatureDone ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'bg-[#FAF8F4] border-[#D8CEBF] text-[#7A8C84] hover:bg-[#F2ECE1]'
                }`}
              >
                {signatureDone ? (
                  <span className="font-serif italic text-lg font-bold text-[#1E2522] tracking-wider">Victoria Sterling ✓</span>
                ) : (
                  <span>Click to Sign Digital Registration Terms</span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl font-semibold text-[#7A8C84] hover:bg-[#FAF8F4]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold bg-[#1E2522] text-[#D4AF37] hover:bg-[#2C3B34] transition-colors"
              >
                Complete Check-In & Issue Key
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
