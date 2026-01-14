
import React from 'react';

export const BackgroundDecor: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      {/* Top Left Branch */}
      <div className="absolute -top-10 -left-10 w-64 h-64 rotate-12 opacity-40">
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" className="text-stone-400">
          <path d="M0,0 Q100,50 150,150 M50,20 Q80,60 70,120 M120,80 Q140,100 130,160" strokeWidth="0.5" />
        </svg>
      </div>
      
      {/* Bottom Right Clouds */}
      <div className="absolute -bottom-20 -right-20 w-96 h-96 opacity-20">
        <svg viewBox="0 0 400 400" fill="none" stroke="currentColor" className="text-stone-300">
          <path d="M100,200 Q150,150 200,200 Q250,250 300,200" strokeWidth="1" />
          <path d="M50,250 Q120,200 180,250 Q240,300 320,250" strokeWidth="1" />
        </svg>
      </div>

      {/* Vertical Title Line */}
      <div className="absolute right-12 top-1/4 flex flex-col items-center gap-4 hidden md:flex">
        <div className="w-px h-24 bg-stone-300"></div>
        <span className="text-stone-400 text-sm tracking-[0.5em] [writing-mode:vertical-rl]">瑞花龙凤葵花镜</span>
        <div className="w-px h-24 bg-stone-300"></div>
      </div>
    </div>
  );
};
