(function(mountPoint, dependencies)
{
	var 	TypesNames = { Undefined: 'undefined', Boolean: 'boolean' },
		CompleteTypes = { Failed: 0, Done: 1 },
		CallStatus = { NotInitialized: -1, NotStarted: 0, InProgress: 1, Error: 2, Success: 4 },
		Zero = 0,
		One = 1,
		Two = 2;

	function slice(collection, fromIndex)
	{
		var result;

		if(fromIndex < collection.length)
		{
			result = Array.prototype.slice.call(collection, fromIndex);
		}
		else
		{
			result = [];
		}

		return result;
	}


	var _dependencies = dependencies || {},
		logger = _dependencies.logger || null;
		
	function constructor(context, method)
	{
		var 	_this = this,
			_callParameters = { callStatus: CallStatus.NotInitialized },
			// Completed queues. When no success, error handlers attached it collect done, error calls to don't forget them.
			_completed = [],
			// The flag that indicates that done or faile was processed (calles succes or error handled)
			//_isHandled,
			// The flag that indicates that done or fail was processed (called one of the operations)
			_isChainProcessed,
			_deferred = null,
			_success,
			_error,
			_successCommon,
			_errorCommon,
			_doneCount = Zero;

			
		// The mehtod that executes a single func with a specified funcArgs
		// Returns a Deffered object
		this.init = function(context, method)
		{
			enqueue(context, method, arguments);
                        complete();
			//return _deferred;
			return _this;
		}

		this.single = function(context, method)
		{
			var result = getDeferred().init.apply(this, Array.prototype.slice.call(arguments, Zero));

                        complete();

			return result;
		}

		// Get the flag that indicates is operation already done.
		this.getIsDone = function()
		{
			return _callParameters.callStatus === CallStatus.Success
				|| _callParameters.callStatus === CallStatus.Error;
		}

		// Get the operation call status: not started, in progress, error, success.
		this.getCallStatusType = function()
		{
			return _callParameters.callStatus;
		}

		// Get the operation error or null.
		this.getError = function()
		{
			return _callParameters.error || null;
		}

		// Get the operation call result or null.
		this.getCallResult = function()
		{
			return _callParameters.callResult || null;
		}

		// Should be executed before wait for done or error. May be done or fail was called before.
		function complete()
		{
			_isChainProcessed = false;
			while(_completed.length !== Zero)
			{
				completeOne(_completed[Zero]);
				if(!_isChainProcessed)
				{
					break;
				}
				completedDequeue();
			}
		}

		// Complete processors hash. Each processor process it's own complete type: done, failed, etc...
		var completeProcessors = 
		{
			// CompleteTypes.Failed: 
			0: function(completeParameters) { callDeferredFailed(completeParamters.error); },
			// CompleteTypes.Done: 
			1: function(completeParameters) { callDeferredDone(completeParameters.callResult); }
		};

		function completeOne(completeParameters)
		{
			completeProcessors[completeParameters.completeType](completeParameters);			
		}

		// Should be caller when parent operation is done.
		this.done = function(callResult)
		{
			beginCompleteDone(callResult);

			if(isProcess())
			{
				doneInternal(callResult);
			}

			rollbackComplete();
		}


		function beginCompleteDone(callResult)
		{
			_isChainProcessed = false;
			_completed.push({ completeType: CompleteTypes.Done, callResult: callResult });
		}

		function rollbackComplete()
		{
			if(_isChainProcessed)
			{
				completedDequeue();
			}
		}

		function isProcess()
		{
			var result = !_callParameters || (_callParameters.callStatus !== CallStatus.IsProgress);

			return result;
		}

		function done(callResult)
		{

			beginCompleteDone(callResult);
			
			doneInternal(callResult);

			rollbackComplete();
		}

		function doneInternal(callResult)
		{
			// If any returns false - stop chain execution otherwise continue.
			if(!success(callResult))
			{
				continueExecution(callResult);
			}
		}

		function success(callResult)
		{
			var callSuccessFlag = (callSuccess(callResult) === false),
				callSuccessCommonFlag = (_this.successCommon(callResult).callResult),
				isStop = callSuccessFlag || callSuccessCommonFlag;

			return isStop;

		}

		// Should be called when the parent operation is failed.
		this.failed = function(error)
		{
			beginCompleteFailed(error);

			if(isProcess())
			{
				failedInternal(error);
			}

			rollbackComplete();
		}

		function failed(error)
		{
			beginCompleteFailed(error);

			failedInternal(error);

			rollbackComplete();
		}

		function beginCompleteFailed(error)
		{
			_isChainProcessed = false;
			_completed.push({ completeType: CompleteTypes.Failed, error: error });
		}

		function failedInternal(error)
		{
			// If at least one is true and no one is false - continue execution.
			if(errorFn(error))
			{
				continueExecution(error);
			}
		}

		function errorFn(error)
		{
			var errorFlag = callError(error),
				errorComonFlag = _this.errorCommon(error),
				isContinue = (errorFlag === true || errorComonFlag.callResult);

			return isContinue;
		}

		// The method that should be called to execute sync success callback.
		function callSuccess(callResult)
		{
			if(_success instanceof Function)
			{
				//_isChainProcessed = true;
				return callSafe(this, _success, [callResult]);
			}
		}

		// The method that should be called to execute sync success common callback.
		this.successCommon = function(callResult)
		{
			var 	successCommonResult = callSuccessCommon(callResult),
				deferredSuccessCommonResult = callDeferredSuccessCommon(callResult),
				result = { isCalled: successCommonResult.isCalled 
						|| deferredSuccessCommonResult.isCalled, 
					callResult: (successCommonResult.isCalled 
							&& successCommonResult.callResult === false)
						|| (deferredSuccessCommonResult.isCalled 
							&& deferredSuccessCommonResult.callResult === false) };

			if(result.isCalled)
			{
				//_isChainProcessed = true;
			}

			return result;
		}

		// The method that should be called to execute current sync success common callback.
		function callSuccessCommon(callResult)
		{
			var result = { isCalled: false, callResult: null };

			if(_successCommon instanceof Function)
			{
				result.isCalled = true;
				result.callResult = callSafe(this, _successCommon, [callResult]);
			}

			return result;
		}

		// The method that should be called to execute next deffered in chain sync successs common callback wrapper.
		function callDeferredSuccessCommon(callResult)
		{
			var result = { isCalled: false, callResult: null };

			if(_deferred !== null)
			{
				result = callSafe(this, _deferred.successCommon, [callResult]);
			}

			return result;
		}

		// The method that should be called to execute sync error callback.
		function callError(error)
		{
			var result;

			if(_error instanceof Function)
			{
				result = callSafe(this, _error, [error]);
				//_isChainProcessed = true;
			}

			return result;
		}

		// The method that calls both current error common and deferred error common handlers and returns true if at least one of them return Boolean true.
		this.errorCommon = function(error)
		{
			// If required to detect does anythin was called in a common chain, we can return hash with a: first - what callback returned, second does callback was called at all.
			// And then we can & second to determine does was called some common handler or not.
			var errorCommonResult = callErrorCommon(error),
				deferredErrorComonResult = callDeferredErrorCommon(error),
				result = { 
						isCalled:  errorCommonResult.isCalled || deferredErrorComonResult.isCalled,
						callResult: (errorCommonResult.isCalled && errorCommonResult.callResult === true)
								|| (deferredErrorComonResult.isCalled && deferredErrorComonResult.callResult === true) 
					};

			if(result.isCalled)
			{
				//_isChainProcessed = true;
			}

			return result;
		}

		// The method that should be called to execute sync error common callback.
		function callErrorCommon(error)
		{
			var result = { isCalled: false, callResult: null };

			if(_errorCommon instanceof Function)
			{
				result.isCalled = true;
				result.callResult = callSafe(this, _errorCommon, [error]);
			}

			return result;
		}

		function callDeferredErrorCommon(error)
		{
			var result = { isCalled: false, callResult: null };

			if(_deferred !== null
				&& (_deferred.errorCommon instanceof Function))
			{
				result = callSafe(this, _deferred.errorCommon, [error]);
			}

			return result;
		}

		// The methd that should be called after all current task handlers (success, error, success common, error common) was executed.
		// This need to continue execution of a current deffered task(s).
		function continueExecution(currentResult)
		{
			if(_callParameters !== null)
			{
				callNext(currentResult);
			}
		}

		// The method that calls operation and process result.
		function callNext(currentResult)
		{
			if(_callParameters.callStatus !== CallStatus.InProgress
				&& _callParameters.callStatus !== CallStatus.NotInitialized)
			{
				_callParameters.callStatus = CallStatus.InProgress;
				var     callArgs = createCallArgs(_callParameters.argsCollection, currentResult),
					wrappedCallResult = callMethod(_callParameters.context, _callParameters.method, callArgs);
				handleCallResult(wrappedCallResult);
			}
		}

		function createCallArgs(argsCollection, currentResult)
		{
			var result = (argsCollection || []).slice(Zero);

			if(!!currentResult)
			{
				result.push(currentResult);
			}

			return result;
		}

		function callMethod(context, method, args)
		{
			var result = { callStatus: CallStatus.NotStarted };

			try
			{
				result.callResult = method.apply(context, args);
				result.callStatus = CallStatus.Success;
			}
			catch(error)
			{
				result.error = error;
				result.callStatus = CallStatus.Error;
			}

			return result;
		}

		// The method that process operation call result.
		function handleCallResult(wrappedCallResult)
		{
			if(wrappedCallResult.callStatus === CallStatus.Error)
			{
				handleSimpleErrorCallResult(wrappedCallResult.error);
			}
			else if(!isDeferred(wrappedCallResult.callResult))
			{
				handleSimpleSuccessCallResult(wrappedCallResult.callResult);
			}
			else
			{
				handleDeferredCallResult(wrappedCallResult.callResult);
			}
		}

		function handleSimpleErrorCallResult(error)
		{
			_callParameters.callStatus = CallStatus.Error;
			_callParameters.error = error;
			errorFn(error);
			callDeferredFailed();
		}

		function handleSimpleSuccessCallResult(callResult)
		{
			_callParameters.callStatus = CallStatus.Success;
			_callParameters.callResult = callResult;
			success(callResult);
			callDeferredDone();
		}

		function handleDeferredCallResult(callResultDeferred)
		{
			_callParameters.callResultDeferred = callResultDeferred;
			attachToCallResultDeferredSafe();
						
		}

		function isDeferred(callResult)
		{
			var result = typeof(callResult) !== TypesNames.Undefined && callResult !== null
				&& ((callResult.onSuccess instanceof Function) || (callResult.onError instanceof Function));

			return result;
		}


		function callDeferredDone()
		{
			if(_deferred !== null &&
				(_deferred.done instanceof Function))
			{
				callSafe(this, _deferred.done, [_callParameters.callResult]);
				_isChainProcessed = true;
			}
		}

		function getDeferred()
		{
			if(_deferred === null)
			{
				createDeferred();
			}

			return _deferred;
		}

		function callDeferredFailed()
		{
			if(_deferred !== null
				&& (_deferred.failed instanceof Function))
			{
				callSafe(this, _deferred.failed, [_callParameters.error]);
				_isChainProcessed = true;
			}
		}

		function prepareDeferred()
		{
			if(_deferred === null)
			{
				createDeferred();
			}
		}

		function attachToCallResultDeferredSafe()
		{
			//prepareDeferred();
			attachToCallResultDeferredOnSuccess();
			attachToCallResultDeferredOnError();
		}

		function attachToCallResultDeferredOnSuccess()
		{
			var callResultDeferred = _callParameters.callResultDeferred;

			if (callResultDeferred.onSuccess instanceof Function)
			{
				callResultDeferred.onSuccess(callResultDeferredSuccess);
			}
		}

		function attachToCallResultDeferredOnError()
		{
			var callResultDeferred = _callParameters.callResultDeferred;

			if(callResultDeferred.onError instanceof Function)
			{
				callResultDeferred.onError(callResultDeferredError);
			}
		}

		// Called when operation is async and returns deffered and it successfully done.
		function callResultDeferredSuccess(callResult)
		{
			_callParameters.callStatus = CallStatus.Success;
			_callParameters.callResult = callResult;
			//callDeferredDone();
			success(callResult);
		}

		// Called when operation is async and returns deferred and it done with an error.
		function callResultDeferredError(error)
		{
			_callParameters.callStatus = CallStatus.Error;
			_callParameters.error = error;
			//callDeferredFailed();
			errorFn(error);
		}

		function callSafe(context, method, argsCollection)
		{
			try
			{
				return method.apply(context, argsCollection);
			}
			catch(error)
			{
				logError(error);
			}
		}

		// The method that specifies a callback function that will be called synchronously when a current task completed.
		// To continue asyn chain use async methods paradigm (single, all, any, ...)
		this.onSuccess = function(callback)
		{
			_success = callback;
			reSuccess();
			return _this;
		}

		// The method that should be called when operation already done and engine need to notify new on success handler.
		function reSuccess()
		{
			if(_this.getIsDone() && _callParameters.callStatus === CallStatus.Success)
			{
				callSuccess(_this.getCallResult());
			}
		}

		// The method that specifies a callback method that will be called synchronously when a current task completed.
		this.onError = function(callback)
		{
			_error = callback;
			reError();
			return _this;
		}

		// The method that should be called when oprtaion already 
		function reError()
		{
			if(_this.getIsDone() && _callParameters.callStatus === CallStatus.Error)
			{
				callError(_this.getError());
			}
		}

		// The method that specifies common sync success handler.
		this.onSuccessCommon = function(callback)
		{
			_successCommon = callback;
			reSuccessCommon();
			return _this;
		}

		function reSuccessCommon()
		{
			if(_this.getIsDone() && _callParameters.callStatus === CallStatus.Success)
			{
				_this.successCommon(_this.getCallResult());
			}
		}

		// The method that specifies common sync error handler.
		this.onErrorCommon = function(callback)
		{
			_errorCommon = callback;
			reErrorCommon();
			return _this;
		}

		function reErrorCommon()
		{
			if(_this.getIsDone() && !_callParameters.callStatus === CallStatus.Error)
			{
				_this.errorCommon(_this.getError());
			}
		}

		// Private
		// Queue
		function enqueue(context, method, args)
		{
			_callParameters =
				{
					context: context,
					method: method,
					argsCollection: slice(args, Two),
					callStatus: CallStatus.NotStarted
				};

		}
		// Deferred
		function createDeferred()
		{
			_deferred = new constructor();
		}

		// Other
		function completedDequeue()
		{
			_completed.splice(Zero, One);
		}

		// Helpers
		function arrayCelear(array)
		{
			while(array.length !== Zero)
			{
				array.pop();
			}
		}


		function logError(error)
		{
			if(logger != null)
			{
				logger.logError(error);
			}
		}

		//return _this.single(context, method, slice(arguments, Two));
	}

	constructor.single = function(context, func)
	{
		var deferred = new constructor();
		result = deferred.init.apply(this, ([context || this, func]).concat(slice(arguments, Two)) );

		//deferred.done();
		deferred.done();

		return result;
	}

	constructor.any = function(context, callsInfos)
	{
		var result = many(context, callsInfos,
			function(allResults, successCount)
			{
				var result = successCont > Zero;

				return result;
			});

		return result;
	}

	constructor.all = function(context, callsInfos)
	{

		var result = many(context, callsInfos,
			function(allResults, successCount) 
			{ 
				var result = allResults.length === successCount;

				return result;
			});

		return result;
	}

	function many(context, callsInfos, donePredicate)
	{
		var processingInfo = manyInitializeProcessingInfo(context, callsInfos);

		manyInitialize(processingInfo, donePredicate);

		manyExecute(processingInfo);

		return processingInfo.deferred;

	}

	function manyInitializeProcessingInfo(context, callsInfos)
	{
		var result = 
			{	
				context: context,
				callsInfos: callsInfos,
				deferred: new constructor(), 
				callsResults: [],  
				successCount: Zero 
			};
		return result;

	}

	function manyInitialize(processingInfo, donePredicate)
	{
		for(var index = Zero; index < processingInfo.callsInfos.length; index++)
		{
			var callInfo = processingInfo.callsInfos[index],
				callDeferred = new constructor(),
				singleDeferred = callDeferred.single.apply(this, callInfo.func, [callInfo.context || processingInfo.context || this].concat(callInfo.args || []));
			manyAttachSingleDeferredHandlers(processingInfo, singleDeferred, donePredicate);
			processingInfo.callsResults.push(singleDeferred);
		}

	}

	function manyAttachSingleDeferredHandlers(processingInfo, singleDeferred, donePredicate)
	{
		singleDeferred.onError(function(error) 
			{
				for(var index = Zero; index < processingInfo.callResults.length; index++)
				{
					processingInfo.callResults[index].abort();
				}
				processingInfo.deferred.failed(error); 
			} );

		singleDeferred.onSuccess(function(error)
			{
				if(donePredicate(processingInfo.callsResults, ++processingInfo.successCount))
				{
					processingInfo.deferred.done();
				} 
			});
	}

	function manyExecute(processingInfo)
	{
		for(var index = Zero; index < processingInfo.callsResults; index++)
		{
			var callResult = processingInfo.callsResults[index];
			callResult.done();
		}
	}

	//return constructor;
	if(typeof mountPoint !== TypesNames.Undefined)
	{
		// Exports
		mountPoint.CallStatus = CallStatus;
		mountPoint.Deferred = constructor;
	}
})(typeof ns !== 'undefined' ? ns('SRD.Multitasking') : this);