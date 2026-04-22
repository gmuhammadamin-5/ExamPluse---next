'use client'
import dynamic from 'next/dynamic'
const GlobalChat = dynamic(() => import('@/components/Collaboration/GlobalChat'), { ssr: false })
export default function GlobalChatPage() {
  return <GlobalChat />
}