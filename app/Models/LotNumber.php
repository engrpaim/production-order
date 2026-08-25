<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LotNumber extends Model
{
   protected $table = 'lot_number';

   protected $fillable = [
            'model',
            'lot_number',
            'lot_quantity',
            'total_batches',
            'quantity_per_batch',
            'condition',
            'excess',
            'remarks',
            'status',
            'ip_address',
            'route'
   ];
}
