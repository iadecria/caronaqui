<?php

namespace Database\Seeders;

use App\Models\Ride;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('senha12345');

        $carlos = User::create([
            'name' => 'Carlos Silva',
            'email' => 'carlos@caronaqui.com',
            'password' => $password,
            'phone' => '(21) 99999-0001',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
            'verified_phone' => true,
            'verified_id' => true,
            'gender' => 'male',
            'rating' => 4.9,
            'total_rides' => 234,
        ]);

        $ana = User::create([
            'name' => 'Ana Oliveira',
            'email' => 'ana@caronaqui.com',
            'password' => $password,
            'phone' => '(11) 99999-0002',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
            'verified_phone' => true,
            'verified_id' => true,
            'gender' => 'female',
            'rating' => 4.8,
            'total_rides' => 156,
        ]);

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@caronaqui.com',
            'password' => $password,
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
            'verified_phone' => true,
            'verified_id' => true,
            'role' => 'admin',
            'rating' => 5.0,
            'total_rides' => 0,
        ]);

        $rides = [
            [
                'driver_id' => $carlos->id,
                'origin_city' => 'Rio de Janeiro',
                'origin_state' => 'RJ',
                'origin_neighborhood' => 'Centro',
                'origin_meeting_point' => 'Estacao Central do Brasil',
                'origin_lat' => -22.9068,
                'origin_lng' => -43.1729,
                'destination_city' => 'Sao Paulo',
                'destination_state' => 'SP',
                'destination_neighborhood' => 'Jardins',
                'destination_dropoff_point' => 'Rua Oscar Freire',
                'destination_lat' => -23.5505,
                'destination_lng' => -46.6333,
                'date' => now()->addDays(2)->toDateString(),
                'time' => '06:00',
                'price' => 85,
                'available_seats' => 3,
                'total_seats' => 4,
                'car_model' => 'Honda Civic',
                'car_color' => 'Prata',
                'allows_pets' => false,
                'allows_smoking' => false,
                'allows_luggage' => true,
            ],
            [
                'driver_id' => $ana->id,
                'origin_city' => 'Sao Paulo',
                'origin_state' => 'SP',
                'origin_neighborhood' => 'Santana',
                'origin_meeting_point' => 'Shopping Santana Parque',
                'origin_lat' => -23.5505,
                'origin_lng' => -46.6333,
                'destination_city' => 'Rio de Janeiro',
                'destination_state' => 'RJ',
                'destination_neighborhood' => 'Flamengo',
                'destination_dropoff_point' => 'Aterro do Flamengo',
                'destination_lat' => -22.9068,
                'destination_lng' => -43.1729,
                'date' => now()->addDays(3)->toDateString(),
                'time' => '09:00',
                'price' => 88,
                'available_seats' => 3,
                'total_seats' => 4,
                'car_model' => 'Toyota Corolla',
                'car_color' => 'Branco',
                'allows_pets' => true,
                'allows_smoking' => false,
                'allows_luggage' => true,
            ],
            [
                'driver_id' => $carlos->id,
                'origin_city' => 'Rio de Janeiro',
                'origin_state' => 'RJ',
                'origin_neighborhood' => 'Barra da Tijuca',
                'origin_meeting_point' => 'Shopping Barra',
                'origin_lat' => -23.0,
                'origin_lng' => -43.36,
                'destination_city' => 'Sao Paulo',
                'destination_state' => 'SP',
                'destination_neighborhood' => 'Pinheiros',
                'destination_dropoff_point' => 'Estacao Fradique Coutinho',
                'destination_lat' => -23.55,
                'destination_lng' => -46.69,
                'date' => now()->addDays(4)->toDateString(),
                'time' => '07:30',
                'price' => 95,
                'available_seats' => 2,
                'total_seats' => 3,
                'car_model' => 'Jeep Renegade',
                'car_color' => 'Cinza',
                'allows_pets' => false,
                'allows_smoking' => false,
                'allows_luggage' => true,
            ],
            [
                'driver_id' => $ana->id,
                'origin_city' => 'Volta Redonda',
                'origin_state' => 'RJ',
                'origin_neighborhood' => 'Centro',
                'origin_meeting_point' => 'Rodoviaria de Volta Redonda',
                'origin_lat' => -22.52,
                'origin_lng' => -44.10,
                'destination_city' => 'Sao Paulo',
                'destination_state' => 'SP',
                'destination_neighborhood' => 'Liberdade',
                'destination_dropoff_point' => 'Metro Liberdade',
                'destination_lat' => -23.55,
                'destination_lng' => -46.63,
                'date' => now()->addDay()->toDateString(),
                'time' => '06:30',
                'price' => 70,
                'available_seats' => 4,
                'total_seats' => 4,
                'car_model' => 'Hyundai HB20',
                'car_color' => 'Vermelho',
                'allows_pets' => true,
                'allows_smoking' => false,
                'allows_luggage' => true,
            ],
            [
                'driver_id' => $carlos->id,
                'origin_city' => 'Sao Paulo',
                'origin_state' => 'SP',
                'origin_neighborhood' => 'Tatuape',
                'origin_meeting_point' => 'Shopping Tatuape',
                'origin_lat' => -23.54,
                'origin_lng' => -46.58,
                'destination_city' => 'Barra Mansa',
                'destination_state' => 'RJ',
                'destination_neighborhood' => 'Centro',
                'destination_dropoff_point' => 'Rodoviaria de Barra Mansa',
                'destination_lat' => -22.54,
                'destination_lng' => -44.17,
                'date' => now()->addDays(5)->toDateString(),
                'time' => '17:00',
                'price' => 65,
                'available_seats' => 3,
                'total_seats' => 4,
                'car_model' => 'Volkswagen T-Cross',
                'car_color' => 'Azul',
                'allows_pets' => false,
                'allows_smoking' => false,
                'allows_luggage' => true,
            ],
        ];

        foreach ($rides as $ride) {
            Ride::create($ride);
        }

        $this->command->info('Seed de dev criado: 3 usuarios + '.count($rides).' viagens (senha: senha12345).');
    }
}
