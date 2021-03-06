/*
+======================================================================================================================+
#                                                                                                                      #
#  Copyright 2016 Systems Research & Developemnt Ltd                                                                   #
#  Author: Rostislav Nikitin                                                                                           #
#                                                                                                                      #
#  Description: JS method (language extension):                                                                        #
#   - public static void require(string name [required], string path [optional])                                       # 
#       Load a javacript file with a specified name by a specfied path. Load in case a javacript file for a            #
#	specified name was not loaded.                                                                                 #
#       If path is ommited then path will be built by a next template: 'basePath/name.extension'.                      #
#       Base path, does add extension and what extension to add can be configured once                                 #
#       till require type initialization through config parameter. Or specified in the SRD.Require.Config object       #
#                                                                                                                      #
+======================================================================================================================+
*/
// Static type. Singletone pattern was used to avoid multiple instances will be created.
(function(mountPoint, context)
{
	// Private static constants
	var 	TypesNames = { Undefined: 'undefined', Boolean: 'boolean', String: 'string', Function: 'function', Object: 'object' },
		Zero = 0,
		One = 1,
		EmptyString = '',
		PointCharacter = '.', 
		SlashCharacter = '/',
		DefaultIsSplitName = false,
		DefaultIsAddJsExtension = true,
		DefaultJsExtension = 'js',
		DefaultConfig = { isSplitName: DefaultIsSplitName, basePath: '.', isAddJsExtension:  true, jsExtension: 'js' },
	// Private static variables
		_mountPoint = mountPoint,
		_context = context || this,
		_instance;
	// Private static methods
	function trim(str)
	{
		var result;

		if(typeof(str) === TypesNames.String)
		{
			result = str.replace(/^\s*/, EmptyString).replace(/\s*$/, EmptyString);
		}
		else
		{
			result = str;
		}

		return result;
	}

	// The constructor
	function constructor()
	{
		// Private instance variables
		var 	_this = this,
			_config = DefaultConfig,
			_scripts = {};

		// Public instance methods
		this.useConfig = function(config)
		{
			if(typeof(config) === TypesNames.Object)
			{
				useConfigSafe(config);
			}

			return _this;
		}

		this.require = function(nameOrCollection, pathOrConfig, config)
		{
			var deferred = new Deferred();
			//alert(pathOrConfig);
			if(typeof(nameOrCollection) === TypesNames.Object && nameOrCollection !== null && "length" in nameOrCollection)
			{
				requireCollection(nameOrCollection, pathOrConfig, deferred);
			}
			else if(typeof(nameOrCollection) === TypesNames.String)
			{
				requireOne(nameOrCollection, pathOrConfig, config, deferred);
			}

			return deferred;
		}


		// The deferred class
		var Deferred = (function(require)
			{
				var 	Zero = 0,
					One = 1;

				function copyArguments(inArgs)
				{
					var result = [];

					for(var index = Zero; index < inArgs.length; index++)
					{
						result.push(inArgs[index]);
					}

					return result;
				}

				function constructor()
				{
					var 	_this = this,
						_arguments,
						_tasksCount = Zero,
						_success,
						_error;

					this.require = function()
					{
						_this.deferred = new constructor();
						_this.deferred.begin();

						_arguments = copyArguments(arguments);

						attachHandlers();

        					return _this.deferred;
					}

					function attachHandlers()
					{
						_this.onSuccess(require);
						_this.onError(_this.deferred.error);
					}

					this.begin = function()
					{
						_tasksCount++;
					}

					this.error = function(error)
					{
						_tasksCount--;

						if(_error instanceof Function)
						{
							errorSafe(error)
						}
					}

					function errorSafe(error)
					{
						try
						{
							var result = _error.apply(this, [error]);
							continueChain(result);
						}
						catch(error)
						{
							//TODO: Log an error.
						}
					}

					function continueChain(result)
					{
						if((typeof result === TypesNames.Boolean) && result)
						{
							_this.begin();
							_this.success();
						}
					}

					this.success = function()
					{
						_tasksCount--;
						if(_tasksCount === Zero && _success instanceof Function)
						{
							successSafe();
						}
					}

					function successSafe()
					{
						try
						{
							var applyResult = _success.apply(this, _arguments);
							// Attach handlers. They will be called when the async method (if not async then nothing will be attached) will done.
							attachDeferredHandlers(applyResult);
						}
						catch(error)
						{
							//alert(error);
							//TODO: Log an error.
						}
					}

					function attachDeferredHandlers(obj)
					{
						if(typeof obj !== TypesNames.Undefined && obj !== null
							&& (obj.onSuccess instanceof Function)
							&& (obj.onError instanceof Function)
							&& (_this.deferred instanceof Object) && _this.deferred !== null
							&& (_this.deferred.success instanceof Function)
							&& (_this.deferred.error instanceof Function))
						{
							obj.onSuccess(_this.deferred.success);
							obj.onError(_this.deferred.error);
						}

					}

					this.onSuccess = function(callback)
					{
						_success = callback;
						//alert(_success);
						return _this;
					}
					this.onError = function(callback)
					{
						_error = callback;
						return _this;
					}

				}

				return constructor;
			})(this.require);


		// Use config members
		function useConfigSafe(config)
		{
			for(var propertyName in config)
			{
				setConfigParameter(propertyName, config);
			}
		}

		function setConfigParameter(parameterName, config)
		{
			if(parameterName in _config)
			{
				_config[parameterName] = config[parameterName];
			}
		}


	        // Require members
		// Require collection members
		function requireCollection(collection, config, deferred)
		{
			for(var index = Zero; index < collection.length; index++)
			{
				requireOne(collection[index].name, collection[index].path, config, deferred);
			}
		}


		function copy(fromObj, toObj)
		{
			for(var propertyName in fromObj)
			{
				var propertyValue = fromObj[propertyName];
				if(!(propertyValue instanceof Function))
				{
					toObj[propertyName] = propertyValue;
				}
			}
		}

		function combine(objOne, objTwo)
		{
			var result = {};
			copy(objOne, result);
			copy(objTwo, result);

			return result;
		}


		// Require one members
		function requireOne(name, path, config, deferred)
		{
			config = combine(_config, config);

			if(config.isSplitName)
			{
				load(name.split(PointCharacter).join(SlashCharacter), path, config, deferred);
			}
			else
			{
				load(name, path, config, deferred);
			}
		}

		var LoadTypes =
		{
			NotExists: -1,
			NotLoaded: 0,
			Loading: 1,
			Loaded: 2
		};

		// Private instance methods

		function load(name, path, config, deferred)
		{
			var loadStatus = getLoadStatus(name);

			if(loadStatus !== LoadTypes.Loaded)
			{
				addToQueue(name, path, config, deferred)
			}

			if(loadStatus !== LoadTypes.Loading && loadStatus !== LoadTypes.Loaded)
			{
				loadNext(name);
			}
		}

		function addToQueue(name, path, config, deferred)
		{
			var path = getPath(name, path, config);

			//debugger;
			if(name in _scripts)
			{
				scriptEnqueue(name, {path: path, deferred: deferred});
			}
			else
			{
				_scripts[name] = {loadStatus: LoadTypes.NotLoaded, queue: [{path: path, deferred: deferred}]};
			}
		}

		function loadNext(name)
		{
			if(name in _scripts)
			{
				loadNextSafe(name);
			}
		}

		function loadNextSafe(name)
		{
			if(_scripts[name].queue.length !== Zero)
			{
				deferredBegin(name);
				var next = scriptPeek(name);
				add(name, next.path);
			}
		}

		function loaded(name)
		{
			deferredSuccess(name);
			setLoadStatus(name, LoadTypes.Loaded);
		}

		function deferredBegin(name)
		{
			if(name in _scripts)
			{
				scriptPeek(name).deferred.begin();
			}
		}
		
		function deferredSuccess(name)
		{
			if(name in _scripts)
			{
				scriptPeek(name).deferred.success();
			}
			scriptDequeue(name);
		}

		function deferredLoadError(name)
		{
			//debugger;
			var 	errorMessage = 'Can not load script file for the "' + name + '" with path: "' + scriptPeek(name).path + '".',
				error = new Error(errorMessage);
			deferredError(name, error);
		}

		function deferredError(name, error)
		{
			if(name in _scripts)
			{
        			scriptPeek(name).deferred.error(error);
				scriptDequeue(name);
			}
		}

		var DefaultScriptQueueValue = null;

		function scriptEnqueue(name, value)
		{
			if(name in _scripts)
			{
				_scripts[name].queue.push(value);
			}
		}

		function scriptPeek(name)
		{
			var result = DefaultScriptQueueValue;

			if(name in _scripts)
			{
				result = scriptPeekSafe(name);
				result = _scripts[name].queue[Zero];
			}

			return result;
		}

		function scriptPeekSafe(name)
		{
			var result = DefaultScriptQueueValue, 
				queue = _scripts[name].queue;

			if(queue.length > Zero)
			{
				result = queue[Zero];
			}

			return result;
		}

		function scriptDequeue(name)
		{
			var result = null;

			if(name in _scripts)
			{
				result = _scripts[name].queue.splice(Zero, One);
			}

			return result;
		}

		function notLoaded(name)
		{
			if(name in _scripts)
			{
				notLoadedSafe(name);
			}
		}

		function notLoadedSafe(name)
		{
			if(_scripts[name].queue.length === One)
			{
				deferredLoadError(name);
				scriptDequeue();
			}
			else
			{
				scriptDequeue(name);
				loadNext(name);
        		}
		}

		function setLoadStatus(name, status)
		{
			_scripts[name].loadStatus = status;
		}

		function getLoadStatus(name)
		{
			var result;

			if(name in _scripts)
			{
				result = _scripts[name].loadStatus;
			}
			else
			{
				result = LoadTypes.NotExists;				
			}

			return result;	
		}


		function getPath(name, path, config)
		{
			var result;

			if(typeof(path) !== TypesNames.String || trim(path) === EmptyString)
			{
				result = buildPath(name, config);
			}
			else
			{
				result = path;
			}

			return result;
		}

		function buildPath(name, config)
		{
			var result;

			if(config.isAddJsExtension)
			{
				result = config.basePath + SlashCharacter + name + PointCharacter + config.jsExtension;
			}
			else
			{
				result = name;
			}

			return result;
		}
		
		var TagHead = "head";

		function add(name, path)
		{
			var head = getHead(),
				scriptTag = buildScriptTag(name, path);

			head.appendChild(scriptTag);
		}

		function getHead()
		{
			var 	result, 
				heads = _context.document.getElementsByTagName(TagHead);
			if(heads.length > Zero)
			{
				result = heads[Zero];
			}
			else
			{
				result = createHead();
			}

			return result;
		}

		function createHead()
		{
			var result = _context.document.createElement(TagHead);
			_this.addHeadTitle(result);

			return result;			
		}

		var TagTitle = "title";

		function addTitle(head)
		{
			var titleTag = _context.document.createElement(TagTitle);
			head.appendChild(titleTag);
		}

		var TagScript = "script";
		var TagScriptTypeTextJavaScript = "text/javascript";

		var ScriptTagEventNames = 
		{
			Load: 'load',
			Error: 'error'
		}
		
		function buildScriptTag(name, path)
		{
			var scriptTag = _context.document.createElement(TagScript);
			configureScriptTag(scriptTag, name, path);
			return scriptTag;
		}

		function configureScriptTag(scriptTag, name, path)
		{
			scriptTag.type = TagScriptTypeTextJavaScript;
			attachScriptTagEventHandlers(scriptTag, name, path);
			scriptTag.src = path;
		}

		function attachScriptTagEventHandlers(scriptTag, name, path)
		{
			scriptTag.addEventListener(ScriptTagEventNames.Load, function(eventObj)
			{
				loaded(name);
			}, false);

			scriptTag.addEventListener(ScriptTagEventNames.Error, function(eventObj) 
			{
				var errorMessage = 'Can\'t load script file for a next name: "' + name + '" with a next path: "' + path + '".';
				logError(new Error(errorMessage));
				notLoaded(name);
			}, false);
		}

		// Helpers private members

		function initializeConfig()
		{
			if(("SRD" in _context) && ("Require" in _context.SRD) && ("Config" in _context.SRD.Require))
			{
				_this.useConfig(_context.SRD.Require.Config);
			}
		}

		function logError(error)
		{
			var LogWarningType = "Warning";
			if(error && _config.logger)
			{
				// TODO: Implement extracting all the error info (line, pos, etc.) and write it also to the log.
				_config.logger.log(LogWarningType, error.message);
			}
			else
			{
				//alert(error.message);
			}
		}
	
		// Constructor code
		initializeConfig();
	}

	function getInstance()
	{
		if(typeof(_instance) === TypesNames.Undefined)
		{
			_instance = new constructor();
		}

		return _instance;
	}

	// This is the sigleton class. It return only the object with getInstance method instead of constructor.
	var result = 
	{
		getInstance: getInstance
	};

	if(!!_mountPoint)
	{
		// Export a reference to the only one require method inside a mount point.
		_mountPoint.require = result.getInstance().require;
		// Add to the require method a 'config' member. It is a refrence to the extensions singleton setConfig method.
		_mountPoint.require.useConfig = result.getInstance().useConfig;
	}

	return result;
})(this, window);