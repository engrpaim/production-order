<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\DailyCheckFile;
use App\Models\OrderModelList;
use App\Models\RoutingCheck;
use App\Models\MachineAllocation;
use App\Models\ProductionOrderModel;
use Illuminate\Routing\Events\Routing;
use Carbon\Carbon;
class ProcessOrderController extends Controller
{
    public function getDailyCheck(Request $request)
    {
        //Get Request Serial
        $serial  = $request->query('serial');

        //Get Machine Permission
        $clientIP = $request->ip();
        $machineAllocation = MachineAllocation::where('ip_address', $clientIP)->first();

        if( $serial != '' ||  $serial != null){

            // @return if Serial exist in DailyCheckFile table exit if not return error
            $record = DailyCheckFile::where('ID', $serial)->first();

            if(!$record){
                return Inertia::render('Main', [
                'appName' => config('app.name'),
                'location' => $machineAllocation ? $machineAllocation->toArray() : null,
                ]);
                exit;
            }

            // @return Routing details
            $routing = RoutingCheck::where('RoutingCode', $record->RoutingCode)->get();

            // @return Model details
            $modelDetails = OrderModelList::where('Model',$record->Model_Name)->first();

            // @return Production Order
            $productionFind = ProductionOrderModel::where('Work_Order',$serial)->first();

            return Inertia::render('Main', [
                'appName' => config('app.name'),
                'serial' => $serial,
                'data' =>  $record ? $record->toArray() : null,
                'model' => $modelDetails ? $modelDetails->toArray(): null,
                'routing' => $routing ? $routing->toArray(): null,
                'location' => $machineAllocation ? $machineAllocation->toArray() : null,
                'order' => $productionFind ? $productionFind->toArray(): null,
            ]);

        }else{

              //Default data if no serial is provided
              return Inertia::render('Main', [
                'appName' => config('app.name'),
                'location' => $machineAllocation ? $machineAllocation->toArray() : null,
              ]);

        }

    }

     public function saveLoading(Request $request)
    {
        /**
         * Handle scanned in Process.jsx.
         *
         * @param array $scanned_data     Data from Process.jsx scan
         * @param array $location         Machine location info (from MachineAllocation)
         * @param array $model_order      Model and order details
         * @param array $daily_check_file Daily check file details (from DailyCheckFile)
         * @param string $workOrder       Work order number
         * @param string $IdName          Identifier name
         * @param string $IdCode          Identifier code
         *
         * @return mixed
         */
        function filterInput($array){
             foreach($array as $key => $value){
                    if($key == 'id' || $key == 'created_at' || $key == 'updated_at'){
                        unset($array[$key]);
                    }
                }
            return $array;
        }

        if($request){
            $clientIP = $request->ip();
            $machineAllocation = MachineAllocation::where('ip_address', $clientIP)->first();
            $now = Carbon::now();

            $request->input('scanned_data') ? $scanned_data = $request->input('scanned_data') : $scanned_data = null;
            $request->input('workOrder') ? $workOrder = $request->input('workOrder') : $workOrder = null;
            $request->input('location') ? $location =  $request->input('location'): $location = null;
            $request->input('daily_check_file') ? $daily_check = $request->input('daily_check_file') : $daily_check = null;
            $request->input('IdName') ? $loader = $request->input('IdName') : $loader = null;
            $request->input('model_order') ? $model_order = $request->input('model_order'):$model_order = null;

            if($scanned_data  != null &&  $workOrder != null && $location != null && $daily_check != null && $workOrder != '' && $workOrder != null){
                /*Check if work order exist*/
                try{
                    $checkIfExist = ProductionOrderModel::where('Work_Order',$workOrder)->first();
                }catch(\Exception $e){
                    dd('Already Exist!' . $e->getMessage());
                }


                if($checkIfExist){
                     return Inertia::render('Main', [
                        'appName' => config('app.name'),
                        'location' => $machineAllocation ? $machineAllocation->toArray() : null,
                        ]);
                }

                $permissionOperation = [];
                $machineDetailsLoading = [];
                $modelDetailsLoading = [];
                $dailyCheckLoading = [];
                //
                $modelDetailsLoading = filterInput($model_order);
                $machineDetailsLoading =  filterInput($location);
                $dailyCheckLoading = filterInput($daily_check);
                // dump($modelDetailsLoading ,    $machineDetailsLoading ,  $dailyCheckLoading);

                if($location["permission"] === 'loading')
                {
                    $location["permission"] ? $currentLocation = "loaded" : $currentLocation = null;
                    $permissionOperation =
                    [
                        'Status' => $currentLocation,
                    ];
                }

                // dd($request->all());

                ProductionOrderModel::create(
                    array_merge(
                        [
                            'Work_Order' =>trim($workOrder),
                            'Model_Name'=> trim($daily_check["Model_Name"]),
                            'Route_Code'=> trim($daily_check["RoutingCode"]),
                            'Nickel_1' => trim($scanned_data["Nickel 1"]),
                            'Nickel_2' => trim($scanned_data["Nickel 2"]),
                            'Basket_Number' => trim($scanned_data["Basket Number"]),
                            'Loader' => trim($loader),
                            'Loading_time'=> trim($now),
                            'Machine_Details' =>  $machineDetailsLoading,
                            'Model_Details' =>  $modelDetailsLoading,
                            'Daily_Check' =>   $dailyCheckLoading,
                            'CurrentLocation' => trim($location["location"]),

                        ],$permissionOperation
                    ));
            }

        }
    }
}
