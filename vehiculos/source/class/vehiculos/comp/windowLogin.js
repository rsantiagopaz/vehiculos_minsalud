qx.Class.define("vehiculos.comp.windowLogin",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Identificación de usuario",
		//width: 500,
		//height: 160,
		movable: false,
		showClose: false,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		txtUsuario.focus();
		txtUsuario.selectAllText();
	});
	
	
	var application = qx.core.Init.getApplication();
	var aux;
	
	
	var functionTraerAreas = function() {
		var p = {};
		p.usuario = txtUsuario.getValue();
		p.password = txtPassword.getValue();
		
		if (p.usuario != "" && p.password != "") {
			btnAceptar.setEnabled(false);
			slbArea.removeAll();
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.ControlAcceso");
			rpc.addListener("completed", function(e){
				var resultado = e.getData().result;
				
				//alert(qx.lang.Json.stringify(resultado, null, 2));
				//alert(qx.lang.Json.stringify(error, null, 2));
				var item;
				
				for (var x in resultado) {
					item = new qx.ui.form.ListItem(resultado[x].label, null, resultado[x].model);
					item.setUserData("datos", resultado[x]);
					
					slbArea.add(item);
				}
				
				btnAceptar.setEnabled(true);			
			});
			rpc.callAsyncListeners(true, "traer_areas", p);
		} else {
			slbArea.removeAll();
		}
	}
	
	
	
	
	
	
	
	
	
	var form = new qx.ui.form.Form();
	
	
	var txtUsuario = new qx.ui.form.TextField("");
	txtUsuario.setRequired(true);
	txtUsuario.setMaxWidth(100);
	txtUsuario.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
		
		functionTraerAreas();
	})
	form.add(txtUsuario, "Usuario", null, "usuario");
	
	
	var txtPassword = new qx.ui.form.PasswordField("");
	txtPassword.setRequired(true);
	txtPassword.setMaxWidth(100);
	txtPassword.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
		
		functionTraerAreas();
	})
	form.add(txtPassword, "Contraseña", null, "password");
	
	
	var slbArea = new qx.ui.form.SelectBox();
	slbArea.setRequired(true);
	slbArea.setMinWidth(300);
	form.add(slbArea, "Area", null, "id_sist_perfil_usuario_oas");
	
	
	

	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
			delete p.model.password;
			
			var datos = slbArea.getSelection()[0].getUserData("datos");
			for (var x in datos) {
				p.model[x] = datos[x];
			}
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.ControlAcceso");
			rpc.addListener("completed", function(e){
				
				this.destroy();
			
				this.fireDataEvent("aceptado", p.model);
			}, this);
			rpc.callAsyncListeners(true, "login", p);

		} else {
			form.getValidationManager().getInvalidFormItems()[0].focus();
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.close();
		
		this.destroy();
	}, this);
	
	//this.add(btnAceptar, {left: "20%", bottom: 0});
	//this.add(btnCancelar, {right: "20%", bottom: 0});
	
	
	form.addButton(btnAceptar);
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	if (qx.core.Environment.get("qx.debug")) {
		aux = qx.data.marshal.Json.createModel({usuario: "rsantiagopaz", password: "ramon", id_sist_perfil_usuario_oas: null}, true);
	} else {
		aux = qx.data.marshal.Json.createModel({usuario: "", password: "", id_sist_perfil_usuario_oas: null}, true);
	}

	controllerForm.setModel(aux);
	
	
	
	
	
	},

	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});