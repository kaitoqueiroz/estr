@extends('layout.admin')

@section('content')
    <div class="page-header">
        <h1>Atendimentos / Show </h1>
    </div>


    <div class="row">
        <div class="col-md-12">

            <form action="#">
                <div class="form-group">
                    <label for="nome">ID</label>
                    <p class="form-control-static">{{$atendimento->id}}</p>
                </div>
                <div class="form-group">
                     <label for="produto_id">PRODUTO_ID</label>
                     <p class="form-control-static">{{$atendimento->produto_id}}</p>
                </div>
                    <div class="form-group">
                     <label for="produto_id">PRODUTO_ID</label>
                     <p class="form-control-static">{{$atendimento->produto_id}}</p>
                </div>
                    <div class="form-group">
                     <label for="outro_dia">OUTRO_DIA</label>
                     <p class="form-control-static">{{$atendimento->outro_dia}}</p>
                </div>
                    <div class="form-group">
                     <label for="motivo">MOTIVO</label>
                     <p class="form-control-static">{{$atendimento->motivo}}</p>
                </div>
            </form>



            <a class="btn btn-default" href="{{ action('Admin\AtendimentoController@index') }}">Back</a>
            <a class="btn btn-warning" href="{{ action('Admin\AtendimentoController@edit', $atendimento->id) }}">Edit</a>
            <form action="{{ action('Admin\AtendimentoController@destroy', $atendimento->id) }}" method="POST" style="display: inline;" onsubmit="if(confirm('Delete? Are you sure?')) { return true } else {return false };"><input type="hidden" name="_method" value="DELETE"><input type="hidden" name="_token" value="{{ csrf_token() }}"><button class="btn btn-danger" type="submit">Delete</button></form>
        </div>
    </div>


@endsection