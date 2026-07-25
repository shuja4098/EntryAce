export interface Testimonial {
  id: string;
  name: string;
  role: string;
  university: string;
  score: string;
  avatar: string;
  quote: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Muhammad Saad',
    role: 'Admitted into Computer Systems',
    university: 'NED University (Batch 2025)',
    score: '88/100 Entry Test Score',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    quote: 'EntryAce AI was the single best resource for my NED preparation. The instant step-by-step Gemini explanations for Math integration shortcuts saved me hours during final revision.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Ayesha Fatima',
    role: 'FAST CS Merit Rank #18',
    university: 'FAST-NUCES Karachi',
    score: '79.5% Aggregate Score',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    quote: 'FAST Advanced Math requires intense speed and accuracy because of negative marking. Practicing on EntryAce AI\'s simulator with timer feedback helped me manage time without losing marks to wrong guesses!',
    rating: 5,
  },
  {
    id: '3',
    name: 'Hamza Khan',
    role: 'NET-1 High Scorer (162/200)',
    university: 'NUST SEECS Aspirant',
    score: '162/200 NET Score',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    quote: 'Whenever I got stuck on a tricky Physics question, the Gemini AI Tutor broke down the conceptual formula in plain English. The topic-wise weakness radar kept my prep razor sharp.',
    rating: 5,
  },
];
