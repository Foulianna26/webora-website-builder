import React, { useState } from 'react';
import { AppStep, FormDataState } from './types';
import StepIntro from './components/StepIntro';
import Wizard from './components/Wizard';
import ThankYou from './components/ThankYou';
import { sendFormEmail } from './emailService';

const initialData: FormDataState = {
  honeypot: '',
  name: '',
  email: '',
  phone: '',
  description: '',
  presentationType: '',
  services: [],
  logo: null,
  photos: [],
  socialLinks: [],
  moods: [],
  styleReference: null,
  dontWant: '',
  goal: '',
  contactMethods: []
};

const App: React.FC = () => {
  const [currentAppStep, setCurrentAppStep] = useState<AppStep>(AppStep.INTRO);
  const [formData, setFormData] = useState<FormDataState>(initialData);

  const handleStart = () => {
    setCurrentAppStep(AppStep.WIZARD);
  };

  const handleFinish = async (data: FormDataState) => {
    if (data.honeypot) {
      setCurrentAppStep(AppStep.SUBMITTING);
      setTimeout(() => setCurrentAppStep(AppStep.THANK_YOU), 1500);
      return;
    }

    setFormData(data);
    setCurrentAppStep(AppStep.SUBMITTING);

    const success = await sendFormEmail(data);
    
    setTimeout(() => {
      setCurrentAppStep(AppStep.THANK_YOU);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden text-white">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500 rounded-full blur-[180px] opacity-15"></div>
      <div className="absolute top-[40%] right-[-5%] w-[300px] h-[300px] bg-purple-600 rounded-full blur-[120px] opacity-10"></div>

      <div className="w-full max-w-2xl z-10">
        <div className="animated-border-container shadow-2xl">
          <div className="animated-border-bg"></div>
          <div className="animated-border-inner w-full">
            {currentAppStep === AppStep.INTRO && <StepIntro onStart={handleStart} />}
            {currentAppStep === AppStep.WIZARD && <Wizard onFinish={handleFinish} initialData={formData} />}
            {currentAppStep === AppStep.SUBMITTING && (
              <div className="text-center py-20 glass rounded-[48px] p-12">
                <div className="inline-block w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-6 glow-cyan"></div>
                <h2 className="text-2xl font-semibold text-white">Αποστολή στοιχείων...</h2>
                <p className="text-gray-400 mt-2">Η σελίδα σας ετοιμάζεται</p>
              </div>
            )}
            {currentAppStep === AppStep.THANK_YOU && <ThankYou />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;