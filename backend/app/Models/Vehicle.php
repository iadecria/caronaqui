<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vehicle extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'model',
        'color',
        'plate',
        'seats',
        'has_ac',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
            'seats' => 'integer',
            'has_ac' => 'boolean',
            'is_default' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
