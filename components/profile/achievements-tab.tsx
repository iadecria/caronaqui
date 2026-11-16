'use client'

import { Anchor } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { AchievementsGrid, MOCK_ACHIEVEMENTS } from '@/components/achievements/achievements-grid'

export function AchievementsTab() {
  const [savingsAmount] = useState(34500) // em centavos = R$ 345,00

  return (
    <div className="space-y-6">
      {/* Header do Perfil com Conquista */}
      <div className="bg-card rounded-3xl p-6 border border-border">
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/30 flex items-center justify-center">
              <span className="text-3xl">😄</span>
            </div>
            {/* Selo Dourado */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-1.5 shadow-lg ring-2 ring-yellow-300">
              <Anchor className="h-5 w-5 text-yellow-900" strokeWidth={2} />
            </div>
          </div>

          {/* Info Usuário */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-foreground">Lucas</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-semibold text-primary">Ponta Firme Supremo ⚓</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">(0 cancelamentos)</p>
          </div>
        </div>
      </div>

      {/* Card Grande: Dinheiro Salvo */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-6 text-white shadow-xl overflow-hidden relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.3),transparent_50%)]" />
        </div>

        <div className="relative z-10">
          {/* Titulo */}
          <p className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-2">
            Dinheiro Salvo no Rolê
          </p>

          {/* Valor Grande */}
          <div className="mb-4">
            <p className="text-5xl font-black tracking-tight">
              R$ {(savingsAmount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Texto Engraçado */}
          <p className="text-sm font-medium opacity-95 mb-6 leading-relaxed">
            Já dá pra comprar umas chapas de MDF pra um projeto novo! 🪚
          </p>

          {/* Barra de Progresso */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Falta pouco para o nível:</span>
            </div>
            <Progress value={75} className="h-2 bg-white/20" />
            <p className="text-xs font-semibold text-white/90">
              O modo CEO tá ativado 💼
            </p>
          </div>
        </div>
      </div>

      {/* Minhas Regras no Carro */}
      <div>
        <h3 className="text-base font-bold text-foreground mb-4">Minhas Regras no Carro</h3>
        <div className="flex flex-wrap gap-2.5">
          {[
            { emoji: '🐧', text: 'Ar Nível Pinguim', bg: 'bg-sky-100', text_color: 'text-sky-900' },
            { emoji: '🤠', text: 'Sertanejo de Corno', bg: 'bg-orange-100', text_color: 'text-orange-900' },
            { emoji: '🚫', text: 'Proibido Farelos', bg: 'bg-red-100', text_color: 'text-red-900' },
            { emoji: '📈', text: 'Trade na Dutra', bg: 'bg-green-100', text_color: 'text-green-900' },
          ].map((rule, idx) => (
            <div
              key={idx}
              className={`${rule.bg} ${rule.text_color} rounded-full px-4 py-2 inline-flex items-center gap-2 font-semibold text-sm border-2 border-current/20`}
            >
              <span>{rule.emoji}</span>
              <span>{rule.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conquistas em linha compacta */}
      <AchievementsGrid
        achievements={MOCK_ACHIEVEMENTS}
        variant="compact"
        maxDisplay={6}
      />

      {/* Card de Aviso: Lata de Sardinha */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-5 border-2 border-amber-200 overflow-hidden">
        {/* Icone de Peixe */}
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">🐟</div>
          <div>
            <h4 className="font-bold text-amber-950 text-lg mb-1">Aviso de Lata de Sardinha!</h4>
            <p className="text-sm text-amber-900 leading-relaxed">
              O motorista tem um carro compacto e abriu 4 vagas. Prepare-se para respirar o mesmo ar que a galera no banco de trás.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State: Sem Caronas Hoje */}
      <div className="bg-card rounded-3xl p-8 border border-border/60 text-center">
        <div className="mb-4 text-5xl opacity-50">🛣️</div>
        <h4 className="font-bold text-foreground text-lg mb-2">Mais vazio que a Dutra no domingo de manhã</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Que tal ser o herói e oferecer uma carona?
        </p>
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors">
          Oferecer Carona
        </button>
      </div>
    </div>
  )
}
