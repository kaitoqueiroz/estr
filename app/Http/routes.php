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

Route::get('/home', function () {
    header("location: /admin/");
});

Route::resource("admin/vendedor","Admin\VendedorController");
Route::resource("admin/filial","Admin\FilialController");
Route::resource("admin/meta","Admin\MetaController");
Route::resource("admin/produto","Admin\ProdutoController");
Route::resource("admin/mensagem","Admin\MensagemController");
Route::resource("admin/usuario","Admin\UsuarioController");

Route::get("admin/meta/valor/diario","Admin\MetaController@metaValorDiario");
Route::get("admin/produtovenda","Admin\VendaController@getProdutoVenda");

Route::post('sincronizar/{vendedor_id}', [
    'middleware' => 'cors', function(){
    },
    'as' => 'sincronizar', 'uses' => 'Admin\SyncController@sincronizar'
]);
Route::get('login', [
    'middleware' => 'cors', function(){
    },
    'as' => 'login', 'uses' => 'Admin\SyncController@login'
]);
Route::get('loginAdmin', [
    'middleware' => 'cors', function(){
    },
    'as' => 'loginAdmin', 'uses' => 'Admin\UsuarioController@login'
]);
Route::get('logout', [
    'middleware' => 'cors', function(){
    },
    'as' => 'logout', 'uses' => 'Admin\UsuarioController@logout'
]);
Route::put('updateSenha/{id}', [
    'middleware' => 'cors', function(){
    },
    'as' => 'updateSenha', 'uses' => 'Admin\UsuarioController@updateSenha'
]);

Route::get('produtosVendidos', [
    'middleware' => 'cors', function(){
    },
    'as' => 'produtosVendidos', 'uses' => 'Admin\ProdutoVendaController@produtosVendidos'
]);

Route::get('vendas', [
    'middleware' => 'cors', function(){
    },
    'as' => 'vendas', 'uses' => 'Admin\VendaController@vendas'
]);

Route::get('metas', [
    'middleware' => 'cors', function(){
    },
    'as' => 'metas', 'uses' => 'Admin\MetaController@metas'
]);
