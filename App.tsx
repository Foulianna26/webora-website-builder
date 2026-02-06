
import React, { useState, useEffect } from 'react';
import { AppStep, FormDataState, FileData } from './types';
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
    // Spam check: if honeypot is filled, discard silently
    if (data.honeypot) {
      console.warn("Spam detected via honeypot field.");
      setCurrentAppStep(AppStep.SUBMITTING);
      setTimeout(() => {
        setCurrentAppStep(AppStep.THANK_YOU);
      }, 1500);
      return;
    }
  
    setFormData(data);
    setCurrentAppStep(AppStep.SUBMITTING);
  
    // Send email via EmailJS
    const success = await sendFormEmail(data);
  
    if (success) {
      console.log("✅ Email sent successfully!");
      setTimeout(() => {
        setCurrentAppStep(AppStep.THANK_YOU);
      }, 2000);
    } else {
      console.error("❌ Email sending failed!");
      // Still show thank you page (user doesn't need to know it failed)
      setTimeout(() => {
        setCurrentAppStep(AppStep.THANK_YOU);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative blurred circles for background aesthetics */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-orange-100 rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-orange-200 rounded-full blur-[120px] opacity-40"></div>

      <div className="w-full max-w-2xl z-10">
        {currentAppStep === AppStep.INTRO && (
          <StepIntro onStart={handleStart} />
        )}

        {currentAppStep === AppStep.WIZARD && (
          <Wizard onFinish={handleFinish} initialData={formData} />
        )}

        {currentAppStep === AppStep.SUBMITTING && (
          <div className="text-center py-20">
             <div className="inline-block w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
             <h2 className="text-2xl font-medium text-gray-800">Αποστολή στοιχείων...</h2>
          </div>
        )}

        {currentAppStep === AppStep.THANK_YOU && (
          <ThankYou />
        )}
      </div>
    </div>
  );
};

export default App;
