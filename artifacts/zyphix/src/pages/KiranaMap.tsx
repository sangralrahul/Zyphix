import React, { useState } from 'react';
import { MapPin, Navigation, Star, Clock, Store } from 'lucide-react';
import { stores } from '@/data/mockData';
import { Button, FONT, IconTile } from '@/ui/kit';

const card = 'rounded-xl border border-[#E6E8EC] bg-white';

export function KiranaMap() {
  const [selectedStore, setSelectedStore] = useState<string | null>(stores[0].id);

  return (
    <div className="mx-auto w-full max-w-[1180px] pb-24 pt-4 text-gray-900 md:pb-8" style={{ fontFamily: FONT }}>
      <div className="flex items-baseline gap-3">
        <h1 className="text-[20px] font-semibold tracking-[-0.01em]">Kirana near me</h1>
        <p className="text-[13px] text-gray-500">{stores.length} stores</p>
      </div>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start">
        {/* Map */}
        <div className={`${card} relative h-[38vh] shrink-0 overflow-hidden md:sticky md:top-[80px] md:h-[calc(100vh-128px)] md:flex-1`}>
          <div className="pointer-events-none absolute inset-0 bg-[#FAFAFA]" style={{
            backgroundImage: 'linear-gradient(rgba(11,15,25,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(11,15,25,.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          {stores.map((store, i) => {
            const active = selectedStore === store.id;
            return (
              <button
                key={store.id}
                type="button"
                onClick={() => setSelectedStore(store.id)}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={{ top: `${20 + (i * 10)}%`, left: `${30 + (i % 2 === 0 ? 10 : 40)}%`, zIndex: active ? 10 : 1 }}
              >
                <span className="flex flex-col items-center">
                  <span className={`mb-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-[11.5px] font-semibold ${active ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-[#E6E8EC] bg-white text-gray-900'}`}>
                    {store.name}
                  </span>
                  <MapPin size={active ? 26 : 22} className={active ? 'text-emerald-600' : 'text-gray-400'} />
                </span>
              </button>
            );
          })}

          {/* User location */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="block h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-500 shadow" />
          </div>
        </div>

        {/* List */}
        <div className="w-full md:w-[360px] md:shrink-0">
          <div className={`${card} divide-y divide-gray-100`}>
            {stores.map(store => {
              const active = selectedStore === store.id;
              return (
                <div key={store.id} onClick={() => setSelectedStore(store.id)}
                  className={`cursor-pointer px-3 py-3 transition ${active ? 'bg-emerald-50/50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <IconTile className="h-9 w-9 rounded-lg"><Store size={16} /></IconTile>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-semibold">{store.name}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12px] text-gray-500">
                        <span className="inline-flex items-center gap-1"><Navigation size={11} /> {store.distance}</span>
                        <span className="inline-flex items-center gap-1"><Clock size={11} /> {store.openHours}</span>
                      </p>
                    </div>
                    {store.rating ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11.5px] font-semibold text-emerald-700">
                        <Star size={11} className="fill-emerald-600 text-emerald-600" /> {store.rating}
                      </span>
                    ) : null}
                  </div>
                  {active && (
                    <div className="mt-3 flex gap-2">
                      <Button href="/now" size="sm" className="!h-8 flex-1">Shop</Button>
                      <Button size="sm" variant="secondary" className="!h-8 flex-1">Directions</Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
