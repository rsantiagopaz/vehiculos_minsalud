qx.Class.define("vehiculos.comp.windowIncidente",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (id_chofer, rowIncidente)
	{
	this.base(arguments);
	
	this.set({
		width: 500,
		height: 250,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		txtFecha.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	var aux;
	
	var form = new qx.ui.form.Form();
	
	var txtFecha = new qx.ui.form.DateField();
	txtFecha.setRequired(true);
	txtFecha.setMaxWidth(100);
	form.add(txtFecha, "Fecha", null, "fecha");
	
	var slbTipo = new qx.ui.form.SelectBox();
	slbTipo.setMaxWidth(200);
	
	var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Chofer");
	try {
		var resultado = rpc.callSync("leer_tipo_incidente");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	for (var x in resultado) {
		slbTipo.add(new qx.ui.form.ListItem(resultado[x].descrip, null, resultado[x].id_tipo_incidente));
	}
	
	form.add(slbTipo, "Tipo", null, "id_tipo_incidente");
	
	var txtDescrip = new qx.ui.form.TextArea("");
	txtDescrip.setRequired(true);
	txtDescrip.setMinWidth(410);
	txtDescrip.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtDescrip, "Descrip.", null, "descrip");
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	if (rowIncidente == null) {
		this.setCaption("Nuevo incidente");
		
		aux = qx.data.marshal.Json.createModel({id_incidente: "0", id_chofer: id_chofer, fecha: null, descrip: "", id_tipo_incidente: null, id_usuario: ""}, true);
	} else {
		this.setCaption("Modificar incidente");
		
		aux = qx.data.marshal.Json.createModel(rowIncidente, true);
	}
	
	controllerForm.setModel(aux);
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Chofer");
			rpc.addListener("completed", function(e){
				var data = e.getData();

				this.fireDataEvent("aceptado");
				
				btnCancelar.execute();
			}, this);
			rpc.callAsyncListeners(true, "alta_modifica_incidente", p);
			
		} else {
			form.getValidationManager().getInvalidFormItems()[0].focus();
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.close();
		
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "20%", bottom: 0});
	this.add(btnCancelar, {right: "20%", bottom: 0});
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});