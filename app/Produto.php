<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    protected $table = 'produto';

    public function produto_venda()
    {
    	return $this->hasMany("App\ProdutoVenda");
    }
}
