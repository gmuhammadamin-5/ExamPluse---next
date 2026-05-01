import LessonsClient from '@/components/Vd Lessons/LessonsClient';

export const metadata = {
  title: 'Video Lessons — IELTS, TOEFL, SAT',
  description:
    'Expert o\'qituvchilardan IELTS, TOEFL va SAT bo\'yicha video darslar. Listening, Reading, Writing va Speaking bo\'limlari uchun to\'liq kurs.',
  alternates: { canonical: 'https://exampulse.uz/lessons' },
};

export default function LessonsPage() { return <LessonsClient />; }
