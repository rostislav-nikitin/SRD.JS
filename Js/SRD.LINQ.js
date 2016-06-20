// Array.Helpers
require('SRD.Namespace', null, { basePath: '../Js', isSplitName: false })
	.require('SRD.Type', null, { basePath: '../Js', isSplitName: false });
	
ns("SRD.LINQ").Extensions = (function(context, isExportToContext)
	{
		// Private static constants
		var 	Zero = 0,
			One = 1,
			DefaultIsInArray = false,
			DefaultIsExportToContext = true,
		// Private static variables
			_isExportToContext = isExportToContext || DefaultIsExportToContext,
			_context = context || this,
			_instance;

		// Private static helper methods
		function isInArraySafeWithComparerExpression(array, element, comparerExpression)
		{
			var result = DefaultIsInArray;

			for(var index = Number.Zero; !result && index < array.length; index++)
			{
				result = comparerExpression(element, array[index]);

			}

			return result;
		}

		function isInArraySafe(array, element, comparerExpression)
		{
			var result = DefaultIsInArray;

			if(typeof(comparerExpression) === TypeNames.Function)
			{
				result = isInArraySafeWithComparerExpression(array, element, comparerExpression);
			}
			else
			{
				result = array.indexOf(element) > Number.MinusOne;
			}
			return result;
		}

		function isInArray (array, element, comparerExpression)
		{
			var result = DefaultIsInArray;
					                           
			if(typeof(array) === TypeNames.Object && "length" in array && array.length > Number.Zero)
			{
				result = isInArraySafe(array, element, comparerExpression);
			}

			return result;
		}

		function validateIsArray(array)
		{
			if(typeof(array) !== TypeNames.Object || array === null || !("length" in array))
			{
				throw Array.Helpers.getIsNotArrayError();
			}
		}

		function getIsNotArrayError()
		{
			var errorMessage = "Object of the array type is required.";
			var error = new Error(errorMessage);
			throw error;
		}

		function validateArrayIsNotEmpty(array)
		{
			Array.Helpers.validateIsArray(array);

			if(array.length < Number.One)
			{
				throw Array.Helpers.getArrayIsEmptyError();
			}

		}

		function getArrayIsEmptyError()
		{
			var errorMessage = "Array is empty.";
			var error = new Error(errorMessage);
			return error;
		}

		function getArrayIsEmptyError()
		{
			var errorMessage = "Sequence don't contains any elements.";
			var error = new Error(errorMessage);

                      	return error;
		}

		function validateForSequenceIsEmpty(array)
		{
       			if(typeof(array) === TypeNames.Object && array !== null &&
				"length" in array && array.length < Number.One)
			{
				throw Array.Helpers.getSequenceDontContainsAnyElementsError();
			}
		}

		function getSequenceContainsMoreThanOneElementError()
		{
			var errorMessage = "Sequence contains more than one element";
			var error = new Error(errorMessage);
				return error;
		}

		function validateForSequenceContainsMoreThenOneElement(array)
		{
			if(typeof(array) === TypeNames.Object && array !== null &&
				"length" in array && array.length > Number.One)
			{
				throw Array.Helpers.getSequenceContainsMoreThanOneElementError();
			}
		}

		function constructor()
		{
			this.extend = function(obj)
			{
				if(obj instanceof Array)
				{
					obj.copy = function() { return copy(obj); };
					/*obj.where = where;
					obj.first = first;
					obj.firstOrDefault = firstOrDefault;
					obj.last = last;
					obj.lastOrDefault = lastOrDefault;*/
				}
				return obj;
			}

		}

		function getInstance()
		{
			if(!(_instance instanceof Object))
			{
				_instance = new constructor();
			}

			return _instance;
		}

		if(_isExportToContext)
		{
			getInstance().extend(Array.prototype);
			_context.linq = getInstance().extend;
		}

		

		// Array extension
		function copySafe(fromArray)
		{
			var result;

			if(fromArray.length != Zero)
			{
				result = fromArray.slice(Zero);
			}
			else
			{
				result = [];
			}
			
			return result;
		}

		function copy(fromArray)
		{
			if(fromArray instanceof Array)
			{
				return copySafe(fromArray);
			}
			else
			{
				throw getIsNonArrayError();
			}
		}
/*
		Array.prototype.first = function(expression)
		{
			function firstWithExpression(array, expression)
			{
				var result = null, resultArray = array.where(expression);

				Array.Helpers.validateForSequenceIsEmpty(resultArray);
				result = resultArray[Number.Zero];

				return result;
			}

			function firstWithoutExpression(array)
			{
				Array.Helpers.validateForSequenceIsEmpty(array);
				var result = array[Number.Zero];

				return result;
			}

			var result = null;

			if(typeof(expression) === TypeNames.Function)
			{
				result = firstWithExpression(this, expression);
			}
			else
			{
				result = firstWithoutExpression(this);
			}
		
			return result;
		}

		Array.prototype.firstOrDefault = function(expression)
		{
			function firstOrDefaultWithExpression(array, expression)
			{
				var result = null, resultArray = array.where(expression);

				if(resultArray.length > Number.Zero)
				{
					result = resultArray[Number.Zero];
				}

				return result;
			}

			function firstOrDefaultWithoutExpression(array)
			{
				var result = null;

				if(array.length > Number.Zero)
				{
					result = array[Number.Zero];
				}

				return result;
			}

			var result = null;

			if(typeof(expression) === TypeNames.Function)
			{
				result = firstOrDefaultWithExpression(this, expression);
			}
			else
			{
				result = firstOrDefaultWithoutExpression(this);
			}
				
			return result;
		}

		Array.prototype.last = function(expression)
		{
			function lastWithExpression(array, expression)
			{
				var resultArray = array.where(expression);

				Array.Helpers.validateForSequenceIsEmpty(resultArray);

				var lastIndex = resultArray.length - Number.One, 
					result = resultArray[lastIndex];

       				return result;
			}

			function lastWithoutExpression(array)
			{
				Array.Helpers.validateForSequenceIsEmpty(array);
				var result = array[array.length - Number.One];

				return result;
			}

			var result = null;

			if(typeof(expression) === TypeNames.Function)
			{
				result = lastWithExpression(this, expression);
			}
			else
			{
				result = lastWithoutExpression(this);
			}

			return result;
		}

		Array.prototype.lastOrDefault = function(expression)
		{
			function lastOrDefaultWithExpression(array, expression)
			{
				var result = null, resultArray = array.where(expression), lastIndex = resultArray.length - Number.One;

				if(lastIndex > Number.MinusOne)
				{
					result = resultArray[lastIndex];
				}

				return result;
			}

			function lastOrDefaultWithoutExpression(array)
			{
				var result = null, lastIndex = array.length - Number.One;

				if(lastIndex > Number.MinusOne)
				{
					result = array[lastIndex];
				}

				return result;
			}

			var result = null;

			if(typeof(expression) === TypeNames.Function)
			{
				result = lastOrDefaultWithExpression(this, expression);
			}
			else
			{
				result = lastOrDefaultWithoutExpression(this);
			}

			return result;
		}

		Array.prototype.selectMany = function(expression)
		{
			function selectManySafe(array, expression)
			{
				function addToResult(innerArray, result)
				{
					if(typeof(innerArray) === TypeNames.Object && "length" in innerArray && innerArray.length > Number.Zero)
					{
						for(var innerIndex = Number.Zero; innerIndex < innerArray.length; innerIndex++)
						{
							result.push(innerArray[innerIndex]);
						}
					}
				}

				var result = [];
				for(var index = Number.Zero; index < array.length; index++)
				{
					addToResult(expression(array[index]), result);
				}

				return result;
			}

			var result = [];

			if(typeof(expression) === TypeNames.Function)
			{
				result = selectManySafe(this, expression);
			}

			return result;
		}

		Array.prototype.any = function(expression)
		{
			var array = this;

			if(typeof(expression) === TypeNames.Function)
			{
				array = this.where(expression);
			}

			var result = array.length > Number.Zero;
			return result;
		}

		Array.prototype.all = function(expression)
		{
			function allSafe(array, expression)
			{
				var result = true;

				for(var index = Number.Zero; result && (index < array.length); index++)
				{
					result = result && expression(array[index]);
				}

				return result;
			}

			var result = true;
				
			if(typeof(expression) === TypeNames.Function && this.length > Number.Zero)
			{
				result = allSafe(this, expression);
			}

			return result;
		}

		Array.prototype.contains = function(item)
		{
			var result;

			if(typeof(item) !== TypeNames.Undefined && item !== null && this.length > Number.Zero)
			{
				result = this.indexOf(item) > Number.MinusOne;
			}
			else
			{
				result = false;
			}

			return result;
		}

		Array.prototype.except = function(array, comparerExpression)
		{
			function exceptSafe(sourceArray, exceptArray, comparerExpression)
			{
				function addToResultWithComparerExpression(addToResultWithComparerExpressionArgs)
				{
					var isFound = false;

					for(var index = Number.Zero, isFound = false;
						index < addToResultWithComparerExpressionArgs.exceptArray.length && !isFound; 
						index++ )
					{
						isFound = addToResultWithComparerExpressionArgs.comparerExpression(addToResultWithComparerExpressionArgs.element, 
							addToResultWithComparerExpressionArgs.exceptArray[index]);
					}

					if(!isFound)
					{
						addToResultWithComparerExpressionArgs.resultArray.push(addToResultWithComparerExpressionArgs.element);
					}

				}

				function addToResultWithoutComparerExpression(addToResultWithoutComparerExpressionArgs)
				{
					if(!addToResultWithoutComparerExpressionArgs.exceptArray.contains(addToResultWithoutComparerExpressionArgs.element))
					{
						addToResultWithoutComparerExpressionArgs.resultArray.push(addToResultWithoutComparerExpressionArgs.element);
					}
				}

				function addToResult(addToResultArgs)
				{
					if(typeof(addToResultArgs.comparerExpression) !== TypeNames.Undefined)
					// && !addToResultArgs.resultArray.any( function(item) { return addToResultArgs.comparerExpression( item, addToResult.element ) } )
					{
						addToResultWithComparerExpression(addToResultArgs);
					}
					else 
					//if(!addToResultArgs.resultArray.contains(addToResultArgs.element))
					{
						addToResultWithoutComparerExpression(addToResultArgs);
					}
				}

					var result = [];

				for(var index = Number.Zero; index < sourceArray.length; index++)
				{
					addToResult({element: sourceArray[index], 
						exceptArray: exceptArray, 
						comparerExpression: comparerExpression,
						resultArray: result});

				}

				return result;
				
  			}

			var result = this;

			if(typeof(array) === TypeNames.Object
				&& "length" in array
				&& array.length !== Number.Zero)
			{
				result = exceptSafe(this, array, comparerExpression);
			}

			return result;
		}

		Array.prototype.intersect = function(array, comparerExpression)
		{
			function intersectSafe(thisArray, array, comparerExpression)
			{
				function intersectWithComparerExpressionSafe(thisArray, array, comparerExpression)
				{
					function addToResult(args)
					{
						var isFound = false;
						for(var index = Number.Zero; !isFound && index < args.array.length; index++)
						{
							isFound = args.comparerExpression(args.element, args.array[index]);
						}
						if(isFound)
						{
							args.resultArray.push(args.element);
						}
					}

					var result = [];

					for(var index = Number.Zero; index < thisArray.length; index++)
					{
						addToResult({element: thisArray[index], array: array, comparerExpression: comparerExpression, resultArray: result});
					}

					return result;
				}

				function intersectWithoutComparerExpressionSafe(thisArray, array)
				{
					function addToResult(element, array)
					{
						if(array.contains(element))
						{
							result.push(element);
						}

					}
					var result = [];

					for(var index = Number.Zero; index < thisArray.length; index++)
					{
						addToResult(thisArray[index], array, result);
					}

					return result;
				}

				var result;

				if(typeof(comparerExpression) === TypeNames.Function)
				{
					result = intersectWithComparerExpressionSafe(thisArray, array, comparerExpression)
				}
				else
				{
					result = intersectWithoutComparerExpressionSafe(thisArray, array);
				}

				return result;
			}

			var result = [];

			if(this.length > Number.Zero &&
				typeof(array) === TypeNames.Object &&
				"length" in array && array.length > Number.Zero)
			{
				result = intersectSafe(this, array, comparerExpression);
			}

			return result;
		}

		Array.prototype.union = function(array, comparerExpression)
		{
			function unionSafe(thisArray, array, comparerExpression)
			{
				function unionSafeWithComparer(args)
				{
					function addArray(resultArray, array, comparerExpression)
					{
						function addToResult(resultArray, element, comparerExpresion)
						{
							if(!Array.Helpers.isInArray(resultArray, element, comparerExpression))
							{
								resultArray.push(element);
							}
						}

						for(var index = Number.Zero; index < array.length; index++)
						{
							addToResult(resultArray, array[index], comparerExpression);
						}
        				}

					var result = [];

					addArray(result, thisArray, comparerExpression);
					addArray(result, array, comparerExpression);


					return result;
				}

				var result = unionSafeWithComparer(thisArray, array, comparerExpression);
				return result;
			}

			var result = [];

			if(typeof(array) === TypeNames.Object &&
				"length" in array &&
				(this.length > Number.Zero || array.length > number.zero))
			{
				result = unionSafe(this, array, comparerExpression);
			}
        				return result;
		}
			
		Array.prototype.equals = function(array)
		{
			function equalsSafe(thisArray, array)
			{
				function equalsElementsSafe(thisArray, array)
				{
					var result = true;

					for(var index = Number.Zero; index < thisArray.length && result; index++)
					{
						result = ((typeof(thisArray[index]) === TypeNames.Object || typeof(thisArray[index]) === TypeNames.Function) && "equals" in thisArray[index] && thisArray[index].equals(array[index]))
							 || thisArray[index] === array[index];
					}

					return result;
				}

				var result = false;

				if(thisArray.length === array.length)
				{
					result = equalsElementsSafe(thisArray, array);
				}

				return result;
			}

			var result = false;

			if(typeof(array) === TypeNames.Object && "length" in array)
			{
				result = equalsSafe(this, array);
			}

			return result;
		}

		Array.prototype.each = function(fn, argsArray)
		{
			function eachSafe(array, fn, argsArray)
			{
				function createParameters(argsArray, item)
				{
					var result = argsArray.copy();

					result.splice(Number.Zero, Number.Zero, item);
					return result;
				}
				
				function pushToResult(pushToResultArgs)
				{
					var parameters = createParameters(pushToResultArgs.ArgsArray, pushToResultArgs.Item);
					var fnResult = pushToResultArgs.Fn.apply(this, parameters)
					if(typeof(fnResult) != TypeNames.Undefined)
					{
						pushToResultArgs.Result.push(fnResult);
					}
				}

				var result = [];

				for(var index = Number.Zero; index < array.length; index++)
				{
					pushToResult(
						{
							
							ArgsArray: argsArray, 
							Item: array[index], 
							Fn: fn, 
							Result: result
						});
				}

				return result;
			}

			function initializeArgsArray(argsArray)
			{
				var result;

				if(typeof(argsArray) === TypeNames.Object && argsArray !== null && "length" in argsArray)
				{
					result = argsArray;
				}
				else
				{
					result = [];
				}
						
				return result;
			}

			var result = [];

			argsArray = initializeArgsArray(argsArray);
				

			if(typeof(fn) === TypeNames.Function)
			{
				result = eachSafe(this, fn, argsArray);
			}

			return result;
		}

		Array.prototype.where = function(whereFunction)
		{
			function whereSafe(array, whereFunction)
			{
				var result = array.each(function(item)
				{
					if(whereFunction(item) === true)
					{
						return item;
					}
				});
					
				return result;
			}
		
			var result = this;

			if(typeof(whereFunction) === TypeNames.Function)
			{
				result = whereSafe(this, whereFunction);
			}

			return result;
		}

		Array.prototype.distinct = function(expression)
		{
			function distinctSafe(array, expression)
			{
				var result = [];
					
				for(var index = Number.Zero; index < array.length; index++)
				{
					if(result.indexOf(array[index]) < Number.Zero)
					{
						result.push(array[index]);
					}
				}

				return result;
			}

			var result = this;

			if(typeof(expression) === TypeNames.Function && this.length > Number.Zero)
			{
				result = distinctSafe(this, expression);
			}

			return result;
				
		}

		Array.prototype.single = function(expression)
		{
			function singleSafe(array)
			{
				Array.Helpers.validateForSequenceIsEmpty(array);
				Array.Helpers.validateForSequenceContainsMoreThenOneElement(array);

				var result = array[Number.Zero];

				return result;
			}

			var result = this;

			if(typeof(expression) === TypeNames.Function && this.length > Number.Zero)
			{
				result = this.where(expression);
			}

			result = singleSafe(result);

			return result;
		}


		Array.prototype.select = function(fn)
		{
			var result = [];

			if(typeof(fn) == TypeNames.Function)
			{
				result = this.each(function(item){
					return fn(item);
				});
			}

			return result;
		}

		// valueExpressionFn = function that returns array item value (by item parameter) to group by
		Array.prototype.groupBy = function(valueExpressionFn)
		{
			function groupBySafe(array, valueExpressionFn)
			{
				var result = {};

				array.each(function(item, valueExpressionFn, result)
				{
					var value = valueExpressionFn(item);
					if(typeof(value) !== TypeNames.Undefined && !(value in result)) 
					{
						result[value] = 
						{
							value: value,
							items: []
						}
					}
					result[value].items.push(value);

				}, [valueExpressionFn, result]);

				return result;
					
			}

			var result = {};

			if(typeof(valueExpressionFn) === TypeNames.Function)
			{
				result = groupBySafe(this, valueExpressionFn);
			}

			return result;
		}

		Array.prototype.customJoin = function(rightArray, predicateFn, selectFn, context)
		{
			function customJoinSafe(customJoinSafeArgs)
			{
				var result = [];

				customJoinSafeArgs.LeftArray.each(function(leftItem, eachArgs)
				{
					eachArgs.RightArray.each(function(rightItem, eachArgs)
					{
						if(eachArgs.PredicateFn(eachArgs.LeftItem, rightItem, eachArgs.Context) === true)
						{
							result.push(eachArgs.SelectFn(eachArgs.LeftItem, rightItem, eachArgs.Context));
						}
					}, [{LeftItem: leftItem, 
						PredicateFn: eachArgs.PredicateFn,
						SelectFn: eachArgs.SelectFn,
						Context: context,
						Result: eachArgs.Result}]);
				}, [{RightArray:customJoinSafeArgs.RightArray, 
					PredicateFn: customJoinSafeArgs.PredicateFn, 
					SelectFn: customJoinSafeArgs.SelectFn,
					Context: customJoinSafeArgs.Context,
					Result: result}]);

				return result;
			}

			var result = [];

			if(typeof(rightArray) === TypeNames.Object && rightArray !== null && "length" in rightArray
				&& typeof(predicateFn) === TypeNames.Function
				&& typeof(selectFn) === TypeNames.Function)
			{
				result = customJoinSafe(
					{
						LeftArray: this, 
						RightArray: rightArray, 
						PredicateFn: predicateFn, 
						SelectFn: selectFn,
						Context: context
					});
			}				

			return result;
		}

		Array.prototype.innerJoin = function(rightArray, leftKeyFn, rightKeyFn, selectFn)
		{
			function innerJoinSafe(innerJoinSafeArgs)
			{
				var result = innerJoinSafeArgs.LeftArray.customJoin(                                                                                                   
					innerJoinSafeArgs.RightArray, 
					function(leftItem, rightItem, keyFns) { return keyFns.LeftKeyFn(leftItem) === keyFns.RightKeyFn(rightItem); },
					innerJoinSafeArgs.SelectFn,
					{
						LeftKeyFn: innerJoinSafeArgs.LeftKeyFn,
						RightKeyFn: innerJoinSafeArgs.RightKeyFn
					}
				);
					
				return result;
			}

			var result = [];
				
			if(typeof(rightArray) === TypeNames.Object && rightArray !== null && "length" in rightArray
				&& typeof(leftKeyFn) === TypeNames.Function
				&& typeof(rightKeyFn) === TypeNames.Function
				&& typeof(selectFn) === TypeNames.Function)
			{
				result = innerJoinSafe(
					{
						LeftArray: this,
						RightArray: rightArray,
						LeftKeyFn: leftKeyFn,
						RightKeyFn: rightKeyFn,
						SelectFn: selectFn
					});
			}

			return result;
		}

		Array.prototype.outerJoin = function(rightArray, leftKeyExpression, rightKeyExpression, selectExpression)
		{
			var DefaultIsFound = false;

			function validate(args)
			{
				Array.Helpers.validateIsArray(args.rightArray);
				Function.Helpers.validateIsFunction(args.leftKeyExpression);
				Function.Helpers.validateIsFunction(args.rightKeyExpression);
				Function.Helpers.validateIsFunction(args.selectExpression);
			}

			function outerJoinSafe(args)
			{
				function joinLeftArray(args)
				{
					function addToResult(args)
					{
						function addToResult(args)
						{
							var result = args.leftKeyExpression(args.leftElement) === args.rightKeyExpression(args.rightElement);

							if(result)
								//&& !args.resultArray( function(item) { return item.leftItem === args.leftElement && item.rightItem === args.leftElement;  } )
							{
								args.resultArray.push({ leftItem: args.leftElement, rightItem: args.rightElement });
							}

							return result;
						}
		
						var isFound = DefaultIsFound;
						for(var index = Number.Zero; index < args.rightArray.length; index++)
						{
							isFound = isFound | addToResult({leftElement: args.element, rightElement: args.rightArray[index],
								leftKeyExpression: args.leftKeyExpression,
								rightKeyExpression: args.rightKeyExpression,
								resultArray: args.resultArray});
						}

						if(!isFound)
						{
							result.push({leftItem: args.element, rightItem: null});
						}
					}

					for(var index = Number.Zero; index < args.leftArray.length; index++)
					{
						addToResult({element: args.leftArray[index], rightArray: args.rightArray, 
							leftKeyExpression: args.leftKeyExpression, rightKeyExpression: args.rightKeyExpression,
							resultArray: args.resultArray});
					}
				}

				function joinRightArray(args)
				{
					for(var index = Number.Zero; index < args.rightArray.length; index++)
					{
						if(typeof(args.rightArray[index]) !== TypeNames.Undefined && args.rightArray[index] !== null)
						{
							var rightKey = args.rightKeyExpression(args.rightArray[index]);
							if(!args.resultArray.any( function(item) { return item.rightItem != null && args.rightKeyExpression(item.rightItem) === rightKey; }))
							{
								args.resultArray.push({leftItem: null, rightItem: args.rightArray[index]});
							}
						}
					}

				}

				var result = [];

				joinLeftArray({leftArray: args.leftArray, rightArray: args.rightArray, 
					leftKeyExpression: args.leftKeyExpression, rightKeyExpression: args.rightKeyExpression,
					resultArray: result});

				joinRightArray({leftArray: args.leftArray, rightArray: args.rightArray,
					leftKeyExpression: args.leftKeyExpression, rightKeyExpression: args.rightKeyExpression,
					resultArray: result});

				result = result.select( function(item) {
					return args.selectExpression(item.leftItem, item.rightItem)
				});


				return result;
			}
				                                           
			var result = [];

			validate({rightArray: rightArray, leftKeyExpression: leftKeyExpression, rightKeyExpression: rightKeyExpression, selectExpression: selectExpression});

			var result = outerJoinSafe({leftArray: this,
				rightArray: rightArray, 
				leftKeyExpression: leftKeyExpression, rightKeyExpression: rightKeyExpression, 
				selectExpression: selectExpression});

			return result;
				
		}

			// Require Math extensions, Number extensions
		Array.prototype.max = function(fn)
		{
			function maxSafe(array, fn)
			{
				var result = NaN;

				for(var index = Number.Zero, value; index < array.length && ((value = fn(array[index])) || true); index++)
				{
					if(typeof(value) === TypeNames.Number && (isNaN(result) || result < value))
					{
						result = value;
					}
				}

				return result;
			}

			var result = NaN;

			if(typeof(fn) === TypeNames.Function && this.length > Number.Zero)
			{
				result = maxSafe(this, fn);
			}

			return result;
		}


		Array.prototype.min = function (fn)
		{
			function minSafe(array, fn)
			{
				var result = NaN;
   
				for(var index = Number.Zero, value; index < array.length && ((value = fn(array[index])) || true); index++)
				{
					if(typeof(value) === TypeNames.Number && (isNaN(result) || value < result))
					{
						result = value;
					}
				}
  
				return result;
			}

			var result = NaN;

			if (typeof(fn) === TypeNames.Function &&  this.length > Number.Zero)
			{
				result = minSafe(this, fn);
			}

			return result;
		}

		Array.prototype.sum = function(expression)
		{
			function sumSafe(array, expression)
			{
				var result = Number.Zero;

				for(var index = Number.Zero, value; index < array.length && ((value = expression(array[index])) || true); index++)
				{
					if(typeof(value) === TypeNames.Number)
					{
						result += value;
					}
				}
					
				return result;
			}

			var result = Number.Zero;

			if(typeof(expression) === TypeNames.Function && this.length > Number.Zero)
			{
				result = sumSafe(this, expression);
			}

			return result;
		}

		Array.prototype.avg = function(expression)
		{
			function avgSafe(array, expression)
			{
				var result = array.sum(expression) / array.length;

				return result;
			}

			var result = NaN;
			// TODO: Vaidate is it expression (is it a function which is returns value)
			if(typeof(expression) === TypeNames.Function && this.length > Number.Zero)
			{
				result = avgSafe(this, expression);
			}

			return result;
		}

		Array.prototype.skip = function(count)
		{
			function skipSafe(array, count)
			{
				function getSkimMethodCountTooMuchError()
				{
					var errorMessage = "Invalid count argument value. Skip mehtod accept count less or equal then array length.";
					var error = new Error(errorMessage);

					return error;
				}

				if(count > array.length)
				{
					throw getSkimMethodCountTooMuchError();
				}
				var result = array.slice(count);
				return result;
			}
			var result = this;
			
			if(typeof(count) === TypeNames.Number)
			{
				result = skipSafe(this, count)
			}

			return result;
		}

		Array.prototype.skipWhile = function(expression)
		{
			function skipWhileSafe(array, expression)
			{
				var result;

				for(var index = Number.Zero; index < array.length; index++)
				{
					if(!expression(array[index]) && ((result = array.slice(index)) || Number.One === Number.One))
					{
						break;
					}
				}

				return result;
			}

			var result = this;
			
			if(typeof(expression) === TypeNames.Function && this.length > Number.Zero)
			{
				result = skipWhileSafe(this, expression);
			}

			return result;
		}

		Array.prototype.take = function(count)
		{
			var result = this;

			if(typeof(count) === TypeNames.Number
				&& count > Number.MinusOne)
			{
				result = this.slice(Number.Zero, count);
			}

			return result;
		}

		Array.prototype.count = function(expression)
		{
			var result = this.where(expression).length;
			return result;
		}
*/
	})();