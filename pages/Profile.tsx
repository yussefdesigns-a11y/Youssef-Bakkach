import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Settings, LogOut } from 'lucide-react';
import { MOCK_ACHIEVEMENTS } from '../constants';

export const Profile: React.FC = () => {
  const { user, resetProgress } = useApp();

  return (
    <div className="flex flex-col pt-8 px-4 pb-20">
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-400">Joined December 2024</p>
        </div>
        <button className="p-2 text-brand-blue">
            <Settings size={24} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
         <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white shadow-lg">
             {user.name[0]}
         </div>
         <div className="flex gap-6">
             <div>
                 <div className="font-bold text-lg text-gray-700">{user.streak}</div>
                 <div className="text-xs text-gray-400 uppercase font-bold">Day Streak</div>
             </div>
             <div>
                 <div className="font-bold text-lg text-gray-700">{user.xp}</div>
                 <div className="text-xs text-gray-400 uppercase font-bold">Total XP</div>
             </div>
              <div>
                 <div className="font-bold text-lg text-gray-700">Diam.</div>
                 <div className="text-xs text-gray-400 uppercase font-bold">League</div>
             </div>
         </div>
      </div>

      <h2 className="text-xl font-bold text-gray-700 mb-4">Achievements</h2>
      <div className="space-y-4">
        {MOCK_ACHIEVEMENTS.map(ach => (
            <div key={ach.id} className="flex items-center gap-4 border-2 border-gray-100 rounded-xl p-4">
                <div className={`w-16 h-16 flex items-center justify-center text-3xl bg-red-500 rounded-lg shadow-sm ${!ach.unlocked && 'grayscale opacity-50'}`}>
                    {ach.icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-700">{ach.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{ach.description}</p>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                        <div 
                            className="bg-brand-yellow h-full" 
                            style={{width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%`}}
                        ></div>
                    </div>
                </div>
            </div>
        ))}
      </div>
      
      <div className="mt-8">
        <Button variant="outline" fullWidth onClick={() => {
            if(window.confirm("Reset all progress?")) resetProgress();
        }} className="flex items-center justify-center gap-2 text-brand-red border-brand-red">
            <LogOut size={18} />
            Reset Progress
        </Button>
      </div>
    </div>
  );
};