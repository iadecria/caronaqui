'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Camera, Star, Shield, Phone, Check, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { EditProfileModal } from './edit-profile-modal'

export function ProfileHeader() {
  const { user } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)

  if (!user) return null

  return (
    <>
      <div className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden bg-muted">
              <Image
                src={user.avatar}
                alt={user.name}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 p-1 md:p-1.5 bg-primary text-primary-foreground rounded-full shadow-md active:bg-primary/90 transition-colors touch-target flex items-center justify-center">
              <Camera className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">{user.name}</h1>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-8 touch-target"
                onClick={() => setShowEditModal(true)}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Editar
              </Button>
            </div>
            
            <p className="text-sm md:text-base text-muted-foreground mt-1 truncate">{user.email}</p>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 md:gap-3 mt-3 md:mt-4">
              {/* Rating */}
              <div className="flex items-center gap-1 text-xs md:text-sm">
                <Star className="h-3.5 w-3.5 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{(user.rating ?? 0).toFixed(1)}</span>
                <span className="text-muted-foreground">({user.totalRides ?? 0})</span>
              </div>
              
              {/* Verified badges */}
              {user.verifiedPhone && (
                <div className="flex items-center gap-0.5 text-xs md:text-sm text-primary">
                  <Phone className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <Check className="h-2.5 w-2.5 md:h-3 md:w-3" />
                  <span className="sr-only">Telefone verificado</span>
                </div>
              )}
              {user.verifiedId && (
                <div className="flex items-center gap-0.5 text-xs md:text-sm text-primary">
                  <Shield className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <Check className="h-2.5 w-2.5 md:h-3 md:w-3" />
                  <span className="sr-only">Identidade verificada</span>
                </div>
              )}
            </div>

            <p className="text-xs md:text-sm text-muted-foreground mt-2 md:mt-3">
              Membro desde {new Date(user.memberSince).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <EditProfileModal open={showEditModal} onOpenChange={setShowEditModal} />
    </>
  )
}
