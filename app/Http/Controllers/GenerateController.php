<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\BatchNumber;
use App\Models\LotNumber;
use App\Models\DailyCheckFile;
use App\Models\DatalistModel;
use App\Models\ProcessOutputInventory;
use App\Models\WeightInventory;
use Carbon\Carbon;
use Exception;
use Nette\Schema\Message;
use PhpParser\Node\Expr\Cast\Double;

use function PHPSTORM_META\type;

class GenerateController extends ProcessOrderController
{
    
    protected function LotNumberSave(object $lotNumber , string $clientIP , string $status , string $route ){
        
        if(count(get_object_vars($lotNumber)) <= 0) return false;
    
        $uniqueNumber = $lotNumber->lot_number ?? null;
        $total = $lotNumber->total ?? null;
        $quantity = $lotNumber->quantity ?? null;
        $model = $lotNumber->model ?? null;
        $lot_quantity = $lotNumber->lot_quantity ?? null;
        $ip_address = $clientIP ?? 'Not Found!';
        $current = $status ?? null;
        $excess = $lotNumber->excess  ?? 0;

        if(!$uniqueNumber) return false;
    
        $checkIfExist = LotNumber::where('lot_number','=',$uniqueNumber )->first();
       
        if($checkIfExist) return false;
        
        
        try{
            $result = LotNumber::create([
                'model' => $model,
                'lot_number' => $uniqueNumber,
                'lot_quantity' => $lot_quantity,
                'total_batches' => $total,
                'quantity_per_batch' => $quantity,
                'excess' => $excess,
                'status' => $current,
                'ip_address' => $ip_address,
            ]);

            if($result)  return $result->toArray();
            return false;
            
        }catch(\Exception $e){

            dd($e);

        }
         return false;
      
    }
    
    protected function getRouting(string $model){
        //Get the routing of model
        $result = DailyCheckFile::where('Model_Name',$model)->where('RoutingCode' ,'LIKE' , "%P2%" )->first();
        if(!$result) return false;
        return $result->toArray();
    }

