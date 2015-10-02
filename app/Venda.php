<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Venda extends Model
{
    protected $table = 'venda';


    public function produto_venda()
    {
    	return $this->hasMany("App\ProdutoVenda");
    }
}
