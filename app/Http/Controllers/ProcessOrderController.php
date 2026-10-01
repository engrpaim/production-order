<?php

namespace App\Http\Controllers;

use App\Models\BatchNumber;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\DailyCheckFile;
use App\Models\DatalistModel;
use App\Models\ExcessModel;
use App\Models\OrderModelList;
use App\Models\Parameters;
use App\Models\RoutingCheck;
use App\Models\MachineAllocation;
use App\Models\ProcessOutputInventory;
use App\Models\ProductionOrderModel;
use App\Models\WeightInventory;
use Illuminate\Routing\Events\Routing;
use Carbon\Carbon;
use Illuminate\Bus\Batch;
use Nette\Schema\Message;
use Ramsey\Uuid\Type\Integer;
use Exception;

class ProcessOrderController extends Controller
{
     public function dataBaseBank(string $database)
     {
            $bank = [
                'model' =>  OrderModelList::class,
                'parameter' =>  Parameters::class,
                'machine' => MachineAllocation::class,
                'excess' => ExcessModel::class
            ];

            return $bank[$database];
    }

    public function locationPermission()
     {
            $ip = request()->ip();

            try{
                    $location = MachineAllocation::where('ip_address' , $ip)->first();
                     if($location) $location = $location->toArray();
            } catch(\Exception $e){
                    $location = null;
            }
            return  $location;
    }

    protected function refresh(string $message, string $theme ,string $action){
        $model = OrderModelList::orderBy('updated_at', 'desc')->orderBy('updated_at', 'desc')->paginate(10, ['*'], 'model');
        $allModel = OrderModelList::select('*')->orderBy('Model', 'asc')->get();
        $parameter = Parameters::orderBy('updated_at', 'desc')->paginate(10,['*'],'paramters');
        $machine = MachineAllocation::orderBy('updated_at', 'desc')->paginate(10,['*'],'machine');
        $excessDataBase = ExcessModel::where('status','hold')->paginate(10,['*'], 'excess');

        $selector_options = ['Media Size', 'Pre-treatment' , 'Post-treatment'  , 'Condition Number' ,'Nickel 1','Nickel 2','Poly Bag','Basket Number','Container','Endorsement' ,'Basket Type','Magnet Type','Drying Method','Plating Specs','Nickel_1_2_A'];
        $finalResult = [];
        $permissionLocation = $this->locationPermission();
        foreach($selector_options as $items){
            if($items){
                $result = Parameters::select('parameter')->where('type' , $items)->orderBy('parameter', 'asc')->get();
                $finalResult[$items]= $result ? array_column($result->toArray(),'parameter' ):null; 
            }
        }

        switch($action){
            case 'model':
                return [
                    'appName' => config('app.name'),
                    'model_manage' =>  $model ?? null, 
                    'parameter_manage' => $parameter??null,
                    'selector_parameters' =>  $finalResult,
                    'machine_manage' => $machine ?? null,
                    'message' => [ 'message' => $message , 'theme' =>$theme ],
                    'location' =>  $permissionLocation,
                    'excess_all_data' => $excessDataBase,
                    'all_model' => $allModel,
                ]; 
            default:
                break;
        }
                     
        
    }

    public function delete(array $data ,string $database){
        
         $db = $this->dataBaseBank( $database);
         $deleteData = $db::find($data['id']);
         if(!$deleteData ) return false;
         $result = $deleteData->delete();
         return $result;
    }

    public function updateData(array $data , string $database){
        $id = $data['id'];
        if(!$id || !$database) return false;
        $db = $this->dataBaseBank($database);
        switch($database){
            case 'machine':

                $ip_address = $data['ip1'] . "." . $data['ip2'] . "." . $data['ip3'] . ".". $data['ip4'];

                for($i = 1  ;$i <= 4 ;$i++){
                    unset($data['ip'.$i]);
                };
                $data['ip_address'] = $ip_address;
               $checkIfExist = $db::where(function ($query) use ($data) {
                                                                                $query->where('user', $data['user'])
                                                                                    ->orWhere('id_number', $data['id_number']);
                                                                            })->where('id', '!=', $data['id'])->first();
                if($checkIfExist)return false;
                break;

            default:
                break;
        }
        $data['updated_at'] = Carbon::now();
        $update = $db::where('id' , $id)->update($data);
        if($update) return true;
        return false;
    }