    protected  function saveDetails(array $data,string $database){

            try{
                $result = DB::transaction(function () use ($data,$database)
                {
                    $bank = [
                            'batch_number' => BatchNumber::class,
                            'daily_check' => DailyCheckFile::class,
                            'process_output' => ProcessOutputInventory::class 
                        ];
                    $db = $database;
                    foreach (array_chunk($data, 256) as $chunk) {
                        try{
                            $bank[$db]::insert($chunk);
                            return true;
                        }catch(Exception $e){
                            dd($e);
                        }
                    }
                });
                if($result) return true;
                return false;
            }catch(Exception $e){
                return false;
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


    protected function ComputeWeight(array $data,int $quantity){
        if(!$data && (!$data['Weight'] || !$quantity)) return false;
        $weight = $data['Weight'];
        return $weight * $quantity;
    }
    protected function saveToInventory(array $batchNumber , array $lotNumberSave , string $route , array $getWeight ,string $clientIP) {
            $dataToInsert = [];
            $dataInsertDailyCheck = [];
            $dataInsertDataList = [];
            $dataInserProcess = [];
            $date1 = Carbon::now()->format('Y-m-d H:i:s');
            $dateYear = Carbon::now()->format('Y-m-d');
            
            
            //Excess
            //Create data for lot_number db
            foreach($batchNumber as $value){

                $batch = $value->batch;
                $dateWoid = Carbon::now()->format('ymdHis');
                $woid = 'O' . $dateWoid . $batch;
                $quantity = $value->quantity;
                $condition = $value->condition;
                $generated_batch_number = $value->batch_number;
                $model = $value->model;
                $data_id = $lotNumberSave["id"];
                $status = 'batching';
                $data_lot_number = $lotNumberSave["lot_number"];

                $dataToInsert[] = [
                    'data_id' => $data_id,
                    'data_lot_number' => $data_lot_number,
                    'model' => $model,
                    'generated_batch_number' => $generated_batch_number,
                    'quantity' => $quantity,
                    'work_order_id' =>$woid, 
                    'condition' => $condition ?? null,
                    'status' => $status,
                    'route_code' =>$route
                ];
            }

            //Process Output list
            foreach($batchNumber as $value){
                $batch = $value->batch;
                $dateWoid = Carbon::now()->format('ymdHis');
                $woid = 'O' . $dateWoid . $batch;
                $quantity = $value->quantity;
                $condition = $value->condition;
                $generated_batch_number = $value->batch_number;
                $model = $value->model;
                $data_id = $lotNumberSave["id"];
                $status = 'batching';
                $data_lot_number = $lotNumberSave["lot_number"];
                $shit = $this->ShiftIdentifier();
                $computedWeight = $this->ComputeWeight($getWeight,$quantity);
                $dataInserProcess[] = [
                    'Date'=>  $date1,
                    'Shift_Date'=>  $dateYear,
                    'Shift' =>  $shit['Shift'] ?? null,
                    'Hour'  =>  $shit['Hour'] ?? null,
                    'Area' =>  'P2 Plating',
                    'Process' =>  'RECEIVING',
                    'Work_Order' =>  $woid,
                    'Model_Name' =>  $model,
                    'Lot_No' =>  $data_lot_number,
                    'Quantity' => $quantity,
                    'Unit_Weight' => $getWeight["Weight"] ?? null,
                    'Total_Weight' => $computedWeight,
                    'Encoder' =>  'For Update',
                    'IP_Address' =>  $clientIP,
                    'Split_Type' =>  '',
                    'Location' =>  'P2 Plating',
                    'Remarks' =>  'P2OWEBDA',
                    'Split_Remarks' => ''
                ];
            }

            
            
            //Create data for datalist check db
            foreach($batchNumber as $value){
                
                $dateWoid = Carbon::now()->format('ymdHis');
                $batch = $value->batch;
                $woid = 'O' . $dateWoid . $batch;
                $quantity = $value->quantity;
                $condition = $value->condition;
                $generated_batch_number = $value->batch_number;
                $model = $value->model;
                $data_id = $lotNumberSave["id"];
                $status = 'batching';
                $data_lot_number = $lotNumberSave["lot_number"];


                $location = $date1 .'%P2 Plating%'.'USER';
                $processhistory1 = $date1 .'%' . 'RECEIVING' . '%' . 'P2 Plating' . '%' . 'user';
                $processhistory2 = $date1 .'|'. $dateYear .'|P2 Plating|RECEIVING|' . $quantity.'|'.'user';

                if($condition === 'exact'){
                    $dataInsertDataList[] = [
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
                        'Received_By' =>  'For Update',
                        'Process' =>  'RECEIVING',
                        'Process_History' =>  $processhistory1,
                        'Process_History2' => $processhistory2,
                        'Location' =>  'P2 Plating',
                        'Location_History' => $location,
                        'Daily_Check_File' =>  '',
                        'Sprayer' =>  '',
                        'PIC' =>  '',
                        'RoutingCode' => $route,
                        'Split_Type' =>  '',
                        'Split_Remarks' => '',
                        'Model_Code' =>  '',
                    ];

                    $dataInsertDailyCheck[] = [
                        'ID' =>$woid,
                        'Model_Name' =>$model,
                        'Lot_No' => $data_lot_number,
                        'Quantity' => $quantity,
                        'RoutingCode' => $route
                    ];
                }
                
            }



            $updateLot = LotNumber::where('id',$data_id)->update(['status' => 'production']);

            if(!$updateLot) return false;
           
            
            try{
                //Save to datalist
                $result  = DB::transaction(function () use ($dataInsertDataList) 
                                    {
                                        $getMaxFIFO = DatalistModel::select('FIFO_No')->latest('FIFO_No')->first();
                                        $Latest = $getMaxFIFO->FIFO_No ?? null;
                                        $addFiFo = intval(explode('-',$Latest)[1] + 1);
                            
                                        foreach (array_chunk($dataInsertDataList, 256) as $chunk) {

                                            $forInsert = [];
                                            
                                            foreach($chunk as $row){
                                                
                                                $dateFIFO = Carbon::now()->format('ym');
                                                $row['FIFO_No'] = $dateFIFO .'-'.sprintf('%05d',$addFiFo);
                                                $forInsert [] = $row;
                                                $addFiFo++;
                                                
                                            }

                                            if(count($forInsert) <= 0 ) return false;

                                            try{
                                                DatalistModel::insert($forInsert);
                                            }catch(Exception $e){
                                                return false;
                                            }

                                            

                                        }
                                        return true;
                                    });
                
                if($result){
                    $this->saveDetails($dataToInsert,'batch_number');
                    $this->saveDetails($dataInsertDailyCheck,'daily_check');
                    $this->saveDetails($dataInserProcess,'process_output');
                    return true;
                }
            }catch(Exception $e){
                dd($e);
            }       
            return false;
    }

    public function checkWeight(string $model){
        if(!$model) return false;
        $weightExist = false;
        try{
            $weightExist = WeightInventory::where('Model_Name' , $model)->first();
            if(!$weightExist) return false;
            return $weightExist->toArray();
        }catch(Exception $e){
            return false;
        }
    }
   
    
    public function GenerateBatch(string $data ,string $action , string  $clientIP ){
        $this->ShiftIdentifier();
        $convertData = json_decode($data);

        $lotNumber = $convertData->lot_number ?? null;
        $batchNumber = $convertData->batch_generated ?? null;
        $status = $convertData->status ?? null;
        $model = $lotNumber->model ?? null;
        if(!$model) return false;

        $checkRouting = $this->getRouting($model);
        if(!$checkRouting && !$checkRouting["RoutingCode"]) return false;

        //Check Weight
        $getWeight = $this->checkWeight($model);
        if(!$getWeight && !$getWeight["Weight"]) return false;
        
        switch( $action){
            case 'generate':

                // saving in lot_number
                $lotNumberSave = $this->LotNumberSave($lotNumber , $clientIP ,$status , $checkRouting["RoutingCode"]);

                if(!$lotNumberSave ) return false;

                // saving in datalist
                $batchSaved = $this->saveToInventory( $batchNumber , $lotNumberSave , $checkRouting["RoutingCode"], $getWeight, $clientIP );
                if(!$batchSaved) return false;

                return true;

            default:
                return false;
        }
                
    }
}
