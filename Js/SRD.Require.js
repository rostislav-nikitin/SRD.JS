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

(function(context, isExportToContext)
{
	// Private static constants
	var 	TypesNames = { Undefined: "undefined", String: "string", Object: "object" },
		Zero = 0,
		One = 1,
		EmptyString = '',
		PointCharacter = '.', 
		SlashCharacter = '/',
		DefaultIsSplitName = false,
		DefaultIsExportToContext = true,
		DefaultIsAddJsExtension = true,
		DefaultJsExtension = "js",
		DefaultConfig = { isSplitName: DefaultIsSplitName, basePath: '.', isAddJsExtension:  true, jsExtension: 'js' },
	// Private static variables
		_context = context || this,
		_isExportToContext = isExportToContext || DefaultIsExportToContext,
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
			//alert(pathOrConfig);
			if(typeof(nameOrCollection) === TypesNames.Object && nameOrCollection !== null && "length" in nameOrCollection)
			{
				requireCollection(nameOrCollection, pathOrConfig);
			}
			else if(typeof(nameOrCollection) === TypesNames.String)
			{
				requireOne(nameOrCollection, pathOrConfig, config);
			}

			return _this;
		}

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
		function requireCollection(collection, config)
		{
			for(var index = Zero; index < collection.length; index++)
			{
				requireOne(collection[index].name, collection[index].path, config);
			}
		}


		// Require one members
		function requireOne(name, path, config)
		{
			config = config || _config;

			if(config.isSplitName)
			{
				load(name.split(PointCharacter).join(SlashCharacter), path, config);
			}
			else
			{
				load(name, path, config);
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

		function load(name, path, config)
		{
			var loadStatus = getLoadStatus(name);

			if(loadStatus !== LoadTypes.Loaded)
			{
				addToQueue(name, path, config)
			}

			if(loadStatus !== LoadTypes.Loading && loadStatus !== LoadTypes.Loaded)
			{
				loadNext(name);
			}
		}

		function addToQueue(name, path, config)
		{
			var path = getPath(name, path, config);

			if(name in _scripts)
			{
				_scripts[name].queue.push(path);
			}
			else
			{
				_scripts[name] = {loadStatus: LoadTypes.NonLoaded, queue: [path]};
			}
		}

		function loadNext(name)
		{
			if(name in _scripts && _scripts[name].queue.length != Zero)
			{
				var nextPath = _scripts[name].queue.splice(Zero, One);
				add(name, nextPath);
			}
		}

		function loaded(name)
		{
			setLoadStatus(name, LoadTypes.Loaded);
		}

		function notLoaded(name)
		{
			loadNext(name);
		}

		function setLoadStatus(name, status)
		{
			_scripts[name].LoadStatus = status;
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
				alert(error.message);
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

	// Create the class instance.
	//_instance = new constructor();
	/*
	Maybe we will decide to store it inside a namespace
	function createNsInternal(namespaceName)
	{
		var parent = _context,
			namespaces = namespaceName.split(PointCharacter);
		for(var index = Zero; index < namespaces.length; index++)
		{
			parent = parent[namespaces[index]] = new { __isNamespace: true , __parentNamespace: parent };
		}

		return parent;
	}

	var createNs = ((typeof(_context.SRD) === TypesNames.Object && typeof(_context.SRD.Namespace) === TypesNames.Object 
		&& typeof(_context.SRD.Namespace.ns) === TypesNames.Function) ? _context.SRD.ns : createNsInternal );
	*/
	if(_isExportToContext)
	{

		//createNs('SRD.Require').Extensions = result;
		// Export a reference to the only one require method.
		_context.require = result.getInstance().require;
		// Add to the require method a 'config' member. It is a refrence to the extensions singleton setConfig method.
		_context.require.useConfig = result.getInstance().useConfig;
	}

	return result;
})();

