<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatalistModel extends Model
{
    protected $connection = 'inventory_connection';
    protected $table = 'datalist';

    protected $fillable = [
        'ID' ,
                    'FIFO_No' ,
                    'Model_Name' ,
                    'Lot_No' ,
                    'Initial_Quantity' ,
                    'Received_Quantity' ,
                    'Running_Quantity_BCS' ,
                    'Running_Quantity' ,
                    'Running_Quantity_2' ,
                    'Remarks' ,
                    'Area' ,
                    'Category' ,
                    'Date_Received' ,
                    'Shift_Date' ,
                    'Received_By' ,
                    'Coating_Date' ,
                    'Process' ,
                    'Process_History' ,
                    'Process_History2' ,
                    'Location' ,
                    'Location_History' ,
                    'Daily_Check_File' ,
                    'Sprayer' ,
                    'PIC' ,
                    'RoutingCode' ,
                    'Split_Type' ,
                    'Split_Remarks' ,
                    'Split_Shift_Date' ,
                    'Model_Code' ,
    ];
}
