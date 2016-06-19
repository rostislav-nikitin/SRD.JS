/*
+======================================================================================================================+
#                                                                                                                      #
#  Copyright 2016 Systems Research & Developemnt Ltd                                                                   #
#  Author: Rostislav Nikitin                                                                                           #
#                                                                                                                      #
#  Description: JS type (types related language extensions).                                                           #
#  Members:                                                                                                            #
#   - private static TypesNames dictionary. Contains general types names.  Can be exported to the context.             #
#   - private static void typeOf(any obj). Can be exported to the context.                                             # 
#	- obj - the parameter that specifies any instance to get type name for                                         #
#	- returns the string type name of the obj                                                                      #
#                                                                                                                      #
+======================================================================================================================+
*/

(function(context, isExportToContext)
{
	var 	TypesNames = 
		{
			Undefined: "undefined",
			Boolean: "boolean",
			Number: "number",
			String: "string",
			Function: "function",
			Array: "array",
			Object: "object",
		},
		One = 1,
		DefaultIsExportToContext = true,
		_context = context || this,
		_isExportToContext = isExportToContext || DefaultIsExportToContext;


	function typeOf(obj)
	{
		var result;
		if(typeof(obj) === TypesNames.Undefined)
		{
			result = TypesNames.Undefined;
		}
		else
		{
			result = Object.prototype.toString.call(obj).match(/\s([^\]]*)/)[One].toLowerCase();
		}

		return result;
	}

	if(_isExportToContext)
	{
		_context.TypesNames = TypesNames;
		_context.typeOf = typeOf;
	}

})();                        