var Namespace=function(e,t){function n(e){function t(){var e=null;for(var t in i)if(i[t]===r&&null!==(e=t))break;return e}var n=!0,r=this,s=n,i=e;this.getIsNamespace=function(){return s},this.getParentNamespace=function(){return i},this.getName=function(){var e=null;return null!==i&&(e=t()),e},this.getFullName=function(){for(var e=[],t=r;typeof t.getParentNamespace===u.Function&&typeof t.getParentNamespace()===u.Object&&null!==t.getParentNamespace();)e.splice(Number.Zero,Number.Zero,t.getName()),t=t.getParentNamespace();return e.join(f)}}function r(e,t,n){var r=typeof e[t[n]],s=null;return s=r===u.Undefined||r===u.Object&&null===types?e[t[n]]=new Namespace(e):e[t[n]]}function s(e){for(var t=e.split(f),n=this,s=c;s<t.length;s++)n=t[s]in n?r(n,t,s):n[t[s]]=new Namespace(n);return n}function i(e){return typeof e===u.Object&&null!==e&&(e===p||typeof e.getIsNamespace===u.Function&&e.getIsNamespace()===!0)}function a(e){for(var t,n=e.split(f),r=p,s=c,t=!1;s<n.length&&(t=i(r));s++)r=r[n[s]];return t&&i(r)}var u={String:"string",Object:"object",Undefined:"undefined",Function:"function"},c=0,o=".",f=o,l=!0,p=e||this,N=typeof t!==u.Undefined&&t===!0||l;n.ns=function(e){var t=this;return typeof e===u.String&&(t=s(e)),t},n.isNs=function(e){var t;return t=typeof e===u.Object&&null!==e&&typeof e.getIsNamespace===u.Function?e.getIsNamespace()===!0:!1};var g={NotExists:!1,Exists:!0};return n.isNsExists=function(e){var t;return t=typeof e===u.String&&null!==e?a(e):g.NotExists},N&&(p.ns=n.ns,p.isNs=n.isNs,p.isNsExists=n.isNsExists),n}();