
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
  honeypot: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  presentationType: string;
  services: ServiceItem[];
  logo: FileData | null;
  photos: FileData[];
  socialLinks: string[];
  moods: string[];
  styleReference: FileData | null;
  dontWant: string;
  goal: string;
  contactMethods: string[];
  additionalComments?: string;  // ΠΡΟΣΘΗΚΗ
  gdprConsent?: boolean;         // ΠΡΟΣΘΗΚΗ
}

export enum AppStep {
  INTRO = 'INTRO',
  WIZARD = 'WIZARD',
  SUBMITTING = 'SUBMITTING',
  THANK_YOU = 'THANK_YOU'
}
