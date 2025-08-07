<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductionOrderModel extends Model
{
    protected $table = 'production_order_list';

    protected $fillable = [
        'Work_Order',
        'Model_Name',
        'Route_Code',
        'Nickel_1',
        'Nickel_2',
        'Basket_Number',
        'Loader',
        'Loading_time',
        'Unloader',
        'Unloading_time',
        'Endorsed_To',
        'Container',
        'Machine_Details',
        'Model_Details',
        'Daily_Check',
        'PolyBag',
        'CurrentLocation',
        'Remarks',
        'Status',
    ];

    protected $casts = [
        'Machine_Details' => 'json',
        'Daily_Check' => 'json',
        'Model_Details' => 'json',
    ];

    public function scopeIsNotEmpty($query, $column)
    {
        return $query->whereNotNull($column)->where($column, '!=', '');
    }

    public function scopeWithStatus($query, $status)
    {
        return $query->where('Status', $status);
    }

    public function scopeWithWorkOrder($query, $workOrder)
    {
        return $query->where('Work_Order', $workOrder);
    }

    public function scopeWithModelName($query, $modelName)
    {
        return $query->where('Model_Name', $modelName);
    }
}
