qx.Class.define("vehiculos.comp.windowTipoVehiculo",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
		this.base(arguments);

		this.set({
			caption: "Tipo de vehículo",
			width: 400,
			height: 400,
			showMinimize: false,
			showMaximize: false
		});
		this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		tbl.focus();
	});
	
	var application = qx.core.Init.getApplication();
		
		
		

	var commandAgregar = new qx.ui.command.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		btnAceptar.setEnabled(true);
		tableModel.addRowsAsMapArray([{id_tipo_vehiculo: "0", descrip: "Nuevo tipo vehiculo", alta: true, modificado: false, eliminado: false}], null, true);
		tbl.setFocusedCell(0, tableModel.getRowCount() - 1, true);
		tbl.startEditing();
	});
	var commandEditar = new qx.ui.command.Command("F2");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		tbl.startEditing();
	});
	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnAgregar = new qx.ui.menu.Button("Agregar tipo", null, commandAgregar);
	var btnCambiar = new qx.ui.menu.Button("Editar", null, commandEditar);
	menu.add(btnAgregar);
	menu.addSeparator();
	menu.add(btnCambiar);
	menu.memorizar();

		
		
		
		//Tabla

		var tableModel = new qx.ui.table.model.Filtered();
		tableModel.setColumns(["Descripción"], ["descrip"]);
		tableModel.setEditable(true);
		tableModel.setColumnSortable(0, false);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		
		var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
		tbl.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		tbl.setShowCellFocusIndicator(true);
		tbl.toggleColumnVisibilityButtonVisible();
		tbl.toggleStatusBarVisible();
		
		var tableColumnModel = tbl.getTableColumnModel();
		var resizeBehavior = tableColumnModel.getBehavior();
		//resizeBehavior.set(0, {width:"60%", minWidth:100});
		//resizeBehavior.set(1, {width:"20%", minWidth:100});
		//resizeBehavior.set(2, {width:"20%", minWidth:100});
		tableColumnModel.getCellEditorFactory(0).setValidationFunction(function(newValue, oldValue){
			newValue = newValue.trim();
			if (newValue=="" || newValue.indexOf("*") > -1) return oldValue; else return newValue;
		});
		
		var selectionModel = tbl.getSelectionModel();
		selectionModel.addListener("changeSelection", function(){
			var aux = (selectionModel.getSelectedCount() > 0);
			commandEditar.setEnabled(aux);
			menu.memorizar([commandEditar]);
		});
		
		
		
		
		

		tbl.setContextMenu(menu);

		
		
		this.add(tbl, {left: 0, top: 0, right: 0, bottom: 35});
		
		tbl.addListener("dataEdited", function(e){
			var focusedRow = tbl.getFocusedRow();
            var original = tableModel.getRowData(focusedRow);

			var actual = tableModel.getRowDataAsMap(focusedRow);
			original.descrip = actual.descrip;
			original.modificado = true;
			tableModel.setRowsAsMapArray([original], focusedRow, true);
			btnAceptar.setEnabled(true);
		}, this);
		
		
		
		
		

		var commandEscape = new qx.ui.command.Command("Escape");
		this.registrarCommand(commandEscape);
		commandEscape.setEnabled(false);
		commandEscape.addListener("execute", function(e){
			if (!tbl.isEditing()) btnCancelar.fireEvent("execute");
		});
		
		var btnAceptar = new qx.ui.form.Button("Aceptar");
		btnAceptar.setEnabled(false);
		btnAceptar.addListener("execute", function(e){
			var rowData;
			var valueById;
			var enviar = true;
			var cambios = {altas: [], modificados: []};
			
			btnAceptar.setEnabled(false);
			
			for (var i=0; i < tableModel.getRowCount(); i++) {
				rowData = tableModel.getRowData(i);
				if (rowData.alta) {
					cambios.altas.push(rowData);
				} else if (rowData.modificado) {
					cambios.modificados.push(rowData);
				}
				for (var x=0; x < tableModel.getRowCount(); x++) {
					valueById = tableModel.getValueById("descrip", x);
					if (x != i && rowData.descrip.toUpperCase()==valueById.toUpperCase()) {
						tbl.setFocusedCell(0, x, true);
						dialog.Dialog.alert("La descripción '" + valueById + "' está duplicada. Alguno de los items con esa descripción debe ser modificado para poder guardar normalmente.", function(){tbl.focus();});
						enviar = false;
						break;
					}
				}
				if (! enviar) break;
			}
			if (enviar) {
				var p = {};
				p.cambios = cambios;
				var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Parametros");
				try {
					var resultado = rpc.callSync("escribir_tipo_vehiculo", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
				
				if (resultado!=null) {
					dialog.Dialog.alert("Se encontraron colores duplicados en tabla. Se descartan modificaciones.", function(){tbl.focus();});
				}
				
				application.objColor.store.reload();
				btnCancelar.fireEvent("execute");
			}
			
			btnAceptar.setEnabled(true);
		}, this);

		var btnCancelar = new qx.ui.form.Button("Cancelar");
		btnCancelar.addListener("execute", function(e){
			this.destroy();
		}, this);
		
		this.add(btnAceptar, {left: 90, bottom: 0});
		this.add(btnCancelar, {right: 90, bottom: 0});
		

		
		
		var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
		try {
			var resultado = rpc.callSync("autocompletarTipo_vehiculo", {texto: ""});
		} catch (ex) {
			alert("Sync exception: " + ex);
		}
		
		tableModel.setDataAsMapArray(resultado, true);
		if (tableModel.getRowCount() > 0) tbl.setFocusedCell(0, 0, true);
	
		
		
	},
	members : 
	{

	}
});