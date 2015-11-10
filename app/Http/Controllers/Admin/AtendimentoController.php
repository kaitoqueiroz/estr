<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\AtendimentoRequest;
use App\Http\Controllers\Controller;

use DB;
use App\Atendimento;
use Illuminate\Http\Request;

class AtendimentoController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$atendimentos = Atendimento::all();

		return view('admin.atendimentos.index', compact('atendimentos'));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		return view('admin.atendimentos.create');
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return Response
	 */
	public function store(AtendimentoRequest $request)
	{
		$atendimento = new Atendimento();

		$atendimento->produto_id = $request->input("produto_id");
        $atendimento->produto_id = $request->input("produto_id");
        $atendimento->outro_dia = $request->input("outro_dia");
        $atendimento->motivo = $request->input("motivo");

		$atendimento->save();

		return redirect()->action('Admin\AtendimentoController@index')->with('message', 'Item created successfully.');
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$atendimento = Atendimento::findOrFail($id);

		return view('admin.atendimentos.show', compact('atendimento'));
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		$atendimento = Atendimento::findOrFail($id);

		return view('admin.atendimentos.edit', compact('atendimento'));
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @param Request $request
	 * @return Response
	 */
	public function update(AtendimentoRequest $request, $id)
	{
		$atendimento = Atendimento::findOrFail($id);

		$atendimento->produto_id = $request->input("produto_id");
        $atendimento->produto_id = $request->input("produto_id");
        $atendimento->outro_dia = $request->input("outro_dia");
        $atendimento->motivo = $request->input("motivo");

		$atendimento->save();

		return redirect()->action('Admin\AtendimentoController@index')->with('message', 'Item updated successfully.');
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$atendimento = Atendimento::findOrFail($id);
		$atendimento->delete();

		return redirect()->action('Admin\AtendimentoController@index')->with('message', 'Item deleted successfully.');
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function atendimentos(Request $request)
	{
		$list = array();
		$take = $request->input('itensPorPagina');
        $de = $request->input('de');
        $ate = $request->input('ate');
        $vendedor_id = $request->input('vendedor_id');
        $pagina = $request->input('pagina');
        $orderBy = $request->input('orderBy');
        $orderByField = $request->input('orderByField');
        $skip = $take*$pagina;
        $qb = DB::table('atendimento')
            ->join('vendedor', 'vendedor.id', '=', 'atendimento.vendedor_id')
            ->join('produto', 'produto.id', '=', 'atendimento.produto_id');
        $filial = "";
        if(isset($_COOKIE['filial'])){
            $filial = $_COOKIE['filial'];
        }
        if($vendedor_id){
            $qb = $qb->where('atendimento.vendedor_id', '=', $vendedor_id);
        }
        if($filial){
            $qb = $qb->where("vendedor.filial_id","=",$filial);
        }
        if($de && $ate){
            $qb = $qb->whereBetween('atendimento.created_at', array($de, $ate));
        }
        $qb2 = $qb;
		$list["total"] = $qb->select(
			'atendimento.motivo',
			DB::raw('count(atendimento.motivo) as quantidade')
		)->groupBy('atendimento.motivo')->get();
		if($take){
			$qb = $qb->take($take);
		}
		if($skip){
			$qb = $qb->skip($skip);
		}
		if($orderByField && $orderBy){
			$qb = $qb->orderBy($orderByField, $orderBy);
		}
		$list["dados"] = $qb->select('atendimento.*', 'vendedor.nome as nome_vendedor', 'produto.descricao as nome_produto')->get();
		

		return response()->json($list);
	}

}
