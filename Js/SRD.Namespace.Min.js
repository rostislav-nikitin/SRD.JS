!function(n,e,t){function s(n){function e(){var n=null;for(var e in i)if(i[e]===s&&null!==(n=e))break;return n}var t=!0,s=this,r=t,i=n||null;this.getIsNamespace=function(){return r},this.getParentNamespace=function(){return i},this.getName=function(){var n=null;return null!==i&&(n=e()),n},this.getFullName=function(){for(var n=[],e=s;typeof e.getParentNamespace===o["function"]&&typeof e.getParentNamespace()===o.object&&null!==e.getParentNamespace();)n.splice(Number.Zero,Number.Zero,e.getName()),e=e.getParentNamespace();return n.join(l)}}function r(n,e,t){var r=typeof n[e[t]],i=null;return i=r===o.undefined||r===o.object&&null===r?n[e[t]]=new s(n):n[e[t]]}function i(n){for(var e=n.split(l),t=this,i=f;i<e.length;i++)t=e[i]in t?r(t,e,i):t[e[i]]=new s(t);return t}function u(n){return typeof n===o.object&&null!==n&&(n===g||typeof n.getIsNamespace===o["function"]&&n.getIsNamespace()===!0)}function a(n){for(var e,t=n.split(l),s=g,r=f,e=!1;r<t.length&&(e=u(s));r++)s=s[t[r]];return e&&u(s)}var o={string:"string",object:"object",undefined:"undefined","function":"function"},f=0,c=".",l=c,p=!0,N="SRD",g=n||this,m=e||N,v=typeof t!==o.undefined&&t===!0||p;s.ns=function(n){var e=this;return typeof n===o.string&&(e=i(n)),e},s.isNs=function(n){var e;return e=typeof n===o.object&&null!==n&&typeof n.getIsNamespace===o["function"]?n.getIsNamespace()===!0:!1};var y={notExists:!1,exists:!0};s.isNsExists=function(n){var e;return e=typeof n===o.string&&null!==n?a(n):y.notExists},v&&(g.ns=s.ns,g.isNs=s.isNs,g.isNsExists=s.isNsExists);var h=s.ns.apply(g,[m]);return h.Namespace=s,s}();