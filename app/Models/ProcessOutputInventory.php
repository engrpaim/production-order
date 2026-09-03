<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProcessOutputInventory extends Model
{
    protected $connection = 'inventory_connection';
    protected $table = 'process_output';
    public $timestamps = false;
    protected $fillable = [
        'Date',
        'Shift_Date',
        'Shift',
        'Hour',
        'Area',
        'Process',
        'Work_Order',
        'Model_Name',
        'Lot_No',
        'Quantity',
        'Unit_Weight',
        'Total_Weight',
        'Encoder',
        'IP_Address',
        'Split_Type',
        'Split_Remarks',
        'Location',
        'Remarks',
    ];
}
