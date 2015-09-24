<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVendasTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('venda', function(Blueprint $table) {
            $table->increments('id');
            $table->string('cod_venda');
            $table->integer('vendedor_id')->unsigned();
            $table->foreign('vendedor_id')->references('id')->on('vendedor');
            $table->date('data');
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
		Schema::drop('venda');
	}

}
