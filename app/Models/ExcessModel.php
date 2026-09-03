<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExcessModel extends Model
{
    protected $table = 'excess_database' ;
    
    protected $fillable = [
        'model',
        'lot_number',
        'generated_lot_number',
        'excess',
        'merge_to',
        'start_date',
        'merge_date',
        'retention',
        'shelf',
        'ip_address',
        'status',
    ];
}
