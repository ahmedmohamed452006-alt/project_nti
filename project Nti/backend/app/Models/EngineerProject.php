<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EngineerProject extends Model
{
    protected $fillable = [
        'engineer_profile_id',
        'title',
        'category',
        'description',
        'area_sqm',
        'location',
        'image_url',
        'completed_year',
    ];

    public function engineer()
    {
        return $this->belongsTo(EngineerProfile::class, 'engineer_profile_id');
    }
}
