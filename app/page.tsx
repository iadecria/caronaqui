'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { PublicShell } from '@/components/public/public-shell'
import { HeroSection } from '@/components/public/hero-section'
import { HowItWorks } from '@/components/public/how-it-works'
import { PublicRidesSection } from '@/components/public/public-rides-section'
import { SecuritySection } from '@/components/public/security-section'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard/buscar')
    }
  }, [isAuthenticated, router])

  return (
    <PublicShell>
      <HeroSection />
      <PublicRidesSection />
      <HowItWorks />
      <SecuritySection />
    </PublicShell>
  )
}
