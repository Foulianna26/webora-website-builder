import React, { useState } from 'react';
import { FormDataState, FileData, ServiceItem } from '../types';
import { Icons, MOODS, PRESENTATION_OPTIONS, GOAL_OPTIONS } from '../constants';
import { compressImage } from '../imageCompressor';

interface Props {
  initialData: FormDataState;
  onFinish: (data: FormDataState) => void;
}

const Wizard: React.FC<Props> = ({ initialData, onFinish }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormDataState>(initialData);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);

  const totalSteps = 6;

  const validateEmail = (email: string) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else onFinish(data);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateData = (updates: Partial<FormDataState>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const getTotalFileCount = () => {
    let count = 0;
    if (data.logo) count++;
    count += data.photos.length;
    if (data.styleReference) count++;
    count += data.services.filter(s => s.image).length;
    return count;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'photos' | 'styleReference') => {
    const files = e.target.files;
    if (!files) return;
    const currentFileCount = getTotalFileCount();
    const newFilesCount = field === 'photos' ? files.length : 1;
    if (currentFileCount + newFilesCount > 15) {
      alert('Μπορείτε να ανεβάσετε έως 15 αρχεία συνολικά.');
      return;
    }
  
    const processedFiles: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Compress image
        const compressedBase64 = await compressImage(file);
        
        processedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          base64: compressedBase64
        });
      } catch (error) {
        console.error('Compression error:', error);
        alert(`Σφάλμα στη σμίκρυνση του ${file.name}`);
      }
    }
  
    if (field === 'photos') {
      updateData({ photos: [...data.photos, ...processedFiles].slice(0, 10) });
    } else {
      updateData({ [field]: processedFiles[0] });
    }
  };

  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert('Το αρχείο υπερβαίνει το 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData: FileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        base64: event.target?.result as string
      };
      const newServices = [...data.services];
      newServices[index] = { ...newServices[index], image: fileData };
      updateData({ services: newServices });
    };
    reader.readAsDataURL(file);
  };

  const removeServiceImage = (index: number) => {
    const newServices = [...data.services];
    newServices[index] = { ...newServices[index], image: null };
    updateData({ services: newServices });
  };

  const toggleMood = (id: string) => {
    const isSelected = data.moods.includes(id);
    if (!isSelected && data.moods.length >= 3) {
      alert('Μπορείτε να επιλέξετε έως 3 ύφη.');
      return;
    }
    const newMoods = isSelected ? data.moods.filter(m => m !== id) : [...data.moods, id];
    updateData({ moods: newMoods });
  };

  const addSocialLink = () => {
    updateData({ socialLinks: [...data.socialLinks, ''] });
  };

  const updateSocialLink = (index: number, value: string) => {
    const newLinks = [...data.socialLinks];
    newLinks[index] = value;
    updateData({ socialLinks: newLinks });
  };

  const removeSocialLink = (index: number) => {
    updateData({ socialLinks: data.socialLinks.filter((_, i) => i !== index) });
  };

  const addService = () => {
    if (data.services.length >= 8) {
      alert('Μπορείτε να προσθέσετε έως 8 στοιχεία.');
      return;
    }
    updateData({ services: [...data.services, { text: '', image: null }] });
  };

  const updateService = (index: number, value: string) => {
    const newServices = [...data.services];
    newServices[index] = { ...newServices[index], text: value };
    updateData({ services: newServices });
  };

  const removeService = (index: number) => {
    updateData({ services: data.services.filter((_, i) => i !== index) });
  };

  const isStepValid = () => {
    if (step === 1) return data.name && data.email && validateEmail(data.email) && data.description;
    if (step === 2) return data.presentationType !== '';
    if (step === 5) return data.goal && data.contactMethods.length > 0;
    return true;
  };

  const emailIsInvalid = emailTouched && data.email && !validateEmail(data.email);
  const isSimplePresence = data.presentationType === 'Απλή Παρουσίαση';
  const needsPhone = data.contactMethods.includes('Τηλέφωνο') && !data.phone;
  const needsSocials = data.goal === 'Follow στα Social' && data.socialLinks.filter(l => l).length === 0;

  const inputStyles = "w-full px-5 py-4 rounded-2xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-inner";
  const labelStyles = "block text-sm font-semibold text-gray-400 mb-2 ml-1";

  return (
    <div className="glass rounded-[48px] overflow-hidden flex flex-col min-h-[650px] animate-fadeIn relative z-10">
      {/* Progress Bar */}
      <div className="bg-white/5 h-1.5 w-full">
        <div 
          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-700 ease-in-out glow-blue"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <div className="px-10 py-8 flex justify-between items-center border-b border-white/5 bg-white/2">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-1 block">Βήμα {step} / {totalSteps}</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {step === 1 && "Βασικά Στοιχεία"}
            {step === 2 && "Περιεχόμενο"}
            {step === 3 && "Αρχεία & Social"}
            {step === 4 && "Ύφος & Αισθητική"}
            {step === 5 && "Στόχος"}
            {step === 6 && "Τελική Ανασκόπηση"}
          </h2>
        </div>
      </div>

      <div className="flex-1 p-10 overflow-y-auto max-h-[65vh]">
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="hidden" aria-hidden="true">
              <input type="text" name="website_url" tabIndex={-1} autoComplete="off" value={data.honeypot} onChange={e => updateData({ honeypot: e.target.value })} />
            </div>
            <div>
              <label className={labelStyles}>Ονοματεπώνυμο / Επιχείρηση</label>
              <input type="text" value={data.name} onChange={e => updateData({ name: e.target.value })} className={inputStyles} placeholder="π.χ. Ιωάννης Παπαδόπουλος" />
            </div>
            <div>
              <label className={labelStyles}>Email</label>
              <input 
                type="email" 
                value={data.email} 
                onBlur={() => setEmailTouched(true)}
                onChange={e => updateData({ email: e.target.value })}
                className={`${inputStyles} ${emailIsInvalid ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="email@example.com"
              />
              {emailIsInvalid && <p className="text-red-500 text-xs mt-1 ml-2">Παρακαλώ εισάγετε έγκυρη διεύθυνση email.</p>}
            </div>
            <div>
              <label className={labelStyles}>Τηλέφωνο (προαιρετικό)</label>
              <input type="tel" value={data.phone} onChange={e => updateData({ phone: e.target.value })} className={inputStyles} />
            </div>
            <div>
              <label className={labelStyles}>Τι κάνετε; (Σύντομη περιγραφή)</label>
              <textarea rows={3} value={data.description} onChange={e => updateData({ description: e.target.value })} className={inputStyles} placeholder="Περιγράψτε τη δραστηριότητά σας..." />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <p className="text-gray-400 font-medium">Τι θα θέλατε να προβάλλετε στην ιστοσελίδα σας;</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PRESENTATION_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => updateData({ presentationType: opt })}
                  className={`p-4 rounded-3xl border-2 transition-all duration-300 text-center relative ${data.presentationType === opt ? 'border-blue-500 bg-blue-500/10 shadow-lg glow-blue' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                >
                  <span className={`font-bold text-sm ${data.presentationType === opt ? 'text-white' : 'text-gray-400'}`}>{opt}</span>
                  {data.presentationType === opt && <div className="absolute top-2 right-2 text-blue-400 text-xs"><Icons.Check /></div>}
                </button>
              ))}
            </div>

            {!isSimplePresence && data.presentationType !== '' && (
              <div className="pt-4 border-t border-white/10 animate-fadeIn">
                <label className={labelStyles}>Λίστα {data.presentationType.toLowerCase()} (έως 8)</label>
                <div className="space-y-4">
                  {data.services.map((service, index) => (
                    <div key={index} className="flex flex-col gap-2 p-4 recessed rounded-2xl animate-fadeIn">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={service.text} 
                          onChange={e => updateService(index, e.target.value)}
                          className={inputStyles}
                          placeholder={`π.χ. ${data.presentationType === 'Υπηρεσίες' ? 'Σχεδιασμός λογοτύπου' : 'Όνομα έργου'}`}
                        />
                        <button onClick={() => removeService(index)} className="p-3 text-gray-400 hover:text-red-500 transition-colors">
                          <Icons.X />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input type="file" accept="image/*" className="hidden" id={`service-img-${index}`} onChange={e => handleServiceImageUpload(e, index)} />
                          <label 
                            htmlFor={`service-img-${index}`}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all ${service.image ? 'bg-blue-500/20 border-blue-400 text-blue-300' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                          >
                            <Icons.Image />
                            {service.image ? 'Άλλαξε φωτογραφία' : 'Προσθήκη φωτογραφίας'}
                          </label>
                        </div>
                        {service.image && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => setPreviewImage(service.image!.base64)} className="text-[10px] text-blue-400 hover:underline">
                              Προεπισκόπηση
                            </button>
                            <button onClick={() => removeServiceImage(index)} className="text-[10px] text-red-400 hover:underline">
                              Διαγραφή
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {data.services.length < 8 && (
                    <button onClick={addService} className="w-full py-3 rounded-2xl border-2 border-dashed border-white/10 text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-all flex items-center justify-center gap-2 font-medium text-sm">
                      <span className="text-xl">+</span> Προσθήκη στοιχείου
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className={labelStyles}>Λογότυπο (Προαιρετικό)</label>
                <input type="file" onChange={e => handleFileUpload(e, 'logo')} className="hidden" id="logo-upload" accept="image/*" />
                <label htmlFor="logo-upload" className="cursor-pointer recessed rounded-3xl p-8 flex flex-col items-center gap-3 hover:bg-white/5 transition-all border border-white/10 border-dashed">
                  <Icons.Upload />
                  <span className="text-sm text-gray-500 font-medium">{data.logo ? data.logo.name : 'Επιλέξτε αρχείο'}</span>
                </label>
                <p className="text-xs text-cyan-400 font-medium">
                  Αν δεν έχετε λογότυπο, θα δημιουργήσουμε κάτι όμορφο βασισμένο στο όνομά σας.
                </p>
              </div>
              <div className="space-y-3">
                <label className={labelStyles}>Φωτογραφίες (έως 5)</label>
                <input type="file" multiple onChange={e => handleFileUpload(e, 'photos')} className="hidden" id="photos-upload" accept="image/*" />
                <label htmlFor="photos-upload" className="cursor-pointer recessed rounded-3xl p-8 flex flex-col items-center gap-3 hover:bg-white/5 transition-all border border-white/10 border-dashed">
                  <Icons.Upload />
                  <span className="text-sm text-gray-500 font-medium">{data.photos.length > 0 ? `${data.photos.length} αρχεία` : 'Επιλέξτε αρχεία'}</span>
                </label>
                <p className="text-xs text-gray-500">Κάθε αρχείο έως 1MB.</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <label className={labelStyles}>Social Links (Instagram, Facebook κλπ)</label>
              <div className="space-y-3">
                {data.socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 animate-fadeIn">
                    <input type="url" value={link} onChange={e => updateSocialLink(index, e.target.value)} className={inputStyles} placeholder="https://..." />
                    <button onClick={() => removeSocialLink(index)} className="p-3 text-gray-400 hover:text-red-500 transition-colors">
                      <Icons.X />
                    </button>
                  </div>
                ))}
                <button onClick={addSocialLink} className="w-full py-3 rounded-2xl border-2 border-dashed border-white/10 text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-all flex items-center justify-center gap-2 font-medium text-sm">
                  <span className="text-xl">+</span> Προσθήκη συνδέσμου
                </button>
              </div>
            </div>
          </div>
        )}

{step === 4 && (
  <div className="space-y-8 animate-fadeIn">
    <p className="text-gray-400 font-medium">Ποια αίσθηση θέλετε να αποπνέει η σελίδα; (Έως 3 ύφη)</p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {MOODS.map(mood => (
        <div 
          key={mood.id}
          className={`group relative flex flex-col rounded-[24px] border-2 cursor-pointer transition-all duration-500 overflow-hidden ${data.moods.includes(mood.id) ? 'border-blue-500 scale-105 shadow-xl glow-blue' : 'border-white/5 bg-white/2 hover:border-white/20'}`}
          onClick={() => toggleMood(mood.id)}
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <img src={mood.image} alt={mood.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <button 
              onClick={(e) => { e.stopPropagation(); setPreviewImage(mood.image); }}
              className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-500 z-10"
              title="Προεπισκόπηση"
            >
              <Icons.Eye />
            </button>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <span className="font-bold text-sm text-white drop-shadow-lg">{mood.label}</span>
            {data.moods.includes(mood.id) && (
              <div className="bg-blue-500 rounded-full p-1 shadow-lg">
                <Icons.Check />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
        {step === 5 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <p className="text-gray-400 font-medium mb-4">Τι θέλετε να κάνει ο επισκέπτης;</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {GOAL_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => updateData({ goal: opt })}
                    className={`p-4 rounded-3xl border-2 transition-all duration-300 text-center ${data.goal === opt ? 'border-cyan-500 bg-cyan-500/10 shadow-lg glow-cyan' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                  >
                    <span className="font-bold text-sm text-white">{opt}</span>
                  </button>
                ))}
              </div>
              {needsSocials && (
                <div className="mt-6 p-6 recessed rounded-3xl border border-blue-500/20 animate-fadeIn space-y-4">
                  <p className="text-sm font-semibold text-blue-300">
                    Θέλετε follow στα Social αλλά δεν έχετε δώσει συνδέσμους. Προσθέστε έναν:
                  </p>
                  <input 
                    type="url"
                    placeholder="https://instagram.com/your-profile"
                    className={inputStyles}
                    onChange={e => updateData({ socialLinks: [e.target.value] })}
                  />
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/10">
              <p className="text-gray-400 font-medium mb-4">Προτιμώμενος τρόπος επικοινωνίας</p>
              <div className="flex gap-6">
                {['Email', 'Τηλέφωνο'].map(method => (
                  <label key={method} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={data.contactMethods.includes(method)}
                      onChange={() => {
                        const methods = data.contactMethods.includes(method)
                          ? data.contactMethods.filter(m => m !== method)
                          : [...data.contactMethods, method];
                        updateData({ contactMethods: methods });
                      }}
                      className="w-6 h-6 rounded border-white/20 text-blue-500 focus:ring-blue-500 accent-blue-500 bg-black/30"
                    />
                    <span className="text-white font-semibold group-hover:text-blue-400 transition-colors">{method}</span>
                  </label>
                ))}
              </div>
              {needsPhone && (
                <div className="mt-6 p-6 recessed rounded-3xl border border-cyan-500/20 animate-fadeIn space-y-3">
                  <p className="text-sm font-semibold text-cyan-300">
                    Δώστε μας τον αριθμό σας:
                  </p>
                  <input type="tel" value={data.phone} onChange={e => updateData({ phone: e.target.value })} placeholder="π.χ. 6900000000" className={inputStyles} />
                </div>
              )}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <p className="text-gray-400 font-medium">Ελέγξτε τα στοιχεία σας πριν την αποστολή.</p>
            <div className="recessed rounded-3xl p-8 space-y-4 border border-white/10">
              <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-gray-500">Όνομα:</span> <span className="font-bold">{data.name}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-gray-500">Email:</span> <span className="font-bold">{data.email}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-gray-500">Τηλέφωνο:</span> <span className="font-bold">{data.phone || '-'}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-gray-500">Προβολή:</span> <span className="font-bold">{data.presentationType}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-gray-500">Στόχος:</span> <span className="font-bold">{data.goal}</span></div>
              <div className="flex flex-col border-b border-white/5 pb-3"><span className="text-gray-500 mb-1">Social Links:</span> <span className="text-white">{data.socialLinks.filter(l => l).length > 0 ? data.socialLinks.filter(l => l).join(', ') : 'Κανένα'}</span></div>
              <div className="flex flex-col border-b border-white/5 pb-3">
                <span className="text-gray-500 mb-1">{data.presentationType}:</span>
                <span className="text-white">
                  {data.services.filter(s => s.text).length > 0 
                    ? data.services.filter(s => s.text).map(s => `${s.text}${s.image ? ' (🖼️)' : ''}`).join(', ') 
                    : (isSimplePresence ? 'Απλή Παρουσίαση' : 'Κανένα')}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-gray-500">Αρχεία:</span> <span className="font-bold">{getTotalFileCount()} / 15</span></div>
              <div className="pt-2"><span className="text-gray-500 block mb-1">Περιγραφή:</span> <p className="text-gray-300 italic">"{data.description}"</p></div>
            </div>
            <div className="p-4 recessed rounded-2xl text-cyan-400 text-xs border border-cyan-500/20">
              Πατώντας υποβολή, τα στοιχεία σας θα σταλούν στην ομάδα μας.
            </div>
          </div>
        )}
      </div>

      <div className="px-10 py-8 bg-black/20 border-t border-white/5 flex justify-between items-center">
        <button 
          onClick={prevStep}
          disabled={step === 1}
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-white transition-all disabled:opacity-0"
        >
          <Icons.ChevronLeft /> Πίσω
        </button>
        
        <button 
          onClick={nextStep}
          disabled={!isStepValid()}
          className={`flex items-center gap-3 px-10 py-4 rounded-full font-bold transition-all shadow-xl hover:scale-105 active:scale-95 disabled:grayscale disabled:opacity-50 ${step === totalSteps ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white glow-blue' : 'bg-white text-black'}`}
        >
          {step === totalSteps ? "Δημιούργησε το website μου" : "Επόμενο"}
          {step !== totalSteps && <Icons.ChevronRight />}
        </button>
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-4xl w-full glass rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <img src={previewImage} alt="Preview" className="w-full h-auto object-contain max-h-[85vh]" />
            <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 bg-blue-600 p-3 rounded-full hover:bg-red-500 text-white shadow-lg transition-all glow-blue">
              <Icons.X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wizard;