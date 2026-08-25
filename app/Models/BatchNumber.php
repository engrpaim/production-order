<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BatchNumber extends Model
{
   protected $table = 'batch_number';
   
   protected $fillable = [
            'data_id',
            'model',
            'data_lot_number',
            'generated_batch_number',
            'quantity',
            'condition',
            'remarks',
            'status',
            'route'
   ];
}
