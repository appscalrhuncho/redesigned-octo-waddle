import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { MenuItem, RestaurantTable } from '../../types';
import { 
  UtensilsCrossed, 
  Wine, 
  Sparkles, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  CreditCard, 
  Bed, 
  Split, 
  FileText, 
  Clock, 
  Search,
  CheckCircle2,
  Users
} from 'lucide-react';

export const RestaurantAndSpaPOS: React.FC = () => {
  const { 
    menu, 
    tables, 
    todayInHouse, 
    addFolioItem, 
    updateTableStatus 
  } = useHotel();

  const [selectedCategory, setSelectedCategory] = useState<string>('All-Day Dining');
  const [selectedTable, setSelectedTable] = useState<RestaurantTable>(tables[0]);
  const [cartItems, setCartItems] = useState<{
    menuItem: MenuItem;
    quantity: number;
    selectedModifiers: string[];
    notes: string;
  }[]>([
    {
      menuItem: menu[2], // Kingfish ceviche
      quantity: 2,
      selectedModifiers: ['Extra Lime'],
      notes: 'Serve with appetizer drinks'
    },
    {
      menuItem: menu[5], // Spritz
      quantity: 2,
      selectedModifiers: ['No Rosemary'],
      notes: ''
    }
  ]);

  const [searchMenuQuery, setSearchMenuQuery] = useState('');
  const [selectedRoomChargeResId, setSelectedRoomChargeResId] = useState<string>(todayInHouse[0]?.id || '');
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [splitCount, setSplitCount] = useState(2);
  const [orderSentSuccess, setOrderSentSuccess] = useState(false);

  // Filter menu items
  const filteredMenu = menu.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchMenuQuery.trim()) {
      return item.name.toLowerCase().includes(searchMenuQuery.toLowerCase()) ||
             item.description.toLowerCase().includes(searchMenuQuery.toLowerCase());
    }
    return true;
  });

  const addItemToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.menuItem.id === item.id);
      if (existing) {
        return prev.map(i => i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItem: item, quantity: 1, selectedModifiers: [], notes: '' }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.menuItem.id === itemId) {
        const q = i.quantity + delta;
        return q > 0 ? { ...i, quantity: q } : null;
      }
      return i;
    }).filter(Boolean) as any);
  };

  const toggleModifier = (itemId: string, mod: string) => {
    setCartItems(prev => prev.map(i => {
      if (i.menuItem.id === itemId) {
        const has = i.selectedModifiers.includes(mod);
        return {
          ...i,
          selectedModifiers: has ? i.selectedModifiers.filter(m => m !== mod) : [...i.selectedModifiers, mod]
        };
      }
      return i;
    }));
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const serviceCharge = Math.round(subtotal * 0.10);
  const total = subtotal + tax + serviceCharge;

  const handleChargeToRoom = () => {
    if (cartItems.length === 0) return;
    if (!selectedRoomChargeResId) {
      alert('Please select an in-house guest room folio.');
      return;
    }

    const res = todayInHouse.find(r => r.id === selectedRoomChargeResId);
    if (!res) return;

    addFolioItem(res.id, {
      category: 'F&B Restaurant',
      description: `Table ${selectedTable.number} F&B: ${cartItems.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}`,
      amount: total,
      postedBy: `Table ${selectedTable.number} POS (${selectedTable.serverName || 'Staff'})`
    });

    updateTableStatus(selectedTable.id, 'occupied', res.guestName);
    setCartItems([]);
    setOrderSentSuccess(true);
    setTimeout(() => setOrderSentSuccess(false), 4000);
  };

  const handleDirectSettle = () => {
    if (cartItems.length === 0) return;
    updateTableStatus(selectedTable.id, 'available');
    setCartItems([]);
    setOrderSentSuccess(true);
    setTimeout(() => setOrderSentSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* POS Top Bar */}
      <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#1E2522] text-[#D4AF37]">
                Restaurant, Bar & Spa POS
              </span>
              <span className="text-xs text-[#7A8C84]">Active Service: Dinner & Evening Terrace</span>
            </div>
            <h2 className="font-serif-heading text-2xl lg:text-3xl font-medium text-[#1E2522]">
              Point of Sale & Room Charge
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <span className="text-[#7A8C84] block">Current Server Assigned</span>
              <span className="font-bold text-[#1E2522]">{selectedTable.serverName || 'Antoine L.'}</span>
            </div>
          </div>
        </div>

        {/* Table Selector Grid */}
        <div className="mt-5 pt-4 border-t border-[#EAE3D6]">
          <span className="text-[11px] font-bold text-[#71827B] uppercase tracking-wider block mb-2">
            Select Dining Table / Spa Pavilion ({tables.length} Total)
          </span>
          
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
            {tables.map(tbl => {
              const isSelected = selectedTable.id === tbl.id;
              return (
                <button
                  key={tbl.id}
                  onClick={() => setSelectedTable(tbl)}
                  className={`p-2 rounded-xl text-center border transition-all text-xs ${
                    isSelected 
                      ? 'bg-[#1E2522] text-white border-[#1E2522] shadow-md ring-2 ring-[#D4AF37]' 
                      : tbl.status === 'occupied'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : tbl.status === 'reserved'
                      ? 'bg-[#F2EFE8] border-[#D4C9BA] text-[#55675F]'
                      : 'bg-white border-[#E0D8CC] hover:bg-[#FAF8F4] text-[#1E2522]'
                  }`}
                >
                  <div className="font-bold text-sm">T-{tbl.number}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">{tbl.seats} Seats</div>
                  <span className={`mt-1 inline-block w-2 h-2 rounded-full ${
                    tbl.status === 'available' ? 'bg-emerald-500' :
                    tbl.status === 'occupied' ? 'bg-amber-500' : 'bg-purple-500'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* POS Main Grid: Menu Catalog (7 cols) + Order Cart (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Menu Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Menu Categories & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
              {['All-Day Dining', 'Breakfast', 'Chef Tasting Menu', 'Artisan Cocktails', 'Cellar Wines', 'Spa Sanctuary'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    selectedCategory === cat
                      ? 'bg-[#1E2522] text-[#FBF9F5] border-[#1E2522]'
                      : 'bg-white border-[#E3DCD1] text-[#55675F] hover:bg-[#FAF8F4]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#889B93] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dish, wine..."
                value={searchMenuQuery}
                onChange={(e) => setSearchMenuQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#E0D8CC] text-xs outline-none w-48 focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredMenu.map(item => (
              <div
                key={item.id}
                onClick={() => addItemToCart(item)}
                className="bg-white border border-[#E3DCD1] hover:border-[#D4AF37] rounded-2xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3 group"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform" 
                />
                
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs text-[#1E2522] truncate">{item.name}</h4>
                      <span className="font-bold text-sm text-[#1E2522] shrink-0">${item.price}</span>
                    </div>
                    <p className="text-[11px] text-[#6B7D75] line-clamp-2 mt-0.5 leading-snug">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F2EDE4]">
                    <div className="flex gap-1">
                      {item.dietary.slice(0, 2).map((d, idx) => (
                        <span key={idx} className="px-1.5 py-0.2 rounded bg-[#FAF8F4] border border-[#E5DFD4] text-[9px] font-semibold text-[#8B7746]">
                          {d}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-[#1E2522] flex items-center gap-0.5 group-hover:text-[#D4AF37]">
                      <Plus className="w-3 h-3" /> Add
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right: Active Order Cart & Folio Charging (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-[#1E2522] text-[#FBF9F5] rounded-3xl p-5 lg:p-6 border border-[#33423B] shadow-xl sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#2E3C36] mb-3">
              <div>
                <h3 className="font-serif-heading text-xl font-semibold text-white">
                  Table {selectedTable.number} Order ({selectedTable.zone})
                </h3>
                <span className="text-[11px] text-[#A6B7AF]">
                  {selectedTable.seats} Seats • Status: {selectedTable.status.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setCartItems([])}
                className="text-xs text-[#E57373] hover:underline"
              >
                Clear
              </button>
            </div>

            {/* Cart Item List */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((cartItem) => (
                <div 
                  key={cartItem.menuItem.id}
                  className="p-3 rounded-2xl bg-[#24312A] border border-[#374940] text-xs space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-white">{cartItem.menuItem.name}</span>
                      <span className="text-[#A2B4AC] block text-[11px]">${cartItem.menuItem.price} each</span>
                    </div>

                    <div className="flex items-center gap-2 bg-[#1B2420] border border-[#3B4C43] rounded-lg px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(cartItem.menuItem.id, -1)}
                        className="text-[#96AAA1] hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-white px-1">{cartItem.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(cartItem.menuItem.id, 1)}
                        className="text-[#96AAA1] hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Modifiers Pill Selector */}
                  {cartItem.menuItem.availableModifiers.length > 0 && (
                    <div className="pt-1.5 border-t border-[#2F3F37] flex flex-wrap gap-1">
                      {cartItem.menuItem.availableModifiers.map((mod) => {
                        const isModActive = cartItem.selectedModifiers.includes(mod);
                        return (
                          <button
                            key={mod}
                            onClick={() => toggleModifier(cartItem.menuItem.id, mod)}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                              isModActive
                                ? 'bg-[#D4AF37] text-[#1E2522] border-[#D4AF37]'
                                : 'bg-[#1D2722] text-[#8EA299] border-[#374940] hover:text-white'
                            }`}
                          >
                            {mod}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {cartItems.length === 0 && (
                <div className="text-center py-8 text-xs text-[#7A8C84] bg-[#233029] rounded-2xl border border-dashed border-[#34463C]">
                  Order ticket is currently empty. Click dishes or cocktails from menu to add.
                </div>
              )}
            </div>

            {/* Calculations & Room Charge Target */}
            {cartItems.length > 0 && (
              <div className="pt-4 mt-4 border-t border-[#2E3C36] space-y-3 text-xs">
                
                <div className="space-y-1.5 text-[#B8C8C1]">
                  <div className="flex justify-between">
                    <span>Food & Beverage Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>VAT / State Tax (5%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Gratuity & Service (10%)</span>
                    <span>${serviceCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-serif-heading font-bold text-white pt-2 border-t border-[#374940]">
                    <span>Total Ticket Amount</span>
                    <span className="text-[#D4AF37]">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Room Charge Target Selector */}
                <div className="p-3 rounded-xl bg-[#25322B] border border-[#3A4C43] space-y-2">
                  <label className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                    Post to Guest Room Folio
                  </label>
                  <select
                    value={selectedRoomChargeResId}
                    onChange={(e) => setSelectedRoomChargeResId(e.target.value)}
                    className="w-full bg-[#1A2420] text-xs text-white border border-[#405249] rounded-xl px-3 py-2 outline-none cursor-pointer"
                  >
                    {todayInHouse.map(res => (
                      <option key={res.id} value={res.id}>
                        Suite {res.roomNumber} - {res.guestName} ({res.roomType})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Split Bill Calculator Toggle */}
                <div className="flex justify-between items-center text-xs">
                  <button
                    onClick={() => setIsSplitBillOpen(!isSplitBillOpen)}
                    className="text-[#D4AF37] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Split className="w-3.5 h-3.5" />
                    {isSplitBillOpen ? 'Close Split Calculator' : 'Split Bill between covers'}
                  </button>
                  {isSplitBillOpen && (
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-[#A6B7AF]">Covers:</span>
                      <button onClick={() => setSplitCount(Math.max(2, splitCount - 1))} className="px-1.5 py-0.5 bg-[#2E3C36] rounded text-white">-</button>
                      <span className="px-1 text-white font-bold">{splitCount}</span>
                      <button onClick={() => setSplitCount(splitCount + 1)} className="px-1.5 py-0.5 bg-[#2E3C36] rounded text-white">+</button>
                    </div>
                  )}
                </div>

                {isSplitBillOpen && (
                  <div className="p-2.5 bg-[#25322B] rounded-xl text-center text-xs border border-[#384A41]">
                    <span className="text-[#B5C5BE]">Split per person ({splitCount} covers): </span>
                    <strong className="text-[#D4AF37] text-sm">${(total / splitCount).toFixed(2)}</strong>
                  </div>
                )}

                {/* Settle Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={handleChargeToRoom}
                    className="py-3 rounded-xl bg-[#D4AF37] hover:bg-[#C29E2E] text-[#1A2420] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <Bed className="w-4 h-4" /> Charge Folio
                  </button>
                  <button
                    onClick={handleDirectSettle}
                    className="py-3 rounded-xl bg-[#2E3C36] hover:bg-[#3C4E46] text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#485C53] transition-all"
                  >
                    <CreditCard className="w-4 h-4" /> Direct Pay
                  </button>
                </div>

              </div>
            )}

            {orderSentSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ticket posted to kitchen & guest room folio successfully!</span>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
