<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\DailyCheckFile;
use App\Models\OrderModelList;
use App\Models\Parameters;
use App\Models\RoutingCheck;
use App\Models\MachineAllocation;
use App\Models\ProductionOrderModel;
use Illuminate\Routing\Events\Routing;
use Carbon\Carbon;
use Nette\Schema\Message;

class ProcessOrderController extends Controller
{
     public function dataBaseBank(string $database)
     {
            $bank = [
                'model' =>  OrderModelList::class,
                'parameter' =>  Parameters::class,
                'machine' => MachineAllocation::class
            ];

            return $bank[$database];
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
            $current = $request->input('current') ? $request->input('current'):null;

            
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
                            'Loading_time'=> trim($now),
                            'Machine_Details' =>  $machineDetailsLoading,
                            'Model_Details' =>  $modelDetailsLoading,
                            'Daily_Check' =>   $dailyCheckLoading,
                            'CurrentLocation' => trim($location["location"]),
                            'Status' => 'loaded',

                        ]
                    ));
            }else if($current == 'unloading' && $workOrder){
                
                $PolyBag = $scanned_data["Poly Bag"] ? $scanned_data["Poly Bag"]:null;
                $Unloader = $request->input('IdName') ? $request->input('IdName') :  null;
                $Endorsed_To = $scanned_data["Endorsed To"] ? $scanned_data["Endorsed To"]:null;
                $Container = $scanned_data["Container"] ? $scanned_data["Container"]:null;
                ProductionOrderModel::where('Work_Order' ,$workOrder)->update([
                    'PolyBag' => $PolyBag,
                    'Unloader' => $Unloader,
                    'Endorsed_To' => $Endorsed_To,
                    'Container' => $Container,
                    'Unloading_time' => Carbon::now(),
                    'Status' => 'unloaded',
                ]);
                
            }

        }
    }

    public function getProductionOrder(Request $request){
        $get = $request->all();

        $model = $request->get('model') ?? null;
        $date_start = $request->get('date_start') ?? null;
        $date_end = $request->get('date_end') ?? null;
        $serial = $request->get('serial') ?? null;
        
        $items = [
            'Model_Name' => $model,
            'Work_Order' => $serial,
        ];

        $query = ProductionOrderModel::query();

        foreach($items as $key => $value){
            if($value){
                $query->where($key, 'LIKE', "%{$value}%");
            }
        }

        if (!empty($date_start) && !empty($date_end)) {
            $query->whereBetween('Loading_time', [
                                                    Carbon::parse($date_start)->startOfDay(),
                                                    Carbon::parse($date_end)->endOfDay(),
                                                ]);
        }

        if( $get && count($get) > 1 ){
            $result = $query->limit(1000)
                            ->orderBy('updated_at', 'desc')
                            ->paginate(15,['*'], 'order')
                            ->withQueryString();
            return Inertia::render('Main', [
                'orderList' => $result
            ]);
        }else{
            $result = ProductionOrderModel::limit(1000)->orderBy('updated_at', 'desc')->paginate(15, ['*'], 'order');
            return Inertia::render('Main', [
                'orderList' => $result
            ]);
        }
            
    }
    //Admin controller
    
    protected function refresh(string $message, string $theme ,string $action){
        $model = OrderModelList::orderBy('updated_at', 'desc')->orderBy('updated_at', 'desc')->paginate(10, ['*'], 'model');
        $parameter = Parameters::orderBy('updated_at', 'desc')->paginate(10,['*'],'paramters');
        $machine = MachineAllocation::orderBy('updated_at', 'desc')->paginate(10,['*'],'machine');
        $selector_options = ['Media Size', 'Pre-treatment' , 'Post-treatment'  , 'Condition Number' ,'Nickel 1','Nickel 2','Poly Bag','Basket Number','Container','Endorsement'];
        $finalResult = [];
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
                    'message' => [ 'message' => $message , 'theme' =>$theme ]
                ]; 

            default:
                break;
        }
                     
        
    }

    public function getAdminManagement(Request $request){

        $data = $request->all();
        $filter = $data['filter_manage'] ?? false;// get unique identificcation
        $model_manage = $data['model_manage'] ?? false;
        $parameter_type = $data['parameter_type'] ?? false;
        $parameter_value = $data['parameter_value'] ?? false;
        
    
        $model = OrderModelList::orderBy('updated_at', 'desc')
                                 ->paginate(10, ['*'], 'model');
        $parameter = Parameters::orderBy('updated_at', 'desc')->paginate(10,['*'],'paramters');
        $machine = MachineAllocation::orderBy('id', 'desc')->paginate(10,['*'],'machine');

        $selector_options = ['Media Size', 'Pre-treatment' , 'Post-treatment'  , 'Condition Number' ,'Nickel 1','Nickel 2','Poly Bag','Basket Number','Container','Endorsement'];
        $finalResult = [];
        
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
                'machine_manage' => $machine
                
            ]);
        }
 
        switch( $filter ){
            case 'model_manage':
                $model = OrderModelList::where('model','LIKE',"%{$model_manage }%")->orderBy('updated_at', 'desc')
                            ->paginate(10,['*'], 'order')
                            ->withQueryString();
                return Inertia::render('Main', [
                    'appName' => config('app.name'),
                    'model_manage' =>  $model ?? null,
                    'parameter_manage' => $parameter??null,
                    'selector_parameters' =>  $finalResult,
                    'machine_manage' => $machine
                ]);
            case 'parameter_manage':
                $parameter = Parameters::where('parameter','LIKE',"%{$parameter_value}%")->where('type','LIKE',"%{$parameter_type }%")->orderBy('updated_at', 'desc')
                            ->paginate(10,['*'], 'param_filter')
                            ->withQueryString();
                return Inertia::render('Main', [
                    'appName' => config('app.name'),
                    'model_manage' =>  $model ?? null,
                    'parameter_manage' => $parameter??null,
                    'selector_parameters' =>  $finalResult,
                    'machine_manage' => $machine
                ]);
            default:
                return Inertia::render('Main', [
                    'appName' => config('app.name'),
                    'model_manage' =>  $model ?? null,
                    'parameter_manage' => $parameter??null,
                    'selector_parameters' =>  $finalResult,
                    'machine_manage' => $machine
                ]);
                
        }

    }
    
   
    public function postAdminHandler(Request $request){
           
            $data = $request->all();
            $action = $data['action'];
            $requestData = $data['data'];
            $database = $data['database'];

            if(!$action && !$requestData  && !$database ) return redirect()->back();
                
            
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
                default:
                    return redirect()->back();
                    
            }
           
    }
}


