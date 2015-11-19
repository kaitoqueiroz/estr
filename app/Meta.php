<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Meta extends Model
{
    protected $table = 'meta';
    public function vendedor(){
        return $this->belongsTo("App\Vendedor");
    }
    public function produtos()
    {
        return $this->belongsToMany('App\Produto','produtometa')->withPivot('quantidade');
    }
}
