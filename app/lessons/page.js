'use client'
import dynamic from 'next/dynamic'
const Lessons = dynamic(() => import('@/components/Vd Lessons/Lessons'), { ssr: false })
export default function LessonsPage() {
  return <Lessons />
}