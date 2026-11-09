import React, { useState, useEffect } from 'react';
import {
  subscribeReservations,
  updateReservationStatus,
  deleteReservation,
  ReservationData,
} from '../../lib/firebase';
import { Calendar, Users, Clock, MessageSquare, Check, X, Trash2, Search, Filter } from 'lucide-react';

export const ReservationsTable: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeReservations((data) => {
      setReservations(data);
    });
    return () => unsubscribe();
  }, []);

  const filteredReservations = reservations.filter((res) => {
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    const matchesSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.notes && res.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: string, status: 'confirmed' | 'cancelled' | 'pending') => {
    await updateReservationStatus(id, status);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete reservation inquiry for ${name}?`)) {
      await deleteReservation(id);
    }
  };

  const openWhatsAppConfirmation = (res: ReservationData) => {
    const cleanPhone = res.phone.replace(/[^0-9]/g, '');
    const text = `Hello ${res.name},
Greetings from ILA KOCHI Kitchen (Metro Pillar 350, Pathadipalam)! 
We are pleased to confirm your table reservation inquiry:
• Party Size: ${res.guests}
• Date: ${res.date}
• Time Slot: ${res.time}
${res.notes ? `• Special Requests: ${res.notes}` : ''}

We look forward to serving you fresh seafood and banana leaf dining. See you soon!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0B291E] border border-[#176B45]/40">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8BFA0]" />
          <input
            type="text"
            placeholder="Search guest or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#123D2A] border border-[#176B45]/50 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#C5A46D] text-[#0B291E] font-semibold'
                  : 'bg-[#123D2A]/80 text-[#DCE8D5] hover:bg-[#176B45]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-[#0B291E]/60 border border-[#176B45]/30">
          <p className="text-sm text-[#A8BFA0]">No reservations found matching the criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReservations.map((res) => {
            const isConfirmed = res.status === 'confirmed';
            const isCancelled = res.status === 'cancelled';
            const isPending = !isConfirmed && !isCancelled;

            return (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-[#0B291E] border border-[#176B45]/50 hover:border-[#C5A46D]/60 transition-all shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                {/* Guest Details */}
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="text-base font-serif-display font-medium text-[#F8F6EE]">
                      {res.name}
                    </h4>
                    <span className="text-xs font-mono text-[#C5A46D]">
                      {res.phone}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-medium ${
                        isConfirmed
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                          : isCancelled
                          ? 'bg-red-950/80 text-red-400 border border-red-500/40'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {res.status || 'pending'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#A8BFA0] pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#C5A46D]" />
                      {res.guests}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A46D]" />
                      {res.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C5A46D]" />
                      {res.time}
                    </span>
                  </div>

                  {res.notes && (
                    <p className="text-xs text-[#DCE8D5]/80 bg-[#123D2A]/60 p-2.5 rounded-xl border border-[#176B45]/30 mt-2 font-light">
                      <span className="text-[#C5A46D] font-medium">Notes / Pre-order: </span>
                      {res.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center flex-shrink-0">
                  <button
                    onClick={() => openWhatsAppConfirmation(res)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-medium uppercase tracking-wider transition-colors border border-[#25D366]/40 cursor-pointer"
                    title="Send WhatsApp confirmation to guest"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  {isPending && (
                    <button
                      onClick={() => res.id && handleStatusChange(res.id, 'confirmed')}
                      className="p-2 rounded-xl bg-[#176B45] hover:bg-[#1f8758] text-[#F8F6EE] transition-colors cursor-pointer"
                      title="Confirm Reservation"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}

                  {!isCancelled && (
                    <button
                      onClick={() => res.id && handleStatusChange(res.id, 'cancelled')}
                      className="p-2 rounded-xl bg-[#123D2A] hover:bg-red-950/60 text-[#A8BFA0] hover:text-red-400 border border-[#176B45]/40 transition-colors cursor-pointer"
                      title="Cancel Reservation"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => res.id && handleDelete(res.id, res.name)}
                    className="p-2 rounded-xl text-[#A8BFA0] hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
