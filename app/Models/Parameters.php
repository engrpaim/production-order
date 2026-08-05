<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Parameters extends Model
{
        use HasFactory;
        protected $table = 'parameters';

        protected $fillable = [
            'parameter',
            'type'
        ];
}
