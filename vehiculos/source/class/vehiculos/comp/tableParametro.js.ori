qx.Class.define("vehiculos.comp.tableParametro",
{
	extend : componente.comp.ui.ramon.table.Table,
	construct : function (tableModel, tabla)
	{

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	this.base(arguments, tableModel, custom);
		

	var tbl = this;
	var numberformatMontoEs2 = new qx.util.format.NumberFormat("es").set({groupingUsed: true});
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();
	
	var commandAgregar = new qx.ui.command.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		var p = {};
		p.tabla = tabla;
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		rpc.callAsync(function(resultado, error, id) {
			if (error == null) {
				var row = qx.lang.Json.parse('{"id_' + tabla + '": ' + resultado + ', "descrip": "Nuevo (' + resultado + ')"}');
	
				tableModel.addRowsAsMapArray([row], null, true);
				tbl.setFocusedCell(0, tableModel.getRowCount() - 1, true);
				tbl.startEditing();
			} else {
				if (error.message = "duplicado") {

				}
			}
		}, "agregar_parametro", p);
	});
	var commandEditar = new qx.ui.command.Command("F2");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		tbl.startEditing();
	});
	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnAgregar = new qx.ui.menu.Button("Agregar...", null, commandAgregar);
	var btnEditar = new qx.ui.menu.Button("Editar", null, commandEditar);
	menu.add(btnAgregar);
	menu.addSeparator();
	menu.add(btnEditar);
	menu.memorizar();
	
	
	
	tbl.setShowCellFocusIndicator(true);
	tbl.toggleColumnVisibilityButtonVisible();
	//tbl.toggleStatusBarVisible();
	tbl.setContextMenu(menu);
	
	var tableColumnModel = tbl.getTableColumnModel();
	
	var selectionModel = tbl.getSelectionModel();
	selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModel.addListener("changeSelection", function(){
		var selectionEmpty = selectionModel.isSelectionEmpty();
		commandEditar.setEnabled(! selectionEmpty);
		menu.memorizar([commandEditar]);
		sharedErrorTooltip.hide();
	});
	
	
	tbl.addListener("dataEdited", function(e){
		var data = e.getData();
		data.value = data.value.trim();
		
		var rowData = tableModel.getRowDataAsMap(data.row);
		rowData.descrip = data.value;
		
		if (data.value == "") {
			rowData.descrip = data.oldValue;
			tableModel.setRowsAsMapArray([rowData], data.row, true);
		} else {
			var p = {};
			p.tabla = tabla;
			p.model = rowData;
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
			rpc.callAsync(function(resultado, error, id) {
				if (error == null) {
					tableModel.setRowsAsMapArray([rowData], data.row, true);
				} else {
					if (error.message = "duplicado") {
						rowData.descrip = data.oldValue;
						tableModel.setRowsAsMapArray([rowData], data.row, true);
						
						sharedErrorTooltip.setLabel("Descripción duplicada");
						sharedErrorTooltip.placeToWidget(tbl);
						sharedErrorTooltip.show();
					}
				}
			}, "editar_parametro", p);
		}
	});
	
	
	
	tableModel.addListener("dataChanged", function(e){
		var rowCount = tableModel.getRowCount();
		if (rowCount > 0) tbl.setAdditionalStatusBarText(numberformatMontoEs2.format(rowCount) + " item/s"); else tbl.setAdditionalStatusBarText(" ");
	});
	
	
	
	var p = {};
	p.tabla = tabla;
	
	var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
	rpc.callAsync(function(resultado, error, id) {
		tableModel.setDataAsMapArray(resultado, true);
		if (resultado.length > 0) tbl.setFocusedCell(0, 0, true);
	}, "leer_parametro", p);
	
	
	},

	members :
	{

	}
});