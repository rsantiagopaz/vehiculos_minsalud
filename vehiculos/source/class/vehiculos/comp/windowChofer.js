qx.Class.define("vehiculos.comp.windowChofer",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Nuevo chofer",
		width: 440,
		height: 570,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		lstChofer.fireDataEvent("changeSelection", []);
		cboChofer.focus();
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	
	var cboChofer = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Chofer", methodName: "autocompletarChoferCompleto"});
	cboChofer.setWidth(250);
	var lstChofer = cboChofer.getChildControl("list");
	lstChofer.addListener("changeSelection", function(e){
		var datos, modelForm;
		
		txtDni.setValid(true);
		txtApenom.setValid(true);
		
		if (lstChofer.isSelectionEmpty()) {
			this.setCaption("Nuevo chofer");
			
			datos = {id_chofer: "0", dni: "", apenom: "", email: "", observa: "", telefono: "", cboDependencia: "", organismo_area_id: null, licencia_oficial: "S", id_tipo: "1", id_categoria: "1", f_emision: null, f_vencimiento: null};
			
			cboDependencia.removeAll();
			cboDependencia.setValue("");
		} else {
			this.setCaption("Modificar chofer");
			datos = lstChofer.getSelection()[0].getUserData("datos");
			datos.chofer.cboDependencia = "";
			
			if (datos.cboDependencia == null) {
				cboDependencia.removeAll();
				cboDependencia.setValue("");
			} else {
				cboDependencia.add(new qx.ui.form.ListItem(datos.cboDependencia.label, null, datos.cboDependencia.model));
			}
			
			datos = datos.chofer;
		}
		
		modelForm = qx.data.marshal.Json.createModel(datos, true);
		controllerForm.setModel(modelForm);
	}, this);
	
	this.add(new qx.ui.basic.Label("Buscar:"), {left: 0, top: 3});
	this.add(cboChofer, {left: 84, top: 0});
	cboChofer.setTabIndex(1);
	
	var lblLinea = new qx.ui.basic.Label("<hr>");
	lblLinea.setRich(true);
	lblLinea.setWidth(500);
	this.add(lblLinea, {left: 0, top: 22, right: 0});
	
	
	
	
	
	
	var form = new qx.ui.form.Form();
	
	form.addGroupHeader("Chofer", {item: {row: 0, column: 0, colSpan: 5}});
	
	var txtDni = new qx.ui.form.TextField("");
	txtDni.setRequired(true);
	txtDni.addListener("blur", function(e){
		var value = this.getValue().trim();
		
		if (value != "") {
			if (isNaN(value) || parseInt(value) == 0) value = "";
		}
		
		this.setValue(value);
	});
	form.add(txtDni, "DNI", null, "dni", null, {tabIndex: 3, item: {row: 1, column: 1, colSpan: 3}});
	
	
	var txtApenom = new qx.ui.form.TextField();
	txtApenom.setRequired(true);
	txtApenom.addListener("blur", function(e){
		var value = this.getValue();
		this.setValue((value == null) ? "" : value.trim());
	});
	form.add(txtApenom, "Ape.y Nom.", null, "apenom", null, {item: {row: 2, column: 1, colSpan: 10}});

	
	aux = new qx.ui.form.TextField();
	aux.addListener("blur", function(e){
		var value = this.getValue();
		this.setValue((value == null) ? "" : value.trim());
	});
	form.add(aux, "E-mail", null, "email", null, {item: {row: 3, column: 1, colSpan: 6}});
	
	
	aux = new qx.ui.form.TextArea();
	aux.addListener("blur", function(e){
		var value = this.getValue();
		this.setValue((value == null) ? "" : value.trim());
	});
	form.add(aux, "Observaciones", null, "observa", null, {item: {row: 4, column: 1, colSpan: 13}});
	
	
	aux = new qx.ui.form.TextField();
	aux.addListener("blur", function(e){
		var value = this.getValue();
		this.setValue((value == null) ? "" : value.trim());
	});
	form.add(aux, "Teléfono", null, "telefono", null, {item: {row: 5, column: 1, colSpan: 6}});
	
	
	var cboDependencia = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Vehiculo", methodName: "autocompletarDependencia"});
	//cboDependencia.setRequired(true);
	form.add(cboDependencia, "Dependencia", function(value) {
		//if (lstDependencia.isSelectionEmpty()) throw new qx.core.ValidationError("Validation Error", "Debe seleccionar dependencia");
	}, "cboDependencia", null, {item: {row: 6, column: 1, colSpan: 13}});
	var lstDependencia = cboDependencia.getChildControl("list");
	form.add(lstDependencia, "", null, "organismo_area_id");
	
	form.addGroupHeader("Licencia de conducir", {item: {row: 7, column: 0, colSpan: 5}});
	
	
	var aux = new qx.ui.form.SelectBox();
	aux.add(new qx.ui.form.ListItem("Si", null, "S"));
	aux.add(new qx.ui.form.ListItem("No", null, "N"));
	form.add(aux, "Lic.oficial", null, "licencia_oficial", null, {item: {row: 8, column: 1, colSpan: 2}});

	
	var aux = new qx.ui.form.SelectBox();
	aux.add(new qx.ui.form.ListItem("Nacional", null, "1"));
	aux.add(new qx.ui.form.ListItem("Municipal", null, "2"));
	aux.add(new qx.ui.form.ListItem("Otra", null, "4"));
	form.add(aux, "Tipo", null, "id_tipo", null, {item: {row: 9, column: 1, colSpan: 4}});
	
	
	var aux = new qx.ui.form.SelectBox();
	aux.add(new qx.ui.form.ListItem("Profesional", null, "1"));
	aux.add(new qx.ui.form.ListItem("A", null, "2"));
	aux.add(new qx.ui.form.ListItem("B", null, "3"));
	aux.add(new qx.ui.form.ListItem("C", null, "4"));
	aux.add(new qx.ui.form.ListItem("D3", null, "5"));
	aux.add(new qx.ui.form.ListItem("E", null, "6"));
	aux.add(new qx.ui.form.ListItem("D", null, "7"));
	form.add(aux, "Categoria", null, "id_categoria", null, {item: {row: 10, column: 1, colSpan: 4}});
	
	
	aux = new qx.ui.form.DateField();
	form.add(aux, "F.emisión", null, "f_emision", null, {item: {row: 11, column: 1, colSpan: 4}});
	
	
	aux = new qx.ui.form.DateField();
	form.add(aux, "F.vencimiento", null, "f_vencimiento", null, {item: {row: 12, column: 1, colSpan: 4}});
	
	



	

	var controllerForm = new qx.data.controller.Form(null, form);
	//modelForm = controllerForm.createModel(true);
	
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 30, 30);
	//var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 45});
	
	
	
	var validationManager = form.getValidationManager();
	validationManager.setValidator(new qx.ui.form.validation.AsyncValidator(
		function(items, validator) {
			if (validationManager.getInvalidFormItems().length == 0){
				var p = {};
				p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
	
				var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Chofer");
				rpc.addListener("completed", function(e){
					var data = e.getData();
	
					validator.setValid(true);
				}, this);
				rpc.addListener("failed", function(e){
					var data = e.getData();
					
					if (data.message == "personal") {
						txtDni.setInvalidMessage("DNI ingresado no es parte de personal");
						txtDni.setValid(false);
					} else if (data.message == "dni") {
						txtDni.setInvalidMessage("DNI duplicado");
						txtDni.setValid(false);
					} else if (data.message == "apenom") {
						txtApenom.setInvalidMessage("Ape.y Nom duplicado");
						txtApenom.setValid(false);
					}
					
					validator.setValid(false);
				}, this);
				rpc.callAsyncListeners(true, "alta_modifica_chofer", p);
				
			} else validator.setValid(false);
		}
	));
	
	validationManager.addListener("complete", qx.lang.Function.bind(function(e){
		if (validationManager.getValid()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
			
			application.popupGrabado.placeToWidget(this, true);
			application.popupGrabado.show();
			
			if (p.model.id_chofer == "0") {
				lstChofer.fireDataEvent("changeSelection", []);
				txtDni.focus();
			} else {
				cboChofer.setValue("");
				lstChofer.removeAll();
				cboChofer.focus();
			}
		} else {
			validationManager.getInvalidFormItems()[0].focus();
		}
	}, this));
	
	
	
	var btnAceptar = new qx.ui.form.Button("Grabar");
	btnAceptar.addListener("execute", function(e){
		form.validate();
	});
	
	var btnCancelar = new qx.ui.form.Button("Cerrar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "25%", bottom: 0});
	this.add(btnCancelar, {right: "25%", bottom: 0});
	
	btnAceptar.setTabIndex(20);
	btnCancelar.setTabIndex(21);
	
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});