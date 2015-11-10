<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Vendedor extends Model
{
	protected $table = 'vendedor';
	
    public function filial()
    {
        return $this->belongsTo('App\Filial');
    }

    public function metas()
    {
        return $this->hasMany('App\Meta');
    }

    public function vendas()
    {
        return $this->hasMany('App\Venda');
    }
}
