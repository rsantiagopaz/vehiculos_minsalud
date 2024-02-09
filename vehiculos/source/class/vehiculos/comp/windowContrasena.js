qx.Class.define("vehiculos.comp.windowContrasena",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
		this.base(arguments);

	this.set({
		caption: "Cambiar contraseña",
		width: 250,
		height: 170,
		showMinimize: false,
		showMaximize: false
	});
	this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		txtPassword.focus();
	});
	

	var application = qx.core.Init.getApplication();
	var modelForm = null;
		
		
	var form = new qx.ui.form.Form();
	
	var txtPassword = new qx.ui.form.PasswordField("");
	txtPassword.setRequired(true);
	txtPassword.setMinWidth(130);
	txtPassword.addListener("blur", function(e){
		txtPassword.setValue(txtPassword.getValue().trim());
	});
	form.add(txtPassword, "Actual", null, "password");
	
	var txtPassnueva = new qx.ui.form.PasswordField("");
	txtPassnueva.setRequired(true);
	txtPassnueva.addListener("blur", function(e){
		txtPassnueva.setValue(txtPassnueva.getValue().trim());
	});
	form.add(txtPassnueva, "Nueva", null, "passnueva");
	
	var txtPassrepetir = new qx.ui.form.PasswordField("");
	txtPassrepetir.setRequired(true);
	txtPassrepetir.addListener("blur", function(e){
		txtPassrepetir.setValue(txtPassrepetir.getValue().trim());
	});
	form.add(txtPassrepetir, "Repetir nueva", null, "passrepetir");
	
	//var formView = new qx.ui.form.renderer.Single(form);
	
	//this.add(formView, {left: 0, top: 0})
	
	var controllerForm = new qx.data.controller.Form(null, form);
	var modelForm = controllerForm.createModel(true);
	var validationManager = form.getValidationManager();
	
	validationManager.setValidator(function(items) {
		if (txtPassrepetir.getValue() != txtPassnueva.getValue()) {
			txtPassrepetir.setInvalidMessage("No coinciden las contraseñas");
			txtPassrepetir.setValid(false);
			
			txtPassnueva.setInvalidMessage("No coinciden las contraseñas");
			txtPassnueva.setValid(false);
			txtPassnueva.focus();
			
			return false;
		} else return true;
	});
	
	var commandEsc = new qx.ui.command.Command("Esc");
	this.registrarCommand(commandEsc);
	commandEsc.addListener("execute", function(e){
		btnCancelar.fireEvent("execute");
	});
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e) {
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(modelForm);
			p.model.usuario = application.login.usuario;
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new vehiculos.comp.rpc.Rpc("services/", "comp.Parametros");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				//alert(qx.lang.Json.stringify(data, null, 2));
				
				btnCancelar.execute();
			});
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				if (data.message != "sesion_terminada") {
					if (data.message == "password") {
						txtPassword.setInvalidMessage("Contraseña incorrecta")
						txtPassword.setValid(false);
						txtPassword.focus();
					} else {
						alert(qx.lang.Json.stringify(data, null, 2));
					}
				}
			});
			rpc.callAsyncListeners(true, "escribir_contrasena", p);
			
		} else {
			var items = form.getItems();
			for (var item in items) {
				if (!items[item].isValid()) {
					items[item].focus();
					break;
				}
			}
		}
	}, this);

	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);
	
	//this.add(btnAceptar, {left: 20, bottom: 0});
	//this.add(btnCancelar, {left: 100, bottom: 0});
	
	form.addButton(btnAceptar);
	form.addButton(btnCancelar);


	var formView = new qx.ui.form.renderer.Single(form);
	
	this.add(formView, {left: 0, top: 0})
	
		
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});