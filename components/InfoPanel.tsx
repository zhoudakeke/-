
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hotspot } from '../types';

interface InfoPanelProps {
  point: Hotspot | null;
  onClose: () => void;
  isEditMode: boolean;
  onUpdate: (point: Hotspot) => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ point, onClose, isEditMode, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!point) return;
    const { name, value } = e.target;
    onUpdate({
      ...point,
      [name]: value,
    });
  };

  return (
    <div className="w-full lg:w-[450px] h-full bg-white/60 backdrop-blur-xl lg:border-l border-stone-200 p-8 flex flex-col justify-center relative overflow-y-auto z-40 shadow-2xl transition-all duration-500">
      <AnimatePresence mode="wait">
        {point ? (
          <motion.div
            key={point.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl font-calligraphy text-[#a67c52]">{point.id < 10 ? `0${point.id}` : point.id}</span>
              <div className="h-px flex-1 bg-stone-200"></div>
              {isEditMode && <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase tracking-widest">编辑中</span>}
            </div>
            
            {isEditMode ? (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">标题</label>
                  <input 
                    name="title"
                    value={point.title}
                    onChange={handleChange}
                    className="text-2xl font-bold text-stone-800 bg-white/50 border border-stone-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#a67c52]/20 focus:border-[#a67c52] outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">分类</label>
                  <select
                    name="category"
                    value={point.category}
                    onChange={handleChange}
                    className="bg-white/50 border border-stone-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#a67c52]/20 focus:border-[#a67c52] outline-none transition-all text-sm"
                  >
                    <option value="structure">器型结构 (Structure)</option>
                    <option value="inner">内区纹饰 (Inner)</option>
                    <option value="outer">镜缘纹饰 (Outer)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">详细描述</label>
                  <textarea 
                    name="description"
                    value={point.description}
                    onChange={handleChange}
                    rows={8}
                    className="text-base text-stone-600 leading-relaxed bg-white/50 border border-stone-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#a67c52]/20 focus:border-[#a67c52] outline-none transition-all resize-none"
                  />
                </div>
                
                <p className="text-[10px] text-stone-400 italic">
                  * 坐标 X: {point.x}% | Y: {point.y}% (请在左侧拖动调整)
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-stone-800 tracking-wider">
                  {point.title}
                </h2>
                
                <p className="text-lg text-stone-600 leading-relaxed indent-8">
                  {point.description}
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border ${
                    point.category === 'structure' ? 'bg-blue-50 text-blue-500 border-blue-100' : 
                    point.category === 'inner' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {point.category === 'structure' ? '器型结构' : 
                     point.category === 'inner' ? '内区纹饰' : '镜缘纹饰'}
                  </span>
                </div>

                <div className="mt-8 pt-8 border-t border-stone-100 italic text-stone-400 text-sm font-light">
                  唐代盛世 · 瑞花龙凤葵花镜
                </div>
              </>
            )}

            <button 
              onClick={onClose}
              className="mt-6 self-start px-8 py-2.5 bg-stone-800 text-stone-100 rounded-full text-sm hover:bg-stone-900 transition-colors shadow-lg hover:shadow-xl active:scale-95"
            >
              完成预览
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center gap-6"
          >
            <div className="w-20 h-20 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-300 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </div>
            <div>
              <p className="text-stone-500 font-medium text-lg mb-2">欢迎来到交互大观</p>
              <p className="text-stone-400 font-light max-w-xs">
                {isEditMode 
                  ? '点击左侧任意金色知识点开始编辑其详细内容与分类' 
                  : '点击镜面上的金色光点，探索大唐铜镜所承载的盛世文明'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
