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
			Undefined: 'undefined',
			Boolean: 'boolean',
			Number: 'number',
			String: 'string',
			StringObject: 'string object',
			Function: 'function',
			Array: 'array',
			Object: 'object',
			Null: 'null'
		},
		MinusOne = -1,
		Zero = 0,
		One = 1,
		StringEmpty = '',
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
	];

	function ClassType(className)
	{
		var _this = this,
			_className = className,
			_isAnonymous = null;

		this.is = function(className)
		{
			return _className === className;
		}

		this.isAnonymous = function()
		{
			if(_isAnonymous === null)
			{
				_isAnonymous = _className === AnonymousFunctionName;
			}

			return _isAnonymous;
		}

		this.className = function()
		{
			var result;

			if(_className === AnonymousFunctionName)
			{
				result = null;
			}
			else
			{
				result = _className;
			}

			return result;
		}
	}

	function IsTypeResult(value, classTypeName)
	{
		var _this = this,
			_value = value,
			_classTypeName = classTypeName,
			_classType = null;

		this.valueOf = function()
		{
			return _value;
		}

		this.classType = function()
		{
			if(_classType === null)
			{
				_classType = new ClassType(_classTypeName);
			}

			return _classType;
		}
	}

	function IsStringResult(value, stringTypeName)
	{
		var _this = this,
			_value = value,
			_stringTypeName = stringTypeName;

		this.valueOf = function()
		{
			return _value;
		}

		this.isNative = function()
		{
			return _value === true &&
				_stringTypeName === StringEmpty;
		}

		this.isBoxed = function()
		{
			return _value === true &&
				_stringTypeName === TypesNames.Object;
		}
	}

	function Type(name)
	{
		var 	_this = this,
			_name = name;

		this.toString = function()
		{
			return _name;
		}

		this.isBoolean = function()
		{
			return _name.startsWith(TypesNames.Boolean);
		}

		this.isNumber = function()
		{
			return _name.startsWith(TypesNames.Number);
		}

		this.isString = function()
		{
			var result;

			if(_name.startsWith(TypesNames.String))
			{
				result = new IsStringResult(true, _name.split(CharacterSpace).slice(One).join());
			}
			else
			{
				result = new IsStringResult(false);
			}

			return result;
        	}

		this.isArray = function()
		{
			return _name === TypesNames.Array;
		}

		this.isObject = function()
		{
			return _name.startsWith(TypesNames.Object);
		}

		this.isNull = function()
		{
			return _name === TypesNames.Null;
		}

		this.isUndefined = function()
		{
			return _name === TypesNames.Undefined;
		}

		this.isNaN = function()
		{
			
		}

		this.isType = function()
		{
			var result;

			if(_name.startsWith(TypesNames.Function))
			{
				result = new IsTypeResult(true, _name.split(CharacterSpace).slice(One).join());
			}
			else
			{
				result = new IsTypeResult(false, null);
			}

			return result;
		}

		this.name = function()
		{
			return _name;
		}
	}

	function typeOf(obj)
	{
		var result;

		for(var index = Zero; index < evaluators.length; index++)
		{
			if(evaluators[index].predicate(obj))
			{
				result = new Type(evaluators[index].evaluate(obj));
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