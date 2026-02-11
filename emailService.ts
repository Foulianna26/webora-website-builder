import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from './emailConfig';
import { FormDataState } from './types';
import { uploadToCloudinary, uploadMultipleImages } from './cloudinaryService';

export const sendFormEmail = async (data: FormDataState): Promise<boolean> => {
  try {
    console.log('📤 Starting email process...');

    // Upload images to Cloudinary
    let logoUrl = '';
    let photoUrls: string[] = [];

    // Upload logo
    if (data.logo) {
      console.log('📸 Uploading logo...');
      const url = await uploadToCloudinary(data.logo);
      if (url) logoUrl = url;
    }

    // Upload photos
    if (data.photos.length > 0) {
      console.log('📸 Uploading photos...');
      photoUrls = await uploadMultipleImages(data.photos);
    }

    console.log('✅ All images uploaded!');

    // Prepare shared data
    const servicesList = data.services
      .filter(s => s.text)
      .map((s, i) => `${i + 1}. ${s.text}`)
      .join('\n') || 'Δεν προστέθηκαν στοιχεία';

    const socialsList = data.socialLinks
      .filter(l => l)
      .join('\n') || 'Δεν προστέθηκαν social links';

    const moodsList = data.moods.join(', ') || 'Δεν επιλέχθηκαν';
    const contactMethodsList = data.contactMethods.join(', ') || 'Δεν επιλέχθηκαν';

    const photosInfo = photoUrls.length > 0
      ? `✅ ${photoUrls.length} φωτογραφίες:\n${photoUrls.map((url, i) => `   ${i + 1}. ${url}`).join('\n')}`
      : '❌ Δεν ανέβηκαν';

    const logoInfo = logoUrl 
      ? `✅ Ανέβηκε:\n   ${logoUrl}`
      : '❌ Δεν ανέβηκε';

    let fileCount = 0;
    if (data.logo) fileCount++;
    fileCount += data.photos.length;

    const submissionTime = new Date().toLocaleString('el-GR', { 
      dateStyle: 'full', 
      timeStyle: 'short' 
    });

    // EMAIL 1: To Admin (you)
    const adminParams = {
      name: data.name,
      email: data.email,
      phone: data.phone || 'Δεν δόθηκε',
      description: data.description,
      additionalComments: data.additionalComments || 'Δεν δόθηκαν επιπλέον σχόλια',
      gdprConsentText: data.gdprConsent ? '✅ Ναι' : '❌ Όχι',
      presentationType: data.presentationType,
      services: servicesList,
      goal: data.goal,
      contactMethods: contactMethodsList,
      moods: moodsList,
      socialLinks: socialsList,
      logo: logoInfo,
      photos: photosInfo,
      fileCount: `${fileCount} / 15`,
      submission_time: submissionTime
    };

    // EMAIL 2: To Customer
    const customerParams = {
      name: data.name,
      email: data.email,
      phone: data.phone || 'Δεν δόθηκε',
      description: data.description,
      presentationType: data.presentationType,
      services: servicesList,
      goal: data.goal,
      contactMethods: contactMethodsList,
      moods: moodsList,
      socialLinks: socialsList,
      logoStatus: data.logo ? '✅ Ανέβηκε' : '❌ Δεν ανέβηκε',
      photoCount: data.photos.length > 0 ? `✅ ${data.photos.length} φωτογραφίες` : '❌ Δεν ανέβηκαν',
      additionalComments: data.additionalComments || 'Δεν δόθηκαν',
      submission_time: submissionTime
    };

    // Send admin email
    console.log('📧 Sending admin email...');
    await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      adminParams,
      EMAIL_CONFIG.publicKey
    );

// Send customer confirmation
console.log('📧 Sending customer confirmation...');
await emailjs.send(
  EMAIL_CONFIG.serviceId,
  'template_79xgqun',
  {
    ...customerParams,
    to_email: data.email  // Dynamic recipient
  },
  EMAIL_CONFIG.publicKey
);

    console.log('✅ Both emails sent successfully!');
    return true;

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};