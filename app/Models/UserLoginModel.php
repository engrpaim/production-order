<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class UserLoginModel extends Authenticatable
{
    protected $table = 'user_login';
    protected $fillable = [
        'username',
        'first_name',
        'surname',
        'id_number',
        'password',
        'email',
        'line',
        'remember_token',
    ];

    protected $hidden = [
        'surname',
        'id_number',
        'password',
        'line',
        'remember_token',
        'created_at',
        'updated_at',
        'first_name',
        
    ];

     protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}
