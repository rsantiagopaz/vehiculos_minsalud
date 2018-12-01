qx.Class.define("vehiculos.comp.rpc.Rpc",
{
	extend : componente.comp.io.ramon.rpc.Rpc,
	construct : function (url, serviceName)
	{
		this.base(arguments, url, serviceName);
		
		
		
		var application = qx.core.Init.getApplication();
		
		var bounds = application.getRoot().getBounds();
		
		this.image = new qx.ui.basic.Image("vehiculos/loading66.gif");
		this.image.setVisibility("hidden");
		this.image.setBackgroundColor("#FFFFFF");
		this.image.setDecorator("main");
		application.getRoot().add(this.image, {left: parseInt(bounds.width / 2 - 33), top: parseInt(bounds.height / 2 - 33)});
		
		this.image.addListenerOnce("appear", function(e){
			this.image.setZIndex(30000);
		}, this);
		
		

		this.addListener("completed", function(e){
			var data = e.getData();
			
			this.image.setVisibility("hidden");
		}, this);
		
		this.addListener("failed", function(e){
			var data = e.getData();
			
			this.image.setVisibility("hidden");
			
			if (data.message == "sesion_terminada") dialog.Dialog.warning("Sesión terminada.<br/>Debe ingresar datos de autenticación.", function(e){location.reload(true);});
			
		}, this);
		
		this.addListener("timeout", function(e){
			var data = e.getData();
			
			this.image.setVisibility("hidden");
		}, this);
		
		this.addListener("aborted", function(e){
			var data = e.getData();
			
			this.image.setVisibility("hidden");
		}, this);
	},
	
	
	members :
	{
		image: null,
		mostrar: true,
		
		callAsyncListeners : function (coalesce, methodName, p)
		{
			if (this.mostrar) this.image.setVisibility("visible");
			
			return this.base(arguments, coalesce, methodName, p);
		}
	},
	
	
	destruct : function ()
	{
		this.image.destroy();
	}
});