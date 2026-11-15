<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestOffer extends Model
{
    protected $fillable = [
        'request_id',
        'engineer_profile_id',
        'offered_price',
        'duration_text',
        'proposal_note',
        'status',
    ];

    protected $casts = [
        'offered_price' => 'float',
    ];

    public function serviceRequest()
    {
        return $this->belongsTo(ServiceRequest::class, 'request_id');
    }

    public function engineer()
    {
        return $this->belongsTo(EngineerProfile::class, 'engineer_profile_id');
    }
}
