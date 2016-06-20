/*
+======================================================================================================================+
#                                                                                                                      #
#  Copyright 2016 Systems Research & Developemnt Ltd                                                                   #
#  Author: Rostislav Nikitin                                                                                           #
#                                                                                                                      #
#  Description: JS class Namespace that provide next functionality:                                                    #
#   - public static object ns(string nsFullName)                                                                       #
#       Create namespaces from the root to the leaf                                                                    #
#       nsFullName - dotted branch(from the root to the current namespace) nodes name                                  #
#       Return leaf namespace                                                                                          #
#       Example: ns("NSName.NSName...NSName")                                                                          #
#                                                                                                                      #
#   - public static boolean isNsExists(string nsFullName)                                                              #
#       Check is namespace exists                                                                                      #
#       nsFullName - dotted branch(from the root to the current namespace) nodes name                                  #
#       Return true if exists otherwise false                                                                          #
#	Example: isNsExists("System.Collections")                                                                      #
#                                                                                                                      #
#   - public static boolean isNs(object obj)                                                                           #
#       Check does specified object is a namespace                                                                     #
#       obj - object to check                                                                                          #
#       Return true if it is a namespace otherwise false                                                               #
#       Example: isNs("System.Collections")                                                                            #
#                                                                                                                      #
#   - public string getName()                                                                                          #
#       Get the name of the namespace instance                                                                         #
#                                                                                                                      #
#   - public string getFullName()                                                                                      #
#       Get the full namespace instance name (dotted branch namespaces nodes names)                                    #
#                                                                                                                      #
#   - public boolean getIsNamespace()                                                                                  #
#       Get the true if instance is a namespace otherwise false                                                        #
#                                                                                                                      #
#   - public object getParentNamespace()                                                                               #
#       Get the parent namespace of the namespace instance or null if the instance is a root namespace                 #
#                                                                                                                      #
+======================================================================================================================+
*/

// Public Namespace class
(function(globalContext, rootNsFullName, isExportToGlobalContext)
{
	// Private static members
	// Constants
	//  Types
	var TypesNames = 
	{
		String: 'string', 
		Object: 'object', 
		Undefined: 'undefined', 
		Function:  'function'
	};

	//  Numbers
	var Zero = 0;
	//   Other
	var PointCharacter = '.', Separator = PointCharacter;


	// Defaults (constants)
	var DefaultIsExportToGlobalContext = true, DefaultRootNsFullName = "SRD";

	// Fields
	var _globalContext = globalContext || this, 
		_rootNsFullName = rootNsFullName || DefaultRootNsFullName,
		_isExportToGlobalContext = 
			(typeof(isExportToGlobalContext) !== TypesNames.Undefined &&  isExportToGlobalContext === true) 
			|| DefaultIsExportToGlobalContext;


	// Constructor
	function constructor (parentNamespace)
	{
		// Private instance members
		// Constants
		var IsNamespace = true;

		// Fields
		var _this = this;
		var _isNamespace = IsNamespace;
		var _parentNamespace = parentNamespace || null;

		// Methods
		function getNameSafe()
		{
			var result = null;

			for(var propertyName in _parentNamespace)
			{
				if(_parentNamespace[propertyName] === _this && (result = propertyName) !== null)
				{
					break;
				}
			}
			return result;
		}

		// Public instance members
		// Properties
		this.getIsNamespace = function(){ return _isNamespace; }
		this.getParentNamespace = function() { return _parentNamespace;  };
		this.getName = function()
		{
			var result = null;

			if(_parentNamespace !== null)
			{
				result = getNameSafe();
			}

			return result;
		}
		this.getFullName = function()
		{
			var parts = [], currentNamespace = _this;

			while(typeof(currentNamespace.getParentNamespace) === TypesNames.Function && 
				typeof(currentNamespace.getParentNamespace()) === TypesNames.Object && 
				currentNamespace.getParentNamespace() !== null)
			{
				parts.splice(Zero, Zero, currentNamespace.getName());
				currentNamespace = currentNamespace.getParentNamespace();
			}

			return parts.join(Separator);
		}
	}

	// Private static members
	function getParent(parent, namespaceParts, index)
	{
		var obj = parent[namespaceParts[index]], 
			type = typeof(obj), 
			result = null;

		if(type === TypesNames.Undefined || obj === null)
		{
			result = parent[namespaceParts[index]] = new constructor(parent);
		}
		else
		{
			result = obj;
		}

		return result;
	}

	function nsSafe(nsFullName)
	{

		var namespaceParts = nsFullName.split(Separator), parent = _globalContext;
					
		for(var index = Zero; index < namespaceParts.length; index++)
		{
			if(namespaceParts[index] in parent)
			{
				parent = getParent(parent, namespaceParts, index);
			}
			else
			{
				parent = parent[namespaceParts[index]] = new constructor(parent);
			}
		}

		return parent;
	}


	// Public static members
	constructor.ns = function (nsFullName)
	{
		var result = _globalContext;

		if(typeof(nsFullName) === TypesNames.String)
		{
			result = nsSafe(nsFullName);
		}

		return result;
	}
	
	constructor.isNs = function(obj)
	{
		var result;
		if(typeof(obj) === TypesNames.Object && obj !== null && typeof(obj.getIsNamespace) === TypesNames.Function)
		{
			result = obj.getIsNamespace() === true;
		}
		else
		{
			result = false;
		}

		return result;
	}

	// Private static members
	var IsNsExists = 
	{
		notExists: false,
		exists: true
	};

	function isNsPart(nsPart)
	{
		return typeof(nsPart) === TypesNames.Object
				&& nsPart !== null
				&& (nsPart === _globalContext || (typeof(nsPart.getIsNamespace) === TypesNames.Function
					&&  nsPart.getIsNamespace() === true));
	}

	function isNsExistsSafe(nsFullName)
	{
		var result;
		for(var nsList = nsFullName.split(Separator), parent = _globalContext, index = Zero, result = false; 
			index < nsList.length  
			&& (result = isNsPart(parent)); 
			index++)
		{
			parent = parent[nsList[index]];
		}

		return result && isNsPart(parent);
	}

	// Public static members
	constructor.isNsExists = function(nsFullName)
	{
		var result;

		if(typeof(nsFullName) === TypesNames.String && nsFullName !== null)
		{
			result = isNsExistsSafe(nsFullName);
		}
		else
		{
			result = IsNsExists.notExists;
		}

		return result;
	}

	// Create Global alias for the Namespace.ns public static member;
	if(_isExportToGlobalContext)
	{
		_globalContext.ns = constructor.ns;	
		_globalContext.isNs = constructor.isNs;
		_globalContext.isNsExists = constructor.isNsExists;
	}

	var rootNs = constructor.ns.apply(_globalContext, [_rootNsFullName]);
	rootNs.Namespace = constructor;

	return constructor;
})();