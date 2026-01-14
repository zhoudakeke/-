
import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hotspot } from '../types';

interface MirrorDisplayProps {
  hotspots: Hotspot[];
  onPointSelect: (id: number) => void;
  onPointMove: (id: number, x: number, y: number) => void;
  activeId: number | null;
  hoveredId: number | null;
  setHoveredId: (id: number | null) => void;
  isEditMode: boolean;
}

export const MirrorDisplay: React.FC<MirrorDisplayProps> = ({ 
  hotspots,
  onPointSelect, 
  onPointMove,
  activeId, 
  hoveredId,
  setHoveredId,
  isEditMode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const MIRROR_IMAGE_URL = "https://raw.githubusercontent.com/zhoudakeke/image/refs/heads/main/1.png";

  const handleDragEnd = (id: number, info: any) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const xPercent = (info.point.x - containerRect.left) / containerRect.width * 100;
    const yPercent = (info.point.y - containerRect.top) / containerRect.height * 100;
    
    // Clamp values between 0 and 100
    const finalX = Math.max(0, Math.min(100, parseFloat(xPercent.toFixed(1))));
    const finalY = Math.max(0, Math.min(100, parseFloat(yPercent.toFixed(1))));
    
    onPointMove(id, finalX, finalY);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center" ref={containerRef}>
      {/* Visual background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full max-w-[100vh] max-h-[100vh] bg-[#c5a880] rounded-full blur-[160px] opacity-[0.12]"></div>
      </div>

      {/* Mirror Container */}
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* The Actual Mirror Image */}
        <div className="relative group w-full h-full flex items-center justify-center">
          <motion.img 
            src={MIRROR_IMAGE_URL}
            alt="唐代瑞花龙凤葵花镜"
            className="w-full h-full object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.3)] filter brightness-[1.02] contrast-[1.05]"
            draggable={false}
          />
          
          {/* Hotspots Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-full h-full max-w-full max-h-full pointer-events-auto">
              {hotspots.map((point) => (
                <motion.div
                  key={point.id}
                  drag={isEditMode}
                  dragMomentum={false}
                  onDragEnd={(e, info) => handleDragEnd(point.id, info)}
                  style={{ 
                    left: `${point.x}%`, 
                    top: `${point.y}%`,
                    position: 'absolute'
                  }}
                  className={`-translate-x-1/2 -translate-y-1/2 z-20 ${isEditMode ? 'cursor-move' : 'cursor-pointer'}`}
                >
                  <button
                    onClick={() => !isEditMode && onPointSelect(point.id)}
                    onMouseEnter={() => setHoveredId(point.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="outline-none group p-5" // Larger hit area
                    aria-label={point.title}
                  >
                    <div className="relative flex items-center justify-center">
                      
                      {/* 1. Ambient Breathing Glow - Now always slightly visible */}
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: (activeId === point.id || hoveredId === point.id) ? 0.6 : 0.25
                        }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="absolute w-8 h-8 rounded-full bg-[#a67c52] blur-md pointer-events-none"
                      />

                      {/* 2. Outer Ring Animation on Active/Hover */}
                      <AnimatePresence>
                        {(activeId === point.id || hoveredId === point.id) && (
                          <motion.div 
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1.6, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            className="absolute w-12 h-12 rounded-full border border-[#a67c52]/40 bg-[#a67c52]/5 backdrop-blur-[4px] shadow-[0_0_20px_rgba(166,124,82,0.2)]"
                          />
                        )}
                      </AnimatePresence>

                      {/* 3. Main Glass Marker */}
                      <motion.div 
                        animate={{ 
                          scale: (activeId === point.id || hoveredId === point.id) ? 1.3 : 1,
                          borderColor: (activeId === point.id || hoveredId === point.id) ? '#a67c52' : '#a67c52aa',
                          backgroundColor: (activeId === point.id || hoveredId === point.id) ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)',
                          boxShadow: activeId === point.id 
                            ? '0 0 25px rgba(166, 124, 82, 0.7), inset 0 0 10px rgba(166, 124, 82, 0.4)' 
                            : '0 0 12px rgba(166, 124, 82, 0.3)'
                        }}
                        className={`w-7 h-7 rounded-full border-[2px] backdrop-blur-[2px] z-30 transition-all duration-300 flex items-center justify-center ${isEditMode ? 'ring-2 ring-white ring-offset-2' : ''}`}
                      >
                         {/* Number Label inside the ring - Always visible but faint */}
                         <span className={`text-[10px] font-bold transition-all duration-300 ${activeId === point.id || hoveredId === point.id ? 'text-[#a67c52] scale-110' : 'text-[#a67c52aa]'}`}>
                            {point.id}
                         </span>
                      </motion.div>
                      
                      {/* 4. Rapid Pulse - Visual "Ping" */}
                      {!isEditMode && (
                        <motion.div 
                          initial={{ scale: 1, opacity: 0.6 }}
                          animate={{ scale: 3.5, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
                          className="absolute w-7 h-7 rounded-full border border-[#a67c52]/50 pointer-events-none"
                        />
                      )}
                      
                      {/* 5. Floating Title Label */}
                      <AnimatePresence>
                        {(hoveredId === point.id || isEditMode) && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 12 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-10 bg-stone-900/90 backdrop-blur-xl px-5 py-2 rounded-lg border border-white/10 shadow-2xl whitespace-nowrap z-50 pointer-events-none flex flex-col items-center"
                          >
                            <span className="text-xs font-bold text-amber-200 tracking-[0.2em] font-calligraphy">
                              {point.title}
                            </span>
                            {isEditMode && (
                              <span className="text-[9px] text-stone-300 font-mono mt-1 opacity-70">
                                X: {point.x}% / Y: {point.y}%
                              </span>
                            )}
                            {/* Little Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-900/90 rotate-45 -mt-1" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
