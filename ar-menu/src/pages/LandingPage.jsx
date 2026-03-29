import React, { useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { ScanFace, Smartphone, ChevronRight, ChefHat } from 'lucide-react';
import { MENU_ITEMS } from '../data/menu';

const LandingPage = () => {
  const navigate = useNavigate();
  const baseUrl = useMemo(() => window.location.origin, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start justify-center">
        
        {/* Left side info */}
        <div className="flex-1 text-center md:text-left text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-sm font-medium tracking-wide text-white/90">Experience WebAR</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight leading-tight">
            The Future of <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-600">
              Dining
            </span> is Here.
          </h1>
          
          <p className="text-lg text-gray-300 max-w-md mx-auto md:mx-0 mb-8 leading-relaxed">
            Scan a dish-specific QR code and the same dish pops up in AR. This is open source, so anyone can add food items by editing one data file.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-gray-300">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <Smartphone size={20} className="text-amber-400" />
              </div>
              <p>1. Open your camera app</p>
            </div>
            <div className="flex items-center gap-4 text-gray-300">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <ScanFace size={20} className="text-amber-400" />
              </div>
              <p>2. Scan a food QR code on menu</p>
            </div>
          </div>
        </div>

        {/* Right side dynamic QR list */}
        <div className="flex-1 w-full max-w-3xl">
          <div className="glass-panel rounded-3xl p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ScanFace size={24} className="text-amber-400" />
              Scan Any Dish to Experience AR
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {MENU_ITEMS.map((item) => {
                const itemUrl = `${baseUrl}/menu/${item.id}`;
                return (
                  <div key={item.id} className="bg-white/5 rounded-2xl border border-white/10 p-4">
                    <p className="text-sm font-semibold text-white mb-1">{item.name}</p>
                    <p className="text-xs text-amber-400 mb-4">{item.price}</p>

                    <div className="bg-white p-3 rounded-xl inline-block shadow-2xl relative mb-4">
                      <QRCodeCanvas
                        value={itemUrl}
                        size={140}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="H"
                        includeMargin={false}
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-md shadow-sm">
                        <ChefHat size={14} className="text-amber-600" />
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/menu/${item.id}`)}
                      className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-full transition-all duration-300"
                    >
                      Open AR
                      <ChevronRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="w-full bg-white/5 rounded-2xl p-4 border border-white/10 mt-2 mb-6 text-center">
              <p className="text-xs text-amber-500 font-bold mb-2 uppercase tracking-widest">Print / Show this target image</p>
              <div className="relative w-full max-w-[220px] mx-auto rounded-lg overflow-hidden shadow-lg border border-white/20">
                <img
                  src="/card.png"
                  alt="Menu AR target image"
                  className="w-full h-auto"
                />
              </div>
              <p className="text-[11px] text-gray-300 mt-3 leading-snug font-medium">
                After opening AR page, point camera to this image.
              </p>
            </div>

            <div className="w-full flex justify-between items-center gap-4 border-t border-white/10 pt-6">
              <p className="text-xs text-gray-500 leading-tight">
                No app install required.<br />Works on iOS and Android.
              </p>

              <span className="text-[11px] text-right text-gray-300 leading-snug">
                To add dishes, edit
                <br />
                <code className="text-amber-400">src/data/menu.js</code>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
