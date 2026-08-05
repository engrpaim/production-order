<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderModelList extends Model
{
    use HasFactory;

    protected $table = 'order_models';

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
    ];

    protected $casts = [ 
        'Allowed_Lines' => 'json',
    ];

}
