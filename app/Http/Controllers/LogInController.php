<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Session;
use App\Models\MachineAllocation;
use App\Models\UserLoginModel;
use Exception;
use Illuminate\Http\Request;
class LogInController extends Controller
{
    public function registerUser(array $data){
 
        $userName = $data['first_name'] . "(".$data['id_number'].")" ;
        $data["username"] =  $userName;
        $data["remember_token"] =  'not remembered';

        $checkIfIdExist = UserLoginModel::where('id_number', '=', $data['id_number'])->first();
        
        if($checkIfIdExist){
            return false;
            
        }
             
        $addUser = UserLoginModel::create($data)->toArray();
        return [ 'loginSuccess' => $addUser["username"].' successfully registered!'];
       
    }

     public function logout(){
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect('/production-order/login');
    }

    public function login(Request $request){

        
        $ip = request()->ip();

        try{
            $location = MachineAllocation::where('ip_address' , $ip)->first();
            if($location) $location = $location->toArray();
        } 
        catch(Exception $e){
            $location = null;
        }

    
        if(!$request->all())  return Inertia::render('Main', 
                                                        [
                                                            'appName' => config('app.name'),
                                                            'location' => $location 
                                                        ]);
        $data = $request->all();
        $method = $data["method"] ;

        if($method === 'logout') $this->logout();
        $requestData = $method === 'login' ?
        [
            'id_number' => ['required'],
            'password' => ['required'],
        ]:[
            'id_number' => ['required'],
            'first_name' => ['required'],
            'surname' => ['required'],
            'department' => ['required'],
            'email' => ['required'],
            'password' => ['required'],
            'line' => ['required'],
            'confirm_password' => ['required'],
        ];
        
        $resultData = null;
    
        $validator = Validator::make($data , $requestData );
      
        if($validator->fails()){
             return Inertia::render('Main', 
                                            [
                                                'appName' => config('app.name'),
                                                'location' => $location,
                                                'loginError' =>'Required I.D and password!'
                                            ]);
        }


        if($data && $data["method"] && $data["method"] === 'register'){
            $resultData = $this->registerUser($data);

            if($resultData ) return Inertia::render('Main', 
                                            [
                                                'appName' => config('app.name'),
                                                'location' => $location,
                                                'loginSuccess' =>$resultData["loginSuccess"]
                                            ]);
            return Inertia::render('Main', 
                                            [
                                                'appName' => config('app.name'),
                                                'location' => $location,
                                                'loginError' =>'User already registered!'
                                            ]);
        }

        $credentials = $validator->validated();
     
        $checkUserStatus = UserLoginModel::select('status')->where('id_number','=',   $data['id_number'] )->first();

        if(!$checkUserStatus ||  $checkUserStatus && array_key_exists('status',$checkUserStatus->toArray()) && in_array($checkUserStatus['status'] , ['requesting' , 'inactive' , 'rejected']) ){
            return Inertia::render('Main', 
                                            [
                                                'appName' => config('app.name'),
                                                'location' => $location,
                                                'loginError' =>!$checkUserStatus ? 'User not found': 'User not yet approved'
                                            ]);
        }
        
        if($method === 'login' && Auth::attempt($credentials)){
            request()->session()->regenerate();
            return redirect()->intended('/production-order/admin');
        }
        


    }

   
}
