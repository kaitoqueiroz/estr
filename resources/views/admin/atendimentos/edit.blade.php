@extends('layout.admin')

@section('content')
    <div class="page-header">
        <h1>Atendimentos / Edit </h1>
    </div>

    {!! \App\Libs\ErrorDisplay::getInstance()->displayAll($errors) !!}

    <div class="row">
        <div class="col-md-12">

            <form action="{{ action('Admin\AtendimentoController@update', $atendimento->id) }}" method="POST">
                <input type="hidden" name="_method" value="PUT">
                <input type="hidden" name="_token" value="{{ csrf_token() }}">

                <div class="form-group">
                    <label for="nome">ID</label>
                    <p class="form-control-static">{{$atendimento->id}}</p>
                </div>
                <div class="form-group">
                     <label for="produto_id">PRODUTO_ID</label>
                     <input type="text" name="produto_id" class="form-control" value="{{ \App\Libs\ValueHelper::getOldInput($atendimento,'produto_id') }}"/>
                     {!! \App\Libs\ErrorDisplay::getInstance()->displayIndividual($errors, "produto_id") !!}
                </div>
                    <div class="form-group">
                     <label for="produto_id">PRODUTO_ID</label>
                     <input type="text" name="produto_id" class="form-control" value="{{ \App\Libs\ValueHelper::getOldInput($atendimento,'produto_id') }}"/>
                     {!! \App\Libs\ErrorDisplay::getInstance()->displayIndividual($errors, "produto_id") !!}
                </div>
                    <div class="form-group">
                     <label for="outro_dia">OUTRO_DIA</label>
                     <input type="text" name="outro_dia" class="form-control" value="{{ \App\Libs\ValueHelper::getOldInput($atendimento,'outro_dia') }}"/>
                     {!! \App\Libs\ErrorDisplay::getInstance()->displayIndividual($errors, "outro_dia") !!}
                </div>
                    <div class="form-group">
                     <label for="motivo">MOTIVO</label>
                     <input type="text" name="motivo" class="form-control" value="{{ \App\Libs\ValueHelper::getOldInput($atendimento,'motivo') }}"/>
                     {!! \App\Libs\ErrorDisplay::getInstance()->displayIndividual($errors, "motivo") !!}
                </div>



            <a class="btn btn-default" href="{{ action('Admin\AtendimentoController@index') }}">Back</a>
            <button class="btn btn-primary" type="submit" >Save</a>
            </form>
        </div>
    </div>


@endsection