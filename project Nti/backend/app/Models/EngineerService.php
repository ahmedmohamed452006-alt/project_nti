<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EngineerService extends Model
{
    protected $fillable = [
        'engineer_profile_id',
        'title',
        'description',
        'price',
        'pricing_type',
    ];

    protected $casts = [
        'price' => 'float',
    ];

    public function engineer()
    {
        return $this->belongsTo(EngineerProfile::class, 'engineer_profile_id');
    }
}
