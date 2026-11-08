import React, { useState } from 'react';
import { Calendar, Users, Clock, Sparkles, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

interface ReservationSectionProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ isModal = false, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: '2 Guests (Table for Two)',
    date: '',
    time: '12:30 PM (Lunch Sadhya)',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide your name and contact phone number.');
      return;
    }

    const message = `Hello ILA KOCHI Kitchen,
I would like to request a table reservation inquiry:
• Name: ${formData.name}
• Contact: ${formData.phone}
• Party Size: ${formData.guests}
• Preferred Date: ${formData.date || 'Today / Upcoming'}
• Preferred Time Slot: ${formData.time}
• Notes / Special Requests: ${formData.notes || 'None'}

Please confirm table availability. Thank you!`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/919526267626?text=${encoded}`;
    setSubmitted(true);
    window.open(waUrl, '_blank');
  };

  const formContent = (
    <div className="w-full text-[#F8F6EE]">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2.5 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B291E] border border-[#176B45]/50 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Table Inquiry &amp; Booking</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif-display font-medium tracking-tight text-[#F8F6EE] leading-tight text-balance">
          Your table is waiting.
        </h2>
        <p className="text-xs sm:text-sm text-[#DCE8D5]/80 font-light leading-relaxed max-w-md mx-auto text-pretty">
          Reserve your spot for authentic Kerala seafood dining on fresh banana leaves. Connects directly with our manager on WhatsApp.
        </p>
      </div>

      {submitted ? (
        <div className="text-center py-8 sm:py-10 space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#176B45]/40 border border-[#C5A46D] flex items-center justify-center mx-auto text-[#C5A46D]">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif-display text-[#F8F6EE]">Inquiry Sent to WhatsApp!</h3>
          <p className="text-xs sm:text-sm text-[#DCE8D5]/80 max-w-md mx-auto">
            Thank you, <span className="text-[#C5A46D] font-medium">{formData.name}</span>! Our team at ILA KOCHI has received your table inquiry and will confirm promptly.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#176B45] text-[#F8F6EE] hover:bg-[#1f8758] transition-colors cursor-pointer"
            >
              Make Another Inquiry
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#176B45] text-[#DCE8D5] hover:text-[#F8F6EE] transition-colors cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleWhatsAppSubmit} className="space-y-4 sm:space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Guest Name */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-sans-ui uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Your Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Rahul Menon"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-11 sm:h-12 px-4 rounded-xl bg-[#0B291E] border border-[#176B45]/60 text-sm text-[#F8F6EE] placeholder-[#A8BFA0]/40 focus:outline-none focus:border-[#C5A46D] focus:ring-1 focus:ring-[#C5A46D] transition-colors"
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-sans-ui uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Phone / WhatsApp Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-11 sm:h-12 px-4 rounded-xl bg-[#0B291E] border border-[#176B45]/60 text-sm text-[#F8F6EE] placeholder-[#A8BFA0]/40 focus:outline-none focus:border-[#C5A46D] focus:ring-1 focus:ring-[#C5A46D] transition-colors"
              />
            </div>

            {/* Number of Guests */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-sans-ui uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Party Size
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A46D] pointer-events-none" />
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl bg-[#0B291E] border border-[#176B45]/60 text-sm text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] transition-colors cursor-pointer"
                >
                  <option value="1 Guest">1 Guest</option>
                  <option value="2 Guests (Table for Two)">2 Guests (Table for Two)</option>
                  <option value="3-4 Guests (Family Table)">3 – 4 Guests (Family Table)</option>
                  <option value="5-8 Guests (Group Gathering)">5 – 8 Guests (Group Gathering)</option>
                  <option value="8+ Guests (Large Feast)">8+ Guests (Large Feast)</option>
                </select>
              </div>
            </div>

            {/* Preferred Date */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-sans-ui uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A46D] pointer-events-none" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  style={{ colorScheme: 'dark' }}
                  className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl bg-[#0B291E] border border-[#176B45]/60 text-sm text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] transition-colors"
                />
              </div>
            </div>

            {/* Preferred Time Slot */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[11px] sm:text-xs font-sans-ui uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Dining Window &amp; Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A46D] pointer-events-none" />
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl bg-[#0B291E] border border-[#176B45]/60 text-sm text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D] transition-colors cursor-pointer"
                >
                  <optgroup label="Lunch (Banana Leaf Sadhya & Catch)">
                    <option value="12:00 PM (Lunch Sadhya)">12:00 PM</option>
                    <option value="12:30 PM (Lunch Sadhya)">12:30 PM</option>
                    <option value="01:15 PM (Lunch Sadhya)">01:15 PM</option>
                    <option value="02:00 PM (Lunch Sadhya)">02:00 PM</option>
                    <option value="03:00 PM (Late Lunch)">03:00 PM</option>
                  </optgroup>
                  <optgroup label="Dinner (Live Tawa Seafood & Roasts)">
                    <option value="07:00 PM (Dinner)">07:00 PM</option>
                    <option value="07:45 PM (Dinner)">07:45 PM</option>
                    <option value="08:30 PM (Dinner)">08:30 PM</option>
                    <option value="09:15 PM (Dinner)">09:15 PM</option>
                    <option value="10:00 PM (Late Dinner)">10:00 PM</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[11px] sm:text-xs font-sans-ui uppercase tracking-wider text-[#A8BFA0] font-medium block">
                Special Requests / Dish Pre-Orders (Optional)
              </label>
              <textarea
                name="notes"
                rows={2}
                placeholder="e.g. Karimeen Pollichathu pre-order, high chair needed..."
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B291E] border border-[#176B45]/60 text-sm text-[#F8F6EE] placeholder-[#A8BFA0]/40 focus:outline-none focus:border-[#C5A46D] resize-none overflow-y-auto transition-colors"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-[11px] text-[#A8BFA0] text-center sm:text-left leading-tight sm:max-w-xs">
              Direct WhatsApp booking inquiry &bull; Instant confirmation with restaurant manager.
            </p>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#0B291E] bg-[#C5A46D] hover:bg-[#d8b982] transition-all shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex-shrink-0"
            >
              <MessageSquare className="w-4 h-4 fill-current flex-shrink-0" />
              <span className="whitespace-nowrap">Send WhatsApp Inquiry</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );

  // When used in a modal, render form directly without redundant outer section wrapper
  if (isModal) {
    return formContent;
  }

  // When used as in-page section, wrap in single clean container
  return (
    <section id="reservation" className="py-20 sm:py-24 lg:py-28 bg-[#0B291E] text-[#F8F6EE] relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-[#123D2A]/90 border border-[#176B45]/60 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-md">
          {formContent}
        </div>
      </div>
    </section>
  );
};
