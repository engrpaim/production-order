<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MachineAllocation extends Model
{
    protected $table = 'machine_allocation';
    protected $fillable = [
        'user',
        'id_number',
        'ip_address',
        'permission',
        'location',
        'line',
    ];

}
