<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use HasUuids;

    protected $fillable = [
        'ride_id',
        'passenger_id',
        'seats_booked',
        'status',
        'pickup_city',
        'pickup_neighborhood',
        'pickup_lat',
        'pickup_lng',
        'dropoff_city',
        'dropoff_neighborhood',
        'dropoff_lat',
        'dropoff_lng',
    ];

    protected function casts(): array
    {
        return [
            'seats_booked' => 'integer',
        ];
    }

    public function ride(): BelongsTo
    {
        return $this->belongsTo(Ride::class);
    }

    public function passenger(): BelongsTo
    {
        return $this->belongsTo(User::class, 'passenger_id');
    }
}
