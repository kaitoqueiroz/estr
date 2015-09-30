@extends('layout.admin')

@section('content')
    <div class="page-header">
        <h1>Usuarios / Create </h1>
    </div>

    {!! \App\Libs\ErrorDisplay::getInstance()->displayAll($errors) !!}

    <div class="row">
        <div class="col-md-12">

            <form action="{{ action('Admin\UsuarioController@store') }}" method="POST">
                <input type="hidden" name="_token" value="{{ csrf_token() }}">

                <div class="form-group">
                     <label for="login">LOGIN</label>
                     <input type="text" name="login" class="form-control" value="{{  Session::getOldInput('login') }}"/>
                     {!! \App\Libs\ErrorDisplay::getInstance()->displayIndividual($errors, "login") !!}
                </div>
                    <div class="form-group">
                     <label for="senha">SENHA</label>
                     <input type="text" name="senha" class="form-control" value="{{  Session::getOldInput('senha') }}"/>
                     {!! \App\Libs\ErrorDisplay::getInstance()->displayIndividual($errors, "senha") !!}
                </div>
                    <div class="form-group">
                     <label for="nome">NOME</label>
                     <input type="text" name="nome" class="form-control" value="{{  Session::getOldInput('nome') }}"/>
                     {!! \App\Libs\ErrorDisplay::getInstance()->displayIndividual($errors, "nome") !!}
                </div>



            <a class="btn btn-default" href="{{ action('Admin\UsuarioController@index') }}">Back</a>
            <button class="btn btn-primary" type="submit" >Create</a>
            </form>
        </div>
    </div>


@endsection