<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyCheckFile extends Model
{
    protected $connection = 'inventory_connection';
    protected $table = 'daily_check';
    protected $fillable = [
            'ID',
            'Model_Name',
            'Lot_No',
            'Quantity',
            'Split_Type',
            'Split_Remarks',
            'Split_Shift_Date',
   ];
}
