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

(function(mountPoint, context)
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
		_mountPoint = mountPoint;

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

	if(!!_mountPoint)
	{
		_mountPoint.TypesNames = TypesNames;
		_mountPoint.typeOf = typeOf;
	}

})(this);                        