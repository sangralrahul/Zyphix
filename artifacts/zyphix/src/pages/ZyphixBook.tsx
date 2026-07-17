import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Clock, ArrowRight, Check, Star, MapPin, Zap } from 'lucide-react';
import { services } from '@/data/mockData';

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
      <div className="px-4 sm:px-8 lg:px-16 pt-6 pb-4"
        style={{ background: 'linear-gradient(180deg, rgba(255,107,53,0.06) 0%, transparent 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.3)' }}>
              <CalendarCheck className="h-6 w-6" style={{ color: '#FF6B35' }} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">ZyphixBook</h1>
              <p className="text-sm" style={{ color: '#5A7A9A' }}>Book local services instantly</p>
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
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#5A7A9A' }}>Available Services</p>
                  <h2 className="text-xl font-black text-white">What do you need help with?</h2>
                </motion.div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {services.map((service) => {
                    const isSelected = selectedService === service.id;
                    return (
                      <motion.div key={service.id} variants={fadeUp}>
                        <div
                          onClick={() => setSelectedService(isSelected ? null : service.id)}
                          className="rounded-2xl p-5 cursor-pointer group relative overflow-hidden transition-all duration-200"
                          style={{
                            background: isSelected ? 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(30,79,194,0.1))' : '#0F1B35',
                            border: isSelected ? '1px solid rgba(255,107,53,0.6)' : '1px solid #1E3A6E',
                            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: isSelected ? '0 8px 32px rgba(255,107,53,0.2)' : 'none',
                          }}>
                          <div className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.08), transparent)', transform: 'translate(30%, -30%)' }} />
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: '#FF6B35' }}>
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{service.emoji}</div>
                          <h4 className="font-black text-white text-base mb-0.5">{service.title}</h4>
                          <p className="text-xs mb-3" style={{ color: '#5A7A9A' }}>{service.category}</p>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: '#00C9A7' }}>{service.available} pros available</p>
                            <p className="text-[10px]" style={{ color: '#5A7A9A' }}>Next: {service.nextSlot}</p>
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
                  <div className="rounded-2xl p-5" style={{ background: '#0F1B35', border: '1px solid #1E3A6E' }}>
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#5A7A9A' }}>Pick a Time</p>
                    <h3 className="text-lg font-black text-white mb-4">Available Time Slots — Today</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className="py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                          style={{
                            background: selectedSlot === slot ? '#FF6B35' : 'rgba(30,58,110,0.5)',
                            color: selectedSlot === slot ? 'white' : '#5A7A9A',
                            border: `1px solid ${selectedSlot === slot ? '#FF6B35' : '#1E3A6E'}`,
                            transform: selectedSlot === slot ? 'scale(1.05)' : 'scale(1)',
                          }}>
                          {slot}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleBook}
                      disabled={!selectedSlot}
                      className="w-full mt-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-40 hover:scale-[1.02]"
                      style={{
                        background: selectedSlot ? '#FF6B35' : 'rgba(255,107,53,0.3)',
                        color: selectedSlot ? 'white' : '#5A7A9A',
                        boxShadow: selectedSlot ? '0 8px 24px rgba(255,107,53,0.3)' : 'none',
                      }}>
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
                <div className="rounded-2xl p-5" style={{ background: '#0F1B35', border: '1px solid #1E3A6E' }}>
                  <h3 className="font-black text-white mb-4">Why book with ZYPHIX?</h3>
                  {[
                    { icon: '✅', title: 'Verified Professionals', desc: 'Every pro is background-checked' },
                    { icon: '💰', title: 'Zero Cancellation Fee', desc: 'Cancel up to 1hr before for free' },
                    { icon: '⭐', title: 'Rated 4.8/5', desc: 'By early customers across India' },
                    { icon: '📍', title: 'Hyperlocal', desc: 'Pros within 2km of you' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-3 border-b last:border-0" style={{ borderColor: 'rgba(30,58,110,0.5)' }}>
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-white text-sm">{item.title}</p>
                        <p className="text-xs" style={{ color: '#5A7A9A' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent bookings */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <div className="rounded-2xl p-5" style={{ background: '#0F1B35', border: '1px solid #1E3A6E' }}>
                  <h3 className="font-black text-white mb-4">Recent near you</h3>
                  {[
                    { name: 'Priya S.', service: 'Haircut', time: '20 min ago' },
                    { name: 'Ravi K.', service: 'Car Service', time: '1 hr ago' },
                    { name: 'Sneha D.', service: 'Home Cleaning', time: '2 hr ago' },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: 'rgba(30,58,110,0.5)' }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                        style={{ background: 'linear-gradient(135deg, #FF6B35, #1E4FC2)', color: 'white' }}>
                        {b.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs font-semibold">{b.name} booked <span style={{ color: '#FF6B35' }}>{b.service}</span></p>
                        <p className="text-[10px]" style={{ color: '#5A7A9A' }}>{b.time}</p>
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
