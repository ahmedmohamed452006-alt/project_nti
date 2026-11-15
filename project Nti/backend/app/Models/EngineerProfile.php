<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EngineerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'specialty_id',
        'years_experience',
        'university',
        'syndicate_number',
        'qualification_doc_url',
        'linkedin_url',
        'bio',
        'is_verified',
        'is_featured',
        'avg_rating',
        'review_count',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_featured' => 'boolean',
        'avg_rating' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function specialty()
    {
        return $this->belongsTo(Specialty::class, 'specialty_id');
    }

    public function services()
    {
        return $this->hasMany(EngineerService::class, 'engineer_profile_id');
    }

    public function projects()
    {
        return $this->hasMany(EngineerProject::class, 'engineer_profile_id');
    }

    public function offers()
    {
        return $this->hasMany(RequestOffer::class, 'engineer_profile_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'engineer_profile_id');
    }
}
