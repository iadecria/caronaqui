<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ride extends Model
{
    use HasUuids;

    protected $fillable = [
        'driver_id',
        'origin_city',
        'origin_state',
        'origin_neighborhood',
        'origin_meeting_point',
        'origin_lat',
        'origin_lng',
        'destination_city',
        'destination_state',
        'destination_neighborhood',
        'destination_dropoff_point',
        'destination_lat',
        'destination_lng',
        'date',
        'time',
        'price',
        'available_seats',
        'total_seats',
        'car_model',
        'car_color',
        'allows_pets',
        'allows_smoking',
        'allows_luggage',
        'has_ac',
        'ladies_only',
        'is_regular',
        'weekdays',
        'description',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'price' => 'decimal:2',
            'available_seats' => 'integer',
            'total_seats' => 'integer',
            'allows_pets' => 'boolean',
            'allows_smoking' => 'boolean',
            'allows_luggage' => 'boolean',
            'has_ac' => 'boolean',
            'ladies_only' => 'boolean',
            'is_regular' => 'boolean',
            'weekdays' => 'array',
        ];
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
