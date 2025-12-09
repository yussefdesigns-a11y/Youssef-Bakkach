import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield } from 'lucide-react';

const MOCK_LEADERBOARD = [
  { name: 'Sarah', xp: 2400, avatar: 'bg-yellow-400' },
  { name: 'Mike', xp: 2150, avatar: 'bg-blue-400' },
  { name: 'You', xp: 0, avatar: 'bg-brand-green' }, // Will update with real XP
  { name: 'Emma', xp: 1800, avatar: 'bg-purple-400' },
  { name: 'John', xp: 1200, avatar: 'bg-red-400' },
];

export const Leaderboard: React.FC = () => {
  const { user } = useApp();
  
  // Sort leaderboard with user's current XP
  const leaderboardData = MOCK_LEADERBOARD.map(u => 
    u.name === 'You' ? { ...u, xp: user.xp } : u
  ).sort((a, b) => b.xp - a.xp);

  return (
    <div className="flex flex-col items-center pt-8 px-4 pb-20">
      <div className="mb-8 text-center">
         <Shield size={64} className="text-brand-yellow mx-auto mb-2" fill="#FFC800" />
         <h1 className="text-2xl font-bold text-gray-700">Diamond League</h1>
         <p className="text-gray-400">Top 10 advance to the next league</p>
      </div>

      <div className="w-full space-y-2">
        {leaderboardData.map((player, index) => (
          <div 
            key={player.name}
            className={`
                flex items-center p-4 rounded-xl border-2
                ${player.name === 'You' ? 'border-brand-green bg-green-50' : 'border-gray-100 bg-white'}
            `}
          >
            <span className={`
                font-bold w-8 text-lg
                ${index === 0 ? 'text-brand-yellow' : 'text-gray-400'}
            `}>
                {index + 1}
            </span>
            
            <div className={`w-10 h-10 rounded-full ${player.avatar} mr-4 flex items-center justify-center text-white font-bold`}>
                {player.name[0]}
            </div>
            
            <div className="flex-1 font-bold text-gray-700">
                {player.name}
            </div>
            
            <div className="font-bold text-gray-500">
                {player.xp} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};