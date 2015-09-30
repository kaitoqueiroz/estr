@extends('layout.admin')

@section('content')
    <div class="page-header">
        <h1>Usuarios / Show </h1>
    </div>


    <div class="row">
        <div class="col-md-12">

            <form action="#">
                <div class="form-group">
                    <label for="nome">ID</label>
                    <p class="form-control-static">{{$usuario->id}}</p>
                </div>
                <div class="form-group">
                     <label for="login">LOGIN</label>
                     <p class="form-control-static">{{$usuario->login}}</p>
                </div>
                    <div class="form-group">
                     <label for="senha">SENHA</label>
                     <p class="form-control-static">{{$usuario->senha}}</p>
                </div>
                    <div class="form-group">
                     <label for="nome">NOME</label>
                     <p class="form-control-static">{{$usuario->nome}}</p>
                </div>
            </form>



            <a class="btn btn-default" href="{{ action('Admin\UsuarioController@index') }}">Back</a>
            <a class="btn btn-warning" href="{{ action('Admin\UsuarioController@edit', $usuario->id) }}">Edit</a>
            <form action="{{ action('Admin\UsuarioController@destroy', $usuario->id) }}" method="POST" style="display: inline;" onsubmit="if(confirm('Delete? Are you sure?')) { return true } else {return false };"><input type="hidden" name="_method" value="DELETE"><input type="hidden" name="_token" value="{{ csrf_token() }}"><button class="btn btn-danger" type="submit">Delete</button></form>
        </div>
    </div>


@endsection