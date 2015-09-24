<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProdutoVendasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('produtovenda', function(Blueprint $table) {
            $table->increments('id');
            $table->integer('quantidade');
            $table->integer('venda_id')->unsigned();
            $table->foreign('venda_id')->references('id')->on('venda');
            $table->timestamps();
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('produtovenda');
	}

}
