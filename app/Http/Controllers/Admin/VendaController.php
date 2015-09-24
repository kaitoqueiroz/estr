<?php namespace App\Http\Controllers\Admin;

use App\Http\Requests\VendaRequest;
use App\Http\Controllers\Controller;

use App\Venda;
use Illuminate\Http\Request;

class VendaController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$venda = Venda::all();

		return view('admin.venda.index', compact('venda'));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		return view('admin.venda.create');
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return Response
	 */
	public function store(VendaRequest $request)
	{
		$venda = new Venda();

		$venda->vendedor_id = $request->input("vendedor_id");
        $venda->vendedor_id = $request->input("vendedor_id");
        $venda->data = $request->input("data");

		$venda->save();

		return redirect()->action('Admin\VendaController@index')->with('message', 'Item created successfully.');
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$venda = Venda::findOrFail($id);

		return view('admin.venda.show', compact('venda'));
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		$venda = Venda::findOrFail($id);

		return view('admin.venda.edit', compact('venda'));
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @param Request $request
	 * @return Response
	 */
	public function update(VendaRequest $request, $id)
	{
		$venda = Venda::findOrFail($id);

		$venda->vendedor_id = $request->input("vendedor_id");
        $venda->vendedor_id = $request->input("vendedor_id");
        $venda->data = $request->input("data");

		$venda->save();

		return redirect()->action('Admin\VendaController@index')->with('message', 'Item updated successfully.');
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$venda = Venda::findOrFail($id);
		$venda->delete();

		return redirect()->action('Admin\VendaController@index')->with('message', 'Item deleted successfully.');
	}

}
