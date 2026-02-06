
import React from 'react';
import { Icons } from '../constants';

interface Props {
  onStart: () => void;
}

const StepIntro: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="glass rounded-[40px] p-8 md:p-12 text-center shadow-xl border border-white/40">
      <div className="mb-8 flex justify-center">
      <img 
  src="/webora-logo.png" 
  alt="Webora Logo" 
  className="h-24 w-auto"
  />
</div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
        Ας φτιάξουμε την <br/> <span className="text-orange-600">παρουσία σου</span> στο διαδίκτυο
      </h1>
      
      <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
        Συμπλήρωσε μερικές απλές πληροφορίες και εμείς θα αναλάβουμε να δημιουργήσουμε το επαγγελματικό σου website αυτόματα.
      </p>

      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={onStart}
          className="group relative flex items-center justify-center gap-3 bg-black text-white px-10 py-5 rounded-full text-xl font-medium hover:bg-gray-800 transition-all duration-300 shadow-xl"
        >
          Δοκιμάστε δωρεάν
          <span className="bg-orange-500 rounded-full p-1 group-hover:translate-x-1 transition-transform">
            <Icons.ChevronRight />
          </span>
        </button>
        <p className="text-sm text-gray-400 mt-4">
          Δεν απαιτείται πληρωμή - Δωρεάν δοκιμή • Διάρκεια: 5 λεπτά
        </p>
      </div>
    </div>
  );
};

export default StepIntro;
