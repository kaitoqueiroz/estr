<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('admin', function () {
    return view('layout/admin');
});

Route::resource("admin/vendedor","Admin\VendedorController");
Route::resource("admin/filial","Admin\FilialController");
Route::resource("admin/meta","Admin\MetaController");
Route::resource("admin/produto","Admin\ProdutoController");
Route::resource("admin/mensagem","Admin\MensagemController");

Route::get('sincronizar/{vendedor_id}', [
    'middleware' => 'cors', function(){
    },
    'as' => 'sincronizar', 'uses' => 'Admin\SyncController@sincronizar'
]);