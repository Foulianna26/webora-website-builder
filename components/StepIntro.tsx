import React from 'react';
import { Icons } from '../constants';

interface Props {
  onStart: () => void;
}

const StepIntro: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="glass rounded-[22px] p-8 md:p-16 text-center animate-fadeIn relative z-10">
      <div className="mb-10 flex justify-center">
        <img 
          src="/webora-logo.png" 
          alt="Webora Logo" 
          className="h-24 w-auto"
        />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
        Ας φτιάξουμε την <br/> <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">παρουσία σου</span>
      </h1>
      
      <p className="text-lg text-gray-400 mb-12 max-w-md mx-auto leading-relaxed">
        Συμπλήρωσε μερικές απλές πληροφορίες και εμείς θα αναλάβουμε να δημιουργήσουμε το επαγγελματικό σου website αυτόματα.
      </p>

      <div className="flex flex-col items-center gap-6">
        <button 
          onClick={onStart}
          className="group relative flex items-center justify-center gap-3 bg-white text-black px-8 md:px-12 py-5 md:py-6 rounded-full text-lg md:text-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
        >
          Δοκιμάστε δωρεάν
          <span className="bg-blue-600 text-white rounded-full p-1.5 group-hover:translate-x-1 transition-transform shadow-inner">
            <Icons.ChevronRight />
          </span>
        </button>
        <p className="text-sm text-gray-500 mt-2 font-medium tracking-wide">
          Δεν απαιτείται πληρωμή - Δωρεάν δοκιμή • Διάρκεια: 5 λεπτά
        </p>
      </div>
    </div>
  );
};

export default StepIntro;