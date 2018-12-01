qx.Class.define("vehiculos.comp.popupInfo",
{
	extend : componente.comp.ui.ramon.popup.Popup,
	construct : function ()
	{
	this.base(arguments);
	
	this.setLayout(new qx.ui.layout.Canvas());
	
	var command = new qx.ui.command.Command("Escape");
	command.setEnabled(false);
	command.addListener("execute", function(e){
		this.hide();
	}, this);
	
	this.registrarCommand(command);

	},
	members : 
	{
		mostrar : function(e){
			this.removeAll();
			this.add(e, {left: 10, top: 10, right: 10, bottom: 10});
			this.show();
			this.activate();
		}
	}
});