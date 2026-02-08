const RATE_LIMIT_KEY = 'webora_last_submission';
const RATE_LIMIT_HOURS = 24;

export const canSubmit = (email: string): { allowed: boolean; remainingTime?: string } => {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  
  if (!stored) return { allowed: true };

  try {
    const data = JSON.parse(stored);
    
    // Αν είναι διαφορετικό email, επιτρέπουμε
    if (data.email !== email) return { allowed: true };

    const lastSubmission = new Date(data.timestamp);
    const now = new Date();
    const hoursPassed = (now.getTime() - lastSubmission.getTime()) / (1000 * 60 * 60);

    if (hoursPassed >= RATE_LIMIT_HOURS) {
      return { allowed: true };
    }

    // Υπολογισμός υπολειπόμενου χρόνου
    const hoursRemaining = Math.ceil(RATE_LIMIT_HOURS - hoursPassed);
    return { 
      allowed: false, 
      remainingTime: `${hoursRemaining} ώρες` 
    };
  } catch {
    return { allowed: true };
  }
};

export const recordSubmission = (email: string): void => {
  const data = {
    email,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
};