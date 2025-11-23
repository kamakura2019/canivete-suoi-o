import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PromptWorkspace from './components/PromptWorkspace';
import { CATEGORIES } from './constants';
import { Category } from './types';
import Icon from './components/Icon';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/20 selection:text-primary">
      
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 glass-panel rounded-full text-gray-300 hover:text-white shadow-lg backdrop-blur-xl"
        >
          <Icon name={isSidebarOpen ? 'X' : 'Menu'} size={20} />
        </button>
      </div>

      <Sidebar 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Dynamic Atmospheric Background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] bg-[size:40px_40px]"></div>
          
          {/* Animated Gradients */}
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] animate-float"></div>
          
          {/* Noise Texture Overlay for matte finish */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
        </div>

        <div className="relative z-10 h-full flex flex-col pt-16 md:pt-0">
          <PromptWorkspace category={selectedCategory} />
        </div>
      </main>
    </div>
  );
};

export default App;