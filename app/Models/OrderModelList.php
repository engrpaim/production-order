<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderModelList extends Model
{
    use HasFactory;

    protected $table = 'Order_Models';

    protected $fillable = [
        'Model',
        'Media_Size',
        'Pre_Treatment',
        'Post_Treatment',
        'Condition_Number',
        'Allowed_Lines',
        'Ip_Address',
        'Quantity',
        'Author', 
        'Model_Code',
        "Magnet_Type",
        "Basket_Type",
        "Nickel_1_2_A",
        "Drying_Method",
        "Qa_Chiptype",
        "Plating_Specs"
    ];

    protected $casts = [ 
        'Allowed_Lines' => 'json',
    ];

}
