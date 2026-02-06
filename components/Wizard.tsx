
import React, { useState } from 'react';
import { FormDataState, FileData, ServiceItem } from '../types';
import { Icons, MOODS, PRESENTATION_OPTIONS, GOAL_OPTIONS } from '../constants';

interface Props {
  initialData: FormDataState;
  onFinish: (data: FormDataState) => void;
}

const Wizard: React.FC<Props> = ({ initialData, onFinish }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormDataState>(initialData);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);

  const totalSteps = 6; // 5 steps + Review

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
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
    // Service images
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
      if (file.size > 1024 * 1024) {
        alert(`Το αρχείο ${file.name} υπερβαίνει το 1MB.`);
        continue;
      }

      const reader = new FileReader();
      const filePromise = new Promise((resolve) => {
        reader.onload = (event) => {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            base64: event.target?.result as string
          });
        };
      });
      reader.readAsDataURL(file);
      processedFiles.push(await filePromise);
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

    const newMoods = isSelected
      ? data.moods.filter(m => m !== id)
      : [...data.moods, id];
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
    if (step === 1) {
      return data.name && data.email && validateEmail(data.email) && data.description;
    }
    if (step === 2) return data.presentationType !== '';
    if (step === 5) return data.goal && data.contactMethods.length > 0;
    return true;
  };

  const emailIsInvalid = emailTouched && data.email && !validateEmail(data.email);
  const isSimplePresence = data.presentationType === 'Απλή Παρουσίαση';

  const needsPhone = data.contactMethods.includes('Τηλέφωνο') && !data.phone;
  const needsSocials = data.goal === 'Follow στα Social' && data.socialLinks.filter(l => l).length === 0;

  return (
    <div className="glass rounded-[32px] overflow-hidden shadow-2xl flex flex-col min-h-[600px] border border-white/50">
      <div className="bg-gray-100 h-2 w-full flex">
         <div 
           className="bg-orange-500 h-full transition-all duration-500 ease-out"
           style={{ width: `${(step / totalSteps) * 100}%` }}
         />
      </div>

      <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100">
        <div>
           <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Βήμα {step} από {totalSteps}</span>
           <h2 className="text-xl font-semibold text-gray-800">
              {step === 1 && "Βασικές Πληροφορίες"}
              {step === 2 && "Περιεχόμενο"}
              {step === 3 && "Αρχεία & Social"}
              {step === 4 && "Ύφος & Αισθητική"}
              {step === 5 && "Στόχος"}
              {step === 6 && "Τελική Ανασκόπηση"}
           </h2>
        </div>
        <div className="text-gray-400 text-sm">
           {Math.round((step / totalSteps) * 100)}%
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto max-h-[60vh]">
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Honeypot field - Visually hidden */}
            <div className="hidden" aria-hidden="true">
               <input 
                 type="text" 
                 name="website_url" 
                 tabIndex={-1} 
                 autoComplete="off" 
                 value={data.honeypot} 
                 onChange={e => updateData({ honeypot: e.target.value })} 
               />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ονοματεπώνυμο / Επιχείρηση</label>
              <input 
                type="text" value={data.name} onChange={e => updateData({ name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
                placeholder="π.χ. Ιωάννης Παπαδόπουλος"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={data.email} 
                onBlur={() => setEmailTouched(true)}
                onChange={e => updateData({ email: e.target.value })}
                className={`w-full px-4 py-3 rounded-2xl border bg-white text-gray-900 focus:ring-2 outline-none transition-all shadow-sm ${emailIsInvalid ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-500'}`}
                placeholder="email@example.com"
              />
              {emailIsInvalid && (
                <p className="text-red-500 text-xs mt-1 ml-2">Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Τηλέφωνο (προαιρετικό)</label>
              <input 
                type="tel" value={data.phone} onChange={e => updateData({ phone: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Τι κάνετε; (Σύντομη περιγραφή)</label>
              <textarea 
                rows={3} value={data.description} onChange={e => updateData({ description: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
                placeholder="Περιγράψτε την δραστηριότητά σας..."
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <p className="text-gray-600">Τι θα θέλατε να προβάλλετε στην ιστοσελίδα σας;</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PRESENTATION_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => updateData({ presentationType: opt })}
                  className={`p-3 rounded-2xl border-2 text-center transition-all ${data.presentationType === opt ? 'border-orange-500 bg-orange-50 text-gray-900 shadow-sm' : 'border-gray-100 hover:border-orange-200 bg-white text-gray-700'}`}
                >
                  <span className="font-medium text-sm">{opt}</span>
                </button>
              ))}
            </div>
            
            {!isSimplePresence && data.presentationType !== '' && (
              <div className="pt-4 border-t border-gray-100 animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 mb-3">Λίστα {data.presentationType.toLowerCase()} (έως 8)</label>
                <div className="space-y-4">
                  {data.services.map((service, index) => (
                    <div key={index} className="flex flex-col gap-2 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm animate-fadeIn">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={service.text} 
                          onChange={e => updateService(index, e.target.value)}
                          className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                          placeholder={`${data.presentationType === 'Υπηρεσίες' ? 'Γράψε εδώ την υπηρεσία που προσφέρεις' : 'Γράψε εδώ τον τίτλο του έργου/προϊόντος'}`}
                        />
                        <button 
                          onClick={() => removeService(index)}
                          className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Icons.X />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            id={`service-img-${index}`} 
                            onChange={e => handleServiceImageUpload(e, index)}
                          />
                          <label 
                            htmlFor={`service-img-${index}`}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all ${service.image ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                          >
                            <Icons.Image />
                            {service.image ? 'Άλλαξε φωτογραφία' : 'Προσθήκη φωτογραφίας - έως 1ΜΒ'}
                          </label>
                        </div>
                        {service.image && (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setPreviewImage(service.image!.base64)}
                              className="text-[10px] text-blue-500 hover:underline"
                            >
                              Προεπισκόπηση
                            </button>
                            <button 
                              onClick={() => removeServiceImage(index)}
                              className="text-[10px] text-red-500 hover:underline"
                            >
                              Διαγραφή
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {data.services.length < 8 && (
                    <button 
                      onClick={addService}
                      className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2 font-medium text-sm"
                    >
                      <span className="text-xl">+</span> Προσθήκη στοιχείου
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Ανέβασμα Λογοτύπου (Προαιρετικό)</label>
                <div className="relative group">
                   <input type="file" onChange={e => handleFileUpload(e, 'logo')} className="hidden" id="logo-upload" accept="image/*" />
                   <label htmlFor="logo-upload" className="cursor-pointer border-2 border-dashed border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center gap-2 hover:border-orange-500 transition-colors shadow-sm">
                      <Icons.Upload />
                      <span className="text-xs text-gray-500">{data.logo ? data.logo.name : 'Επιλέξτε αρχείο'}</span>
                   </label>
                </div>
                <p className="text-xs text-orange-600 font-medium">
                  Αν δεν έχετε λογότυπο, μην ανησυχείτε! Θα δημιουργήσουμε κάτι όμορφο βασισμένο στο όνομά σας.
                </p>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Φωτογραφίες (έως 5 συνολικά)</label>
                <div className="relative group">
                   <input type="file" multiple onChange={e => handleFileUpload(e, 'photos')} className="hidden" id="photos-upload" accept="image/*" />
                   <label htmlFor="photos-upload" className="cursor-pointer border-2 border-dashed border-gray-200 bg-white rounded-2xl p-6 flex flex-col items-center gap-2 hover:border-orange-500 transition-colors shadow-sm">
                      <Icons.Upload />
                      <span className="text-xs text-gray-500">{data.photos.length > 0 ? `${data.photos.length} αρχεία` : 'Επιλέξτε αρχεία'}</span>
                   </label>
                </div>
                <p className="text-xs text-gray-500">
                  Κάθε αρχείο πρέπει να είναι έως 1MB.
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-3">Social Links (Instagram, Facebook κλπ)</label>
              <div className="space-y-3">
                {data.socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 animate-fadeIn">
                    <input 
                      type="url" 
                      value={link} 
                      onChange={e => updateSocialLink(index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
                      placeholder="https://..."
                    />
                    <button 
                      onClick={() => removeSocialLink(index)}
                      className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Icons.X />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={addSocialLink}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center gap-2 font-medium text-sm"
                >
                  <span className="text-xl">+</span> Προσθήκη συνδέσμου social media
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className="text-gray-600">Ποια αίσθηση θέλετε να αποπνέει η σελίδα;</p>
              <p className="text-xs text-orange-600 font-medium mb-4 italic">(Επιλέξτε έως 3 ύφη)</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {MOODS.map(mood => (
                <div 
                  key={mood.id}
                  className={`group relative flex flex-col rounded-2xl border-2 cursor-pointer transition-all overflow-hidden ${data.moods.includes(mood.id) ? 'border-orange-500 bg-orange-50 shadow-md ring-2 ring-orange-200' : 'border-gray-100 hover:border-orange-200 bg-white'}`}
                  onClick={() => toggleMood(mood.id)}
                >
                  <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                    <img 
                      src={mood.image} 
                      alt={mood.label} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                       <button 
                        onClick={(e) => { e.stopPropagation(); setPreviewImage(mood.image); }}
                        className="bg-white/90 p-2 rounded-full text-gray-700 shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-500 hover:text-white"
                        title="Προεπισκόπηση"
                      >
                        <Icons.Eye />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex justify-between items-center">
                    <span className={`font-semibold text-sm ${data.moods.includes(mood.id) ? 'text-orange-700' : 'text-gray-700'}`}>
                      {mood.label}
                    </span>
                    {data.moods.includes(mood.id) && (
                      <div className="bg-orange-500 text-white rounded-full p-1 transform animate-scaleIn">
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
            {/* Goal Section */}
            <div>
              <p className="text-gray-600 mb-4 font-medium">Τι θέλετε να κάνει ο επισκέπτης;</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {GOAL_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => updateData({ goal: opt })}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${data.goal === opt ? 'border-orange-500 bg-orange-50 text-gray-900 shadow-sm' : 'border-gray-100 hover:border-orange-200 bg-white text-gray-700'}`}
                  >
                    <span className="font-medium">{opt}</span>
                  </button>
                ))}
              </div>

              {/* Conditional: Social Follow Notice */}
              {needsSocials && (
                <div className="mt-6 p-6 bg-blue-50 rounded-[24px] border border-blue-100 animate-fadeIn space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Θέλετε να σας ακολουθούν στα Social Media, αλλά δεν έχετε δώσει συνδέσμους. Προσθέστε έναν παρακάτω:
                    </p>
                    <p className="text-xs text-blue-700 mt-1 italic">
                      Αν θέλετε να προσθέσετε παραπάνω social media πηγαίνετε πίσω στο Βήμα 3.
                    </p>
                  </div>
                  <input 
                    type="url"
                    placeholder="https://instagram.com/your-profile"
                    className="w-full px-4 py-3 rounded-2xl border border-blue-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                    onChange={e => updateData({ socialLinks: [e.target.value] })}
                  />
                </div>
              )}
            </div>

            {/* Contact Methods Section */}
            <div className="pt-6 border-t border-gray-100">
              <p className="text-gray-600 mb-4 font-medium">Προτιμώμενος τρόπος επικοινωνίας</p>
              <div className="flex gap-6 items-center">
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
                      style={{ appearance: 'auto', WebkitAppearance: 'checkbox' }}
                      className="w-6 h-6 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500 bg-white shadow-sm"
                    />
                    <span className="text-gray-700 font-semibold group-hover:text-black transition-colors">{method}</span>
                  </label>
                ))}
              </div>

              {/* Conditional: Missing Phone Input */}
              {needsPhone && (
                <div className="mt-6 p-6 bg-orange-50 rounded-[24px] border border-orange-100 animate-fadeIn space-y-3">
                  <p className="text-sm font-semibold text-orange-800 italic">
                    Εφόσον επιλέξατε το τηλέφωνο ως τρόπο επικοινωνίας, παρακαλούμε δώστε μας τον αριθμό σας:
                  </p>
                  <input 
                    type="tel"
                    value={data.phone}
                    onChange={e => updateData({ phone: e.target.value })}
                    placeholder="π.χ. 6900000000"
                    className="w-full px-4 py-3 rounded-2xl border border-orange-200 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {step === 6 && (
           <div className="space-y-4 animate-fadeIn">
              <p className="text-gray-600">Ελέγξτε τα στοιχεία σας πριν την αποστολή.</p>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Όνομα:</span> <span className="text-gray-900">{data.name}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Email:</span> <span className="text-gray-900">{data.email}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Τηλέφωνο:</span> <span className="text-gray-900">{data.phone || '-'}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Προβολή:</span> <span className="text-gray-900">{data.presentationType}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Στόχος:</span> <span className="text-gray-900">{data.goal}</span></div>
                <div className="flex flex-col border-b pb-2"><span className="text-gray-500 mb-1">Social Links:</span> <span className="text-gray-900">{data.socialLinks.filter(l => l).length > 0 ? data.socialLinks.filter(l => l).join(', ') : 'Κανένα'}</span></div>
                <div className="flex flex-col border-b pb-2">
                  <span className="text-gray-500 mb-1">{data.presentationType}:</span> 
                  <span className="text-gray-900">
                    {data.services.filter(s => s.text).length > 0 
                      ? data.services.filter(s => s.text).map(s => `${s.text}${s.image ? ' (🖼️)' : ''}`).join(', ') 
                      : (isSimplePresence ? 'Απλή Παρουσίαση' : 'Κανένα')}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Αρχεία:</span> <span className="text-gray-900">{getTotalFileCount()} / 15</span></div>
                <div className="pt-2"><span className="text-gray-500 block mb-1">Περιγραφή:</span> <p className="text-gray-800 line-clamp-3">{data.description}</p></div>
              </div>
              <div className="p-4 bg-orange-50 rounded-2xl text-orange-700 text-xs">
                 Πατώντας υποβολή, τα στοιχεία σας θα σταλούν στην ομάδα μας για επεξεργασία.
              </div>
           </div>
        )}
      </div>

      <div className="px-8 py-6 border-t border-gray-100 flex justify-between bg-white/40">
        <button 
          onClick={prevStep}
          disabled={step === 1}
          className="flex items-center gap-2 text-gray-500 font-medium hover:text-black transition-colors disabled:opacity-0"
        >
          <Icons.ChevronLeft />
          Πίσω
        </button>
        
        <button 
          onClick={nextStep}
          disabled={!isStepValid()}
          className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg disabled:bg-gray-300"
        >
          {step === totalSteps ? "Δημιούργησε το website μου" : "Επόμενο"}
          {step !== totalSteps && <Icons.ChevronRight />}
        </button>
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
           <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="bg-gray-100 p-2 flex items-center gap-1.5 border-b border-gray-200">
                <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                <div className="flex-1 bg-white rounded h-5 mx-4 flex items-center px-3">
                   <div className="w-20 h-2 bg-gray-100 rounded"></div>
                </div>
              </div>
              <img src={previewImage} alt="Style reference" className="w-full h-auto object-contain max-h-[85vh]" />
              <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-orange-500 hover:text-white shadow-lg transition-all z-10">
                <Icons.X />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Wizard;
