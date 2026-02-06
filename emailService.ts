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
    let serviceImageUrls: { [key: number]: string } = {};

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

    // Upload service images
    for (let i = 0; i < data.services.length; i++) {
      if (data.services[i].image) {
        console.log(`📸 Uploading service image ${i + 1}...`);
        const url = await uploadToCloudinary(data.services[i].image!);
        if (url) serviceImageUrls[i] = url;
      }
    }

    console.log('✅ All images uploaded!');

    // Prepare services list with image links
    const servicesList = data.services
      .filter(s => s.text)
      .map((s, i) => {
        const imageLink = serviceImageUrls[i] 
          ? `\n   🖼️ Εικόνα: ${serviceImageUrls[i]}`
          : '';
        return `${i + 1}. ${s.text}${imageLink}`;
      })
      .join('\n') || 'Δεν προστέθηκαν στοιχεία';

    // Prepare social links
    const socialsList = data.socialLinks
      .filter(l => l)
      .join('\n') || 'Δεν προστέθηκαν social links';

    // Prepare moods
    const moodsList = data.moods.join(', ') || 'Δεν επιλέχθηκαν';

    // Prepare contact methods
    const contactMethodsList = data.contactMethods.join(', ') || 'Δεν επιλέχθηκαν';

    // Count files
    let fileCount = 0;
    if (data.logo) fileCount++;
    fileCount += data.photos.length;
    fileCount += data.services.filter(s => s.image).length;

    // Prepare photos list with links
    const photosInfo = photoUrls.length > 0
      ? `✅ ${photoUrls.length} φωτογραφίες:\n${photoUrls.map((url, i) => `   ${i + 1}. ${url}`).join('\n')}`
      : '❌ Δεν ανέβηκαν';

    // Prepare logo info
    const logoInfo = logoUrl 
      ? `✅ Ανέβηκε:\n   ${logoUrl}`
      : '❌ Δεν ανέβηκε';

    // Prepare email parameters
    const templateParams = {
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
      logo: logoInfo,
      photos: photosInfo,
      fileCount: `${fileCount} / 15`,
      submission_time: new Date().toLocaleString('el-GR', { 
        dateStyle: 'full', 
        timeStyle: 'short' 
      })
    };

    // Send email
    console.log('📧 Sending email...');
    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      templateParams,
      EMAIL_CONFIG.publicKey
    );

    console.log('✅ Email sent successfully:', response);
    return true;

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};