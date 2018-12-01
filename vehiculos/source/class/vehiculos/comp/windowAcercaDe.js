qx.Class.define("vehiculos.comp.windowAcercaDe",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Acerca de...",
		width: 500,
		height: 200,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});

	var layout = new qx.ui.layout.HBox(0, "center");
	layout.setAlignY("middle");
	this.setLayout(layout);
	
	var layout = new qx.ui.layout.VBox(0, "middle");
	layout.setAlignX("center");
	
	var composite = new qx.ui.container.Composite(layout)
	this.add(composite, {flex: 1});
	
	composite.add(new qx.ui.basic.Label("Programador: Ramón S. Paz"), {flex: 1});
	composite.add(new qx.ui.basic.Label("rsantiagopaz@gmail.com"), {flex: 1});

	
	var application = qx.core.Init.getApplication();

	
	}
});