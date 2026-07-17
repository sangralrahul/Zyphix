import React, { useState } from 'react';
import { MapPin, Navigation, Star, Clock, Store } from 'lucide-react';
import { stores } from '@/data/mockData';

export function KiranaMap() {
  const [selectedStore, setSelectedStore] = useState<string | null>(stores[0].id);

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] flex flex-col md:flex-row gap-4 animate-in fade-in duration-500 pb-16 md:pb-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-[-1rem]">
      
      {/* Mobile Map Toggle / Header */}
      <div className="md:hidden py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Store className="h-5 w-5 text-zyphix-sky" />
          Kirana Near Me
        </h1>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-background border border-border rounded-xl relative overflow-hidden h-[40vh] md:h-full shrink-0">
        {/* Fake Map Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231E4FC2' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
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
              <div className={`px-2 py-1 rounded shadow-lg text-xs font-bold mb-1 whitespace-nowrap ${
                selectedStore === store.id ? 'bg-zyphix-sky text-background' : 'bg-card text-white border border-border'
              }`}>
                {store.name}
              </div>
              <MapPin className={`h-8 w-8 ${selectedStore === store.id ? 'text-zyphix-sky fill-zyphix-sky/20' : 'text-zyphix-teal fill-zyphix-teal/20'}`} />
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
        <div className="hidden md:block pb-4 border-b border-border mb-4 shrink-0">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Store className="h-6 w-6 text-zyphix-sky" />
            Kirana Near Me
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Find local stores around you</p>
        </div>

        <div className="overflow-y-auto space-y-3 pr-2 pb-8 no-scrollbar flex-1">
          {stores.map(store => (
            <div 
              key={store.id}
              onClick={() => setSelectedStore(store.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                selectedStore === store.id 
                  ? 'bg-zyphix-sky/10 border-zyphix-sky' 
                  : 'bg-card border-border hover:border-muted/50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white text-lg">{store.name}</h3>
                <div className="flex items-center bg-zyphix-teal/20 text-zyphix-teal px-1.5 py-0.5 rounded text-xs font-bold">
                  <Star className="h-3 w-3 fill-zyphix-teal mr-1" />
                  {store.rating}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Navigation className="h-3.5 w-3.5 text-zyphix-sky" />
                  <span className="text-white font-medium">{store.distance} away</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{store.openHours}</span>
                </div>
              </div>

              {selectedStore === store.id && (
                <div className="mt-4 pt-3 border-t border-border flex gap-2">
                  <button className="flex-1 bg-zyphix-sky text-background font-bold py-2 rounded-lg text-sm">
                    Shop Now
                  </button>
                  <button className="flex-1 bg-background border border-zyphix-sky text-zyphix-sky font-bold py-2 rounded-lg text-sm">
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