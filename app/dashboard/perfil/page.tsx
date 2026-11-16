'use client'

import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileTabs } from '@/components/profile/profile-tabs'

export default function PerfilPage() {
  return (
    <div className="space-y-4 md:space-y-6 px-4 py-4 md:px-6 md:py-6">
      <ProfileHeader />
      <ProfileTabs />
    </div>
  )
}
