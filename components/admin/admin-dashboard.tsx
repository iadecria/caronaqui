'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, Zap, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const chartData = [
  { day: 'Seg', caronas: 12 },
  { day: 'Ter', caronas: 19 },
  { day: 'Qua', caronas: 15 },
  { day: 'Qui', caronas: 25 },
  { day: 'Sex', caronas: 22 },
  { day: 'Sab', caronas: 30 },
  { day: 'Dom', caronas: 28 },
]

const recentTrips = [
  { id: 1, route: 'SJC → Taubaté', driver: 'João Silva', seats: 3, status: 'Ativa' },
  { id: 2, route: 'São Paulo → Campinas', driver: 'Maria Santos', seats: 4, status: 'Ativa' },
  { id: 3, route: 'Sorocaba → Jundiaí', driver: 'Pedro Costa', seats: 2, status: 'Completa' },
  { id: 4, route: 'Ribeirão Preto → Araraquara', driver: 'Ana Oliveira', seats: 1, status: 'Ativa' },
]

const kpiCards = [
  { label: 'Usuários Ativos', value: '1.250', icon: Users, color: 'text-blue-500' },
  { label: 'Viagens Hoje', value: '84', icon: TrendingUp, color: 'text-green-500' },
  { label: 'CO2 Economizado', value: '450kg', icon: Zap, color: 'text-yellow-500' },
  { label: 'Denúncias Pendentes', value: '2', icon: AlertCircle, color: 'text-red-500' },
]

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{card.label}</CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Chart and Recent Trips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2 bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Crescimento de Caronas na Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                  cursor={{ fill: '#e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="caronas" fill="#50C878" name="Caronas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 text-sm">Resumo Rápido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-gray-900">42%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Usuários Novos</p>
              <p className="text-2xl font-bold text-gray-900">128</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Receita Hoje</p>
              <p className="text-2xl font-bold text-green-600">R$ 2.450</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trips Table */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Últimas Viagens Criadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Rota</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Motorista</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Vagas</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.map((trip) => (
                  <tr key={trip.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-900">{trip.route}</td>
                    <td className="px-4 py-3 text-gray-700">{trip.driver}</td>
                    <td className="px-4 py-3 text-gray-700">{trip.seats}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        trip.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
