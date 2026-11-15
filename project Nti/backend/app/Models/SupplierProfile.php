<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupplierProfile extends Model
{
    protected $fillable = [
        'user_id',
        'business_name',
        'category',
        'supplier_group',
        'icon',
        'delivery_info',
        'address',
        'summary',
        'tags',
        'commercial_reg_doc',
        'is_verified',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_verified' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
