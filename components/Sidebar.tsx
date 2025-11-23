import React from 'react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';
import Icon from './Icon';

interface SidebarProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onSelectCategory, isOpen, onCloseMobile }) => {
  return (
    <>
      {/* Overlay for mobile with blur */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-md transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 bg-black/20 md:bg-transparent border-r border-white/5 backdrop-blur-2xl md:backdrop-blur-none
        transform transition-transform duration-500 cubic-bezier(0.2, 0.8, 0.2, 1)
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        flex flex-col
      `}>
        {/* Logo Area */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
               <div className="absolute inset-0 bg-gradient-to-br from-primary to-primaryDark rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="relative w-full h-full rounded-xl bg-black/40 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                 <Icon name="SwissFranc" className="text-white" size={20} /> 
               </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold tracking-tight text-white leading-none">Canivete<span className="text-primary font-light">Suíço</span></h1>
              <span className="text-[10px] text-subtle tracking-[0.2em] uppercase mt-1 opacity-70 group-hover:text-primary transition-colors">AI Engineering</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="space-y-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat);
                    onCloseMobile();
                  }}
                  className={`
                    relative group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm transition-all duration-300 border border-transparent overflow-hidden
                    ${isActive ? 'bg-white/[0.03] text-white border-white/5' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]'}
                  `}
                >
                  {isActive && (
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent opacity-80" />
                  )}
                  
                  <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-subtle group-hover:text-gray-300'}`}>
                    <Icon name={cat.icon} size={18} />
                  </span>
                  
                  <span className="relative z-10 font-medium tracking-wide flex-1 text-left">{cat.name}</span>
                  
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5">
          <div className="glass-panel p-3 rounded-xl flex items-center justify-between">
             <div className="flex items-center gap-2 text-xs text-subtle">
                <div className="relative w-2 h-2">
                   <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                   <div className="relative w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
                <span>Gemini 2.5 Flash</span>
             </div>
             <Icon name="Cpu" size={14} className="text-white/20" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;