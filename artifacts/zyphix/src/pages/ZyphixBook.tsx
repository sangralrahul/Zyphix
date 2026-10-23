import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Check } from 'lucide-react';
import { services } from '@/data/mockData';

const G = '#0DA366';
const HEAD_FONT = "'Outfit', sans-serif";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } }
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const TIME_SLOTS = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

export function ZyphixBook() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const handleBook = () => {
    if (selectedSlot) {
      setBooked(true);
      setTimeout(() => setBooked(false), 3000);
    }
  };

  return (
    <div className="pb-24 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Header */}
      <div className="px-4 sm:px-8 lg:px-16 pt-8 pb-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-orange-50 border border-orange-200">
              <CalendarCheck className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-[-0.03em] text-gray-900" style={{ fontFamily: HEAD_FONT }}>ZyphixBook</h1>
              <p className="text-sm text-gray-600">Book local services instantly</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-8 lg:px-16 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Services */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div variants={stagger} initial="hidden" animate="visible">
                <motion.div variants={fadeUp} className="mb-5">
                  <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700 mb-1">Available Services</p>
                  <h2 className="text-xl font-black tracking-[-0.03em] text-gray-900" style={{ fontFamily: HEAD_FONT }}>What do you need help with?</h2>
                </motion.div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {services.map((service) => {
                    const isSelected = selectedService === service.id;
                    return (
                      <motion.div key={service.id} variants={fadeUp}>
                        <div
                          onClick={() => setSelectedService(isSelected ? null : service.id)}
                          className={`rounded-3xl p-5 cursor-pointer group relative overflow-hidden border transition-all duration-200 ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-400 shadow-[0_8px_24px_rgba(13,163,102,.15)]'
                              : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(11,18,32,.06)]'
                          }`}>
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: G }}>
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{service.emoji}</div>
                          <h4 className="font-black text-gray-900 text-base mb-0.5" style={{ fontFamily: HEAD_FONT }}>{service.title}</h4>
                          <p className="text-xs text-gray-500 mb-3">{service.category}</p>
                          <div>
                            <p className="text-xs font-semibold text-emerald-700">{service.available} pros available</p>
                            <p className="text-[10px] text-gray-500">Next: {service.nextSlot}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Time slots */}
              {selectedService && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="rounded-3xl p-5 bg-white border border-gray-200">
                    <p className="text-[12px] font-bold uppercase tracking-[.12em] text-emerald-700 mb-1">Pick a Time</p>
                    <h3 className="text-lg font-black tracking-[-0.02em] text-gray-900 mb-4" style={{ fontFamily: HEAD_FONT }}>Available Time Slots — Today</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                            selectedSlot === slot
                              ? 'text-white border-transparent scale-105'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-white'
                          }`}
                          style={selectedSlot === slot ? { background: G } : undefined}>
                          {slot}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleBook}
                      disabled={!selectedSlot}
                      className="w-full mt-4 py-3.5 rounded-2xl font-bold text-sm text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 hover:-translate-y-0.5 disabled:hover:translate-y-0"
                      style={{ background: G }}>
                      {booked ? '✓ Booking Confirmed!' : 'Confirm Booking'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Info sidebar */}
            <div className="space-y-4">
              {/* Trust badges */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="rounded-3xl p-5 bg-white border border-gray-200">
                  <h3 className="font-black text-gray-900 mb-2" style={{ fontFamily: HEAD_FONT }}>Why book with Zyphix?</h3>
                  {[
                    { icon: '✅', title: 'Verified Professionals', desc: 'Every pro is background-checked' },
                    { icon: '💰', title: 'Zero Cancellation Fee', desc: 'Cancel up to 1hr before for free' },
                    { icon: '💳', title: 'Transparent Pricing', desc: 'Know the price before you book' },
                    { icon: '📍', title: 'Hyperlocal', desc: 'Pros within 2km of you' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* How it works */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <div className="rounded-3xl p-5 bg-white border border-gray-200">
                  <h3 className="font-black text-gray-900 mb-2" style={{ fontFamily: HEAD_FONT }}>How it works</h3>
                  {[
                    { step: '1', title: 'Pick a service', desc: 'Choose what you need help with' },
                    { step: '2', title: 'Choose a slot', desc: 'Select a time that suits you' },
                    { step: '3', title: 'Confirm', desc: 'A verified local pro is assigned' },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0" style={{ background: G }}>
                        {b.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 text-xs font-semibold">{b.title}</p>
                        <p className="text-[10px] text-gray-500">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
