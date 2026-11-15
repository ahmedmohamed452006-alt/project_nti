<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Specialty extends Model
{
    protected $fillable = [
        'slug',
        'name_ar',
        'name_en',
        'icon',
        'sort_order',
    ];

    public function engineers()
    {
        return $this->hasMany(EngineerProfile::class, 'specialty_id');
    }

    public function serviceRequests()
    {
        return $this->hasMany(ServiceRequest::class, 'specialty_id');
    }
}
