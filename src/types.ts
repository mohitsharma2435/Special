export interface Memory {
  id: string;
  image: string;
  fallbackImage?: string;
  filename?: string;
  title: string;
  subtitle?: string;
  emoji: string;
  date?: string;
  note?: string;
  aspectRatio?: 'portrait' | 'square' | 'wide';
  colorTag?: string;
}

export interface ScrapbookPageData {
  id: number;
  title: string;
  photos: {
    url: string;
    fallbackUrl?: string;
    caption: string;
    rotation: number;
    tapeColor?: string;
    position: { top: string; left: string; width: string };
  }[];
  stickers: {
    emoji: string;
    position: { top: string; left: string };
    scale?: number;
    rotation?: number;
  }[];
  notes: {
    text: string;
    font?: string;
    position: { top: string; left: string };
    color?: string;
  }[];
  decorations?: {
    type: 'flower' | 'stamp' | 'ribbon' | 'paper-scrap' | 'heart-doodle';
    position: { top: string; left: string };
    rotation?: number;
  }[];
}

export interface BirthdayConfig {
  name: string;
  oldAge: number;
  newAge: number;
  dateLabel: string;
  subtitle: string;
  footerText: string;
  musicUrl?: string;
  musicTitle?: string;
  accentColor: string;
}
