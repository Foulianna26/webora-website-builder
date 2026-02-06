import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';

const ThankYou: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [countdown, setCountdown] = useState({
    hours: 17,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDialog(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass rounded-[40px] p-8 md:p-12 text-center shadow-xl border border-white/40 min-h-[400px] flex flex-col items-center justify-center animate-fadeIn relative">
      {!showDialog ? (
        <>
          <div className="mb-8 relative">
            <div className="w-24 h-24 border-4 border-orange-100 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full animate-pulse shadow-lg shadow-orange-200"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Λάβαμε το αίτημά σου!</h2>
          <p className="text-gray-600">Επεξεργαζόμαστε τα στοιχεία σου...</p>
        </>
      ) : (
        <div className="animate-scaleIn w-full">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-green-100">
            <Icons.Check />
          </div>
          <p className="mb-6 italic">
            Λίγη υπομονή ακόμα!<br/><br/>Λόγω αυξημένης ζήτησης, ο χρόνος παράδοσης έχει αυξηθεί.<br/><br/>
            Είσαι σε γραμμή προτεραιότητας!
          </p>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-3xl border-2 border-orange-200 mb-6 shadow-md">
            <p className="text-sm text-orange-800 font-semibold mb-3">⏰ Εκτιμώμενος χρόνος παράδοσης:</p>
            <div className="flex justify-center gap-4 mb-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm min-w-[80px]">
                <div className="text-3xl font-bold text-orange-600">{countdown.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 mt-1">ώρες</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm min-w-[80px]">
                <div className="text-3xl font-bold text-orange-600">{countdown.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 mt-1">λεπτά</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm min-w-[80px]">
                <div className="text-3xl font-bold text-orange-600">{countdown.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 mt-1">δευτ.</div>
              </div>
            </div>
            <p className="text-xs text-orange-700 italic">
              * Ο πραγματικός χρόνος μπορεί να διαφέρει ελαφρώς
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md">
            <div className="text-lg text-gray-800 font-bold leading-relaxed">
              Η σελίδα σου θα σταλεί με προσωπικό link στο email σου μέσα στις επόμενες 24 ώρες. 
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  Ενώ περιμένεις, δες τι φτιάξαμε για άλλους!
                </p>
                <a 
                  href="#" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Δες τα έργα μας</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThankYou;