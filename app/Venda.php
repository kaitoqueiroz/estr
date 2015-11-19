<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Venda extends Model
{
    protected $table = 'venda';


    public function vendedor()
    {
        return $this->belongsTo("App\Vendedor");
    }
    public function produtos()
    {
    	return $this->belongsToMany('App\Produto','produtovenda')->withPivot('quantidade');
    }
}
