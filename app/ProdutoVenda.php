<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProdutoVenda extends Model
{
    protected $table = 'produtovenda';

    public function venda(){
    	return $this->belongsTo('App\Venda');
    }

    public function produto(){
    	return $this->belongsTo('App\Produto');
    }
}
