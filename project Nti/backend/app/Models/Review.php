<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'engineer_profile_id',
        'customer_id',
        'request_id',
        'author_name',
        'rating',
        'comment',
    ];

    public function engineer()
    {
        return $this->belongsTo(EngineerProfile::class, 'engineer_profile_id');
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
}