    public function createNewData(array $data , string $database){
        $db = $this->dataBaseBank( $database);
      
        $finder = '';
        
        //column finder
        switch($database){
            case 'model':
                $finder ='Model';
                break;
            case 'parameter':
                $finder = 'parameter';
                break;
            case 'machine':

                $finder = 'ip_address';
                $ip_address = $data['ip1'] . "." . $data['ip2'] . "." . $data['ip3'] . ".". $data['ip4'];

                for($i = 1  ;$i <= 4 ;$i++){
                    unset($data['ip'.$i]);
                };
                $data['ip_address'] = $ip_address;
                $checkIfExist = $db::where('user' , $data['user'])->orWhere('id_number' , $data['id_number'])->first();
                if($checkIfExist)return false;
                
                break;

            default:
                break;
        }

        $checkIfExist = $db::where($finder , $data[$finder])->first();
        if($checkIfExist || !$db) return false;

        $CreateData = $db::create($data);

        if($CreateData) return true;
        return false;
    }

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
                    'loading' => false,
                    'message' =>[ 'message' =>'Record not found in daily checkfile!' , 'theme' => 'error-notification']
                ]);
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
                'loading' => false,
                'message' =>[ 'message' =>'Record Found!' , 'theme' => 'success-notification']
            ]);

        }else{
          
             return Inertia::render('Main', [
                    'appName' => config('app.name'),
                    'location' => $machineAllocation ? $machineAllocation->toArray() : null,
                    'loading' => false,
                ]);
        }

    }

    public function updateDatalist(string $woid ,string $location ,string $process1 ,string $process2 , string $currentProcess){
            if(!$woid) return false;
            try{
                $result = DatalistModel::where('ID' , '=' , $woid)->first();
                if(!$result) return false;
                $modelDetails = $result->toArray();

                $update = DatalistModel::where('ID' , '=', $woid)->update([
                    'Process_History' =>  $process1.';'.$modelDetails["Process_History"],
                    'Process_History2' =>  $process2.';'.$modelDetails["Process_History2"],
                    'Location_History' =>  $location.';'.$modelDetails["Location_History"],
                    'Process' => $currentProcess
                ]);

                if($update ) return true;
                return false;
            }catch(\Exception $e ){
                dd($e);
            }
    }

     protected function ShiftIdentifier(){
        //get shift and work hour
        $datenowShift = Carbon::now()->subHours(6)->format('H');
        $currentShift = intval($datenowShift) < 12 ? 'E':'F';
        $hourNow = sprintf('%04d',(intval($datenowShift) * 100)) . "H";

        return [
            'Shift' =>  $currentShift,
            'Hour' => $hourNow,
        ];
    }
    public function updateProcessOutput(string $woid ,int $quantity, string $clientIP ,string   $dateYear ,string $model_order, string $process ,string $loader){

                        $shift = $this->ShiftIdentifier();
                        $computedWeight = 0;
                        
                        if(!$woid || !$model_order) return false;
                       

                        try{
                            $checkBatchDetails = BatchNumber::where('work_order_id' , '=' , $woid )->first();
                            if(!$checkBatchDetails) return false;

                            $checkWeight  = WeightInventory::where('Model_Name' , $model_order)->first();
                            $quantityWeightRecord = $checkWeight && $checkWeight->Weight ? $checkWeight->Weight : 0;
                            $computedWeight  = $quantity * $quantityWeightRecord;

                            $resultDetails = $checkBatchDetails->toArray();
                            
                            $result = ProcessOutputInventory:: create([
                                                                'Date' => Carbon::now()->format("Y-m-d H:i:s"),
                                                                'Shift_Date'=>  $dateYear,
                                                                'Shift' =>  $shift['Shift'] ?? null,
                                                                'Hour'  =>  $shift['Hour'] ?? null,
                                                                'Area' =>  'P2 Plating',
                                                                'Process' =>  $process,
                                                                'Work_Order' =>  $woid,
                                                                'Model_Name' =>  $model_order,
                                                                'Lot_No' =>  $resultDetails["data_lot_number"],
                                                                'Quantity' => $quantity,
                                                                'Unit_Weight' => $checkWeight && $checkWeight->Weight ?$checkWeight->Weight: 0,
                                                                'Total_Weight' => $computedWeight,
                                                                'Encoder' =>  $loader,
                                                                'IP_Address' =>  $clientIP,
                                                                'Split_Type' =>  '',
                                                                'Location' =>  'P2 Plating',
                                                                'Remarks' =>  'P2OWEBDA',
                                                                'Split_Remarks' => '',
                                                            ]);
                            
                            if($result) return true;
                            return false;
                        }catch(\Exception $e){
                            dd($e);
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
        function filterInput(array $array){
          
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
            $request->input('quantity') ? $quantity_order = $request->input('quantity'):$quantity_order = null;
            $current = $request->input('current') ? $request->input('current'):null;
            
            
            if(!$workOrder) return redirect()->back();
            $date1 = Carbon::now()->format('Y-m-d H:i:s');
            $dateYear = Carbon::now()->format('Y-m-d');

          
            
                
            
            if($current == 'loading'){
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
                            'PolyBag' => trim($model_order["poly_bag"]),
                            'Container' => trim($model_order["container"]),
                            'Loading_time'=> trim($now),
                            'Machine_Details' =>  $machineDetailsLoading,
                            'Model_Details' =>  $modelDetailsLoading,
                            'Daily_Check' =>   $dailyCheckLoading,
                            'CurrentLocation' => trim($location["location"]),
                            'Quantity' => $dailyCheckLoading["Quantity"],
                            'Status' => 'loaded',

                        ]
                    ));

                $locationHistory = $date1 .'%P2 Plating%'.$loader;
                $processhistory1 = $date1 .'%' . 'LOADING' . '%' . 'P2 Plating' . '%' . $loader;
                $processhistory2 = $date1 .'|'. $dateYear .'|P2 Plating|LOADING|' . $quantity_order.'|'.$loader;

                $this->updateDatalist( $workOrder , $locationHistory ,$processhistory1 ,$processhistory2 , 'LOADING');
                $this->updateProcessOutput($workOrder ,$quantity_order,  $clientIP ,$dateYear ,$model_order["Model"],'LOADING',$loader);
                    
            }else if($current == 'unloading' && $workOrder){
                
                $Unloader = $request->input('IdName') ? $request->input('IdName') :  null;
                $Endorsed_To = $scanned_data["Endorsement"] ? strtoupper($scanned_data["Endorsement"]):null;

                ProductionOrderModel::where('Work_Order' ,$workOrder)->update([
                    'Unloader' => $Unloader,
                    'Endorsed_To' => $Endorsed_To,
                    'Unloading_time' => Carbon::now(),
                    'Status' => 'unloaded',
                ]);


                $locationHistory = $date1 .'%P2 Plating%'.$loader;
                $processhistory1 = $date1 .'%' . 'UNLOADING' . '%' . 'P2 Plating' . '%' . $loader;
                $processhistory2 = $date1 .'|'. $dateYear .'|P2 Plating|UNLOADING|' . $quantity_order.'|'.$loader;

                $unloadingSave = $this->updateDatalist( $workOrder , $locationHistory ,$processhistory1 ,$processhistory2 , 'UNLOADING');
                $endorsingSave = $this->updateProcessOutput($workOrder ,$quantity_order,  $clientIP ,$dateYear ,$model_order["Model"],'UNLOADING',$loader);
                
                sleep(1);
                $locationHistory = $date1 .'%P2 Plating%'.$loader;
                $processhistory1 = $date1 .'%' . $Endorsed_To . '%' . 'P2 Plating' . '%' . $loader;
                $processhistory2 = $date1 .'|'. $dateYear .'|P2 Plating|'.$Endorsed_To.'|' . $quantity_order.'|'.$loader;
                
                if($unloadingSave) $this->updateDatalist( $workOrder , $locationHistory ,$processhistory1 ,$processhistory2 , $Endorsed_To );
                if($endorsingSave) $this->updateProcessOutput($workOrder ,$quantity_order,  $clientIP ,$dateYear ,$model_order["Model"],$Endorsed_To ,$loader);
            }

        }
    }

    public function getProductionOrder(Request $request){
        $get = $request->all();

        $model = $request->get('model') ?? null;
        $date_start = $request->get('date_start') ?? null;
        $date_end = $request->get('date_end') ?? null;
        $serial = $request->get('serial') ?? null;
        $location = $request->get('location') ?? null;
        $items = [
            'Model_Name' => $model,
            'Work_Order' => $serial,
            'CurrentLocation' => $location
        ];

        $query = ProductionOrderModel::query();
        $query2 = ProductionOrderModel::query();
        foreach($items as $key => $value){
            if($value){
                $query->where($key, 'LIKE', "%{$value}%");
                $query2->where($key, 'LIKE', "%{$value}%");
            }
        }
        
        $permissionLocation = $this->locationPermission();
        
        if (!empty($date_start) && !empty($date_end)) {
            $query->whereBetween('Loading_time', [
                                                    Carbon::parse($date_start)->startOfDay(),
                                                    Carbon::parse($date_end)->endOfDay(),
                                                ]);
            $query2->whereBetween('Loading_time', [
                                                    Carbon::parse($date_start)->startOfDay(),
                                                    Carbon::parse($date_end)->endOfDay(),
                                                ]);
            
        }

        if( $get && count($get) > 1 ){
           
            $result = $query->orderBy('updated_at', 'desc')
                            ->paginate(15,['*'], 'order')
                            ->withQueryString();

            $excelData = $query2->orderBy('updated_at', 'desc')->get();
                
            $dataExcel =  $excelData  ? json_encode($excelData->toArray()):null;
                
            return Inertia::render('Main', [
                'orderList' => $result,
                'exceList' => $dataExcel,
                'location' =>  $permissionLocation 
            ]);
            
        }else{
            $result = ProductionOrderModel::limit(1000)->orderBy('updated_at', 'desc')->paginate(15, ['*'], 'order');
            $excelData = ProductionOrderModel::limit(1000)->orderBy('updated_at', 'desc')->get(); 
            $dataExcel =  $excelData  ? json_encode($excelData->toArray()):null;

            return Inertia::render('Main', [
                'orderList' => $result,
                'exceList' => $dataExcel,
                'location' =>  $permissionLocation 
            ]);
        }
            
    }
    //Admin controller
    
    

    public function getAdminManagement(Request $request){
     
        $data = $request->all();
        $filter = $data['filter_manage'] ?? false;
        $model_manage = $data['model_manage'] ?? false;
        $parameter_type = $data['parameter_type'] ?? false;
        $parameter_value = $data['parameter_value'] ?? false;
        $location = $data['location'] ?? null;
        $ip_address = $data['ip_address'] ?? null;
        $modelSearch = $data['model'] ?? null;
        $status = $data['status'] ?? null;
        $lot_number = $data['lot_number'] ?? null;
        $work_order_id = $data['work_order_id'] ?? null;       
        $currentIp = $request->ip();

        $checkIFadmin = MachineAllocation::where('ip_address','=',$currentIp)->first();

        if($checkIFadmin && $checkIFadmin->permission !== 'admin' || !$checkIFadmin) return redirect('/production-order/');
  
        $model = OrderModelList::limit(1000)->orderBy('updated_at', 'desc')
                                 ->paginate(10, ['*'], 'model');
        $parameter = Parameters::limit(1000)->orderBy('updated_at', 'desc')->paginate(10,['*'],'paramters');
        $machine = MachineAllocation::limit(1000)->orderBy('id', 'desc')->paginate(10,['*'],'machine_filter');
        $excessDataBase = ExcessModel::where('status','hold')->orderBy('created_at' , 'desc')->paginate(10,['*'], 'excess');
        $allModel = OrderModelList::select('*')->orderBy('Model', 'asc')->get();
        $protoList =  BatchNumber::limit(1000)->orderBy('data_id', 'desc')->paginate(10,['*'],'order_list');

        $selector_options = ['Media Size', 'Pre-treatment' , 'Post-treatment'  , 'Condition Number' ,'Nickel 1','Nickel 2','Poly Bag','Basket Number','Container','Endorsement','Basket Type','Magnet Type','Drying Method','Plating Specs','Nickel_1_2_A'];
        $finalResult = [];
        

        $permissionLocation = $this->locationPermission();
        foreach($selector_options as $items){
            if($items){
                $result = Parameters::select('parameter')->where('type' , $items)->orderBy('parameter', 'asc')->get();
                $finalResult[$items]= $result ? array_column($result->toArray(),'parameter' ):null; 
            }
        }

        if(!$filter && !$model_manage ){
           
            return Inertia::render('Main', [
                'appName' => config('app.name'),
                'model_manage' =>  $model ?? null,
                'parameter_manage' => $parameter??null,
                'selector_parameters' =>  $finalResult,
                'machine_manage' => $machine,
                'location' => $permissionLocation,
                'excess_all_data' => $excessDataBase,
                'all_model' => $allModel,
                'proto_all_data' => $protoList
                
            ]);
        }

        switch( $filter ){
            case 'model_manage':
                $model = OrderModelList::where('model','LIKE',"%{$model_manage}%")->orderBy('updated_at', 'desc')
                            ->paginate(10,['*'], 'order')
                            ->withQueryString();
                return Inertia::render('Main', [
                    'appName' => config('app.name'),
                    'model_manage' =>  $model ?? null,
                    'parameter_manage' => $parameter??null,
                    'selector_parameters' =>  $finalResult,
                    'machine_manage' => $machine,
                    'location' => $permissionLocation,
                    'all_model' => $allModel,
                    'proto_all_data' => $protoList
                    
                ]);

            case 'parameter_manage':
                $parameter = Parameters::where('parameter','LIKE',"%{$parameter_value}%")->where('type','LIKE',"%{$parameter_type}%")->orderBy('updated_at', 'desc')
                            ->paginate(10,['*'], 'param_filter')
                            ->withQueryString();
                return Inertia::render('Main', [
                    'appName' => config('app.name'),
                    'model_manage' =>  $model ?? null,
                    'parameter_manage' => $parameter??null,
                    'selector_parameters' =>  $finalResult,
                    'machine_manage' => $machine,
                    'location' => $permissionLocation,
                    'all_model' => $allModel,
                    'proto_all_data' => $protoList
                ]);

            case 'machine_manage':
                $machine = MachineAllocation::where('location','LIKE',"%{$location}%")->where('ip_address','LIKE',"%{$ip_address}%")->orderBy('updated_at', 'desc')
                            ->paginate(10,['*'], 'machine_filter')
                            ->withQueryString();
                return Inertia::render('Main', [
                    'appName' => config('app.name'),
                    'model_manage' =>  $model ?? null,
                    'parameter_manage' => $parameter??null,
                    'selector_parameters' =>  $finalResult,
                    'machine_manage' => $machine,
                    'location' => $permissionLocation,
                    'all_model' => $allModel,
                    'proto_all_data' => $protoList
                ]);

            case 'excess':
              
                $excess = ExcessModel::where('model','LIKE',"%{$modelSearch}%")
                            ->where('lot_number','LIKE',"%{$lot_number}%")
                            ->where('status','LIKE',"%{$status}%")
                            ->orderBy('updated_at', 'desc')
                            ->paginate(10,['*'], 'machine_filter')
                            ->withQueryString();

                return Inertia::render('Main', [
                    'appName' => config('app.name'),
                    'model_manage' =>  $model ?? null,
                    'parameter_manage' => $parameter??null,
                    'selector_parameters' =>  $finalResult,
                    'machine_manage' => $machine,
                    'location' => $permissionLocation,
                    'excess_all_data' => $excess,
                    'all_model' => $allModel,
                    'proto_all_data' => $protoList
                ]);
            case 'proto_order':
              
                $protoList = BatchNumber::where('model','LIKE',"%{$modelSearch}%")
                            ->where('data_lot_number','LIKE',"%{$lot_number}%")
                            ->where('work_order_id','LIKE',"%{$work_order_id}%")
                            ->orderBy('updated_at', 'desc')
                            ->paginate(10,['*'], 'machine_filter')
                            ->withQueryString();

                return Inertia::render('Main', [
                    'appName' => config('app.name'),
                    'model_manage' =>  $model ?? null,
                    'parameter_manage' => $parameter??null,
                    'selector_parameters' =>  $finalResult,
                    'machine_manage' => $machine,
                    'location' => $permissionLocation,
                    'excess_all_data' => $excessDataBase,
                    'all_model' => $allModel,
                    'proto_all_data' => $protoList
                ]);

            default:
                return Inertia::render('Main', [
                    'appName' => config('app.name'),
                    'model_manage' =>  $model ?? null,
                    'parameter_manage' => $parameter??null,
                    'selector_parameters' =>  $finalResult,
                    'machine_manage' => $machine,
                    'location' => $permissionLocation,
                    'all_model' => $allModel,
                    'proto_all_data' => $protoList
                ]);
                
        }

    }
    
   public function saveSolo(array $data , string  $clientIP ){
        $date1 = Carbon::now()->format('Y-m-d H:i:s');
        $dateYear = Carbon::now()->format('Y-m-d');
        $shiftInstance = new GenerateController();
        $shift = $shiftInstance->ShiftIdentifier();
        $model = $data["model"];
        $woid = $data["work_order_id"];
        $data_lot_number = $data["data_lot_number"]; 
        $quantity = $data["quantity"];
        $generateBatchNumber = $data["generated_batch_number"];
        $checkRouting = $shiftInstance->getRouting($model);
        if(!$checkRouting) return false;

        $getWeight = $shiftInstance->checkWeight($model);
        !$getWeight ? $getWeight =[] :null;

        $computedWeight = $shiftInstance->ComputeWeight($getWeight,$quantity);
        
        $location = $date1 .'%P2 Plating%'.$clientIP;
        $processhistory1 = $date1 .'%' . 'RECEIVING' . '%' . 'P2 Plating' . '%' . 'Generated by:'.$clientIP;
        $processhistory2 = $date1 .'|'. $dateYear .'|P2 Plating|RECEIVING|' . $quantity.'|'.'Generated by:'.$clientIP;

        $dataInserProcess []= [
                        'Date'=>  $date1,
                        'Shift_Date'=>  $dateYear,
                        'Shift' =>  $shift['Shift'] ?? null,
                        'Hour'  =>  $shift['Hour'] ?? null,
                        'Area' =>  'P2 Plating',
                        'Process' =>  'RECEIVING',
                        'Work_Order' =>  $woid,
                        'Model_Name' =>  $model,
                        'Lot_No' =>  $data_lot_number,
                        'Quantity' => $quantity,
                        'Unit_Weight' => $getWeight["Weight"] ?? 0,
                        'Total_Weight' => $computedWeight,
                        'Encoder' =>  $clientIP,
                        'IP_Address' =>  $clientIP,
                        'Split_Type' =>  '',
                        'Location' =>  'P2 Plating',
                        'Remarks' =>  'P2OWEBDA',
                        'Split_Remarks' => '',
                    ];
         
        $dataInsertDataList [] = [
                        'ID' =>  $woid,
                        'FIFO_No' =>  'For Update',
                        'Model_Name' =>  $model,
                        'Lot_No' =>  $data_lot_number,
                        'Initial_Quantity' =>  $quantity,
                        'Received_Quantity' =>  0,
                        'Running_Quantity_BCS' =>  0,
                        'Running_Quantity' =>  $quantity,
                        'Running_Quantity_2' =>  $quantity,
                        'Remarks' =>  '',
                        'Area' =>  'P2 Plating',
                        'Category' => '',
                        'Date_Received' =>  Carbon::now()->format('y-m-d H:i:s'),
                        'Shift_Date' =>   Carbon::now()->format('y-m-d'),
                        'Received_By' =>  $clientIP,
                        'Process' =>  'RECEIVING',
                        'Process_History' =>  $processhistory1,
                        'Process_History2' => $processhistory2,
                        'Location' =>  'P2 Plating',
                        'Location_History' => $location,
                        'Daily_Check_File' =>  '',
                        'Sprayer' =>  '',
                        'PIC' =>  '',
                        'RoutingCode' => $checkRouting["RoutingCode"],
                        'Split_Type' =>  '',
                        'Split_Remarks' => '',
                        'Model_Code' =>  '',
                    ];

        $dataInsertDailyCheck [] = [
                        'ID' =>$woid,
                        'Model_Name' =>$model,
                        'Lot_No' => $data_lot_number,
                        'Quantity' => $quantity,
                        'RoutingCode' =>  $checkRouting["RoutingCode"]
                    ];

      
        $shiftInstance->saveDetails($dataInsertDailyCheck,'daily_check');
        $shiftInstance->saveDetails($dataInserProcess,'process_output');
        $shiftInstance->saveDetails($dataInsertDataList,'datalist');

        //udpate batch number 
        try{
            BatchNumber::where('work_order_id' , $woid)->update(['inventory_encoding' => 1]);

            $checkExcess = ExcessModel::where('generated_lot_number',$generateBatchNumber)->first();
            if($checkExcess) ExcessModel::where('generated_lot_number',$generateBatchNumber)->update(['status' => 'disposed']);
        }catch(Exception $e){
            return false;
        }
        return true;
   }
  
    public function postAdminHandler(Request $request){
        
            $data = $request->all();
            $action = $data['action'] ?? null;
            $requestData = $data['data']?? null;
            $database = $data['database']?? null;
         
            if(!$action && !$requestData  && !$database ) return redirect()->back();
            

            $clientIP = $request->ip();
            $generateController = new GenerateController;

            switch($action){

                case 'delete':

                    $result = $this->delete($requestData,$database);
                    if($result){
                       $refresh =$this->refresh('Deleted Successfully' , 'success-notification' , 'model' );
                       return Inertia::render('Main',  $refresh );
                    }else{
                       $refresh =$this->refresh('Error Delete!' , 'error-notification' , 'model' );
                       return Inertia::render('Main',  $refresh );
                    }

                case 'update':
                    $result = $this->updateData($requestData ,$database);
                    if($result){
                       $refresh =$this->refresh('Updated Successfully' , 'success-notification' , 'model' );
                       return Inertia::render('Main',  $refresh );
                    }else{
                       $refresh =$this->refresh('Error update!' , 'error-notification' , 'model' );
                       return Inertia::render('Main',  $refresh );
                    }
                case 'create':
                   
                    $result = $this->createNewData($requestData ,$database);
                    if($result){
                       $refresh =$this->refresh('Created Successfully' , 'success-notification' , 'model' );
                       return Inertia::render('Main',  $refresh );
                    }else{
                        $refresh =$this->refresh('Data Already exsist!' , 'error-notification' , 'model' );
                       return Inertia::render('Main',  $refresh );
                    }
                    break;
                 case 'generate':
                  
                   
                    $result = $generateController->GenerateBatch($requestData , $action ,  $clientIP );
                        
                    if($result){
                       $refresh =$this->refresh('Generated QR successfully!' , 'success-notification' , 'model' );
                       $refresh['message']['generation_status'] = true;
                       $refresh['generated_woid'] =  $result;
                       return Inertia::render('Main',  $refresh );
                    }else{
                       $refresh =$this->refresh('Generating Error!' , 'error-notification' , 'model' );
                       //true failed false okay
                       $refresh['message']['generation_status'] = false;
                       return Inertia::render('Main',  $refresh );
                    }
              
                case 'excess':
                    $modelName = $requestData["model"] ?? null;
                    
                    if(!$modelName) return redirect()->back();
                    
                    $result = ExcessModel::where('model',$modelName)->where('status', 'hold')->first();
                    

                    if(!$result) return redirect()->back();
                    
                    $refresh =$this->refresh('Checked Excess' , 'success-notification' , 'model' );
                    $refresh['excess'] = $result->toArray();
                    return Inertia::render('Main',  $refresh );
                case 'solo':
                    $result = $this->saveSolo($requestData ,  $clientIP );
                    break;
                default:
                    return redirect()->back();
                    
            }
           
    }

}


