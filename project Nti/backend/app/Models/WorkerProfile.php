<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'trade',
        'trade_group',
        'icon',
        'years_experience',
        'summary',
        'tags',
        'avg_rating',
        'is_available',
    ];

    protected $casts = [
        'tags' => 'array',
        'avg_rating' => 'float',
        'is_available' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
