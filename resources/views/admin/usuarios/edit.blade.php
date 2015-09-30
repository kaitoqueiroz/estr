@extends('layout.admin')

@section('content')
    <div class="page-header">
        <h1>Usuarios / Edit </h1>
    </div>

    {!! \App\Libs\ErrorDisplay::getInstance()->displayAll($errors) !!}

    <div class="row">
        <div class="col-md-12">

            <form action="{{ action('Admin\UsuarioController@update', $usuario->id) }}" method="POST">
                <input type="hidden" name="_method" value="PUT">
                <input type="hidden" name="_token" value="{{ csrf_token() }}">

                <div class="form-group">
                    <label for="nome">ID</label>
                    <p class="form-control-static">{{$usuario->id}}</p>
                </div>
                <div class="form-group">
                     <label for="login">LOGIN</label>
                     <input type="text" name="login" class="form-control" value="{{ \App\Libs\ValueHelper::getOldInput($usuario,'login') }}"/>
                     {!! \App\Libs\ErrorDisplay::getInstance()->displayIndividual($errors, "login") !!}
                </div>
                    <div class="form-group">
                     <label for="senha">SENHA</label>
                     <input type="text" name="senha" class="form-control" value="{{ \App\Libs\ValueHelper::getOldInput($usuario,'senha') }}"/>
                     {!! \App\Libs\ErrorDisplay::getInstance()->displayIndividual($errors, "senha") !!}
                </div>
                    <div class="form-group">
                     <label for="nome">NOME</label>
                     <input type="text" name="nome" class="form-control" value="{{ \App\Libs\ValueHelper::getOldInput($usuario,'nome') }}"/>
                     {!! \App\Libs\ErrorDisplay::getInstance()->displayIndividual($errors, "nome") !!}
                </div>



            <a class="btn btn-default" href="{{ action('Admin\UsuarioController@index') }}">Back</a>
            <button class="btn btn-primary" type="submit" >Save</a>
            </form>
        </div>
    </div>


@endsection