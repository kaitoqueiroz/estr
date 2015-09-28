<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\SyncRequest;
use App\Http\Controllers\Controller;

use DB;
use App\Sync;
use Illuminate\Http\Request;

class SyncController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$sync = Sync::all();

		return view('admin.sync.index', compact('sync'));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		return view('admin.sync.create');
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return Response
	 */
	public function store(SyncRequest $request)
	{
		$sync = new Sync();

		$sync->data = $request->input("data");
        $sync->vendedor_id = $request->input("vendedor_id");
        $sync->vendedor_id = $request->input("vendedor_id");

		$sync->save();

		return redirect()->action('Admin\SyncController@index')->with('message', 'Item created successfully.');
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$sync = Sync::findOrFail($id);

		return view('admin.sync.show', compact('sync'));
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		$sync = Sync::findOrFail($id);

		return view('admin.sync.edit', compact('sync'));
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @param Request $request
	 * @return Response
	 */
	public function update(SyncRequest $request, $id)
	{
		$sync = Sync::findOrFail($id);

		$sync->data = $request->input("data");
        $sync->vendedor_id = $request->input("vendedor_id");
        $sync->vendedor_id = $request->input("vendedor_id");

		$sync->save();

		return redirect()->action('Admin\SyncController@index')->with('message', 'Item updated successfully.');
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$sync = Sync::findOrFail($id);
		$sync->delete();

		return redirect()->action('Admin\SyncController@index')->with('message', 'Item deleted successfully.');
	}
	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function login(Request $request)
	{
		$login = $request->input("login");
		$senha = $request->input("senha");

		$loginOK = DB::table('vendedor')
					->where("login","=",$login)
					->where("senha","=", $senha)->get();

		if(count($loginOK) > 0){
			$dados = array("result"=>"OK","usuario"=>$loginOK[0]->id);
		}else{
			$dados = array("result"=>"ERROR");			
		}
		return response()->json($dados);
	}
	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function sincronizar(Request $request, $id)
	{
		$dados_sync = $request->input("dados_sync");

		if(count($dados_sync)>0){
			foreach ($dados_sync["mensagensvendedor"] as $key => $mensagemvendedor) {
				$exitenteMV = DB::table('mensagemvendedor')
					->where("vendedor_id","=",$id)
					->where("mensagem_id","=", $mensagemvendedor["mensagem_id"])->get();
				if(count($exitenteMV)==0){
					DB::table('mensagemvendedor')->insertGetId(
					    ['vendedor_id' => $mensagemvendedor["vendedor_id"], 'mensagem_id' => $mensagemvendedor["mensagem_id"],'created_at' => date("Y-m-d H:i:s")]
					);
				}
			}
			foreach ($dados_sync["vendas"] as $key => $venda) {
				$exitenteVenda = DB::table('venda')->where("cod_venda","=",$venda["cod_venda"])->get();
				if(count($exitenteVenda)==0){
					$venda_id = DB::table('venda')->insertGetId(
					    ['vendedor_id' => $venda["vendedor_id"], 'data' => $venda["data"],'cod_venda' => $venda["cod_venda"], 'created_at' => date("Y-m-d H:i:s") ]
					);

					foreach ($dados_sync["produtosvenda"] as $key => $produtovenda) {
						DB::table('produtovenda')->insert(
						    ['quantidade' => $produtovenda["quantidade"], 'produto_id' => $produtovenda["produto_id"], 'venda_id' => $venda_id, 'created_at' => date("Y-m-d H:i:s"), 'created_at' => date("Y-m-d H:i:s")]
						);
					}
				}
			}

		}
		$dados = array();
		$dados["mensagens"] = DB::table('mensagem')->where("vendedor_id","=",$id)->get();
		$mensagens = array();
		foreach ($dados["mensagens"] as $key => $mensagem) {
			$mensagem->mensagens_vendedor = DB::table('mensagemvendedor')->where("mensagem_id","=",$mensagem->id)->get();
			$mensagens[] = $mensagem;
		}
		$dados["mensagens"] = $mensagens;


		$dados["produtos"] = DB::table('produto')->get();
		$dados["vendedor"] = DB::table('vendedor')->where("id","=",$id)->get();
		
		$dados["metas"] = DB::table('meta')->where("vendedor_id","=",$id)->get();
		$metas = array();
		foreach ($dados["metas"] as $key => $meta) {
			$meta->produtos_meta = DB::table('produtometa')->where("meta_id","=",$meta->id)->get();
			$metas[] = $meta;
		}
		$dados["metas"] = $metas;

		$dados["vendas"] = DB::table('venda')->where("vendedor_id","=",$id)->get();
		$vendas = array();
		foreach ($dados["vendas"] as $key => $venda) {
			$venda->produtos_venda = DB::table('produtovenda')->where("venda_id","=",$venda->id)->get();
			$vendas[] = $venda;
		}
		$dados["vendas"] = $vendas;

		DB::table('sync')->insert(
		    ['vendedor_id' => $id, 'created_at' => date("Y-m-d H:i:s")]
		);

		return response()->json($dados);
	}

}
