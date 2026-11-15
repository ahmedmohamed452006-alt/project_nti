<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    protected $fillable = [
        'customer_id',
        'specialty_id',
        'target_engineer_id',
        'title',
        'unit_type',
        'governorate',
        'city',
        'area_sqm',
        'budget_range',
        'description',
        'customer_name',
        'customer_phone',
        'customer_email',
        'status',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function specialty()
    {
        return $this->belongsTo(Specialty::class, 'specialty_id');
    }

    public function targetEngineer()
    {
        return $this->belongsTo(EngineerProfile::class, 'target_engineer_id');
    }

    public function offers()
    {
        return $this->hasMany(RequestOffer::class, 'request_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'request_id');
    }
}
