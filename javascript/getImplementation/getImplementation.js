define( function() {
"use strict";

function C_GetImplementationTest()
{
};

C_GetImplementationTest.prototype.initialize = function( oControlHost, fnDoneInitializing )
{
	var o = oControlHost.configuration;
	if ( !o || !o.waitForControls )
	{
		fnDoneInitializing();
		throw new scriptableReportError( "getImplementation", "initialize", "Expected waitForControls in configuration." );
	}

	this.m_oTextItem = oControlHost.page.getControlByName( o.textItem );
	if ( !this.m_oTextItem )
	{
		throw new scriptableReportError( "getImplementation", "initialize", "Can't find textItem [" + o.textItem + "] specified in configuration." );
	}
	var aPromises = [];
	for ( var i = 0; i < o.waitForControls.length; i++ )
	{
		var sName = o.waitForControls[i];
		var oControl = oControlHost.page.getControlByName( sName );
		if ( !oControl )
		{
			throw new scriptableReportError( "getImplementation", "initialize", "Can't find control [" + sName + "] in configuration." );
		}
		this.appendMessage( sName + ": calling getImplementation" );
		aPromises.push( oControl.instance );
	}

	Q.all( aPromises ).done( this.allModulesReady.bind( this ) );

	aPromises[0].done( this.moduleReady.bind( this ) );

	fnDoneInitializing();
};

C_GetImplementationTest.prototype.moduleReady = function( oModuleInstance )
{
	this.appendMessage( oModuleInstance.getControlHost().control.name + ": moduleReady" );
};

C_GetImplementationTest.prototype.allModulesReady = function( aModuleInstances )
{
	for ( var i = 0; i < aModuleInstances.length; i++ )
	{
		var oModuleInstance = aModuleInstances[i];
		var o = oModuleInstance.getLoadedBundles();
		for ( var s in o )
		{
			this.appendMessage( oModuleInstance.getControlHost().control.name + ":" + s );
		}
	}
};

C_GetImplementationTest.prototype.appendMessage = function( s )
{
	this.m_oTextItem.text += "\r\n" + s;
};

return C_GetImplementationTest;
});
