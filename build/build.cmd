SET basePath=../Js/
java -jar ..\node_modules\closure-library\compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js "%basePath%SRD.Namespace.js" "%basePath%SRD.Type.js" "%basePath%SRD.Deferred.js" "%basePath%SRD.Require.js" --js_output_file srd.core.min.adv.js
java -jar ..\node_modules\closure-library\compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js "%basePath%SRD.LINQ.js" --js_output_file srd.linq.min.adv.js

REM java -jar ..\node_modules\closure-library\compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js "SRD.Namespace.js" "SRD.Type.js" "SRD.Deferred.js" "SRD.Require.js" --js_output_file srd.core.min.smp.js

REM java -jar ..\node_modules\closure-library\compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js "SRD.Namespace.js" --js_output_file srd.namespace.min.adv.js
REM java -jar ..\node_modules\closure-library\compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js "SRD.Namespace.js" --js_output_file srd.namespace.min.smp.js

REM java -jar ..\node_modules\closure-library\compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js "SRD.Type.js" --js_output_file srd.type.min.adv.js
REM java -jar ..\node_modules\closure-library\compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js "SRD.Type.js" --js_output_file srd.type.min.smp.js

REM java -jar ..\node_modules\closure-library\compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js "SRD.Deferred.js" --js_output_file srd.deferred.min.adv.js
REM java -jar ..\node_modules\closure-library\compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js "SRD.Deferred.js" --js_output_file srd.deferred.min.smp.js

REM java -jar ..\node_modules\closure-library\compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js "SRD.Require.js" --js_output_file srd.require.min.adv.js
REM java -jar ..\node_modules\closure-library\compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js "SRD.Require.js" --js_output_file srd.require.min.smp.js

	


