<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Filial extends Model
{
    protected $table = 'filial';
    
    public function vendedores()
    {
        return $this->hasMany('App\Vendedor');
    }
}
