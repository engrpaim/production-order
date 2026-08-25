<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeightInventory extends Model
{
    protected $connection = 'inventory_connection';
    protected $table = 'weight';
}
