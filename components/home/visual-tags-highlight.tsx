'use client'

import { Sparkles } from 'lucide-react'

export function VisualTagsHighlight() {
  return (
    <div className="px-4 pb-5 md:px-6">
      <div className="rounded-2xl bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/30 p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground mb-1">
              Tags Visuais: O Diferencial do CaronAqui
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Identifique características dos motoristas e caronas com ícones visuais claros e intuitivos. 
              Saiba rapidamente sobre pets, bagagem, ar-condicionado e muito mais antes de escolher sua carona.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
