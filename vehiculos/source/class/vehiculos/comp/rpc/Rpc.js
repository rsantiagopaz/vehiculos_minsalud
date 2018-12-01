qx.Class.define("vehiculos.comp.rpc.Rpc",
{
	extend : componente.comp.io.ramon.rpc.Rpc,
	construct : function (url, serviceName)
	{
		this.base(arguments, url, serviceName);
		
		
		
		var application = qx.core.Init.getApplication();
		
		if (vehiculos.comp.rpc.Rpc.LOADING == null) {
			this.loading = new componente.comp.ui.ramon.image.Loading("vehiculos/loading66.gif");
		} else {
			this.loading = vehiculos.comp.rpc.Rpc.LOADING;
		}
		
		
		

		this.addListener("completed", function(e){
			var data = e.getData();
			
			//this.image.setVisibility("hidden");
			if (this.mostrar) this.loading.hide();
		}, this);
		
		this.addListener("failed", function(e){
			var data = e.getData();
			
			//this.image.setVisibility("hidden");
			if (this.mostrar) this.loading.hide();
			
			if (data.message == "sesion_terminada") dialog.Dialog.warning("Sesión terminada.<br/>Debe ingresar datos de autenticación.", function(e){location.reload(true);});
			
		}, this);
		
		this.addListener("timeout", function(e){
			var data = e.getData();
			
			//this.image.setVisibility("hidden");
			if (this.mostrar) this.loading.hide();
		}, this);
		
		this.addListener("aborted", function(e){
			var data = e.getData();
			
			//this.image.setVisibility("hidden");
			if (this.mostrar) this.loading.hide();
		}, this);
	},
	
	
	members :
	{
		loading: null,
		mostrar: true,
		
		callAsyncListeners : function (coalesce, methodName, p)
		{
			//if (this.mostrar) this.image.setVisibility("visible");
			if (this.mostrar) this.loading.show();
			
			return this.base(arguments, coalesce, methodName, p);
		}
	},
	
	
	statics :
	{
		LOADING: null
	},
	
	
	destruct : function ()
	{
		//this.loading.destroy();
	}
});