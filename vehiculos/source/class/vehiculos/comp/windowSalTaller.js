qx.Class.define("vehiculos.comp.windowSalTaller",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (vehiculo, rowDataMovimiento)
	{
	this.base(arguments);
	
	this.set({
		caption: "Salida de taller",
		width: 700,
		height: 500,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		var timer = qx.util.TimerManager.getInstance();
		timer.start(function() {
			this.setCaption("Salida de taller, " + vehiculo.nro_patente + "  " + vehiculo.marca);
			txtKilo.focus();
		}, null, this, null, 50);
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();

	
	
	var txtKilo = new componente.comp.ui.ramon.spinner.Spinner(0, 0, 10000000);
	txtKilo.setRequired(true);
	txtKilo.setWidth(80);
	txtKilo.setNumberFormat(application.numberformatEntero);
	txtKilo.getChildControl("upbutton").setVisibility("excluded");
	txtKilo.getChildControl("downbutton").setVisibility("excluded");
	txtKilo.setSingleStep(0);
	txtKilo.setPageStep(0);
	txtKilo.addListener("focus", function(e){
		this.getChildControl("textfield").selectAllText();
	});
	
	this.add(txtKilo, {left: 65, top: 25});
	this.add(new qx.ui.basic.Label("Kilometraje:"), {left: 0, top: 28});
	
	
	var gbx = new qx.ui.groupbox.GroupBox(" Reparación ")
	gbx.setLayout(new qx.ui.layout.Basic());
	this.add(gbx, {top: 0, right: 30});
	
	var form = new qx.ui.form.Form();
	
	var cboReparacion = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarTipoReparacion"});
	cboReparacion.setRequired(true);
	cboReparacion.setMinWidth(300);
	var lstReparacion = cboReparacion.getChildControl("list");
	lstReparacion.addListener("changeSelection", function(e){

	});
	form.add(cboReparacion, "Tipo reparación", function(value) {
		if (lstReparacion.isSelectionEmpty()) throw new qx.core.ValidationError("Validation Error", "Debe seleccionar tipo reparación");
	}, "id_tipo_reparacion");
	
	var txtCosto = new componente.comp.ui.ramon.spinner.Spinner(0, 0, 1000000);
	txtCosto.setMaxWidth(80);
	txtCosto.setNumberFormat(application.numberformatMontoEn);
	txtCosto.getChildControl("upbutton").setVisibility("excluded");
	txtCosto.getChildControl("downbutton").setVisibility("excluded");
	txtCosto.setSingleStep(0);
	txtCosto.setPageStep(0);
	form.add(txtCosto, "Costo", null, "costo");
	
	var txtCantidad = new componente.comp.ui.ramon.spinner.Spinner(1, 1, 10000);
	txtCantidad.setMaxWidth(80);
	txtCantidad.setNumberFormat(application.numberformatEntero);
	txtCantidad.getChildControl("upbutton").setVisibility("excluded");
	txtCantidad.getChildControl("downbutton").setVisibility("excluded");
	txtCantidad.setSingleStep(0);
	txtCantidad.setPageStep(0);
	form.add(txtCantidad, "Cantidad", null, "cantidad");
	
	var txtObserva = new qx.ui.form.TextArea("");
	form.add(txtObserva, "Observaciones", null, "observa");
	
	var btnAgregar = new qx.ui.form.Button("Agregar");
	btnAgregar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.id_movimiento = rowDataMovimiento.id_movimiento;
			p.id_tipo_reparacion = lstReparacion.getModelSelection().getItem(0);
			p.reparacion = lstReparacion.getSelection()[0].getUserData("datos").label;
			p.costo = txtCosto.getValue();
			p.cantidad = txtCantidad.getValue();
			p.total = p.costo * p.cantidad;
			p.observa = txtObserva.getValue().trim();
			
			sharedErrorTooltip.hide();
			tblSal.setValid(true);
			tableModelSal.addRowsAsMapArray([p], null, true);
			tblSal.setFocusedCell(0, tableModelSal.getRowCount() - 1, true);
			
			var total = 0;
			for (var x = 0; x < tableModelSal.getRowCount(); x++) {
				total+= tableModelSal.getValueById("total", x);
			}
			tblSal.setAdditionalStatusBarText("Total: " + application.numberformatMontoEs.format(total));
			
			form.reset();
			lstReparacion.removeAll();
			
			cboReparacion.focus();
		} else {
			form.getValidationManager().getInvalidFormItems()[0].focus();
		}
	});
	form.addButton(btnAgregar);
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	//var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 12, 25, 10);
	var formView = new qx.ui.form.renderer.Single(form);
	gbx.add(formView);
	
	
	
	

	
	
	
	
	var commandEliminar = new qx.ui.command.Command("Del");
	commandEliminar.setEnabled(false);
	commandEliminar.addListener("execute", function(e){
		var focusedRow = tblSal.getFocusedRow();
		
		tblSal.blur();
		tableModelSal.removeRows(focusedRow, 1);
		
		var total = 0;
		for (var x = 0; x < tableModelSal.getRowCount(); x++) {
			total+= tableModelSal.getValueById("total", x);
		}
		tblSal.setAdditionalStatusBarText("Total: " + application.numberformatMontoEs.format(total));
		
		var rowCount = tableModelSal.getRowCount();
		focusedRow = (focusedRow > rowCount - 1) ? rowCount - 1 : focusedRow;
		tblSal.setFocusedCell(0, focusedRow, true);
		tblSal.focus();
	});
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnEliminar = new qx.ui.menu.Button("Eliminar", null, commandEliminar);
	menu.add(btnEliminar);
	menu.memorizar();
	
	
	
	
	//Tabla

	var tableModelSal = new qx.ui.table.model.Simple();
	tableModelSal.setColumns(["Reparación", "Costo", "Cantidad", "Total", "Obs."], ["reparacion", "costo", "cantidad", "total", "observa"]);
	tableModelSal.setColumnSortable(0, false);
	tableModelSal.setColumnSortable(1, false);
	tableModelSal.setColumnSortable(2, false);
	tableModelSal.setColumnSortable(3, false);
	tableModelSal.setColumnSortable(4, false);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblSal = new componente.comp.ui.ramon.table.Table(tableModelSal, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblSal.setShowCellFocusIndicator(false);
	tblSal.toggleColumnVisibilityButtonVisible();
	//tblSal.toggleStatusBarVisible();
	tblSal.setContextMenu(menu);
	tblSal.setAdditionalStatusBarText("Total: 0,00");
	
	var tableColumnModelSal = tblSal.getTableColumnModel();
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
	tableColumnModelSal.setDataCellRenderer(1, cellrendererNumber);
	tableColumnModelSal.setDataCellRenderer(3, cellrendererNumber);
	
	var resizeBehavior = tableColumnModelSal.getBehavior();
	resizeBehavior.set(0, {width:"53%", minWidth:100});
	resizeBehavior.set(1, {width:"13%", minWidth:100});
	resizeBehavior.set(2, {width:"13%", minWidth:100});
	resizeBehavior.set(3, {width:"13%", minWidth:100});
	resizeBehavior.set(4, {width:"8%", minWidth:100});
	
	var selectionModelSal = tblSal.getSelectionModel();
	selectionModelSal.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelSal.addListener("changeSelection", function(e){
		var selectionEmpty = selectionModelSal.isSelectionEmpty();
		commandEliminar.setEnabled(! selectionEmpty);
		menu.memorizar([commandEliminar]);
	});

	this.add(tblSal, {left: 0, top: 250, right: 0, bottom: 35});
	
	
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		//alert(qx.lang.Json.stringify(tableModelSal.getDataAsMapArray(), null, 2));

		if (tableModelSal.getRowCount() == 0) {
			tblSal.setValid(false);
			cboReparacion.focus();
			
			sharedErrorTooltip.setLabel("Debe agregar alguna reparación");
			sharedErrorTooltip.placeToWidget(tblSal);
			sharedErrorTooltip.show();
		} else {
			
			var p = {};
			p.id_movimiento = rowDataMovimiento.id_movimiento;
			p.kilo = txtKilo.getValue();
			p.model = tableModelSal.getDataAsMapArray();
			p.movimiento_estado = rowDataMovimiento.estado;
			
			var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
			rpc.addListener("completed", function(e){
				btnCancelar.execute();
				
				this.fireDataEvent("aceptado");
			}, this);
			rpc.addListener("failed", function(e){
				btnCancelar.execute();
				
				this.fireDataEvent("estado");
			}, this);
			rpc.callAsyncListeners(true, "salida_taller", p);
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.close();
		
		this.destroy();
	}, this);
	
	var btnDiferir = new qx.ui.form.Button("Diferir...");
	btnDiferir.addListener("execute", function(e){
		(new dialog.Confirm({
		        "message"   : "Desea diferir la carga de datos en salida de taller?",
		        "callback"  : function(e){
	        					if (e) {
									var p = {};
									p.id_movimiento = rowDataMovimiento.id_movimiento;
									p.movimiento_estado = rowDataMovimiento.estado;

									var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Vehiculo");
									rpc.addListener("completed", function(e){
										btnCancelar.execute();
										
										this.fireDataEvent("aceptado");
									}, this);
									rpc.addListener("failed", function(e){
										btnCancelar.execute();
										
										this.fireDataEvent("estado");
									}, this);
									rpc.callAsyncListeners(true, "diferir_salida_taller", p);
	        					}
		        				},
		        "context"   : this,
		        "image"     : "icon/48/status/dialog-warning.png"
		})).show();
	}, this);
	
	this.add(btnAceptar, {left: "35%", bottom: 0});
	this.add(btnCancelar, {right: "35%", bottom: 0});
	this.add(btnDiferir, {right: "5%", bottom: 0});
	
	
	txtKilo.setTabIndex(1);
	gbx.setTabIndex(2);
	cboReparacion.setTabIndex(3);
	txtCosto.setTabIndex(4);
	txtCantidad.setTabIndex(5);
	txtObserva.setTabIndex(6);
	btnAgregar.setTabIndex(7);
	tblSal.setTabIndex(8);
	btnAceptar.setTabIndex(9);
	btnCancelar.setTabIndex(10);
	btnDiferir.setTabIndex(11);
	
	
	
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event",
		"estado": "qx.event.type.Event"
	}
});