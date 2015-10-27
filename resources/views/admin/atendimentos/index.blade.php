@extends('layout.admin')

@section('content')
    <div class="page-header">
        <h1>Atendimentos</h1>
    </div>


    <div class="row">
        <div class="col-md-12">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>PRODUTO_ID</th>
                        <th>PRODUTO_ID</th>
                        <th>OUTRO_DIA</th>
                        <th>MOTIVO</th>
                        <th class="text-right">OPTIONS</th>
                    </tr>
                </thead>

                <tbody>

                @foreach($atendimentos as $atendimento)
                <tr>
                    <td>{{$atendimento->id}}</td>
                    <td>{{$atendimento->produto_id}}</td>
                    <td>{{$atendimento->produto_id}}</td>
                    <td>{{$atendimento->outro_dia}}</td>
                    <td>{{$atendimento->motivo}}</td>

                    <td class="text-right">
                        <a class="btn btn-primary" href="{{ action('Admin\AtendimentoController@show', $atendimento->id) }}">View</a>
                        <a class="btn btn-warning " href="{{ action('Admin\AtendimentoController@edit', $atendimento->id) }}">Edit</a>
                        <form action="{{ action('Admin\AtendimentoController@destroy', $atendimento->id) }}" method="POST" style="display: inline;" onsubmit="if(confirm('Delete? Are you sure?')) { return true } else {return false };"><input type="hidden" name="_method" value="DELETE"><input type="hidden" name="_token" value="{{ csrf_token() }}"> <button class="btn btn-danger" type="submit">Delete</button></form>
                    </td>
                </tr>

                @endforeach

                </tbody>
            </table>

            <a class="btn btn-success" href="{{ action('Admin\AtendimentoController@create') }}">Create</a>
        </div>
    </div>


@endsection