@extends('layout.admin')

@section('content')
    <div class="page-header">
        <h1>Usuarios</h1>
    </div>


    <div class="row">
        <div class="col-md-12">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>LOGIN</th>
                        <th>SENHA</th>
                        <th>NOME</th>
                        <th class="text-right">OPTIONS</th>
                    </tr>
                </thead>

                <tbody>

                @foreach($usuarios as $usuario)
                <tr>
                    <td>{{$usuario->id}}</td>
                    <td>{{$usuario->login}}</td>
                    <td>{{$usuario->senha}}</td>
                    <td>{{$usuario->nome}}</td>

                    <td class="text-right">
                        <a class="btn btn-primary" href="{{ action('Admin\UsuarioController@show', $usuario->id) }}">View</a>
                        <a class="btn btn-warning " href="{{ action('Admin\UsuarioController@edit', $usuario->id) }}">Edit</a>
                        <form action="{{ action('Admin\UsuarioController@destroy', $usuario->id) }}" method="POST" style="display: inline;" onsubmit="if(confirm('Delete? Are you sure?')) { return true } else {return false };"><input type="hidden" name="_method" value="DELETE"><input type="hidden" name="_token" value="{{ csrf_token() }}"> <button class="btn btn-danger" type="submit">Delete</button></form>
                    </td>
                </tr>

                @endforeach

                </tbody>
            </table>

            <a class="btn btn-success" href="{{ action('Admin\UsuarioController@create') }}">Create</a>
        </div>
    </div>


@endsection