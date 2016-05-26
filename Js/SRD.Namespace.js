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
#       Example: ns("NSNAme.NSName...NSNAme")                                                                          #
#                                                                                                                      #
#   - public static boolean isNsExists(nsFullName)                                                                     #
#       Check is namespace exists                                                                                      #
#       nsFullName - dotted branch(from the root to the current namespace) nodes name                                  #
#       Return true if exists otherwise false                                                                          #
#	Example: isNsExists("System.Collections")                                                                      #
#                                                                                                                      #
#   - public static boolean isNs(nsFullName)                                                                           #
#       Check does specified object is a namespace                                                                     #
#       nsFullName - dotted branch(from the root to the current namespace) nodes name                                  #
#       Return true if it is a namespace otherwise false                                                               #
#       Example: isNs("System.Collections")                                                                            #
#                                                                                                                      #
#   - public string getName()                                                                                          #
#       Get the name of the namespace instance                                                                         #
#                                                                                                                      #
#   - public string getFullName() - get the namespace full name                                                        #
#       Get the full namespace name (dotted branch namespaces nodes names)                                             #
#                                                                                                                      #
+======================================================================================================================+
*/

// Public Namespace class
var Namespace = (function(globalContext, isExportToGlobalContext)
{
	// Private static members
	// Constants
	//  Types
	var StringTypeName = "string", ObjectTypeName = "object", 
		UndefinedTypeName = "undefined", FunctionTypeName = "function";
	//  Numbers
	var Zero = 0;
	//   Other
	var PointCharacter = '.', Separator = PointCharacter;


	// Defaults (constants)
	var DefaultIsExportToGlobalContext = true;

	// Fields
	var _globalContext = globalContext || this, 
		_isExportToGlobalContext = 
			(typeof(isExportToGlobalContext) !== UndefinedTypeName &&  isExportToGlobalContext === true) 
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
		var _parentNamespace = parentNamespace;

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

			while(typeof(currentNamespace.getParentNamespace) === FunctionTypeName && 
				typeof(currentNamespace.getParentNamespace()) === ObjectTypeName && 
				currentNamespace.getParentNamespace() !== null)
			{
				parts.splice(Number.Zero, Number.Zero, currentNamespace.getName());
				currentNamespace = currentNamespace.getParentNamespace();
			}

			return parts.join(Separator);
		}
	}

	// Private static members
	function getParent(parent, namespaceParts, index)
	{
		var type = typeof(parent[namespaceParts[index]]), result = null;

		if(type === UndefinedTypeName || (type === ObjectTypeName && types === null))
		{
			result = parent[namespaceParts[index]] = new Namespace(parent);
		}
		else
		{
			result = parent[namespaceParts[index]];
		}

		return result;
	}

	function nsSafe(namespaceName)
	{

		var namespaceParts = namespaceName.split(Separator), parent = this;
					
		for(var index = Zero; index < namespaceParts.length; index++)
		{
			if(namespaceParts[index] in parent)
			{
				parent = getParent(parent, namespaceParts, index);
			}
			else
			{
				parent = parent[namespaceParts[index]] = new Namespace(parent);
			}
		}

		return parent;
	}


	// Public static members
	constructor.ns = function (namespaceName)
	{
		var result = this;

		if(typeof(namespaceName) === StringTypeName)
		{
			result = nsSafe(namespaceName);
		}

		return result;
	}
	
	constructor.isNs = function(obj)
	{
		var result;
		if(typeof(obj) === ObjectTypeName && obj !== null && typeof(obj.getIsNamespace) === FunctionTypeName)
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
	var NsExists = true;
	var NsNotExists = false;

	function isNsPart(nsPart)
	{
		return typeof(nsPart) === ObjectTypeName 
				&& nsPart !== null
				&& (nsPart === _globalContext || (typeof(nsPart.getIsNamespace) === FunctionTypeName 
					&&  nsPart.getIsNamespace() === true));
	}

	function isNsExistsSafe(nsName)
	{
		var result;
		for(var nsList = nsName.split(Separator), parent = _globalContext, index = Zero, result = false; 
			index < nsList.length  
			&& (result = isNsPart(parent)); 
			index++)
		{
			parent = parent[nsList[index]];
		}

		return result && isNsPart(parent);
	}

	// Public static members
	constructor.isNsExists = function(nsName)
	{
		var result;

		if(typeof(nsName) === StringTypeName && nsName !== null)
		{
			result = isNsExistsSafe(nsName);
		}
		else
		{
			result = NsNotExists;
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

	return constructor;
})();