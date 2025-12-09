import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserState, Language } from '../types';
import { INITIAL_USER_STATE } from '../constants';

interface AppContextType {
  user: UserState;
  updateUser: (updates: Partial<UserState>) => void;
  completedLessons: string[];
  completeLesson: (lessonId: string, xp: number) => void;
  resetProgress: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Persist state to local storage for a better demo experience
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('lingoleap_user');
    return saved ? JSON.parse(saved) : INITIAL_USER_STATE;
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('lingoleap_completed');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lingoleap_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lingoleap_completed', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const updateUser = (updates: Partial<UserState>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const completeLesson = (lessonId: string, xpEarned: number) => {
    if (!completedLessons.includes(lessonId)) {
        setCompletedLessons(prev => [...prev, lessonId]);
        // Simple logic: if lesson ID equals current level, unlock next
        if (parseInt(lessonId) === user.currentLevel) {
            updateUser({ 
                xp: user.xp + xpEarned, 
                currentLevel: user.currentLevel + 1 
            });
        } else {
            updateUser({ xp: user.xp + xpEarned });
        }
    } else {
        // Practice mode, just xp
        updateUser({ xp: user.xp + Math.floor(xpEarned / 2) });
    }
  };

  const resetProgress = () => {
      setUser(INITIAL_USER_STATE);
      setCompletedLessons([]);
  };

  return (
    <AppContext.Provider value={{ user, updateUser, completedLessons, completeLesson, resetProgress }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
