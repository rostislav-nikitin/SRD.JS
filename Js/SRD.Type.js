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
			StringObject: 'string object',
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
		var result = typeof(obj);

                if(obj instanceof String)
                {
                      result = TypesNames.StringObject;
                }
		else if(result !== TypesNames.Undefined)
		{
			result = Object.prototype.toString.call(obj).match(/\s([^\]]*)/)[1].toLowerCase();
		}

		return result;
	}

	if(_isExportToContext)
	{
		_context.TypesNames = TypesNames;
		_context.typeOf = typeOf;
	}

})();                        