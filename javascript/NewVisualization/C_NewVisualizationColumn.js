define( function() {
"use strict";

var G_Rave;
var G_Bundles = {};

function C_Rave2Column()
{
};

C_Rave2Column.prototype.initialize = function( oControlHost, fnDoneInitializing )
{
	// Only used for testing getImplementation
	this.m_oControlHost = oControlHost;

	var oConfiguration = oControlHost.configuration;
	var sBundleId = ( oConfiguration ? oConfiguration.bundle : "" ) || "rave-library-column";

	if ( G_Bundles[sBundleId] )
	{
		this.dependenciesLoaded( oConfiguration, sBundleId, fnDoneInitializing, G_Rave, null, G_Bundles[sBundleId] );
		return;
	}

	var sRaveLocation = "http://vottrave.ottawa.ibm.com/rave2/download/nightly/";
	var a = ["rave", "rave-library", "rave-legends", "rave-layouts", "rave-utilities", "rave-navigation", "rave-accessibility", sBundleId];
	var oPaths = {};
	for ( var i = 0; i < a.length; i++ )
	{
		var s = a[i];
		oPaths[s] = sRaveLocation + s + '/' + s + '.min';
	}
	var oConfig = { waitSeconds : 60, paths : oPaths };
	requirejs( oConfig, ["rave", "rave-accessibility", sBundleId], this.dependenciesLoaded.bind( this, oConfiguration, sBundleId, fnDoneInitializing ) )
};

C_Rave2Column.prototype.dependenciesLoaded = function( oConfiguration, sBundleId, fnDoneInitializing, oRave, oRave2Accessibility, oBundle )
{
	G_Rave = oRave;
	if ( !G_Bundles[sBundleId] )
	{
		G_Bundles[sBundleId] = oBundle;
	}
	this.m_oVis = oBundle.create();
	var oProperties = ( oConfiguration ? oConfiguration.properties : null ) || { "data.handling" : "data.handling.options.Clustered" };
	for ( s in oProperties )
	{
		this.m_oVis.property( s, oProperties[s] )
	}
	this.m_oDataModel = this.m_oVis.createDataModel( this.m_oVis.info().dataModels()[0].id() );
	fnDoneInitializing();
};

C_Rave2Column.prototype.draw = function( oControlHost )
{
	var oConfiguration = oControlHost.configuration;
	var div = oControlHost.container;
	div.style.overflow = "hidden";
	this.m_elSvg = div.appendChild( div.ownerDocument.createElementNS( "http://www.w3.org/2000/svg", "svg" ) );
	this.m_elSvg.setAttribute( "height", ( oConfiguration ? oConfiguration.properties.height : "" ) || "500" );
	this.m_elSvg.setAttribute( "width", ( oConfiguration ? oConfiguration.properties.width : "" ) || "900" );
	this.m_oVis.node( G_Rave.select( this.m_elSvg ) );

	var aRowNumbers = [];
	var iRowCount = this.m_oDataStore.rowCount;
	for ( var i = 0; i < iRowCount; i++ )
	{
		aRowNumbers[i] = i;
	}

	var oDataSet = this.m_oDataModel.dataset( "data" );
	oDataSet.data( aRowNumbers );
	oDataSet.slot( "x" ).push().type( "string" ).accessor( this.cellAccessor.bind( this, 0 ) );
	oDataSet.slot( "y" ).push().type( "numeric" ).accessor( this.cellAccessor.bind( this, 1 ) );
	oDataSet.slot( "color" ).push().type( "string" ).accessor( this.cellAccessor.bind( this, 0 ) );

	this.m_oVis.render();
};

C_Rave2Column.prototype.cellAccessor = function( iColumn, iRow )
{
	return this.m_oDataStore.getCellValue( iRow, iColumn );
};

C_Rave2Column.prototype.setData = function( oControlHost, oDataStore )
{
	this.m_oDataStore = oDataStore;
};

// Only used for testing getImplementation
C_Rave2Column.prototype.getLoadedBundles = function()
{
	return G_Bundles;
};
// Only used for testing getImplementation
C_Rave2Column.prototype.getControlHost = function()
{
	return this.m_oControlHost;
};

return C_Rave2Column;
});
