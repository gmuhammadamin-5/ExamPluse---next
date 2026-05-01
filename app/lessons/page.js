import dynamic from 'next/dynamic';

const Lessons = dynamic(() => import('@/components/Vd Lessons/Lessons'), { ssr: false });

export const metadata = {
  title: 'Video Lessons — IELTS, TOEFL, SAT',
  description:
    'Expert o\'qituvchilardan IELTS, TOEFL va SAT bo\'yicha video darslar. Listening, Reading, Writing va Speaking bo\'limlari uchun to\'liq kurs.',
  alternates: { canonical: 'https://exampulse.uz/lessons' },
};

export default function LessonsPage() { return <Lessons />; }
