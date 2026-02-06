
export interface FileData {
  name: string;
  size: number;
  type: string;
  base64: string;
}

export interface ServiceItem {
  text: string;
  image: FileData | null;
}

export interface FormDataState {
  // Honeypot for spam protection
  honeypot: string;
  // Step 1
  name: string;
  email: string;
  phone: string;
  description: string;
  // Step 2
  presentationType: string;
  services: ServiceItem[];
  // Step 3
  logo: FileData | null;
  photos: FileData[];
  socialLinks: string[];
  // Step 4
  moods: string[];
  styleReference: FileData | null;
  dontWant: string;
  // Step 5
  goal: string;
  contactMethods: string[];
}

export enum AppStep {
  INTRO = 'INTRO',
  WIZARD = 'WIZARD',
  SUBMITTING = 'SUBMITTING',
  THANK_YOU = 'THANK_YOU'
}
