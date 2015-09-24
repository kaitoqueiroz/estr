<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\MensagemVendedorRequest;
use App\Http\Controllers\Controller;

use App\MensagemVendedor;
use Illuminate\Http\Request;

class MensagemVendedorController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$mensagemvendedor = MensagemVendedor::all();

		return view('admin.mensagemvendedor.index', compact('mensagemvendedor'));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		return view('admin.mensagemvendedor.create');
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return Response
	 */
	public function store(MensagemVendedorRequest $request)
	{
		$mensagemvendedor = new MensagemVendedor();

		$mensagemvendedor->mensagem_id = $request->input("mensagem_id");
        $mensagemvendedor->mensagem_id = $request->input("mensagem_id");
        $mensagemvendedor->vendedor_id = $request->input("vendedor_id");
        $mensagemvendedor->vendedor_id = $request->input("vendedor_id");

		$mensagemvendedor->save();

		return redirect()->action('Admin\MensagemVendedorController@index')->with('message', 'Item created successfully.');
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$mensagemvendedor = MensagemVendedor::findOrFail($id);

		return view('admin.mensagemvendedor.show', compact('mensagemvendedor'));
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		$mensagemvendedor = MensagemVendedor::findOrFail($id);

		return view('admin.mensagemvendedor.edit', compact('mensagemvendedor'));
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @param Request $request
	 * @return Response
	 */
	public function update(MensagemVendedorRequest $request, $id)
	{
		$mensagemvendedor = MensagemVendedor::findOrFail($id);

		$mensagemvendedor->mensagem_id = $request->input("mensagem_id");
        $mensagemvendedor->mensagem_id = $request->input("mensagem_id");
        $mensagemvendedor->vendedor_id = $request->input("vendedor_id");
        $mensagemvendedor->vendedor_id = $request->input("vendedor_id");

		$mensagemvendedor->save();

		return redirect()->action('Admin\MensagemVendedorController@index')->with('message', 'Item updated successfully.');
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$mensagemvendedor = MensagemVendedor::findOrFail($id);
		$mensagemvendedor->delete();

		return redirect()->action('Admin\MensagemVendedorController@index')->with('message', 'Item deleted successfully.');
	}

}
