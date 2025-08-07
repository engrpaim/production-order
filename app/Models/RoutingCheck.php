<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoutingCheck extends Model
{
    protected $connection = 'inventory_connection';
    protected $table = 'routing';
}
