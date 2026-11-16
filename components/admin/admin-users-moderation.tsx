'use client'

import React, { useState } from 'react'
import { Check, X, ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const users = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
    status: 'Aguardando Validação',
    document: '📷',
    trustLevel: 'Novato',
    cancellations: 0,
    joinDate: '2024-04-15',
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    status: 'Aguardando Validação',
    document: '📷',
    trustLevel: 'Novato',
    cancellations: 1,
    joinDate: '2024-04-20',
  },
  {
    id: 3,
    name: 'Pedro Costa',
    email: 'pedro.costa@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
    status: 'Aprovado',
    document: '📷',
    trustLevel: 'Confiável',
    cancellations: 0,
    joinDate: '2024-03-10',
  },
]

export function AdminUsersModeration() {
  const [selectedUser, setSelectedUser] = useState(users[0])

  const pendingUsers = users.filter(u => u.status === 'Aguardando Validação')

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending" className="text-yellow-600">Pendentes</TabsTrigger>
          <TabsTrigger value="suspended">Suspensos</TabsTrigger>
        </TabsList>

        {/* Pendentes Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Usuários Pendentes de Aprovação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Usuário</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Documento</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedUser(user)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-2xl cursor-pointer hover:scale-125 transition-transform">
                          {user.document}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                alert(`Usuário ${user.name} aprovado!`)
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                alert(`Usuário ${user.name} rejeitado!`)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Todos Tab */}
        <TabsContent value="all" className="space-y-4">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Todos os Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suspensos Tab */}
        <TabsContent value="suspended">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Usuários Suspensos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center py-8">Nenhum usuário suspenso no momento.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Panel */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes do Usuário</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex justify-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback>{selectedUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">NOME</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">EMAIL</p>
                  <p className="text-sm text-gray-700">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">NÍVEL DE CONFIANÇA</p>
                  <p className="text-sm font-semibold text-teal-600">{selectedUser.trustLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">CANCELAMENTOS</p>
                  <p className="text-sm text-gray-700">{selectedUser.cancellations}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">DATA DE INGRESSO</p>
                  <p className="text-sm text-gray-700">{new Date(selectedUser.joinDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                {selectedUser.status === 'Aguardando Validação' && (
                  <>
                    <Button className="flex-1 bg-green-500 hover:bg-green-600">
                      <Check className="h-4 w-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button className="flex-1" variant="destructive">
                      <X className="h-4 w-4 mr-2" />
                      Rejeitar
                    </Button>
                  </>
                )}
                {selectedUser.status === 'Aprovado' && (
                  <Button className="w-full" variant="destructive">
                    🔒 Suspender Conta
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
