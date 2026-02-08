export const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
  
          // Resize αν είναι μεγαλύτερο από maxWidth
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
  
          canvas.width = width;
          canvas.height = height;
  
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context error'));
            return;
          }
  
          ctx.drawImage(img, 0, 0, width, height);
  
          // Convert to base64 με compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
  
        img.onerror = () => reject(new Error('Image load error'));
        img.src = e.target?.result as string;
      };
  
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsDataURL(file);
    });
  };