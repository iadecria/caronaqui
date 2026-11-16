'use client'

import { Star, Car, Clock, Shield, User, Trophy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { AchievementsTab } from './achievements-tab'
import Image from 'next/image'

// Mock data para historico e avaliacoes
const mockHistory = [
  { id: 'h1', from: 'Rio de Janeiro', to: 'Sao Paulo', date: '2026-04-10', role: 'passageiro' },
  { id: 'h2', from: 'Sao Paulo', to: 'Rio de Janeiro', date: '2026-04-05', role: 'motorista' },
  { id: 'h3', from: 'Rio de Janeiro', to: 'Sao Paulo', date: '2026-03-28', role: 'passageiro' },
]

const mockReviews = [
  { id: 'rev1', author: 'Ana Oliveira', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana', rating: 5, comment: 'Otimo motorista, muito pontual e educado!', date: '2026-04-10' },
  { id: 'rev2', author: 'Carlos Silva', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', rating: 5, comment: 'Viagem tranquila, recomendo!', date: '2026-04-05' },
  { id: 'rev3', author: 'Roberto Santos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto', rating: 4, comment: 'Boa viagem, carro confortavel.', date: '2026-03-28' },
]

const mockVehicles = [
  { id: 'v1', model: 'Honda Civic', color: 'Prata', plate: 'ABC-1234', year: 2022 },
]

export function ProfileTabs() {
  const { user } = useAuth()

  return (
    <Tabs defaultValue="sobre" className="w-full">
      <TabsList className="w-full grid grid-cols-2 md:grid-cols-6 h-auto">
        <TabsTrigger value="sobre" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Sobre</span>
        </TabsTrigger>
        <TabsTrigger value="conquistas" className="gap-2">
          <Trophy className="h-4 w-4" />
          <span className="hidden sm:inline">Conquistas</span>
        </TabsTrigger>
        <TabsTrigger value="historico" className="gap-2">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">Historico</span>
        </TabsTrigger>
        <TabsTrigger value="avaliacoes" className="gap-2">
          <Star className="h-4 w-4" />
          <span className="hidden sm:inline">Avaliacoes</span>
        </TabsTrigger>
        <TabsTrigger value="veiculos" className="gap-2">
          <Car className="h-4 w-4" />
          <span className="hidden sm:inline">Veiculos</span>
        </TabsTrigger>
        <TabsTrigger value="seguranca" className="gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Seguranca</span>
        </TabsTrigger>
      </TabsList>

      {/* Sobre */}
      <TabsContent value="sobre">
        <Card>
          <CardHeader>
            <CardTitle>Sobre mim</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Motorista experiente na Via Dutra. Viajo frequentemente entre Rio e Sao Paulo a trabalho. 
              Gosto de manter o carro limpo e o ar-condicionado ligado. Sem musica alta, apenas conversa boa!
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Viagens como motorista</p>
                <p className="text-2xl font-bold">{user?.totalRides || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Viagens como passageiro</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Conquistas */}
      <TabsContent value="conquistas" className="space-y-4 md:space-y-6">
        <AchievementsTab />
      </TabsContent>

      {/* Historico */}
      <TabsContent value="historico">
        <Card>
          <CardHeader>
            <CardTitle>Historico de Viagens</CardTitle>
            <CardDescription>Suas ultimas viagens realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockHistory.map((trip) => (
                <div key={trip.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{trip.from} → {trip.to}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(trip.date).toLocaleDateString('pt-BR')} - {trip.role === 'motorista' ? 'Como motorista' : 'Como passageiro'}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">Ver detalhes</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Avaliacoes */}
      <TabsContent value="avaliacoes">
        <Card>
          <CardHeader>
            <CardTitle>Avaliacoes Recebidas</CardTitle>
            <CardDescription>O que os outros usuarios dizem sobre voce</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="flex gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <Image src={review.avatar} alt={review.author} width={40} height={40} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{review.author}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(review.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Veiculos */}
      <TabsContent value="veiculos">
        <Card>
          <CardHeader>
            <CardTitle>Meus Veiculos</CardTitle>
            <CardDescription>Veiculos cadastrados para oferecer caronas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockVehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Car className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{vehicle.model}</p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.color} - {vehicle.year} - {vehicle.plate}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Editar</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                Adicionar veiculo
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Seguranca */}
      <TabsContent value="seguranca">
        <Card>
          <CardHeader>
            <CardTitle>Seguranca e Verificacoes</CardTitle>
            <CardDescription>Mantenha sua conta segura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Verificacao de identidade</p>
                  <p className="text-sm text-muted-foreground">Documento verificado</p>
                </div>
              </div>
              <span className="text-sm text-primary font-medium">Verificado</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Verificacao de telefone</p>
                  <p className="text-sm text-muted-foreground">(21) 99999-9999</p>
                </div>
              </div>
              <span className="text-sm text-primary font-medium">Verificado</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Autenticacao em duas etapas</p>
                  <p className="text-sm text-muted-foreground">Proteja sua conta com 2FA</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Ativar</Button>
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                Alterar senha
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
