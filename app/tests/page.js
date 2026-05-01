import ExamHub from '@/components/Tests/ExamHub';

export const metadata = {
  title: 'Mock Tests — IELTS, TOEFL, SAT, Cambridge',
  description:
    'IELTS, TOEFL, SAT, Cambridge va CEFR uchun AI-powered mock testlar. Haqiqiy imtihon formatida mashq qiling va darhol band score oling.',
  alternates: { canonical: 'https://exampulse.uz/tests' },
};

export default function TestsPage() { return <ExamHub />; }
