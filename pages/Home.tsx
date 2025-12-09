import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Check, Lock } from 'lucide-react';
import { LEVEL_NODES } from '../constants';
import { useApp } from '../context/AppContext';
import { Mascot } from '../components/Mascot';

export const Home: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const handleNodeClick = (id: number) => {
    if (id <= user.currentLevel) {
      navigate(`/lesson/${id}`);
    }
  };

  return (
    <div className="flex flex-col items-center pt-8 pb-20 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      
      {/* Unit Header */}
      <div className="w-full bg-brand-green p-4 rounded-xl mx-4 mb-4 flex justify-between items-center shadow-lg text-white">
          <div>
              <h2 className="font-bold text-xl">Unit 1</h2>
              <p className="text-brand-green-100">Intro to French</p>
          </div>
          <Star fill="white" className="text-white" />
      </div>

      <div className="relative flex flex-col items-center w-full space-y-6">
        {LEVEL_NODES.map((node, index) => {
          const isUnlocked = node.id <= user.currentLevel;
          const isCurrent = node.id === user.currentLevel;
          const isCompleted = node.id < user.currentLevel;

          // Create a sine wave path effect using margins
          const offsetX = Math.sin(index) * 60; 

          return (
            <div 
                key={node.id} 
                className="relative z-10"
                style={{ transform: `translateX(${offsetX}px)` }}
            >
              <div className="relative group">
                {/* Floating Crown for current level */}
                {isCurrent && (
                     <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 animate-bounce">
                         <div className="bg-white px-3 py-1 rounded-lg text-xs font-bold shadow text-brand-green uppercase tracking-wide whitespace-nowrap">
                             Start
                         </div>
                         <div className="w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-white border-r-[6px] border-r-transparent absolute left-1/2 -translate-x-1/2 bottom-[-6px]"></div>
                     </div>
                )}

                <button
                  onClick={() => handleNodeClick(node.id)}
                  disabled={!isUnlocked}
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-[0_6px_0_0_rgba(0,0,0,0.2)] transition-transform active:translate-y-[6px] active:shadow-none
                    ${isCompleted ? 'bg-brand-yellow shadow-[0_6px_0_0_#E5B400]' : ''}
                    ${isCurrent ? 'bg-brand-green shadow-[0_6px_0_0_#46A302]' : ''}
                    ${!isUnlocked ? 'bg-gray-200 text-gray-400 shadow-[0_6px_0_0_#E5E5E5]' : ''}
                  `}
                >
                  {isCompleted ? <Check size={32} className="text-white font-bold" strokeWidth={4} /> : 
                   !isUnlocked ? <Lock size={24} /> : 
                   <span>{node.icon}</span>}
                </button>
                
                {/* Progress ring for current level (cosmetic) */}
                {isCurrent && (
                    <div className="absolute inset-0 rounded-full border-4 border-white opacity-30 pointer-events-none"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <Mascot emotion="happy" size="md" className="fixed bottom-24 right-4 z-0 opacity-50 pointer-events-none" />
    </div>
  );
};