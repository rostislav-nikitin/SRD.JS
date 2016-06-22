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
		Zero = 0,
		One = 1,
		CharacterSpace = ' ',
		AnonymousFunctionName = 'anonymous',
		DefaultEvaluatorPredicateValue = true,
		_mountPoint = mountPoint;

	var evaluators = 
	[
		{ predicate: function(obj) { return obj instanceof String; }, evaluate: function (obj) { return TypesNames.StringObject; } },
		{ predicate: function(obj) { return obj instanceof Function; }, evaluate: function(obj)
			{
				var result = CharacterSpace + AnonymousFunctionName, 
					matches = Function.prototype.toString.call(obj).match(/function\s+([^\s\{\(]+)/);

				if(!!matches && matches.length > Zero)
				{
					result = CharacterSpace + matches[One];
				}

				result = TypesNames.Function + result;

				return result;
			} },
		{ predicate: function(obj) { return typeof obj !== TypesNames.Undefined }, evaluate: function(obj) 
			{
				var result = Object.prototype.toString.call(obj).match(/\s([^\]]*)/)[1].toLowerCase(); 
				return result;
			} },
		{ predicate: function(obj) { return DefaultEvaluatorPredicateValue; }, evaluate: function(obj) { return typeof(obj); } }
	]

	function typeOf(obj)
	{
		var result;

		for(var index = Zero; index < evaluators.length; index++)
		{
			if(evaluators[index].predicate(obj))
			{
				result = evaluators[index].evaluate(obj);
				break;
			}
		}

		return result;
	}

	if(!!_mountPoint)
	{
		_mountPoint.TypesNames = TypesNames;
		_mountPoint.typeOf = typeOf;
	}

})(this);                        