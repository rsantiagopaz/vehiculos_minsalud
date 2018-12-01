qx.Class.define("vehiculos.comp.windowParque",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (id_entsal)
	{
	this.base(arguments);
	
	this.set({
		caption: "Parque",
		width: 500,
		height: 300,
		showMinimize: false,
		showMaximize: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());
	this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		txtDescrip.focus();
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	var numberformatMontoEs2 = new qx.util.format.NumberFormat("es").set({groupingUsed: true});
	
	
	var functionActualizarTaller = function(id_parque) {
		var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Parametros");
		rpc.addListener("completed", function(e){
			var data = e.getData();

			tableModelTaller.setDataAsMapArray(data.result, true);
			
			if (id_parque != null) tblTaller.buscar("id_parque", id_parque);
		}, this);
		rpc.callAsyncListeners(true, "leer_parque");
		
		
		
	};
	
	
	
	var formInfoVehiculo = new qx.ui.form.Form();
	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setRequired(true);
	txtDescrip.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	formInfoVehiculo.add(txtDescrip, "Descripción", null, "descrip", null, {tabIndex: 1, item: {row: 1, column: 1, colSpan: 8}});

	
	var cboDependencia = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Vehiculo", methodName: "autocompletarDependencia"});
	cboDependencia.setRequired(true);
	formInfoVehiculo.add(cboDependencia, "Dependencia", function(value) {
		if (lstDependencia.isSelectionEmpty()) throw new qx.core.ValidationError("Validation Error", "Debe seleccionar dependencia");
	}, "cboDependencia", null, {tabIndex: 2, item: {row: 2, column: 1, colSpan: 13}});
	var lstDependencia = cboDependencia.getChildControl("list");
	formInfoVehiculo.add(lstDependencia, "", null, "organismo_area_id");
	
	var btnAgregar = new qx.ui.form.Button("Agregar");
	btnAgregar.addListener("execute", function(e){
		if (formInfoVehiculo.validate()) {
			var p = {};
			p = qx.util.Serializer.toNativeObject(controllerFormInfoVehiculo.getModel());
			
			var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Parametros");
			rpc.addListener("completed", function(e){
				var data = e.getData();
	
				txtDescrip.setValue("");
				cboDependencia.setValue("");
				lstDependencia.removeAll();
				txtDescrip.focus();
				
				functionActualizarTaller(data.result);
			}, this);
			rpc.callAsyncListeners(true, "agregar_parque", p);
			
		} else {
			formInfoVehiculo.getValidationManager().getInvalidFormItems()[0].focus();
		}
	});
	formInfoVehiculo.addButton(btnAgregar, {tabIndex: 3, item: {row: 3, column: 1, colSpan: 4}});
	//formInfoVehiculo.addButton(btnAgregar);

	

	var controllerFormInfoVehiculo = new qx.data.controller.Form(null, formInfoVehiculo);
	controllerFormInfoVehiculo.createModel(true);
	
	var formViewVehiculo = new componente.comp.ui.ramon.abstractrenderer.Grid(formInfoVehiculo, 30, 30);
	//var formViewVehiculo = new qx.ui.form.renderer.Single(formInfoVehiculo);
	this.add(formViewVehiculo, {left: 0, top: 0});
	
	
	
	
	//Tabla

	var tableModelTaller = new qx.ui.table.model.Simple();
	tableModelTaller.setColumns(["Descripción", "Dependencia"], ["descrip", "dependencia"]);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblTaller = new componente.comp.ui.ramon.table.Table(tableModelTaller, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblTaller.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	tblTaller.setShowCellFocusIndicator(false);
	tblTaller.toggleColumnVisibilityButtonVisible();
	//tblTaller.toggleStatusBarVisible();
	
	var tableColumnModelTaller = tblTaller.getTableColumnModel();
	
	tableModelTaller.addListener("dataChanged", function(e){
		var rowCount = tableModelTaller.getRowCount();
		if (rowCount > 0) tblTaller.setAdditionalStatusBarText(numberformatMontoEs2.format(rowCount) + " item/s"); else tblTaller.setAdditionalStatusBarText(" ");
	});
	
	this.add(tblTaller, {left: 0, top: 100, right: 0, bottom: 0});
	
	tblTaller.setTabIndex(4);
	
	functionActualizarTaller();
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});