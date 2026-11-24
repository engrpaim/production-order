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
            Session::put('loginError','Duplicate User');
            return redirect()->back();
        }
              dd( $data);
        $addUser = UserLoginModel::create($data)->toArray();
        Session::put('loginSuccess', $addUser["username"].' successfully registered!');
        return redirect('/production-order/login');
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
            return false;
        }


        if($data && $data["method"] && $data["method"] === 'register'){
            $resultData = $this->registerUser($data);
            if($resultData ) return true;
            return false;
        }

        $credentials = $validator->validated();
        $checkUserStatus = UserLoginModel::select('status')->where('id_number','=',   $data['id_number'] )->first();

        if(!$checkUserStatus ||  $checkUserStatus && array_key_exists('status',$checkUserStatus->toArray()) && in_array($checkUserStatus['status'] , ['requesting' , 'inactive' , 'rejected']) ){
            Session::put('loginError', 'Username not exist or not yet approved');
            return redirect()->back();
        }
        
        if($method === 'login' && Auth::attempt($credentials)){
            request()->session()->regenerate();
            return redirect()->intended('/production-order/admin');
        }

        Session::put('loginError', 'Wrong I.D or password!');
        return redirect()->back();

    }

   
}
