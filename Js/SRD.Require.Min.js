!function(n,e){function t(n){var e;return e=typeof n===u.String?n.replace(/^\s*/,a).replace(/\s*$/,a):n}function r(){function n(n){for(var t in n)e(t,n)}function e(n,e){n in k&&(k[n]=e[n])}function r(n,e,t){for(var r=c;r<n.length;r++)l(n[r].name,n[r].path,e,t)}function i(n,e){for(var t in n){var r=n[t];r instanceof Function||(e[t]=r)}}function o(n,e){var t={};return i(n,t),i(e,t),t}function l(n,e,t,r){t=o(k,t),t.isSplitName?h(n.split(s).join(d),e,t,r):h(n,e,t,r)}function h(n,e,t,r){var i=D(n);i!==K.Loaded&&v(n,e,t,r),i!==K.Loading&&i!==K.Loaded&&E(n)}function v(n,e,t,r){var e=O(n,e,t);n in z?j(n,{path:e,deferred:r}):z[n]={loadStatus:K.NotLoaded,queue:[{path:e,deferred:r}]}}function E(n){n in z&&S(n)}function S(n){if(z[n].queue.length!==c){y(n);var e=x(n);I(n,e.path)}}function q(n){m(n),R(n,K.Loaded)}function y(n){n in z&&x(n).deferred.begin()}function m(n){n in z&&x(n).deferred.success(),F(n)}function b(n){var e='Can not load script file for the "'+n+'" with path: "'+x(n).path+'".',t=new Error(e);L(n,t)}function L(n,e){n in z&&(x(n).deferred.error(e),F(n))}function j(n,e){n in z&&z[n].queue.push(e)}function x(n){var e=M;return n in z&&(e=C(n),e=z[n].queue[c]),e}function C(n){var e=M,t=z[n].queue;return t.length>c&&(e=t[c]),e}function F(n){var e=null;return n in z&&(e=z[n].queue.splice(c,f)),e}function w(n){n in z&&N(n)}function N(n){z[n].queue.length===f?(b(n),F()):(F(n),E(n))}function R(n,e){z[n].loadStatus=e}function D(n){var e;return e=n in z?z[n].loadStatus:K.NotExists}function O(n,e,r){var i;return i=typeof e!==u.String||t(e)===a?B(n,r):e}function B(n,e){var t;return t=e.isAddJsExtension?e.basePath+d+n+s+e.jsExtension:n}function I(n,e){var t=U(),r=J(n,e);t.appendChild(r)}function U(){var n,e=p.document.getElementsByTagName(Q);return n=e.length>c?e[c]:A()}function A(){var n=p.document.createElement(Q);return $.addHeadTitle(n),n}function J(n,e){var t=p.document.createElement(V);return P(t,n,e),t}function P(n,e,t){n.type=X,T(n,e,t),n.src=t}function T(n,e,t){n.addEventListener(Y.Load,function(n){q(e)},!1),n.addEventListener(Y.Error,function(n){var r="Can't load script file for a next name: \""+e+'" with a next path: "'+t+'".';W(new Error(r)),w(e)},!1)}function H(){"SRD"in p&&"Require"in p.SRD&&"Config"in p.SRD.Require&&$.useConfig(p.SRD.Require.Config)}function W(n){var e="Warning";n&&k.logger&&k.logger.log(e,n.message)}var $=this,k=g,z={};this.useConfig=function(e){return typeof e===u.Object&&n(e),$},this.require=function(n,e,t){var i=new G;return typeof n===u.Object&&null!==n&&"length"in n?r(n,e,i):typeof n===u.String&&l(n,e,t,i),i};var G=function(n){function e(n){for(var e=[],t=r;t<n.length;t++)e.push(n[t]);return e}function t(){function i(){h.onSuccess(n),h.onError(h.deferred.error)}function o(n){try{var e=l.apply(this,[n]);c(e)}catch(n){}}function c(n){typeof n===u.Boolean&&n&&(h.begin(),h.success())}function f(){try{var n=d.apply(this,s);a(n)}catch(e){}}function a(n){typeof n!==u.Undefined&&null!==n&&n.onSuccess instanceof Function&&n.onError instanceof Function&&h.deferred instanceof Object&&null!==h.deferred&&h.deferred.success instanceof Function&&h.deferred.error instanceof Function&&(n.onSuccess(h.deferred.success),n.onError(h.deferred.error))}var s,d,l,h=this,g=r;this.require=function(){return h.deferred=new t,h.deferred.begin(),s=e(arguments),i(),h.deferred},this.begin=function(){g++},this.error=function(n){g--,l instanceof Function&&o(n)},this.success=function(){g--,g===r&&d instanceof Function&&f()},this.onSuccess=function(n){return d=n,h},this.onError=function(n){return l=n,h}}var r=0;return t}(this.require),K={NotExists:-1,NotLoaded:0,Loading:1,Loaded:2},M=null,Q="head",V="script",X="text/javascript",Y={Load:"load",Error:"error"};H()}function i(){return typeof o===u.Undefined&&(o=new r),o}var o,u={Undefined:"undefined",Boolean:"boolean",String:"string",Function:"function",Object:"object"},c=0,f=1,a="",s=".",d="/",l=!1,h=!0,g={isSplitName:l,basePath:".",isAddJsExtension:!0,jsExtension:"js"},p=n||this,v=e||h,E={getInstance:i};return v&&(p.require=E.getInstance().require,p.require.useConfig=E.getInstance().useConfig),E}();