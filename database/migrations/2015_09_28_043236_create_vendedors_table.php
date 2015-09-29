<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVendedorsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('vendedor', function(Blueprint $table) {
            $table->increments('id');
            $table->string('nome');
            $table->string('login');
            $table->string('senha');
            $table->integer('filial_id')->unsigned();
            $table->foreign('filial_id')->references('id')->on('filial')->onDelete('cascade');
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
		Schema::drop('vendedor');
	}

}
