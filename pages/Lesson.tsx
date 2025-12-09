import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Volume2, Mic, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { Mascot } from '../components/Mascot';
import { useApp } from '../context/AppContext';
import { generateLessonContent } from '../services/geminiService';
import { Question, QuestionType } from '../types';
import { LEVEL_NODES } from '../constants';

export const Lesson: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, completeLesson, updateUser } = useApp();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [progress, setProgress] = useState(0);
  const [isCheckDisabled, setIsCheckDisabled] = useState(true);

  useEffect(() => {
    const loadLesson = async () => {
      if (!id) return;
      setLoading(true);
      const node = LEVEL_NODES.find(n => n.id === parseInt(id));
      const topic = node ? node.topic : 'Basics';
      
      try {
          const data = await generateLessonContent(topic, user.targetLanguage, user.nativeLanguage);
          setQuestions(data);
      } catch (e) {
          // Error handled in service (returns mock), but safe fallback here too
          console.error(e);
      } finally {
          setLoading(false);
      }
    };
    loadLesson();
  }, [id, user.targetLanguage, user.nativeLanguage]);

  // Reset state when moving to next question
  useEffect(() => {
    setSelectedOption(null);
    setTextInput('');
    setFeedback(null);
    setIsCheckDisabled(true);
  }, [currentIndex]);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (option: string) => {
    if (feedback) return; // Prevent changing after check
    setSelectedOption(option);
    setIsCheckDisabled(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (feedback) return;
    setTextInput(e.target.value);
    setIsCheckDisabled(e.target.value.trim().length === 0);
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = user.targetLanguage === 'fr' ? 'fr-FR' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleCheck = () => {
    if (!currentQuestion) return;

    let isCorrect = false;

    if (currentQuestion.type === QuestionType.MULTIPLE_CHOICE) {
      isCorrect = selectedOption === currentQuestion.correctAnswer;
    } else {
      isCorrect = textInput.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    }

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    // Play sound effect (optional, browser dependent auto-play policies)
    if (isCorrect) {
        // const audio = new Audio('/success.mp3'); audio.play().catch(() => {});
    } else {
        updateUser({ hearts: Math.max(0, user.hearts - 1) });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(((currentIndex + 1) / questions.length) * 100);
    } else {
      // Lesson Complete
      if (id) completeLesson(id, 10 + questions.length * 2);
      navigate('/'); 
    }
  };
  
  const handleExit = () => {
      if (window.confirm("Are you sure you want to quit? You will lose progress.")) {
          navigate('/');
      }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <Mascot emotion="happy" size="lg" className="animate-bounce-short mb-4" />
        <p className="text-gray-500 font-bold text-xl">Creating your lesson...</p>
      </div>
    );
  }

  if (!currentQuestion) return <div>Error loading lesson</div>;

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto relative">
      {/* Header */}
      <div className="px-4 py-6 flex items-center gap-4">
        <button onClick={handleExit} className="text-gray-400 hover:text-gray-600">
          <X size={28} />
        </button>
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-green transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-brand-red font-bold flex items-center gap-1">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            {user.hearts}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-32 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-700 mb-8 mt-4">
            {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && "Select the correct meaning"}
            {currentQuestion.type === QuestionType.TRANSLATE_TO_NATIVE && "Translate this sentence"}
            {currentQuestion.type === QuestionType.TRANSLATE_TO_TARGET && "Translate this sentence"}
            {currentQuestion.type === QuestionType.LISTENING && "Type what you hear"}
        </h2>

        {/* Question Prompt Area */}
        <div className="flex items-start gap-4 mb-8">
            <Mascot emotion={feedback === 'correct' ? 'happy' : feedback === 'incorrect' ? 'sad' : 'neutral'} size="sm" />
            
            <div className="relative border-2 border-gray-200 rounded-2xl p-4 pr-12">
                 {/* Speech Bubble Arrow */}
                <div className="absolute top-6 -left-2 w-4 h-4 bg-white border-l-2 border-b-2 border-gray-200 transform rotate-45"></div>
                
                {currentQuestion.type === QuestionType.LISTENING ? (
                    <button 
                        onClick={() => playAudio(currentQuestion.audioText || currentQuestion.prompt)}
                        className="bg-brand-blue text-white p-4 rounded-xl shadow-[0_4px_0_0_#1899D6] active:translate-y-1 active:shadow-none transition-transform"
                    >
                        <Volume2 size={32} />
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        {currentQuestion.type !== QuestionType.TRANSLATE_TO_TARGET && (
                           <button onClick={() => playAudio(currentQuestion.prompt)} className="text-brand-blue">
                               <Volume2 size={24} />
                           </button>
                        )}
                        <span className="text-xl text-gray-700 font-medium">{currentQuestion.prompt}</span>
                    </div>
                )}
            </div>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
            {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && currentQuestion.options ? (
                <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(opt)}
                            disabled={feedback !== null}
                            className={`
                                p-4 rounded-xl border-2 border-b-4 text-lg text-left transition-all
                                ${selectedOption === opt 
                                    ? 'border-brand-blue bg-blue-50 text-brand-blue' 
                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                                }
                            `}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            ) : (
                <textarea
                    value={textInput}
                    onChange={(e) => {
                         setTextInput(e.target.value);
                         setIsCheckDisabled(e.target.value.trim().length === 0);
                    }}
                    disabled={feedback !== null}
                    placeholder="Type in English..."
                    className="w-full p-4 text-lg bg-gray-100 rounded-xl border-2 border-gray-200 focus:border-brand-gray focus:outline-none resize-none h-32"
                />
            )}
        </div>
      </div>

      {/* Footer / Feedback Action */}
      <div className={`fixed bottom-0 w-full max-w-md border-t-2 p-4 transition-colors duration-300 z-50 ${
          feedback === 'correct' ? 'bg-[#d7ffb8] border-[#b8f28b]' : 
          feedback === 'incorrect' ? 'bg-[#ffdfe0] border-[#ffc1c1]' : 'bg-white border-gray-100'
      }`}>
        <div className="flex justify-between items-center mb-4">
            {feedback === 'correct' && (
                <div className="flex items-center gap-3 text-brand-greenDark font-bold text-xl">
                    <div className="bg-white rounded-full p-2"><Check size={24} /></div>
                    <span>Nicely done!</span>
                </div>
            )}
            {feedback === 'incorrect' && (
                <div className="flex flex-col text-brand-redDark">
                    <span className="font-bold text-xl mb-1">Correct answer:</span>
                    <span className="text-lg">{currentQuestion.correctAnswer}</span>
                </div>
            )}
        </div>

        {feedback === null ? (
            <Button fullWidth onClick={handleCheck} disabled={isCheckDisabled}>
                Check
            </Button>
        ) : (
            <Button 
                fullWidth 
                onClick={handleNext} 
                variant={feedback === 'correct' ? 'primary' : 'danger'}
            >
                Continue
            </Button>
        )}
      </div>
    </div>
  );
};