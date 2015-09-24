<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Vendedor extends Model
{
	protected $table = 'vendedor';
	
    public function filial()
    {
        return $this->belongsTo('Filial');
    }
}
