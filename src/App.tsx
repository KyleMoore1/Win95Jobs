import React, { useState, useEffect, useRef } from 'react';
import { AppWindow as Windows, Search, Gamepad2, ChevronRight } from 'lucide-react';
import { useJobStore } from './lib/store';
import JobExplorer from './components/JobExplorer';
import JobDetail from './components/JobDetail';
import Minesweeper from './components/Minesweeper';

function App() {
  const { activeWindow } = useJobStore();
  const [showMinesweeper, setShowMinesweeper] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startMenuRef.current && !startMenuRef.current.contains(event.target as Node)) {
        setShowStartMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartClick = () => {
    setShowStartMenu(!showStartMenu);
  };

  const launchProgram = (program: 'explorer' | 'minesweeper') => {
    if (program === 'explorer') {
      useJobStore.getState().setActiveWindow('explorer');
    } else if (program === 'minesweeper') {
      setShowMinesweeper(true);
    }
    setShowStartMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#008080] overflow-hidden">
      {/* Windows */}
      <JobExplorer />
      {activeWindow === 'detail' && <JobDetail />}
      {showMinesweeper && <Minesweeper onClose={() => setShowMinesweeper(false)} />}

      {/* Start Menu */}
      {showStartMenu && (
        <div 
          ref={startMenuRef}
          className="fixed bottom-10 left-0 w-64 win95-window z-50"
        >
          <div className="flex">
            {/* Left sidebar */}
            <div className="w-8 bg-[#000080] flex flex-col justify-end">
              <div className="text-white font-bold text-2xl vertical-text pb-4">
                Windows 95
              </div>
            </div>

            {/* Menu items */}
            <div className="flex-1 bg-[#C0C0C0] p-1">
              <button
                className="w-full flex items-center gap-2 p-1 hover:bg-[#000080] hover:text-white group"
                onClick={() => launchProgram('explorer')}
              >
                <Search className="w-5 h-5" />
                <span className="flex-1 text-left">Job Explorer</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
              </button>
              <button
                className="w-full flex items-center gap-2 p-1 hover:bg-[#000080] hover:text-white group"
                onClick={() => launchProgram('minesweeper')}
              >
                <Gamepad2 className="w-5 h-5" />
                <span className="flex-1 text-left">Minesweeper</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="taskbar">
        <button
          className={`start-button ${showStartMenu ? 'active' : ''}`}
          onClick={handleStartClick}
        >
          <Windows className="w-5 h-5" />
          Start
        </button>
        {activeWindow && (
          <div className="win95-button-static flex items-center gap-2 min-w-40">
            <Search className="w-4 h-4" />
            <span className="truncate">Job Explorer.exe</span>
          </div>
        )}
        <button
          className="win95-button hidden md:flex items-center gap-2 min-w-40"
          onClick={() => setShowMinesweeper(true)}
        >
          <Gamepad2 className="w-4 h-4" />
          <span className="truncate">Minesweeper.exe</span>
        </button>
        <a 
          href="https://grepjob.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-auto text-sm hover:underline truncate text-blue-800"
        >
          <span className="hidden md:inline">For more jobs, visit grepjob.com →</span>
          <span className="md:hidden">grepjob.com →</span>
        </a>
      </div>
    </div>
  );
}

export default App;