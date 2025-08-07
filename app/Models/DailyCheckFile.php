<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyCheckFile extends Model
{
    protected $connection = 'inventory_connection';
    protected $table = 'daily_check';

}
