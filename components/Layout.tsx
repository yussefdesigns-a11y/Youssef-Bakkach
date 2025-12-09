import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Award, User, Settings, Heart, Flame, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useApp();

  // Hide layout on Onboarding or inside a Lesson
  if (location.pathname === '/onboarding' || location.pathname.startsWith('/lesson')) {
    return <>{children}</>;
  }

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <button
        onClick={() => navigate(to)}
        className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors ${
          isActive ? 'text-brand-blue' : 'text-gray-400 hover:text-brand-blue-dark'
        }`}
      >
        <Icon size={24} strokeWidth={isActive ? 3 : 2} fill={isActive ? "currentColor" : "none"} className={isActive ? "opacity-20 absolute scale-150" : "hidden"} />
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      </button>
    );
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white z-10">
        <div className="flex items-center space-x-2">
            {/* Flag */}
             <span className="text-2xl">{user.targetLanguage === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
        </div>
        
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-brand-red font-bold">
                <Heart size={20} fill="#FF4B4B" />
                <span>{user.hearts}</span>
            </div>
             <div className="flex items-center space-x-1 text-brand-yellow font-bold">
                <Flame size={20} fill="#FFC800" />
                <span>{user.streak}</span>
            </div>
             <div className="flex items-center space-x-1 text-brand-blue font-bold">
                <Zap size={20} fill="#1CB0F6" />
                <span>{user.xp}</span>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-20 bg-white relative">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 py-1 flex justify-around items-center z-20 pb-safe">
        <NavItem to="/" icon={Home} label="Learn" />
        <NavItem to="/leaderboard" icon={Award} label="Leaderboard" />
        <NavItem to="/profile" icon={User} label="Profile" />
      </nav>
      
      {/* Safe area padding for bottom nav on mobile */}
      <div className="h-4 w-full bg-white absolute bottom-0 -z-10"></div>
    </div>
  );
};