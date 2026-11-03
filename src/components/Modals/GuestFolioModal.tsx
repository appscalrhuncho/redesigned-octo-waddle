import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { FolioItem, Reservation } from '../../types';
import { AppLogo } from '../Common/AppLogo';
import { 
  X, 
  Printer, 
  Download, 
  Plus, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  BedDouble, 
  Receipt, 
  FileText 
} from 'lucide-react';

interface GuestFolioModalDialogProps {
  reservation: Reservation;
}

const GuestFolioModalDialog: React.FC<GuestFolioModalDialogProps> = ({ reservation }) => {
  const { 
    closeFolioModal, 
    addFolioItem, 
    settleFolioPayment 
  } = useHotel();

  const [isAddChargeOpen, setIsAddChargeOpen] = useState(false);
  const [chargeCat, setChargeCat] = useState<FolioItem['category']>('Minibar');
  const [chargeDesc, setChargeDesc] = useState('');
  const [chargeAmount, setChargeAmount] = useState<number>(45);

  const [isSettleOpen, setIsSettleOpen] = useState(false);
  const [settleAmount, setSettleAmount] = useState<number>(
    Math.max(0, reservation.totalAmount - reservation.paidAmount)
  );
  const [settleMethod, setSettleMethod] = useState<'Visa' | 'MasterCard' | 'Amex' | 'ApplePay' | 'Cash'>('Amex');

  const folioItems = reservation.folio || [];
  const balanceDue = Math.max(0, reservation.totalAmount - reservation.paidAmount);

  const handleAddCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chargeDesc || chargeAmount <= 0) return;

    addFolioItem(reservation.id, {
      category: chargeCat,
      description: chargeDesc,
      amount: Number(chargeAmount),
      postedBy: 'Front Desk Agent'
    });

    setChargeDesc('');
    setIsAddChargeOpen(false);
  };

  const handleSettle = (e: React.FormEvent) => {
    e.preventDefault();
    if (settleAmount <= 0) return;

    settleFolioPayment(reservation.id, settleAmount, settleMethod);
    setIsSettleOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1E2522]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#E3DCD1] rounded-3xl max-w-3xl w-full p-6 lg:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0">
        
        {/* Folio Header & Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D6] print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#1E2522] text-[#D4AF37]">
              Official Master Folio
            </span>
            <span className="text-xs text-[#71827B]">Folio #{reservation.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F4] border border-[#DCD3C5] hover:bg-[#EFE8DC] text-xs font-semibold text-[#1E2522] flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print Invoice
            </button>
            <button 
              onClick={closeFolioModal}
              className="text-[#7A8C84] hover:text-[#1E2522] p-1.5 rounded-full hover:bg-[#FAF8F4]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Folio Content */}
        <div className="space-y-6">
          
          {/* Hotel & Guest Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AppLogo size={32} variant="gold" />
                <span className="font-serif-heading font-bold text-xl text-[#1E2522] tracking-wider uppercase">
                  The Azure Sanctuary
                </span>
              </div>
              <p className="text-xs text-[#71827B]">
                100 Ocean Crest Bluff, Cliffside Sanctuary<br />
                VAT / Tax ID: AZ-8849204 • concierge@azuresanctuary.com
              </p>
            </div>

            <div className="text-right text-xs bg-[#FAF8F4] border border-[#E7DFD2] p-3.5 rounded-2xl w-full sm:w-auto">
              <span className="text-[#71827B] uppercase font-bold text-[10px] block">Guest Folio</span>
              <h4 className="font-bold text-sm text-[#1E2522]">{reservation.guestName}</h4>
              <p className="text-[#5B6C64]">
                Suite {reservation.roomNumber} ({reservation.roomType})<br />
                Stay: {reservation.checkInDate} → {reservation.checkOutDate} ({reservation.nights} nights)
              </p>
            </div>
          </div>

          {/* Itemized Folio Table */}
          <div className="border border-[#E4DCCE] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1E2522] text-[#FBF9F5] text-[10px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3.5">Date & Time</th>
                  <th className="py-2.5 px-3.5">Category</th>
                  <th className="py-2.5 px-3.5">Description</th>
                  <th className="py-2.5 px-3.5 text-right">Posted By</th>
                  <th className="py-2.5 px-3.5 text-right">Amount ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE5D8] text-[#2C3833]">
                {folioItems.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-[#FAF8F4]">
                    <td className="py-2.5 px-3.5 text-[11px] text-[#71827B] whitespace-nowrap">{item.date}</td>
                    <td className="py-2.5 px-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF8F4] border border-[#E2D8C9] text-[10px] font-medium text-[#465A51]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 font-medium text-[#1E2522]">{item.description}</td>
                    <td className="py-2.5 px-3.5 text-right text-[11px] text-[#71827B]">{item.postedBy}</td>
                    <td className="py-2.5 px-3.5 text-right font-bold text-[#1E2522]">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Folio Summary Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FAF8F4] border border-[#E7DFD2] p-4 rounded-2xl text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[#71827B]">Payment Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  reservation.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                  reservation.paymentStatus === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {reservation.paymentStatus}
                </span>
              </div>
              <p className="text-[11px] text-[#71827B]">
                Total Amount: <strong>${reservation.totalAmount.toLocaleString()}</strong> • 
                Paid to Date: <strong>${reservation.paidAmount.toLocaleString()}</strong>
              </p>
            </div>

            <div className="text-right w-full sm:w-auto">
              <span className="text-[#71827B] uppercase font-bold text-[10px] block">Outstanding Balance Due</span>
              <span className={`font-serif-heading text-2xl font-bold ${balanceDue > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                ${balanceDue.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Action Controls (Add Charge / Settle Payment) */}
        <div className="pt-2 border-t border-[#EAE3D6] flex flex-wrap justify-between items-center gap-3 print:hidden">
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddChargeOpen(!isAddChargeOpen)}
              className="px-3.5 py-2 rounded-xl bg-[#FAF8F4] border border-[#DCD3C5] hover:bg-[#EFE8DC] text-xs font-semibold text-[#1E2522] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Post Custom Charge
            </button>
          </div>

          <div className="flex gap-2">
            {balanceDue > 0 && (
              <button
                onClick={() => {
                  setSettleAmount(balanceDue);
                  setIsSettleOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#C29E2E] text-[#1A2420] font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <CreditCard className="w-4 h-4" /> Settle Balance (${balanceDue})
              </button>
            )}
            <button
              onClick={closeFolioModal}
              className="px-4 py-2.5 rounded-xl bg-[#1E2522] hover:bg-[#2C3B34] text-white font-semibold text-xs"
            >
              Done
            </button>
          </div>
        </div>

        {/* Post Custom Charge Sub-Form */}
        {isAddChargeOpen && (
          <form onSubmit={handleAddCharge} className="p-4 bg-[#FAF8F4] border border-[#E7DFD2] rounded-2xl text-xs space-y-3 print:hidden">
            <span className="font-bold text-[#1E2522] block">Post Room Charge to Folio</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[#6D7D76] uppercase block mb-1">Category</label>
                <select
                  value={chargeCat}
                  onChange={(e) => setChargeCat(e.target.value as any)}
                  className="w-full p-2 bg-white border border-[#E0D8CC] rounded-xl outline-none"
                >
                  <option value="Minibar">Minibar & Premium Snacks</option>
                  <option value="F&B Restaurant">F&B In-Room Dining</option>
                  <option value="Spa Sanctuary">Spa Sanctuary Treatment</option>
                  <option value="Marine & Excursions">Marine & Helicopter</option>
                  <option value="Laundry & Valet">Laundry & Valet</option>
                  <option value="Late Check-Out Fee">Late Check-Out Fee</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#6D7D76] uppercase block mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={chargeDesc}
                  onChange={(e) => setChargeDesc(e.target.value)}
                  placeholder="e.g. Vintage Champagne & Macarons"
                  className="w-full p-2 bg-white border border-[#E0D8CC] rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#6D7D76] uppercase block mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-[#E0D8CC] rounded-xl outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddChargeOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#D5CCC0] text-[#55675F]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-[#1E2522] text-white font-semibold"
              >
                Post Charge
              </button>
            </div>
          </form>
        )}

        {/* Settle Balance Sub-Form */}
        {isSettleOpen && (
          <form onSubmit={handleSettle} className="p-4 bg-[#FAF6EC] border border-[#E7DFD2] rounded-2xl text-xs space-y-3 print:hidden">
            <span className="font-bold text-[#1E2522] block">Process Folio Settlement</span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#6D7D76] uppercase block mb-1">Payment Amount ($)</label>
                <input
                  type="number"
                  required
                  max={balanceDue}
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-[#E0D8CC] rounded-xl font-bold text-base outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#6D7D76] uppercase block mb-1">Settlement Method</label>
                <select
                  value={settleMethod}
                  onChange={(e) => setSettleMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-[#E0D8CC] rounded-xl outline-none"
                >
                  <option value="Amex">American Express (Centurion / Platinum)</option>
                  <option value="Visa">Visa Signature</option>
                  <option value="MasterCard">MasterCard World Elite</option>
                  <option value="ApplePay">Apple Pay / Contactless</option>
                  <option value="Cash">Cash / Currency Vault</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsSettleOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#D5CCC0] text-[#55675F]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Authorize & Post Payment
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export const GuestFolioModal: React.FC = () => {
  const { isFolioModalOpen, selectedFolioReservation } = useHotel();

  if (!isFolioModalOpen || !selectedFolioReservation) return null;

  return <GuestFolioModalDialog reservation={selectedFolioReservation} />;
};
