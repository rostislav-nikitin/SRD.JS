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
if(!window.SRD)
{
	window.SRD = { __isNamespace: true }
}

if(!window.SRD.Require)
{
	window.SRD.Require = { __isNamespace: true }
}

window.SRD.Require.Extensions = (function(config, context)
{
	// Private static constants
	var 	TypesNames = { Undefined: "undefined", String: "string", Object: "object" },
		Zero = 0,
		EmptyString = '',
		PointCharacter = '.', 
		SlashCharacter = '/',
		DefaultIsAddJsExtension = true,
		DefaultJsExtension = "js",
		DefaultConfig = { basePath: '.', isAddJsExtension:  true, jsExtension: 'js' },
	// Private static variables
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
	function constructor(config)
	{
		// Private instance variables
		var 	_this = this,
			_config = config || ((("SRD" in _context) && ("Require" in _context.SRD) && ("Config" in _context.SRD.Require)) ? _context.SRD.Require.Config : DefaultConfig),
			_loaded = [];

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
			_this.useConfig(config);

			for(var index = Zero; index < collection.length; index++)
			{
				requireOne(collection[index].name, collection[index].path);
			}
		}


		// Require one members
		function requireOne(name, path, config)
		{
			_this.useConfig(config);

		 	if(_loaded.indexOf(name) < Zero)
			{
				load(name, path);
				_loaded.push(name);
			}

		}

		// Private instance methods
		function load(name, path)
		{
			path = getPath(name, path);
			add(path);
		}

		function getPath(name, path)
		{
			var result;

			if(typeof(path) !== TypesNames.String || trim(path) === EmptyString)
			{
				result = buildPath(name);
			}
			else
			{
				result = path;
			}

			return result;
		}

		function buildPath(name)
		{
			var result;

			if(_config.isAddJsExtension)
			{
				result = _config.basePath + SlashCharacter + name + PointCharacter + _config.jsExtension;
			}
			else
			{
				result = name;
			}

			return result;
		}
		
		var TagHead = "head";

		function add(path)
		{
			var head = getHead(),
				scriptTag = buildScriptTag(path);

			try
			{
				head.appendChild(scriptTag);
			}
			catch(error)
			{
				logError(error);
			}
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
		
		function buildScriptTag(path)
		{
			var scriptTag = _context.document.createElement(TagScript);
			scriptTag.type = TagScriptTypeTextJavaScript;
			scriptTag.onerror = function(eventObj) 
			{
				var errorMessage = 'Can\'t load script file for a next path: "' + path + '".';
				logError(new Error(errorMessage));
			};
			scriptTag.src = path;

			return scriptTag;
		}

		// Helpers private members
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

	return result;
})();

// Export a reference to the only one require method.
var require = SRD.Require.Extensions.getInstance().require;
// Add to the require method a 'config' member. It is a refrence to the extensions singleton setConfig method.
require.useConfig = SRD.Require.Extensions.getInstance().useConfig;