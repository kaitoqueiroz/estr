@extends('layout.admin')

@section('content')
    <div class="page-header">
        <h1>Atendimentos / Create </h1>
    </div>

    {!! \App\Libs\ErrorDisplay::getInstance()->displayAll($errors) !!}

    <div class="row">
        <div class="col-md-12">

            <form action="{{ action('Admin\AtendimentoController@store') }}" method="POST">
                <input type="hidden" name="_token" value="{{ csrf_token() }}">

                <div class="form-group">
                     <label for="produto_id">PRODUTO_ID</label>
                     <input type="text" name="produto_id" class="form-control" value="{{  Session::getOldInput('produto_id') }}"/>
                     {!! \App\Libs\ErrorDisplay::getInstance()->displayIndividual($errors, "produto_id") !!}
                </div>
                    <div class="form-group">
                     <label for="produto_id">PRODUTO_ID</label>
                     <input type="text" name="produto_id" class="form-control" value="{{  Session::getOldInput('produto_id') }}"/>
                     {!! \App\Libs\ErrorDisplay::getInstance()->displayIndividual($errors, "produto_id") !!}
                </div>
                    <div class="form-group">
                     <label for="outro_dia">OUTRO_DIA</label>
                     <input type="text" name="outro_dia" class="form-control" value="{{  Session::getOldInput('outro_dia') }}"/>
                     {!! \App\Libs\ErrorDisplay::getInstance()->displayIndividual($errors, "outro_dia") !!}
                </div>
                    <div class="form-group">
                     <label for="motivo">MOTIVO</label>
                     <input type="text" name="motivo" class="form-control" value="{{  Session::getOldInput('motivo') }}"/>
                     {!! \App\Libs\ErrorDisplay::getInstance()->displayIndividual($errors, "motivo") !!}
                </div>



            <a class="btn btn-default" href="{{ action('Admin\AtendimentoController@index') }}">Back</a>
            <button class="btn btn-primary" type="submit" >Create</a>
            </form>
        </div>
    </div>


@endsection