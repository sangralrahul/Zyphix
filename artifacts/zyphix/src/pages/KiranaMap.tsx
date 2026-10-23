import React, { useState } from 'react';
import { MapPin, Navigation, Star, Clock, Store } from 'lucide-react';
import { stores } from '@/data/mockData';

const G = '#0DA366';
const HEAD_FONT = "'Outfit', sans-serif";

export function KiranaMap() {
  const [selectedStore, setSelectedStore] = useState<string | null>(stores[0].id);

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] flex flex-col md:flex-row gap-4 animate-in fade-in duration-500 pb-16 md:pb-0 pt-6">

      {/* Mobile Map Toggle / Header */}
      <div className="md:hidden pb-2">
        <h1 className="text-xl font-black tracking-[-0.03em] text-gray-900 flex items-center gap-2" style={{ fontFamily: HEAD_FONT }}>
          <Store className="h-5 w-5" style={{ color: G }} />
          Kirana Near Me
        </h1>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-white border border-gray-200 rounded-3xl relative overflow-hidden h-[40vh] md:h-full shrink-0">
        {/* Fake Map Background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230DA366' fill-opacity='0.25'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#F3F4F6',
        }}></div>

        {/* Map Pins */}
        {stores.map((store, i) => (
          <div
            key={store.id}
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-transform hover:scale-110"
            style={{
              top: `${20 + (i * 15)}%`,
              left: `${30 + (i % 2 === 0 ? 10 : 40)}%`,
              zIndex: selectedStore === store.id ? 10 : 1
            }}
            onClick={() => setSelectedStore(store.id)}
          >
            <div className={`relative flex flex-col items-center ${selectedStore === store.id ? 'animate-bounce' : ''}`}>
              <div className={`px-2 py-1 rounded-lg shadow-md text-xs font-bold mb-1 whitespace-nowrap ${
                selectedStore === store.id ? 'text-white' : 'bg-white text-gray-900 border border-gray-200'
              }`} style={selectedStore === store.id ? { background: G } : undefined}>
                {store.name}
              </div>
              <MapPin className={`h-8 w-8 ${selectedStore === store.id ? 'text-emerald-600 fill-emerald-600/20' : 'text-gray-400 fill-gray-400/20'}`} />
            </div>
          </div>
        ))}

        {/* User Location Pin */}
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative z-10"></div>
          </div>
        </div>
      </div>

      {/* Sidebar List */}
      <div className="w-full md:w-[380px] flex flex-col h-[50vh] md:h-full">
        <div className="hidden md:block pb-4 border-b border-gray-200 mb-4 shrink-0">
          <h1 className="text-2xl font-black tracking-[-0.03em] text-gray-900 flex items-center gap-2" style={{ fontFamily: HEAD_FONT }}>
            <Store className="h-6 w-6" style={{ color: G }} />
            Kirana Near Me
          </h1>
          <p className="text-sm text-gray-600 mt-1">Find local stores around you</p>
        </div>

        <div className="overflow-y-auto space-y-3 pr-2 pb-8 no-scrollbar flex-1">
          {stores.map(store => (
            <div
              key={store.id}
              onClick={() => setSelectedStore(store.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                selectedStore === store.id
                  ? 'bg-emerald-50 border-emerald-400'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 text-lg">{store.name}</h3>
                <div className="flex items-center bg-emerald-50 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded-md text-xs font-bold">
                  <Star className="h-3 w-3 fill-emerald-600 text-emerald-600 mr-1" />
                  {store.rating}
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Navigation className="h-3.5 w-3.5" style={{ color: G }} />
                  <span className="text-gray-900 font-medium">{store.distance} away</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{store.openHours}</span>
                </div>
              </div>

              {selectedStore === store.id && (
                <div className="mt-4 pt-3 border-t border-emerald-200 flex gap-2">
                  <button className="flex-1 text-white font-bold py-2 rounded-xl text-sm transition hover:opacity-90" style={{ background: G }}>
                    Shop Now
                  </button>
                  <button className="flex-1 bg-white border border-gray-200 text-gray-900 font-bold py-2 rounded-xl text-sm transition hover:bg-gray-50">
                    Get Directions
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
