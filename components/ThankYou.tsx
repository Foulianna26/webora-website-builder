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
    <div className="glass rounded-[48px] p-8 md:p-12 text-center min-h-[400px] flex flex-col items-center justify-center animate-fadeIn relative">
      {!showDialog ? (
        <>
          <div className="relative w-24 h-24 mx-auto mb-8">
  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 animate-spin" style={{ animationDuration: '3s' }}></div>
  <div className="absolute inset-1 rounded-full bg-[#0B0E14] flex items-center justify-center">
    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full animate-pulse glow-blue"></div>
  </div>
</div>
          <h2 className="text-3xl font-bold text-white mb-4">Λάβαμε το αίτημά σου!</h2>
          <p className="text-gray-400">Η "μηχανή" μας εργάζεται πυρετωδώς...</p>
        </>
      ) : (
        <div className="animate-scaleIn w-full">
          <div className="relative w-24 h-24 mx-auto mb-6">
  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 animate-spin" style={{ animationDuration: '3s' }}></div>
  <div className="absolute inset-1 rounded-full bg-[#0B0E14] flex items-center justify-center">
    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full glow-blue"></div>
  </div>
</div>
          <h2 className="text-3xl font-bold text-white mb-6">Σχεδόν έτοιμο!</h2>
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
            <p className="text-sm text-blue-300">
              Λόγω αυξημένης ζήτησης, η σελίδα σου θα είναι έτοιμη εντός 24 ωρών.
            </p>
          </div>
          <div className="recessed p-6 rounded-3xl border border-white/10 mb-6 shadow-md">
            <p className="text-sm text-blue-300 font-semibold mb-3">Εκτιμώμενος χρόνος παράδοσης:</p>
            <div className="flex justify-center gap-4 mb-4">
              <div className="recessed rounded-2xl p-4 shadow-sm min-w-[80px] border border-white/10">
                <div className="text-3xl font-bold text-cyan-400">{countdown.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-400 mt-1">ώρες</div>
              </div>
              <div className="recessed rounded-2xl p-4 shadow-sm min-w-[80px] border border-white/10">
                <div className="text-3xl font-bold text-cyan-400">{countdown.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-400 mt-1">λεπτά</div>
              </div>
              <div className="recessed rounded-2xl p-4 shadow-sm min-w-[80px] border border-white/10">
                <div className="text-3xl font-bold text-cyan-400">{countdown.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-400 mt-1">δευτ.</div>
              </div>
            </div>
            <p className="text-xs text-blue-400/70 italic">
              * Ο πραγματικός χρόνος μπορεί να διαφέρει ελαφρώς
            </p>
          </div>

          <div className="glass rounded-3xl p-6 border border-white/10 shadow-md">
            <p className="text-lg text-gray-300 font-medium leading-relaxed mb-6">
              Η σελίδα σου θα σταλεί με προσωπικό link στο email σου μέσα στις επόμενες 24 ώρες.
            </p>
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-3">
                Ενώ περιμένεις, δες τι φτιάξαμε για άλλους! 👇
              </p>
              <a 
                href="https://yourwebsite.com/portfolio" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 glow-blue"
              >
                <span>Δες τα έργα μας</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThankYou;