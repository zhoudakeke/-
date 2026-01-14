
import React, { useState, useCallback, useRef } from 'react';
import { BackgroundDecor } from './components/BackgroundDecor';
import { MirrorDisplay } from './components/MirrorDisplay';
import { InfoPanel } from './components/InfoPanel';
import { MIRROR_HOTSPOTS as INITIAL_HOTSPOTS } from './constants';
import { Hotspot } from './types';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [hotspots, setHotspots] = useState<Hotspot[]>(INITIAL_HOTSPOTS);
  const [activePointId, setActivePointId] = useState<number | null>(null);
  const [hoveredPointId, setHoveredPointId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const handlePointSelect = useCallback((id: number) => {
    setActivePointId(prevId => prevId === id ? null : id);
  }, []);

  const handlePointMove = useCallback((id: number, x: number, y: number) => {
    setHotspots(prev => prev.map(p => p.id === id ? { ...p, x, y } : p));
  }, []);

  const handlePointUpdate = useCallback((updatedPoint: Hotspot) => {
    setHotspots(prev => prev.map(p => p.id === updatedPoint.id ? updatedPoint : p));
  }, []);

  const activePoint = hotspots.find(p => p.id === activePointId) || null;

  const copyToClipboard = () => {
    const configStr = JSON.stringify(hotspots, null, 2);
    navigator.clipboard.writeText(configStr);
    alert('配置已复制到剪贴板！');
  };

  return (
    <div className="h-screen w-full bg-[#fdfcf8] relative text-stone-800 flex flex-col lg:flex-row overflow-hidden">
      <BackgroundDecor />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden z-10 flex flex-col">
        {/* Top Header */}
        <header className="absolute top-10 left-10 lg:top-14 lg:left-14 flex flex-col gap-1 z-30 pointer-events-none">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl lg:text-5xl font-bold tracking-[0.4em] text-stone-900 pointer-events-auto"
          >
            唐韵镜华
          </motion.h1>
          <div className="flex items-center gap-4 mt-3 pointer-events-auto">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-stone-600 font-light tracking-[0.3em] text-sm lg:text-base border-l-4 border-[#a67c52] pl-6"
            >
              瑞花龙凤葵花镜知识赏析
            </motion.p>
            
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`ml-4 px-3 py-1 rounded border text-[10px] tracking-widest transition-colors shadow-sm ${
                isEditMode ? 'bg-[#a67c52] text-white border-[#a67c52]' : 'bg-white/50 text-stone-400 border-stone-200 hover:border-stone-400'
              }`}
            >
              {isEditMode ? '退出编辑' : '编辑内容与位置'}
            </button>
            
            {isEditMode && (
              <button 
                onClick={() => setShowConfig(true)}
                className="px-3 py-1 rounded border border-stone-200 bg-white/50 text-stone-400 text-[10px] tracking-widest hover:border-stone-400 shadow-sm"
              >
                导出最终配置
              </button>
            )}
          </div>
        </header>

        {/* Central Display Container */}
        <div className="flex-1 w-full h-full overflow-hidden">
          <MirrorDisplay 
            hotspots={hotspots}
            onPointSelect={handlePointSelect}
            onPointMove={handlePointMove}
            activeId={activePointId}
            hoveredId={hoveredPointId}
            setHoveredId={setHoveredPointId}
            isEditMode={isEditMode}
          />
        </div>

        {/* Legend / Quick Nav - Enhanced for single line and wider width */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-5xl px-8 z-30 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white/80 backdrop-blur-3xl border border-stone-200/80 rounded-full px-10 py-4 flex items-center gap-8 shadow-[0_20px_60px_rgba(166,124,82,0.15)] overflow-x-auto no-scrollbar max-w-full"
          >
            <span className="text-[10px] text-stone-400 uppercase tracking-[0.4em] whitespace-nowrap hidden sm:inline border-r border-stone-200 pr-8 mr-2 font-bold">
              知识点快速访问
            </span>
            <div className="flex flex-nowrap justify-center gap-4">
              {hotspots.map((point) => (
                <button
                  key={point.id}
                  onClick={() => handlePointSelect(point.id)}
                  onMouseEnter={() => setHoveredPointId(point.id)}
                  onMouseLeave={() => setHoveredPointId(null)}
                  className={`w-11 h-11 rounded-full text-sm font-bold transition-all duration-500 border flex items-center justify-center flex-shrink-0 ${
                    activePointId === point.id 
                      ? 'bg-[#a67c52] text-white border-[#a67c52] scale-110 shadow-lg' 
                      : hoveredPointId === point.id
                      ? 'bg-[#a67c52]/10 text-[#a67c52] border-[#a67c52] scale-105'
                      : 'bg-white/90 text-stone-500 border-stone-200 hover:border-[#a67c52] hover:text-[#a67c52]'
                  }`}
                  title={point.title}
                >
                  {point.id}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Sidebar Info Panel */}
      <InfoPanel 
        point={activePoint} 
        onClose={() => setActivePointId(null)}
        isEditMode={isEditMode}
        onUpdate={handlePointUpdate}
      />

      {/* Config Export Modal */}
      <AnimatePresence>
        {showConfig && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl flex flex-col gap-4"
            >
              <h3 className="text-xl font-bold">最终配置 JSON</h3>
              <p className="text-sm text-stone-500">复制以下内容，下次运行前可手动更新 constants.ts 以保持更改。</p>
              <textarea 
                readOnly
                className="w-full h-64 p-4 font-mono text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none"
                value={JSON.stringify(hotspots, null, 2)}
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowConfig(false)} className="px-6 py-2 rounded-full border border-stone-200 text-stone-500 text-sm">关闭</button>
                <button onClick={copyToClipboard} className="px-6 py-2 rounded-full bg-[#a67c52] text-white text-sm">复制到剪贴板</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Help Indicator */}
      <div className="fixed bottom-3 right-6 text-[8px] text-stone-400 pointer-events-none lg:hidden z-30 uppercase tracking-[0.3em]">
        {isEditMode ? 'Drag to move / Click to edit text' : 'Touch Points to zoom in'}
      </div>
    </div>
  );
};

export default App;
