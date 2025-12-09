import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Mascot } from '../components/Mascot';
import { useApp } from '../context/AppContext';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser } = useApp();

  const handleStart = (lang: 'fr' | 'en') => {
    updateUser({ targetLanguage: lang });
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center max-w-md mx-auto">
      <Mascot emotion="happy" size="lg" className="mb-8" />
      
      <h1 className="text-3xl font-extrabold text-gray-700 mb-4">
        LingoLeap
      </h1>
      
      <p className="text-gray-500 text-lg mb-12">
        The free, fun, and effective way to learn a language!
      </p>

      <div className="space-y-4 w-full">
        <Button fullWidth onClick={() => handleStart('fr')}>
          I want to learn French 🇫🇷
        </Button>
        <Button fullWidth variant="outline" onClick={() => handleStart('en')}>
          I want to learn English 🇬🇧
        </Button>
      </div>
      
      <div className="mt-8">
        <p className="text-gray-400 text-sm">ALREADY HAVE AN ACCOUNT?</p>
        <Button variant="ghost" className="mt-2 text-brand-green">LOG IN</Button>
      </div>
    </div>
  );
};