// demo/vite.config.mjs
import { defineConfig } from "file:///Users/shuang/web/Plugin/vite-plugin-auto-vue-router/node_modules/.pnpm/vite@5.0.10_@types+node@20.10.5_sass@1.69.5/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/shuang/web/Plugin/vite-plugin-auto-vue-router/node_modules/.pnpm/@vitejs+plugin-vue@4.5.2_vite@5.0.10_vue@3.3.12/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { fileURLToPath, URL } from "url";

// dist/index.js
import He from "file:///Users/shuang/web/Plugin/vite-plugin-auto-vue-router/node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/index.js";
import rr from "fs";
var ir = `import { createPinia, defineStore } from 'pinia';
import { createRouter, createWebHashHistory, createMemoryHistory, createWebHistory } from 'vue-router';

//\u53EF\u5199\u81EA\u5B9A\u4E49\u8F6C\u6362\u63D2\u4EF6\u65B9\u6848 https://cn.vitejs.dev/guide/migration-from-v1.html#custom-blocks-transforms

const pinia = createPinia();

/*#vite-plugin-auto-vue-router-route-query*/

/* \u8FD9\u91CC\u4F1A\u751F\u6210\u4E00\u6BB5\u8FD9\u6837\u7684\u4EE3\u7801
const RouteQuery = {
    "/login": {
        "meta": {
            "layout": "noAuth"
        }
    }
}
*/

// ! /*#xxx*/ \u8FD9\u79CD\u5907\u6CE8\u4E00\u5B9A\u8981\u6CE8\u610F\u3001\u6CE8\u610F\u3001\u6CE8\u610F\uFF0C\u5B83\u80CC\u5E76\u4E0D\u662F\u6CE8\u91CA\u8FD9\u4E48\u7B80\u5355
// ! /*#xxx*/ \u8FD9\u79CD\u5907\u6CE8\u4E00\u5B9A\u8981\u6CE8\u610F\u3001\u6CE8\u610F\u3001\u6CE8\u610F\uFF0C\u5B83\u80CC\u5E76\u4E0D\u662F\u6CE8\u91CA\u8FD9\u4E48\u7B80\u5355
// ! /*#xxx*/ \u8FD9\u79CD\u5907\u6CE8\u4E00\u5B9A\u8981\u6CE8\u610F\u3001\u6CE8\u610F\u3001\u6CE8\u610F\uFF0C\u5B83\u80CC\u5E76\u4E0D\u662F\u6CE8\u91CA\u8FD9\u4E48\u7B80\u5355

/**
 * 
 * @param {*} comp 
 * @param {*} route 
 * @param {*} isEager \u662F\u5426\u662F\u540C\u6B65\u52A0\u8F7D
 */
function getRouteItem(comp, route, isEager = true) {
    const routeItem = {
        beforeEnter: null,
        redirect: null,
        aliasOf: null,
        path: null,
        name: null,
        props: false,
        ...route,
        component: comp
    }
    return routeItem;
}

function getRouteName(pathStr) { // pathStr = /xxx/xxx.vue
    const regex = /[^\\/]+\\/pages\\/(.*)/;
    const match = pathStr.match(regex); 
    const pathWithSuffix = match ? match[1] : ''; // \u8FD9\u91CC\u7684 match[1] \u8868\u793A\u83B7\u53D6\u7B2C\u4E00\u4E2A\u6355\u83B7\u7EC4\u7684\u5185\u5BB9
    let RoutePath = pathWithSuffix?.replace(/.vue/, ''); // xxx/xxx
    const pathArrs = RoutePath.split('/');                  // ['xxx', 'xxx']
    const PathLastName = pathArrs[pathArrs.length-1];        // \u53D6\u6700\u540E\u4E00\u4E2A\u6587\u4EF6\u540D
    let RouteName = RoutePath?.replace(/\\//g, '-');       // xxx-xxx
    const queryRegex = /^\\[(\\w+)(,\\s*\\w+)*\\]$/;
     /** 
     * \u5339\u914D\u591A\u4E2Apath\u4E3A\u53C2\u6570
     * \u6587\u4EF6\u547D\u540D\u89C4\u5219\u5FC5\u9700\u9075\u5B88
     * _.vue = /:query+ \u5339\u914D: /one, /one/two, /one/two/three, \u7B49...
     * user/_.vue = user/:query+ \u5339\u914D: user/one, user/one/two, user/one/two/three, \u7B49...
     * \u4E0D\u8FC7\u79CD\u5EFA\u8BAE\u5728\u5355\u6587\u4EF6\u76EE\u5F55\u4E0B\u5B9A\u4E49\uFF0C\u4F8B\u5982\uFF1A
     *  user
     *      detail
     *          _.vue , 
     *  \u800C\u4E0D\u662F
     *  user
     *      _.vue
     *      [id].vue
     * \u56E0\u4E3A_.vue\u4F1A\u5339\u914D\u6389user/\u4E4B\u540E\u7684\u4E00\u5207
     */
    if (PathLastName==='_') {
        RoutePath = RoutePath.replace(new RegExp(PathLastName),'') // \u4F8B\u5982\uFF1Auser/_ , \u6E05\u9664path\u6700\u540E\u4E00\u8282\u7684 _  = user/
        RouteName = RouteName.replace(new RegExp(PathLastName),'') // \u4F8B\u5982\uFF1Auser-_ , \u6E05\u9664path\u6700\u540E\u4E00\u8282\u7684 _  = user-
        RouteName = RouteName.replace(/-/,'') // \u4F8B\u5982\uFF1Auser- , \u6E05\u9664-  = user
        RoutePath = RoutePath +':query+'; // \u7ED3\u679C\u793A\u4F8B\uFF1A setting/:query+
    } else if (queryRegex.test(PathLastName)) {
        /**
         * \u5339\u914D\u5355\u4E2A\u3001\u591A\u4E2A\u6307\u5B9A\u53C2\u6570\u540D\u79F0, \u8FD9\u79CD\u573A\u666F\u5E94\u8BE5\u5F88\u5C11\u7528\u5230
         * \u6587\u4EF6\u547D\u540D\u89C4\u5219\u5FC5\u9700\u9075\u5B88, \u867D\u7136\u652F\u6301\u7A7A\u683C\u5B9A\u4E49\uFF0C\u4F46\u5EFA\u8BAE\u4E0D\u8981\u52A0\u7A7A\u683C
         * [id] = /:id
         * [id, uid, ...] = /:id/:uid/ \u4EE5\u6B64\u7C7B\u63A8
         */
        const QueryRule = new RegExp(/[/[].+?]/, 'g');
        const queryNameString = PathLastName.replace(/[\\[\\]]/g, ''); // \u4F7F\u7528\u6B63\u5219\u8868\u8FBE\u5F0F\u66FF\u6362\u6389 '[xxx,xxx]' \u7ED3\u679C\u7B49\u4E8E\uFF1Axxx,xxx
        const queryNames = queryNameString.split(','); // \u7ED3\u679C\u7B49\u4E8E\uFF1A[xxx, xxx]
        RoutePath = RoutePath.replace(QueryRule,''); // \u4F8B\u5982\uFF1Auser/[id] \u7ED3\u679C\u7B49\u4E8E\uFF1Auser/
        RouteName = RouteName.replace(QueryRule,''); // \u4F8B\u5982\uFF1Auser-[id] \u7ED3\u679C\u7B49\u4E8E\uFF1Auser-
        RouteName = RouteName.replace(/-/,'') // \u4F8B\u5982\uFF1Auser- , \u6E05\u9664-  = user
        let pathQ = '/:'+queryNames.join('/:'); // \u7ED3\u679C\u7B49\u4E8E\uFF1A/:xxx/:xxx, \u5982\u679C\u5B58\u5728\u7A7A\u683C/:xxx/: xxx
        pathQ = pathQ.replace(/\\s+/g, ''); // \u6E05\u9664\u7A7A\u683C
        RoutePath = RoutePath+pathQ;
    }

    RoutePath = '/'+ RoutePath;
    function deleteLastValueFromArray(arr) {
        if (arr.length > 0) {
            arr.pop(); // \u4F7F\u7528 Array.pop() \u65B9\u6CD5\u5220\u9664\u6700\u540E\u4E00\u4E2A\u503C
        }
        return arr;
    }
    const aliasPaths = deleteLastValueFromArray(pathArrs);
    let alias = [];
    if (aliasPaths && aliasPaths.length && RoutePath.indexOf('/index')>=0) {
        alias.push('/'+aliasPaths.join('/'));
        alias.push('/'+aliasPaths.join('/')+'/');
    }
    return {
        RoutePath,
        RouteName,
        alias
    }
}

export const useRouteState = defineStore('RouteState', ()=> {
    let RouteState = {};
    const RouteStateData = sessionStorage.getItem("RouteState") || '';

    try {
        RouteState = JSON.parse(RouteStateData);
    } catch (error) {
        RouteState = {}
    }

    function increment(path, query = {}) {
        RouteState[path] = query;
        sessionStorage.setItem("RouteState", JSON.stringify(RouteState));
    }

    return {
        RouteState,
        increment
    }
});

export default {
    install(app, options) {
        if (!app || !app.use) {
            return console.error('Vue App.use error')
        }
        options = Object.assign({
            history: 'h5',
            index: '/index', // \u9ED8\u8BA4\u9996\u9875
            errorPagePath: '/404',
            RouteBefore:{  // 'path': { ...route }
                /* path: 'login' 
                '/login':{
                    beforeEnter:()=>{
                        console.log(989889);
                    }
                }
                */ 
            }
        }, options);
        
        app.use(pinia);
        let routerArray = [];
        /*#vite-plugin-auto-vue-router-options*/
        const modules = import.meta.glob(/*#vite-plugin-auto-vue-router-path*/ /*#vite-plugin-auto-vue-router-glob-rules*/);
        if (!configs.eager) { // \u52A8\u6001\u5BFC\u5165\u7684\u903B\u8F91, conpoment: ()=> import('xxx/xxx.vue')
            for (let k in modules) {
                const comp = modules[k];
                const { RouteName, RoutePath, alias } = getRouteName(k);
                const itemComp = getRouteItem(comp, { path: RoutePath, name: RouteName }, false);
                const RouteObjs = options.RouteBefore[RoutePath||RouteName] || {};
                let LazyLoadRoute = {};
                if (typeof RouteQuery === 'object') {
                    LazyLoadRoute = RouteQuery[RoutePath];
                }
                Object.assign(itemComp,{ ...RouteObjs, ...LazyLoadRoute, alias });
                routerArray.push(itemComp);
                switch (RoutePath) {
                    case options.index:
                        routerArray.push({
                            ...itemComp,
                            path:'/',
                            name: '/'
                        });
                        break;
                    case options.errorPagePath:
                        routerArray.push({
                            ...itemComp,
                            path:'/:pathMatch(.*)*',
                            name: 'NotFound'
                        });
                        break;
                }
            }
        } else {
            for (let k in modules) {
                const comp = modules[k].default;
                const { RouteName, RoutePath, alias } = getRouteName(k);
                const route = Object.assign({
                    props: false,
                    name: RouteName,
                    path: RoutePath,
                    alias
                }, comp.route);
                const itemComp = getRouteItem(comp, route);
                routerArray.push(itemComp);
                switch (route.path) {
                    case options.index:
                        routerArray.push({
                            ...itemComp,
                            path:'/',
                            name: '/'
                        });
                        break;
                    case options.errorPagePath:
                        routerArray.push({
                            ...itemComp,
                            path:'/:pathMatch(.*)*',
                            name: 'NotFound'
                        });
                        break;
                }
            }
        }
        console.log(options.history, 'options.history')
        const RouterAPP = createRouter({
            history: options.history==='hash'? createWebHashHistory(): options.history==='ssr'? createMemoryHistory(): options.history==='h5'? createWebHistory(): createWebHistory(),
            routes: routerArray
        });
        
        const RouteStater = useRouteState();

        RouterAPP.page = (to, mode='push')=> {
            const pathStr = to.path || to.name;
            RouteStater.increment(pathStr, to.hiddenParams);
            return RouterAPP[mode](to);
        }

        RouterAPP.beforeResolve(to => {
            let d = {};
            if (Object.keys(RouteStater.RouteState).length) {
                d = RouteStater.RouteState[to.path] || RouteStater.RouteState[to.name];
            }
            to.params = Object.assign(to.params, d);
        });
        console.log(RouterAPP, 'RouterAPP');
        app.use(RouterAPP);
    }
}`;
function on(e) {
  return typeof e > "u" || e === null;
}
function or(e) {
  return typeof e == "object" && e !== null;
}
function tr(e) {
  return Array.isArray(e) ? e : on(e) ? [] : [e];
}
function lr(e, n) {
  var r, o, i, l;
  if (n)
    for (l = Object.keys(n), r = 0, o = l.length; r < o; r += 1)
      i = l[r], e[i] = n[i];
  return e;
}
function ur(e, n) {
  var r = "", o;
  for (o = 0; o < n; o += 1)
    r += e;
  return r;
}
function ar(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
var fr = on;
var cr = or;
var sr = tr;
var pr = ur;
var hr = ar;
var dr = lr;
var F = {
  isNothing: fr,
  isObject: cr,
  toArray: sr,
  repeat: pr,
  isNegativeZero: hr,
  extend: dr
};
function tn(e, n) {
  var r = "", o = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !n && e.mark.snippet && (r += `

` + e.mark.snippet), o + " " + r) : o;
}
function ee(e, n) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = n, this.message = tn(this, false), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
ee.prototype = Object.create(Error.prototype);
ee.prototype.constructor = ee;
ee.prototype.toString = function(n) {
  return this.name + ": " + tn(this, n);
};
var I = ee;
function Se(e, n, r, o, i) {
  var l = "", t = "", u = Math.floor(i / 2) - 1;
  return o - n > u && (l = " ... ", n = o - u + l.length), r - o > u && (t = " ...", r = o + u - t.length), {
    str: l + e.slice(n, r).replace(/\t/g, "\u2192") + t,
    pos: o - n + l.length
    // relative position
  };
}
function Ce(e, n) {
  return F.repeat(" ", n - e.length) + e;
}
function mr(e, n) {
  if (n = Object.create(n || null), !e.buffer)
    return null;
  n.maxLength || (n.maxLength = 79), typeof n.indent != "number" && (n.indent = 1), typeof n.linesBefore != "number" && (n.linesBefore = 3), typeof n.linesAfter != "number" && (n.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, o = [0], i = [], l, t = -1; l = r.exec(e.buffer); )
    i.push(l.index), o.push(l.index + l[0].length), e.position <= l.index && t < 0 && (t = o.length - 2);
  t < 0 && (t = o.length - 1);
  var u = "", a, c, h = Math.min(e.line + n.linesAfter, i.length).toString().length, p = n.maxLength - (n.indent + h + 3);
  for (a = 1; a <= n.linesBefore && !(t - a < 0); a++)
    c = Se(
      e.buffer,
      o[t - a],
      i[t - a],
      e.position - (o[t] - o[t - a]),
      p
    ), u = F.repeat(" ", n.indent) + Ce((e.line - a + 1).toString(), h) + " | " + c.str + `
` + u;
  for (c = Se(e.buffer, o[t], i[t], e.position, p), u += F.repeat(" ", n.indent) + Ce((e.line + 1).toString(), h) + " | " + c.str + `
`, u += F.repeat("-", n.indent + h + 3 + c.pos) + `^
`, a = 1; a <= n.linesAfter && !(t + a >= i.length); a++)
    c = Se(
      e.buffer,
      o[t + a],
      i[t + a],
      e.position - (o[t] - o[t + a]),
      p
    ), u += F.repeat(" ", n.indent) + Ce((e.line + a + 1).toString(), h) + " | " + c.str + `
`;
  return u.replace(/\n$/, "");
}
var gr = mr;
var xr = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
];
var vr = [
  "scalar",
  "sequence",
  "mapping"
];
function yr(e) {
  var n = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(o) {
      n[String(o)] = r;
    });
  }), n;
}
function Ar(e, n) {
  if (n = n || {}, Object.keys(n).forEach(function(r) {
    if (xr.indexOf(r) === -1)
      throw new I('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = n, this.tag = e, this.kind = n.kind || null, this.resolve = n.resolve || function() {
    return true;
  }, this.construct = n.construct || function(r) {
    return r;
  }, this.instanceOf = n.instanceOf || null, this.predicate = n.predicate || null, this.represent = n.represent || null, this.representName = n.representName || null, this.defaultStyle = n.defaultStyle || null, this.multi = n.multi || false, this.styleAliases = yr(n.styleAliases || null), vr.indexOf(this.kind) === -1)
    throw new I('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var N = Ar;
function Ye(e, n) {
  var r = [];
  return e[n].forEach(function(o) {
    var i = r.length;
    r.forEach(function(l, t) {
      l.tag === o.tag && l.kind === o.kind && l.multi === o.multi && (i = t);
    }), r[i] = o;
  }), r;
}
function br() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, n, r;
  function o(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (n = 0, r = arguments.length; n < r; n += 1)
    arguments[n].forEach(o);
  return e;
}
function Ee(e) {
  return this.extend(e);
}
Ee.prototype.extend = function(n) {
  var r = [], o = [];
  if (n instanceof N)
    o.push(n);
  else if (Array.isArray(n))
    o = o.concat(n);
  else if (n && (Array.isArray(n.implicit) || Array.isArray(n.explicit)))
    n.implicit && (r = r.concat(n.implicit)), n.explicit && (o = o.concat(n.explicit));
  else
    throw new I("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(l) {
    if (!(l instanceof N))
      throw new I("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (l.loadKind && l.loadKind !== "scalar")
      throw new I("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (l.multi)
      throw new I("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), o.forEach(function(l) {
    if (!(l instanceof N))
      throw new I("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Ee.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(o), i.compiledImplicit = Ye(i, "implicit"), i.compiledExplicit = Ye(i, "explicit"), i.compiledTypeMap = br(i.compiledImplicit, i.compiledExplicit), i;
};
var ln = Ee;
var un = new N("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
});
var an = new N("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
});
var fn = new N("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
});
var cn = new ln({
  explicit: [
    un,
    an,
    fn
  ]
});
function wr(e) {
  if (e === null)
    return true;
  var n = e.length;
  return n === 1 && e === "~" || n === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Sr() {
  return null;
}
function Cr(e) {
  return e === null;
}
var sn = new N("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: wr,
  construct: Sr,
  predicate: Cr,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
function _r(e) {
  if (e === null)
    return false;
  var n = e.length;
  return n === 4 && (e === "true" || e === "True" || e === "TRUE") || n === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function Er(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function Rr(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var pn = new N("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: _r,
  construct: Er,
  predicate: Rr,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
function Or(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function Fr(e) {
  return 48 <= e && e <= 55;
}
function Tr(e) {
  return 48 <= e && e <= 57;
}
function Nr(e) {
  if (e === null)
    return false;
  var n = e.length, r = 0, o = false, i;
  if (!n)
    return false;
  if (i = e[r], (i === "-" || i === "+") && (i = e[++r]), i === "0") {
    if (r + 1 === n)
      return true;
    if (i = e[++r], i === "b") {
      for (r++; r < n; r++)
        if (i = e[r], i !== "_") {
          if (i !== "0" && i !== "1")
            return false;
          o = true;
        }
      return o && i !== "_";
    }
    if (i === "x") {
      for (r++; r < n; r++)
        if (i = e[r], i !== "_") {
          if (!Or(e.charCodeAt(r)))
            return false;
          o = true;
        }
      return o && i !== "_";
    }
    if (i === "o") {
      for (r++; r < n; r++)
        if (i = e[r], i !== "_") {
          if (!Fr(e.charCodeAt(r)))
            return false;
          o = true;
        }
      return o && i !== "_";
    }
  }
  if (i === "_")
    return false;
  for (; r < n; r++)
    if (i = e[r], i !== "_") {
      if (!Tr(e.charCodeAt(r)))
        return false;
      o = true;
    }
  return !(!o || i === "_");
}
function Lr(e) {
  var n = e, r = 1, o;
  if (n.indexOf("_") !== -1 && (n = n.replace(/_/g, "")), o = n[0], (o === "-" || o === "+") && (o === "-" && (r = -1), n = n.slice(1), o = n[0]), n === "0")
    return 0;
  if (o === "0") {
    if (n[1] === "b")
      return r * parseInt(n.slice(2), 2);
    if (n[1] === "x")
      return r * parseInt(n.slice(2), 16);
    if (n[1] === "o")
      return r * parseInt(n.slice(2), 8);
  }
  return r * parseInt(n, 10);
}
function Pr(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !F.isNegativeZero(e);
}
var hn = new N("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: Nr,
  construct: Lr,
  predicate: Pr,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
});
var Ir = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function kr(e) {
  return !(e === null || !Ir.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function Dr(e) {
  var n, r;
  return n = e.replace(/_/g, "").toLowerCase(), r = n[0] === "-" ? -1 : 1, "+-".indexOf(n[0]) >= 0 && (n = n.slice(1)), n === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : n === ".nan" ? NaN : r * parseFloat(n, 10);
}
var jr = /^[-+]?[0-9]+e/;
function Mr(e, n) {
  var r;
  if (isNaN(e))
    switch (n) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (n) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (n) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (F.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), jr.test(r) ? r.replace("e", ".e") : r;
}
function Br(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || F.isNegativeZero(e));
}
var dn = new N("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: kr,
  construct: Dr,
  predicate: Br,
  represent: Mr,
  defaultStyle: "lowercase"
});
var mn = cn.extend({
  implicit: [
    sn,
    pn,
    hn,
    dn
  ]
});
var gn = mn;
var xn = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
);
var vn = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function Hr(e) {
  return e === null ? false : xn.exec(e) !== null || vn.exec(e) !== null;
}
function Yr(e) {
  var n, r, o, i, l, t, u, a = 0, c = null, h, p, m;
  if (n = xn.exec(e), n === null && (n = vn.exec(e)), n === null)
    throw new Error("Date resolve error");
  if (r = +n[1], o = +n[2] - 1, i = +n[3], !n[4])
    return new Date(Date.UTC(r, o, i));
  if (l = +n[4], t = +n[5], u = +n[6], n[7]) {
    for (a = n[7].slice(0, 3); a.length < 3; )
      a += "0";
    a = +a;
  }
  return n[9] && (h = +n[10], p = +(n[11] || 0), c = (h * 60 + p) * 6e4, n[9] === "-" && (c = -c)), m = new Date(Date.UTC(r, o, i, l, t, u, a)), c && m.setTime(m.getTime() - c), m;
}
function Ur(e) {
  return e.toISOString();
}
var yn = new N("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: Hr,
  construct: Yr,
  instanceOf: Date,
  represent: Ur
});
function $r(e) {
  return e === "<<" || e === null;
}
var An = new N("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: $r
});
var Le = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function qr(e) {
  if (e === null)
    return false;
  var n, r, o = 0, i = e.length, l = Le;
  for (r = 0; r < i; r++)
    if (n = l.indexOf(e.charAt(r)), !(n > 64)) {
      if (n < 0)
        return false;
      o += 6;
    }
  return o % 8 === 0;
}
function zr(e) {
  var n, r, o = e.replace(/[\r\n=]/g, ""), i = o.length, l = Le, t = 0, u = [];
  for (n = 0; n < i; n++)
    n % 4 === 0 && n && (u.push(t >> 16 & 255), u.push(t >> 8 & 255), u.push(t & 255)), t = t << 6 | l.indexOf(o.charAt(n));
  return r = i % 4 * 6, r === 0 ? (u.push(t >> 16 & 255), u.push(t >> 8 & 255), u.push(t & 255)) : r === 18 ? (u.push(t >> 10 & 255), u.push(t >> 2 & 255)) : r === 12 && u.push(t >> 4 & 255), new Uint8Array(u);
}
function Gr(e) {
  var n = "", r = 0, o, i, l = e.length, t = Le;
  for (o = 0; o < l; o++)
    o % 3 === 0 && o && (n += t[r >> 18 & 63], n += t[r >> 12 & 63], n += t[r >> 6 & 63], n += t[r & 63]), r = (r << 8) + e[o];
  return i = l % 3, i === 0 ? (n += t[r >> 18 & 63], n += t[r >> 12 & 63], n += t[r >> 6 & 63], n += t[r & 63]) : i === 2 ? (n += t[r >> 10 & 63], n += t[r >> 4 & 63], n += t[r << 2 & 63], n += t[64]) : i === 1 && (n += t[r >> 2 & 63], n += t[r << 4 & 63], n += t[64], n += t[64]), n;
}
function Kr(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var bn = new N("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: qr,
  construct: zr,
  predicate: Kr,
  represent: Gr
});
var Wr = Object.prototype.hasOwnProperty;
var Qr = Object.prototype.toString;
function Vr(e) {
  if (e === null)
    return true;
  var n = [], r, o, i, l, t, u = e;
  for (r = 0, o = u.length; r < o; r += 1) {
    if (i = u[r], t = false, Qr.call(i) !== "[object Object]")
      return false;
    for (l in i)
      if (Wr.call(i, l))
        if (!t)
          t = true;
        else
          return false;
    if (!t)
      return false;
    if (n.indexOf(l) === -1)
      n.push(l);
    else
      return false;
  }
  return true;
}
function Jr(e) {
  return e !== null ? e : [];
}
var wn = new N("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Vr,
  construct: Jr
});
var Zr = Object.prototype.toString;
function Xr(e) {
  if (e === null)
    return true;
  var n, r, o, i, l, t = e;
  for (l = new Array(t.length), n = 0, r = t.length; n < r; n += 1) {
    if (o = t[n], Zr.call(o) !== "[object Object]" || (i = Object.keys(o), i.length !== 1))
      return false;
    l[n] = [i[0], o[i[0]]];
  }
  return true;
}
function ei(e) {
  if (e === null)
    return [];
  var n, r, o, i, l, t = e;
  for (l = new Array(t.length), n = 0, r = t.length; n < r; n += 1)
    o = t[n], i = Object.keys(o), l[n] = [i[0], o[i[0]]];
  return l;
}
var Sn = new N("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Xr,
  construct: ei
});
var ni = Object.prototype.hasOwnProperty;
function ri(e) {
  if (e === null)
    return true;
  var n, r = e;
  for (n in r)
    if (ni.call(r, n) && r[n] !== null)
      return false;
  return true;
}
function ii(e) {
  return e !== null ? e : {};
}
var Cn = new N("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: ri,
  construct: ii
});
var Pe = gn.extend({
  implicit: [
    yn,
    An
  ],
  explicit: [
    bn,
    wn,
    Sn,
    Cn
  ]
});
var $ = Object.prototype.hasOwnProperty;
var ce = 1;
var _n = 2;
var En = 3;
var se = 4;
var _e = 1;
var oi = 2;
var Ue = 3;
var ti = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var li = /[\x85\u2028\u2029]/;
var ui = /[,\[\]\{\}]/;
var Rn = /^(?:!|!!|![a-z\-]+!)$/i;
var On = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function $e(e) {
  return Object.prototype.toString.call(e);
}
function M(e) {
  return e === 10 || e === 13;
}
function q(e) {
  return e === 9 || e === 32;
}
function k(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function W(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function ai(e) {
  var n;
  return 48 <= e && e <= 57 ? e - 48 : (n = e | 32, 97 <= n && n <= 102 ? n - 97 + 10 : -1);
}
function fi(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function ci(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function qe(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "\x85" : e === 95 ? "\xA0" : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function si(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
var Fn = new Array(256);
var Tn = new Array(256);
for (G = 0; G < 256; G++)
  Fn[G] = qe(G) ? 1 : 0, Tn[G] = qe(G);
var G;
function pi(e, n) {
  this.input = e, this.filename = n.filename || null, this.schema = n.schema || Pe, this.onWarning = n.onWarning || null, this.legacy = n.legacy || false, this.json = n.json || false, this.listener = n.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Nn(e, n) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = gr(r), new I(n, r);
}
function g(e, n) {
  throw Nn(e, n);
}
function pe(e, n) {
  e.onWarning && e.onWarning.call(null, Nn(e, n));
}
var ze = {
  YAML: function(n, r, o) {
    var i, l, t;
    n.version !== null && g(n, "duplication of %YAML directive"), o.length !== 1 && g(n, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(o[0]), i === null && g(n, "ill-formed argument of the YAML directive"), l = parseInt(i[1], 10), t = parseInt(i[2], 10), l !== 1 && g(n, "unacceptable YAML version of the document"), n.version = o[0], n.checkLineBreaks = t < 2, t !== 1 && t !== 2 && pe(n, "unsupported YAML version of the document");
  },
  TAG: function(n, r, o) {
    var i, l;
    o.length !== 2 && g(n, "TAG directive accepts exactly two arguments"), i = o[0], l = o[1], Rn.test(i) || g(n, "ill-formed tag handle (first argument) of the TAG directive"), $.call(n.tagMap, i) && g(n, 'there is a previously declared suffix for "' + i + '" tag handle'), On.test(l) || g(n, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      l = decodeURIComponent(l);
    } catch {
      g(n, "tag prefix is malformed: " + l);
    }
    n.tagMap[i] = l;
  }
};
function U(e, n, r, o) {
  var i, l, t, u;
  if (n < r) {
    if (u = e.input.slice(n, r), o)
      for (i = 0, l = u.length; i < l; i += 1)
        t = u.charCodeAt(i), t === 9 || 32 <= t && t <= 1114111 || g(e, "expected valid JSON character");
    else
      ti.test(u) && g(e, "the stream contains non-printable characters");
    e.result += u;
  }
}
function Ge(e, n, r, o) {
  var i, l, t, u;
  for (F.isObject(r) || g(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), t = 0, u = i.length; t < u; t += 1)
    l = i[t], $.call(n, l) || (n[l] = r[l], o[l] = true);
}
function Q(e, n, r, o, i, l, t, u, a) {
  var c, h;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), c = 0, h = i.length; c < h; c += 1)
      Array.isArray(i[c]) && g(e, "nested arrays are not supported inside keys"), typeof i == "object" && $e(i[c]) === "[object Object]" && (i[c] = "[object Object]");
  if (typeof i == "object" && $e(i) === "[object Object]" && (i = "[object Object]"), i = String(i), n === null && (n = {}), o === "tag:yaml.org,2002:merge")
    if (Array.isArray(l))
      for (c = 0, h = l.length; c < h; c += 1)
        Ge(e, n, l[c], r);
    else
      Ge(e, n, l, r);
  else
    !e.json && !$.call(r, i) && $.call(n, i) && (e.line = t || e.line, e.lineStart = u || e.lineStart, e.position = a || e.position, g(e, "duplicated mapping key")), i === "__proto__" ? Object.defineProperty(n, i, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: l
    }) : n[i] = l, delete r[i];
  return n;
}
function Ie(e) {
  var n;
  n = e.input.charCodeAt(e.position), n === 10 ? e.position++ : n === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : g(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function R(e, n, r) {
  for (var o = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; q(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (n && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (M(i))
      for (Ie(e), i = e.input.charCodeAt(e.position), o++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && o !== 0 && e.lineIndent < r && pe(e, "deficient indentation"), o;
}
function me(e) {
  var n = e.position, r;
  return r = e.input.charCodeAt(n), !!((r === 45 || r === 46) && r === e.input.charCodeAt(n + 1) && r === e.input.charCodeAt(n + 2) && (n += 3, r = e.input.charCodeAt(n), r === 0 || k(r)));
}
function ke(e, n) {
  n === 1 ? e.result += " " : n > 1 && (e.result += F.repeat(`
`, n - 1));
}
function hi(e, n, r) {
  var o, i, l, t, u, a, c, h, p = e.kind, m = e.result, x;
  if (x = e.input.charCodeAt(e.position), k(x) || W(x) || x === 35 || x === 38 || x === 42 || x === 33 || x === 124 || x === 62 || x === 39 || x === 34 || x === 37 || x === 64 || x === 96 || (x === 63 || x === 45) && (i = e.input.charCodeAt(e.position + 1), k(i) || r && W(i)))
    return false;
  for (e.kind = "scalar", e.result = "", l = t = e.position, u = false; x !== 0; ) {
    if (x === 58) {
      if (i = e.input.charCodeAt(e.position + 1), k(i) || r && W(i))
        break;
    } else if (x === 35) {
      if (o = e.input.charCodeAt(e.position - 1), k(o))
        break;
    } else {
      if (e.position === e.lineStart && me(e) || r && W(x))
        break;
      if (M(x))
        if (a = e.line, c = e.lineStart, h = e.lineIndent, R(e, false, -1), e.lineIndent >= n) {
          u = true, x = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = t, e.line = a, e.lineStart = c, e.lineIndent = h;
          break;
        }
    }
    u && (U(e, l, t, false), ke(e, e.line - a), l = t = e.position, u = false), q(x) || (t = e.position + 1), x = e.input.charCodeAt(++e.position);
  }
  return U(e, l, t, false), e.result ? true : (e.kind = p, e.result = m, false);
}
function di(e, n) {
  var r, o, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return false;
  for (e.kind = "scalar", e.result = "", e.position++, o = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (U(e, o, e.position, true), r = e.input.charCodeAt(++e.position), r === 39)
        o = e.position, e.position++, i = e.position;
      else
        return true;
    else
      M(r) ? (U(e, o, i, true), ke(e, R(e, false, n)), o = i = e.position) : e.position === e.lineStart && me(e) ? g(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  g(e, "unexpected end of the stream within a single quoted scalar");
}
function mi(e, n) {
  var r, o, i, l, t, u;
  if (u = e.input.charCodeAt(e.position), u !== 34)
    return false;
  for (e.kind = "scalar", e.result = "", e.position++, r = o = e.position; (u = e.input.charCodeAt(e.position)) !== 0; ) {
    if (u === 34)
      return U(e, r, e.position, true), e.position++, true;
    if (u === 92) {
      if (U(e, r, e.position, true), u = e.input.charCodeAt(++e.position), M(u))
        R(e, false, n);
      else if (u < 256 && Fn[u])
        e.result += Tn[u], e.position++;
      else if ((t = fi(u)) > 0) {
        for (i = t, l = 0; i > 0; i--)
          u = e.input.charCodeAt(++e.position), (t = ai(u)) >= 0 ? l = (l << 4) + t : g(e, "expected hexadecimal character");
        e.result += si(l), e.position++;
      } else
        g(e, "unknown escape sequence");
      r = o = e.position;
    } else
      M(u) ? (U(e, r, o, true), ke(e, R(e, false, n)), r = o = e.position) : e.position === e.lineStart && me(e) ? g(e, "unexpected end of the document within a double quoted scalar") : (e.position++, o = e.position);
  }
  g(e, "unexpected end of the stream within a double quoted scalar");
}
function gi(e, n) {
  var r = true, o, i, l, t = e.tag, u, a = e.anchor, c, h, p, m, x, v = /* @__PURE__ */ Object.create(null), A, b, D, y;
  if (y = e.input.charCodeAt(e.position), y === 91)
    h = 93, x = false, u = [];
  else if (y === 123)
    h = 125, x = true, u = {};
  else
    return false;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = u), y = e.input.charCodeAt(++e.position); y !== 0; ) {
    if (R(e, true, n), y = e.input.charCodeAt(e.position), y === h)
      return e.position++, e.tag = t, e.anchor = a, e.kind = x ? "mapping" : "sequence", e.result = u, true;
    r ? y === 44 && g(e, "expected the node content, but found ','") : g(e, "missed comma between flow collection entries"), b = A = D = null, p = m = false, y === 63 && (c = e.input.charCodeAt(e.position + 1), k(c) && (p = m = true, e.position++, R(e, true, n))), o = e.line, i = e.lineStart, l = e.position, V(e, n, ce, false, true), b = e.tag, A = e.result, R(e, true, n), y = e.input.charCodeAt(e.position), (m || e.line === o) && y === 58 && (p = true, y = e.input.charCodeAt(++e.position), R(e, true, n), V(e, n, ce, false, true), D = e.result), x ? Q(e, u, v, b, A, D, o, i, l) : p ? u.push(Q(e, null, v, b, A, D, o, i, l)) : u.push(A), R(e, true, n), y = e.input.charCodeAt(e.position), y === 44 ? (r = true, y = e.input.charCodeAt(++e.position)) : r = false;
  }
  g(e, "unexpected end of the stream within a flow collection");
}
function xi(e, n) {
  var r, o, i = _e, l = false, t = false, u = n, a = 0, c = false, h, p;
  if (p = e.input.charCodeAt(e.position), p === 124)
    o = false;
  else if (p === 62)
    o = true;
  else
    return false;
  for (e.kind = "scalar", e.result = ""; p !== 0; )
    if (p = e.input.charCodeAt(++e.position), p === 43 || p === 45)
      _e === i ? i = p === 43 ? Ue : oi : g(e, "repeat of a chomping mode identifier");
    else if ((h = ci(p)) >= 0)
      h === 0 ? g(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : t ? g(e, "repeat of an indentation width identifier") : (u = n + h - 1, t = true);
    else
      break;
  if (q(p)) {
    do
      p = e.input.charCodeAt(++e.position);
    while (q(p));
    if (p === 35)
      do
        p = e.input.charCodeAt(++e.position);
      while (!M(p) && p !== 0);
  }
  for (; p !== 0; ) {
    for (Ie(e), e.lineIndent = 0, p = e.input.charCodeAt(e.position); (!t || e.lineIndent < u) && p === 32; )
      e.lineIndent++, p = e.input.charCodeAt(++e.position);
    if (!t && e.lineIndent > u && (u = e.lineIndent), M(p)) {
      a++;
      continue;
    }
    if (e.lineIndent < u) {
      i === Ue ? e.result += F.repeat(`
`, l ? 1 + a : a) : i === _e && l && (e.result += `
`);
      break;
    }
    for (o ? q(p) ? (c = true, e.result += F.repeat(`
`, l ? 1 + a : a)) : c ? (c = false, e.result += F.repeat(`
`, a + 1)) : a === 0 ? l && (e.result += " ") : e.result += F.repeat(`
`, a) : e.result += F.repeat(`
`, l ? 1 + a : a), l = true, t = true, a = 0, r = e.position; !M(p) && p !== 0; )
      p = e.input.charCodeAt(++e.position);
    U(e, r, e.position, false);
  }
  return true;
}
function Ke(e, n) {
  var r, o = e.tag, i = e.anchor, l = [], t, u = false, a;
  if (e.firstTabInLine !== -1)
    return false;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = l), a = e.input.charCodeAt(e.position); a !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, g(e, "tab characters must not be used in indentation")), !(a !== 45 || (t = e.input.charCodeAt(e.position + 1), !k(t)))); ) {
    if (u = true, e.position++, R(e, true, -1) && e.lineIndent <= n) {
      l.push(null), a = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, V(e, n, En, false, true), l.push(e.result), R(e, true, -1), a = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > n) && a !== 0)
      g(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < n)
      break;
  }
  return u ? (e.tag = o, e.anchor = i, e.kind = "sequence", e.result = l, true) : false;
}
function vi(e, n, r) {
  var o, i, l, t, u, a, c = e.tag, h = e.anchor, p = {}, m = /* @__PURE__ */ Object.create(null), x = null, v = null, A = null, b = false, D = false, y;
  if (e.firstTabInLine !== -1)
    return false;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = p), y = e.input.charCodeAt(e.position); y !== 0; ) {
    if (!b && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, g(e, "tab characters must not be used in indentation")), o = e.input.charCodeAt(e.position + 1), l = e.line, (y === 63 || y === 58) && k(o))
      y === 63 ? (b && (Q(e, p, m, x, v, null, t, u, a), x = v = A = null), D = true, b = true, i = true) : b ? (b = false, i = true) : g(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, y = o;
    else {
      if (t = e.line, u = e.lineStart, a = e.position, !V(e, r, _n, false, true))
        break;
      if (e.line === l) {
        for (y = e.input.charCodeAt(e.position); q(y); )
          y = e.input.charCodeAt(++e.position);
        if (y === 58)
          y = e.input.charCodeAt(++e.position), k(y) || g(e, "a whitespace character is expected after the key-value separator within a block mapping"), b && (Q(e, p, m, x, v, null, t, u, a), x = v = A = null), D = true, b = false, i = false, x = e.tag, v = e.result;
        else if (D)
          g(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = c, e.anchor = h, true;
      } else if (D)
        g(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = c, e.anchor = h, true;
    }
    if ((e.line === l || e.lineIndent > n) && (b && (t = e.line, u = e.lineStart, a = e.position), V(e, n, se, true, i) && (b ? v = e.result : A = e.result), b || (Q(e, p, m, x, v, A, t, u, a), x = v = A = null), R(e, true, -1), y = e.input.charCodeAt(e.position)), (e.line === l || e.lineIndent > n) && y !== 0)
      g(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < n)
      break;
  }
  return b && Q(e, p, m, x, v, null, t, u, a), D && (e.tag = c, e.anchor = h, e.kind = "mapping", e.result = p), D;
}
function yi(e) {
  var n, r = false, o = false, i, l, t;
  if (t = e.input.charCodeAt(e.position), t !== 33)
    return false;
  if (e.tag !== null && g(e, "duplication of a tag property"), t = e.input.charCodeAt(++e.position), t === 60 ? (r = true, t = e.input.charCodeAt(++e.position)) : t === 33 ? (o = true, i = "!!", t = e.input.charCodeAt(++e.position)) : i = "!", n = e.position, r) {
    do
      t = e.input.charCodeAt(++e.position);
    while (t !== 0 && t !== 62);
    e.position < e.length ? (l = e.input.slice(n, e.position), t = e.input.charCodeAt(++e.position)) : g(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; t !== 0 && !k(t); )
      t === 33 && (o ? g(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(n - 1, e.position + 1), Rn.test(i) || g(e, "named tag handle cannot contain such characters"), o = true, n = e.position + 1)), t = e.input.charCodeAt(++e.position);
    l = e.input.slice(n, e.position), ui.test(l) && g(e, "tag suffix cannot contain flow indicator characters");
  }
  l && !On.test(l) && g(e, "tag name cannot contain such characters: " + l);
  try {
    l = decodeURIComponent(l);
  } catch {
    g(e, "tag name is malformed: " + l);
  }
  return r ? e.tag = l : $.call(e.tagMap, i) ? e.tag = e.tagMap[i] + l : i === "!" ? e.tag = "!" + l : i === "!!" ? e.tag = "tag:yaml.org,2002:" + l : g(e, 'undeclared tag handle "' + i + '"'), true;
}
function Ai(e) {
  var n, r;
  if (r = e.input.charCodeAt(e.position), r !== 38)
    return false;
  for (e.anchor !== null && g(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), n = e.position; r !== 0 && !k(r) && !W(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === n && g(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(n, e.position), true;
}
function bi(e) {
  var n, r, o;
  if (o = e.input.charCodeAt(e.position), o !== 42)
    return false;
  for (o = e.input.charCodeAt(++e.position), n = e.position; o !== 0 && !k(o) && !W(o); )
    o = e.input.charCodeAt(++e.position);
  return e.position === n && g(e, "name of an alias node must contain at least one character"), r = e.input.slice(n, e.position), $.call(e.anchorMap, r) || g(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], R(e, true, -1), true;
}
function V(e, n, r, o, i) {
  var l, t, u, a = 1, c = false, h = false, p, m, x, v, A, b;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, l = t = u = se === r || En === r, o && R(e, true, -1) && (c = true, e.lineIndent > n ? a = 1 : e.lineIndent === n ? a = 0 : e.lineIndent < n && (a = -1)), a === 1)
    for (; yi(e) || Ai(e); )
      R(e, true, -1) ? (c = true, u = l, e.lineIndent > n ? a = 1 : e.lineIndent === n ? a = 0 : e.lineIndent < n && (a = -1)) : u = false;
  if (u && (u = c || i), (a === 1 || se === r) && (ce === r || _n === r ? A = n : A = n + 1, b = e.position - e.lineStart, a === 1 ? u && (Ke(e, b) || vi(e, b, A)) || gi(e, A) ? h = true : (t && xi(e, A) || di(e, A) || mi(e, A) ? h = true : bi(e) ? (h = true, (e.tag !== null || e.anchor !== null) && g(e, "alias node should not have any properties")) : hi(e, A, ce === r) && (h = true, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : a === 0 && (h = u && Ke(e, b))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && g(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), p = 0, m = e.implicitTypes.length; p < m; p += 1)
      if (v = e.implicitTypes[p], v.resolve(e.result)) {
        e.result = v.construct(e.result), e.tag = v.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if ($.call(e.typeMap[e.kind || "fallback"], e.tag))
      v = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (v = null, x = e.typeMap.multi[e.kind || "fallback"], p = 0, m = x.length; p < m; p += 1)
        if (e.tag.slice(0, x[p].tag.length) === x[p].tag) {
          v = x[p];
          break;
        }
    v || g(e, "unknown tag !<" + e.tag + ">"), e.result !== null && v.kind !== e.kind && g(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + v.kind + '", not "' + e.kind + '"'), v.resolve(e.result, e.tag) ? (e.result = v.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : g(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || h;
}
function wi(e) {
  var n = e.position, r, o, i, l = false, t;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (t = e.input.charCodeAt(e.position)) !== 0 && (R(e, true, -1), t = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || t !== 37)); ) {
    for (l = true, t = e.input.charCodeAt(++e.position), r = e.position; t !== 0 && !k(t); )
      t = e.input.charCodeAt(++e.position);
    for (o = e.input.slice(r, e.position), i = [], o.length < 1 && g(e, "directive name must not be less than one character in length"); t !== 0; ) {
      for (; q(t); )
        t = e.input.charCodeAt(++e.position);
      if (t === 35) {
        do
          t = e.input.charCodeAt(++e.position);
        while (t !== 0 && !M(t));
        break;
      }
      if (M(t))
        break;
      for (r = e.position; t !== 0 && !k(t); )
        t = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    t !== 0 && Ie(e), $.call(ze, o) ? ze[o](e, o, i) : pe(e, 'unknown document directive "' + o + '"');
  }
  if (R(e, true, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, R(e, true, -1)) : l && g(e, "directives end mark is expected"), V(e, e.lineIndent - 1, se, false, true), R(e, true, -1), e.checkLineBreaks && li.test(e.input.slice(n, e.position)) && pe(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && me(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, R(e, true, -1));
    return;
  }
  if (e.position < e.length - 1)
    g(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Ln(e, n) {
  e = String(e), n = n || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new pi(e, n), o = e.indexOf("\0");
  for (o !== -1 && (r.position = o, g(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    wi(r);
  return r.documents;
}
function Si(e, n, r) {
  n !== null && typeof n == "object" && typeof r > "u" && (r = n, n = null);
  var o = Ln(e, r);
  if (typeof n != "function")
    return o;
  for (var i = 0, l = o.length; i < l; i += 1)
    n(o[i]);
}
function Ci(e, n) {
  var r = Ln(e, n);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new I("expected a single document in the stream, but found more");
  }
}
var _i = Si;
var Ei = Ci;
var Pn = {
  loadAll: _i,
  load: Ei
};
var In = Object.prototype.toString;
var kn = Object.prototype.hasOwnProperty;
var De = 65279;
var Ri = 9;
var ne = 10;
var Oi = 13;
var Fi = 32;
var Ti = 33;
var Ni = 34;
var Re = 35;
var Li = 37;
var Pi = 38;
var Ii = 39;
var ki = 42;
var Dn = 44;
var Di = 45;
var he = 58;
var ji = 61;
var Mi = 62;
var Bi = 63;
var Hi = 64;
var jn = 91;
var Mn = 93;
var Yi = 96;
var Bn = 123;
var Ui = 124;
var Hn = 125;
var P = {};
P[0] = "\\0";
P[7] = "\\a";
P[8] = "\\b";
P[9] = "\\t";
P[10] = "\\n";
P[11] = "\\v";
P[12] = "\\f";
P[13] = "\\r";
P[27] = "\\e";
P[34] = '\\"';
P[92] = "\\\\";
P[133] = "\\N";
P[160] = "\\_";
P[8232] = "\\L";
P[8233] = "\\P";
var $i = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
];
var qi = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function zi(e, n) {
  var r, o, i, l, t, u, a;
  if (n === null)
    return {};
  for (r = {}, o = Object.keys(n), i = 0, l = o.length; i < l; i += 1)
    t = o[i], u = String(n[t]), t.slice(0, 2) === "!!" && (t = "tag:yaml.org,2002:" + t.slice(2)), a = e.compiledTypeMap.fallback[t], a && kn.call(a.styleAliases, u) && (u = a.styleAliases[u]), r[t] = u;
  return r;
}
function Gi(e) {
  var n, r, o;
  if (n = e.toString(16).toUpperCase(), e <= 255)
    r = "x", o = 2;
  else if (e <= 65535)
    r = "u", o = 4;
  else if (e <= 4294967295)
    r = "U", o = 8;
  else
    throw new I("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + F.repeat("0", o - n.length) + n;
}
var Ki = 1;
var re = 2;
function Wi(e) {
  this.schema = e.schema || Pe, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || false, this.skipInvalid = e.skipInvalid || false, this.flowLevel = F.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = zi(this.schema, e.styles || null), this.sortKeys = e.sortKeys || false, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || false, this.noCompatMode = e.noCompatMode || false, this.condenseFlow = e.condenseFlow || false, this.quotingType = e.quotingType === '"' ? re : Ki, this.forceQuotes = e.forceQuotes || false, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function We(e, n) {
  for (var r = F.repeat(" ", n), o = 0, i = -1, l = "", t, u = e.length; o < u; )
    i = e.indexOf(`
`, o), i === -1 ? (t = e.slice(o), o = u) : (t = e.slice(o, i + 1), o = i + 1), t.length && t !== `
` && (l += r), l += t;
  return l;
}
function Oe(e, n) {
  return `
` + F.repeat(" ", e.indent * n);
}
function Qi(e, n) {
  var r, o, i;
  for (r = 0, o = e.implicitTypes.length; r < o; r += 1)
    if (i = e.implicitTypes[r], i.resolve(n))
      return true;
  return false;
}
function de(e) {
  return e === Fi || e === Ri;
}
function ie(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== De || 65536 <= e && e <= 1114111;
}
function Qe(e) {
  return ie(e) && e !== De && e !== Oi && e !== ne;
}
function Ve(e, n, r) {
  var o = Qe(e), i = o && !de(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      o
    ) : o && e !== Dn && e !== jn && e !== Mn && e !== Bn && e !== Hn) && e !== Re && !(n === he && !i) || Qe(n) && !de(n) && e === Re || n === he && i
  );
}
function Vi(e) {
  return ie(e) && e !== De && !de(e) && e !== Di && e !== Bi && e !== he && e !== Dn && e !== jn && e !== Mn && e !== Bn && e !== Hn && e !== Re && e !== Pi && e !== ki && e !== Ti && e !== Ui && e !== ji && e !== Mi && e !== Ii && e !== Ni && e !== Li && e !== Hi && e !== Yi;
}
function Ji(e) {
  return !de(e) && e !== he;
}
function Z(e, n) {
  var r = e.charCodeAt(n), o;
  return r >= 55296 && r <= 56319 && n + 1 < e.length && (o = e.charCodeAt(n + 1), o >= 56320 && o <= 57343) ? (r - 55296) * 1024 + o - 56320 + 65536 : r;
}
function Yn(e) {
  var n = /^\n* /;
  return n.test(e);
}
var Un = 1;
var Fe = 2;
var $n = 3;
var qn = 4;
var K = 5;
function Zi(e, n, r, o, i, l, t, u) {
  var a, c = 0, h = null, p = false, m = false, x = o !== -1, v = -1, A = Vi(Z(e, 0)) && Ji(Z(e, e.length - 1));
  if (n || t)
    for (a = 0; a < e.length; c >= 65536 ? a += 2 : a++) {
      if (c = Z(e, a), !ie(c))
        return K;
      A = A && Ve(c, h, u), h = c;
    }
  else {
    for (a = 0; a < e.length; c >= 65536 ? a += 2 : a++) {
      if (c = Z(e, a), c === ne)
        p = true, x && (m = m || // Foldable line = too long, and not more-indented.
        a - v - 1 > o && e[v + 1] !== " ", v = a);
      else if (!ie(c))
        return K;
      A = A && Ve(c, h, u), h = c;
    }
    m = m || x && a - v - 1 > o && e[v + 1] !== " ";
  }
  return !p && !m ? A && !t && !i(e) ? Un : l === re ? K : Fe : r > 9 && Yn(e) ? K : t ? l === re ? K : Fe : m ? qn : $n;
}
function Xi(e, n, r, o, i) {
  e.dump = function() {
    if (n.length === 0)
      return e.quotingType === re ? '""' : "''";
    if (!e.noCompatMode && ($i.indexOf(n) !== -1 || qi.test(n)))
      return e.quotingType === re ? '"' + n + '"' : "'" + n + "'";
    var l = e.indent * Math.max(1, r), t = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - l), u = o || e.flowLevel > -1 && r >= e.flowLevel;
    function a(c) {
      return Qi(e, c);
    }
    switch (Zi(
      n,
      u,
      e.indent,
      t,
      a,
      e.quotingType,
      e.forceQuotes && !o,
      i
    )) {
      case Un:
        return n;
      case Fe:
        return "'" + n.replace(/'/g, "''") + "'";
      case $n:
        return "|" + Je(n, e.indent) + Ze(We(n, l));
      case qn:
        return ">" + Je(n, e.indent) + Ze(We(eo(n, t), l));
      case K:
        return '"' + no(n) + '"';
      default:
        throw new I("impossible error: invalid scalar style");
    }
  }();
}
function Je(e, n) {
  var r = Yn(e) ? String(n) : "", o = e[e.length - 1] === `
`, i = o && (e[e.length - 2] === `
` || e === `
`), l = i ? "+" : o ? "" : "-";
  return r + l + `
`;
}
function Ze(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function eo(e, n) {
  for (var r = /(\n+)([^\n]*)/g, o = function() {
    var c = e.indexOf(`
`);
    return c = c !== -1 ? c : e.length, r.lastIndex = c, Xe(e.slice(0, c), n);
  }(), i = e[0] === `
` || e[0] === " ", l, t; t = r.exec(e); ) {
    var u = t[1], a = t[2];
    l = a[0] === " ", o += u + (!i && !l && a !== "" ? `
` : "") + Xe(a, n), i = l;
  }
  return o;
}
function Xe(e, n) {
  if (e === "" || e[0] === " ")
    return e;
  for (var r = / [^ ]/g, o, i = 0, l, t = 0, u = 0, a = ""; o = r.exec(e); )
    u = o.index, u - i > n && (l = t > i ? t : u, a += `
` + e.slice(i, l), i = l + 1), t = u;
  return a += `
`, e.length - i > n && t > i ? a += e.slice(i, t) + `
` + e.slice(t + 1) : a += e.slice(i), a.slice(1);
}
function no(e) {
  for (var n = "", r = 0, o, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = Z(e, i), o = P[r], !o && ie(r) ? (n += e[i], r >= 65536 && (n += e[i + 1])) : n += o || Gi(r);
  return n;
}
function ro(e, n, r) {
  var o = "", i = e.tag, l, t, u;
  for (l = 0, t = r.length; l < t; l += 1)
    u = r[l], e.replacer && (u = e.replacer.call(r, String(l), u)), (H(e, n, u, false, false) || typeof u > "u" && H(e, n, null, false, false)) && (o !== "" && (o += "," + (e.condenseFlow ? "" : " ")), o += e.dump);
  e.tag = i, e.dump = "[" + o + "]";
}
function en(e, n, r, o) {
  var i = "", l = e.tag, t, u, a;
  for (t = 0, u = r.length; t < u; t += 1)
    a = r[t], e.replacer && (a = e.replacer.call(r, String(t), a)), (H(e, n + 1, a, true, true, false, true) || typeof a > "u" && H(e, n + 1, null, true, true, false, true)) && ((!o || i !== "") && (i += Oe(e, n)), e.dump && ne === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = l, e.dump = i || "[]";
}
function io(e, n, r) {
  var o = "", i = e.tag, l = Object.keys(r), t, u, a, c, h;
  for (t = 0, u = l.length; t < u; t += 1)
    h = "", o !== "" && (h += ", "), e.condenseFlow && (h += '"'), a = l[t], c = r[a], e.replacer && (c = e.replacer.call(r, a, c)), H(e, n, a, false, false) && (e.dump.length > 1024 && (h += "? "), h += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), H(e, n, c, false, false) && (h += e.dump, o += h));
  e.tag = i, e.dump = "{" + o + "}";
}
function oo(e, n, r, o) {
  var i = "", l = e.tag, t = Object.keys(r), u, a, c, h, p, m;
  if (e.sortKeys === true)
    t.sort();
  else if (typeof e.sortKeys == "function")
    t.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new I("sortKeys must be a boolean or a function");
  for (u = 0, a = t.length; u < a; u += 1)
    m = "", (!o || i !== "") && (m += Oe(e, n)), c = t[u], h = r[c], e.replacer && (h = e.replacer.call(r, c, h)), H(e, n + 1, c, true, true, true) && (p = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, p && (e.dump && ne === e.dump.charCodeAt(0) ? m += "?" : m += "? "), m += e.dump, p && (m += Oe(e, n)), H(e, n + 1, h, true, p) && (e.dump && ne === e.dump.charCodeAt(0) ? m += ":" : m += ": ", m += e.dump, i += m));
  e.tag = l, e.dump = i || "{}";
}
function nn(e, n, r) {
  var o, i, l, t, u, a;
  for (i = r ? e.explicitTypes : e.implicitTypes, l = 0, t = i.length; l < t; l += 1)
    if (u = i[l], (u.instanceOf || u.predicate) && (!u.instanceOf || typeof n == "object" && n instanceof u.instanceOf) && (!u.predicate || u.predicate(n))) {
      if (r ? u.multi && u.representName ? e.tag = u.representName(n) : e.tag = u.tag : e.tag = "?", u.represent) {
        if (a = e.styleMap[u.tag] || u.defaultStyle, In.call(u.represent) === "[object Function]")
          o = u.represent(n, a);
        else if (kn.call(u.represent, a))
          o = u.represent[a](n, a);
        else
          throw new I("!<" + u.tag + '> tag resolver accepts not "' + a + '" style');
        e.dump = o;
      }
      return true;
    }
  return false;
}
function H(e, n, r, o, i, l, t) {
  e.tag = null, e.dump = r, nn(e, r, false) || nn(e, r, true);
  var u = In.call(e.dump), a = o, c;
  o && (o = e.flowLevel < 0 || e.flowLevel > n);
  var h = u === "[object Object]" || u === "[object Array]", p, m;
  if (h && (p = e.duplicates.indexOf(r), m = p !== -1), (e.tag !== null && e.tag !== "?" || m || e.indent !== 2 && n > 0) && (i = false), m && e.usedDuplicates[p])
    e.dump = "*ref_" + p;
  else {
    if (h && m && !e.usedDuplicates[p] && (e.usedDuplicates[p] = true), u === "[object Object]")
      o && Object.keys(e.dump).length !== 0 ? (oo(e, n, e.dump, i), m && (e.dump = "&ref_" + p + e.dump)) : (io(e, n, e.dump), m && (e.dump = "&ref_" + p + " " + e.dump));
    else if (u === "[object Array]")
      o && e.dump.length !== 0 ? (e.noArrayIndent && !t && n > 0 ? en(e, n - 1, e.dump, i) : en(e, n, e.dump, i), m && (e.dump = "&ref_" + p + e.dump)) : (ro(e, n, e.dump), m && (e.dump = "&ref_" + p + " " + e.dump));
    else if (u === "[object String]")
      e.tag !== "?" && Xi(e, e.dump, n, l, a);
    else {
      if (u === "[object Undefined]")
        return false;
      if (e.skipInvalid)
        return false;
      throw new I("unacceptable kind of an object to dump " + u);
    }
    e.tag !== null && e.tag !== "?" && (c = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? c = "!" + c : c.slice(0, 18) === "tag:yaml.org,2002:" ? c = "!!" + c.slice(18) : c = "!<" + c + ">", e.dump = c + " " + e.dump);
  }
  return true;
}
function to(e, n) {
  var r = [], o = [], i, l;
  for (Te(e, r, o), i = 0, l = o.length; i < l; i += 1)
    n.duplicates.push(r[o[i]]);
  n.usedDuplicates = new Array(l);
}
function Te(e, n, r) {
  var o, i, l;
  if (e !== null && typeof e == "object")
    if (i = n.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (n.push(e), Array.isArray(e))
      for (i = 0, l = e.length; i < l; i += 1)
        Te(e[i], n, r);
    else
      for (o = Object.keys(e), i = 0, l = o.length; i < l; i += 1)
        Te(e[o[i]], n, r);
}
function lo(e, n) {
  n = n || {};
  var r = new Wi(n);
  r.noRefs || to(e, r);
  var o = e;
  return r.replacer && (o = r.replacer.call({ "": o }, "", o)), H(r, 0, o, true, true) ? r.dump + `
` : "";
}
var uo = lo;
var ao = {
  dump: uo
};
function je(e, n) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + n + " instead, which is now safe by default.");
  };
}
var fo = N;
var co = ln;
var so = cn;
var po = mn;
var ho = gn;
var mo = Pe;
var go = Pn.load;
var xo = Pn.loadAll;
var vo = ao.dump;
var yo = I;
var Ao = {
  binary: bn,
  float: dn,
  map: fn,
  null: sn,
  pairs: Sn,
  set: Cn,
  timestamp: yn,
  bool: pn,
  int: hn,
  merge: An,
  omap: wn,
  seq: an,
  str: un
};
var bo = je("safeLoad", "load");
var wo = je("safeLoadAll", "loadAll");
var So = je("safeDump", "dump");
var zn = {
  Type: fo,
  Schema: co,
  FAILSAFE_SCHEMA: so,
  JSON_SCHEMA: po,
  CORE_SCHEMA: ho,
  DEFAULT_SCHEMA: mo,
  load: go,
  loadAll: xo,
  dump: vo,
  YAMLException: yo,
  types: Ao,
  safeLoad: bo,
  safeLoadAll: wo,
  safeDump: So
};
var Co = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function _o(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var oe = { exports: {} };
var Gn = {};
var Eo = function(n) {
  return n && typeof n == "object" && typeof n.copy == "function" && typeof n.fill == "function" && typeof n.readUInt8 == "function";
};
var Ne = { exports: {} };
typeof Object.create == "function" ? Ne.exports = function(n, r) {
  n.super_ = r, n.prototype = Object.create(r.prototype, {
    constructor: {
      value: n,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
} : Ne.exports = function(n, r) {
  n.super_ = r;
  var o = function() {
  };
  o.prototype = r.prototype, n.prototype = new o(), n.prototype.constructor = n;
};
var Ro = Ne.exports;
(function(e) {
  var n = /%[sdj%]/g;
  e.format = function(f) {
    if (!te(f)) {
      for (var s = [], d = 0; d < arguments.length; d++)
        s.push(i(arguments[d]));
      return s.join(" ");
    }
    for (var d = 1, S = arguments, L = S.length, C = String(f).replace(n, function(_) {
      if (_ === "%%")
        return "%";
      if (d >= L)
        return _;
      switch (_) {
        case "%s":
          return String(S[d++]);
        case "%d":
          return Number(S[d++]);
        case "%j":
          try {
            return JSON.stringify(S[d++]);
          } catch {
            return "[Circular]";
          }
        default:
          return _;
      }
    }), w = S[d]; d < L; w = S[++d])
      b(w) || !z(w) ? C += " " + w : C += " " + i(w);
    return C;
  }, e.deprecate = function(f, s) {
    if (B(Co.process))
      return function() {
        return e.deprecate(f, s).apply(this, arguments);
      };
    if (process.noDeprecation === true)
      return f;
    var d = false;
    function S() {
      if (!d) {
        if (process.throwDeprecation)
          throw new Error(s);
        process.traceDeprecation ? console.trace(s) : console.error(s), d = true;
      }
      return f.apply(this, arguments);
    }
    return S;
  };
  var r = {}, o;
  e.debuglog = function(f) {
    if (B(o) && (o = process.env.NODE_DEBUG || ""), f = f.toUpperCase(), !r[f])
      if (new RegExp("\\b" + f + "\\b", "i").test(o)) {
        var s = process.pid;
        r[f] = function() {
          var d = e.format.apply(e, arguments);
          console.error("%s %d: %s", f, s, d);
        };
      } else
        r[f] = function() {
        };
    return r[f];
  };
  function i(f, s) {
    var d = {
      seen: [],
      stylize: t
    };
    return arguments.length >= 3 && (d.depth = arguments[2]), arguments.length >= 4 && (d.colors = arguments[3]), A(s) ? d.showHidden = s : s && e._extend(d, s), B(d.showHidden) && (d.showHidden = false), B(d.depth) && (d.depth = 2), B(d.colors) && (d.colors = false), B(d.customInspect) && (d.customInspect = true), d.colors && (d.stylize = l), a(d, f, d.depth);
  }
  e.inspect = i, i.colors = {
    bold: [1, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    white: [37, 39],
    grey: [90, 39],
    black: [30, 39],
    blue: [34, 39],
    cyan: [36, 39],
    green: [32, 39],
    magenta: [35, 39],
    red: [31, 39],
    yellow: [33, 39]
  }, i.styles = {
    special: "cyan",
    number: "yellow",
    boolean: "yellow",
    undefined: "grey",
    null: "bold",
    string: "green",
    date: "magenta",
    // "name": intentionally not styling
    regexp: "red"
  };
  function l(f, s) {
    var d = i.styles[s];
    return d ? "\x1B[" + i.colors[d][0] + "m" + f + "\x1B[" + i.colors[d][1] + "m" : f;
  }
  function t(f, s) {
    return f;
  }
  function u(f) {
    var s = {};
    return f.forEach(function(d, S) {
      s[d] = true;
    }), s;
  }
  function a(f, s, d) {
    if (f.customInspect && s && ae(s.inspect) && // Filter out the util module, it's inspect function is special
    s.inspect !== e.inspect && // Also filter out any prototype objects using the circular check.
    !(s.constructor && s.constructor.prototype === s)) {
      var S = s.inspect(d, f);
      return te(S) || (S = a(f, S, d)), S;
    }
    var L = c(f, s);
    if (L)
      return L;
    var C = Object.keys(s), w = u(C);
    if (f.showHidden && (C = Object.getOwnPropertyNames(s)), ue(s) && (C.indexOf("message") >= 0 || C.indexOf("description") >= 0))
      return h(s);
    if (C.length === 0) {
      if (ae(s)) {
        var _ = s.name ? ": " + s.name : "";
        return f.stylize("[Function" + _ + "]", "special");
      }
      if (le(s))
        return f.stylize(RegExp.prototype.toString.call(s), "regexp");
      if (ye(s))
        return f.stylize(Date.prototype.toString.call(s), "date");
      if (ue(s))
        return h(s);
    }
    var T = "", Y = false, fe = ["{", "}"];
    if (v(s) && (Y = true, fe = ["[", "]"]), ae(s)) {
      var er = s.name ? ": " + s.name : "";
      T = " [Function" + er + "]";
    }
    if (le(s) && (T = " " + RegExp.prototype.toString.call(s)), ye(s) && (T = " " + Date.prototype.toUTCString.call(s)), ue(s) && (T = " " + h(s)), C.length === 0 && (!Y || s.length == 0))
      return fe[0] + T + fe[1];
    if (d < 0)
      return le(s) ? f.stylize(RegExp.prototype.toString.call(s), "regexp") : f.stylize("[Object]", "special");
    f.seen.push(s);
    var we;
    return Y ? we = p(f, s, d, w, C) : we = C.map(function(nr) {
      return m(f, s, d, w, nr, Y);
    }), f.seen.pop(), x(we, T, fe);
  }
  function c(f, s) {
    if (B(s))
      return f.stylize("undefined", "undefined");
    if (te(s)) {
      var d = "'" + JSON.stringify(s).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
      return f.stylize(d, "string");
    }
    if (y(s))
      return f.stylize("" + s, "number");
    if (A(s))
      return f.stylize("" + s, "boolean");
    if (b(s))
      return f.stylize("null", "null");
  }
  function h(f) {
    return "[" + Error.prototype.toString.call(f) + "]";
  }
  function p(f, s, d, S, L) {
    for (var C = [], w = 0, _ = s.length; w < _; ++w)
      Be(s, String(w)) ? C.push(m(
        f,
        s,
        d,
        S,
        String(w),
        true
      )) : C.push("");
    return L.forEach(function(T) {
      T.match(/^\d+$/) || C.push(m(
        f,
        s,
        d,
        S,
        T,
        true
      ));
    }), C;
  }
  function m(f, s, d, S, L, C) {
    var w, _, T;
    if (T = Object.getOwnPropertyDescriptor(s, L) || { value: s[L] }, T.get ? T.set ? _ = f.stylize("[Getter/Setter]", "special") : _ = f.stylize("[Getter]", "special") : T.set && (_ = f.stylize("[Setter]", "special")), Be(S, L) || (w = "[" + L + "]"), _ || (f.seen.indexOf(T.value) < 0 ? (b(d) ? _ = a(f, T.value, null) : _ = a(f, T.value, d - 1), _.indexOf(`
`) > -1 && (C ? _ = _.split(`
`).map(function(Y) {
      return "  " + Y;
    }).join(`
`).substr(2) : _ = `
` + _.split(`
`).map(function(Y) {
      return "   " + Y;
    }).join(`
`))) : _ = f.stylize("[Circular]", "special")), B(w)) {
      if (C && L.match(/^\d+$/))
        return _;
      w = JSON.stringify("" + L), w.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (w = w.substr(1, w.length - 2), w = f.stylize(w, "name")) : (w = w.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), w = f.stylize(w, "string"));
    }
    return w + ": " + _;
  }
  function x(f, s, d) {
    var S = f.reduce(function(L, C) {
      return C.indexOf(`
`) >= 0, L + C.replace(/\u001b\[\d\d?m/g, "").length + 1;
    }, 0);
    return S > 60 ? d[0] + (s === "" ? "" : s + `
 `) + " " + f.join(`,
  `) + " " + d[1] : d[0] + s + " " + f.join(", ") + " " + d[1];
  }
  function v(f) {
    return Array.isArray(f);
  }
  e.isArray = v;
  function A(f) {
    return typeof f == "boolean";
  }
  e.isBoolean = A;
  function b(f) {
    return f === null;
  }
  e.isNull = b;
  function D(f) {
    return f == null;
  }
  e.isNullOrUndefined = D;
  function y(f) {
    return typeof f == "number";
  }
  e.isNumber = y;
  function te(f) {
    return typeof f == "string";
  }
  e.isString = te;
  function Vn(f) {
    return typeof f == "symbol";
  }
  e.isSymbol = Vn;
  function B(f) {
    return f === void 0;
  }
  e.isUndefined = B;
  function le(f) {
    return z(f) && Ae(f) === "[object RegExp]";
  }
  e.isRegExp = le;
  function z(f) {
    return typeof f == "object" && f !== null;
  }
  e.isObject = z;
  function ye(f) {
    return z(f) && Ae(f) === "[object Date]";
  }
  e.isDate = ye;
  function ue(f) {
    return z(f) && (Ae(f) === "[object Error]" || f instanceof Error);
  }
  e.isError = ue;
  function ae(f) {
    return typeof f == "function";
  }
  e.isFunction = ae;
  function Jn(f) {
    return f === null || typeof f == "boolean" || typeof f == "number" || typeof f == "string" || typeof f == "symbol" || // ES6 symbol
    typeof f > "u";
  }
  e.isPrimitive = Jn, e.isBuffer = Eo;
  function Ae(f) {
    return Object.prototype.toString.call(f);
  }
  function be(f) {
    return f < 10 ? "0" + f.toString(10) : f.toString(10);
  }
  var Zn = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  function Xn() {
    var f = /* @__PURE__ */ new Date(), s = [
      be(f.getHours()),
      be(f.getMinutes()),
      be(f.getSeconds())
    ].join(":");
    return [f.getDate(), Zn[f.getMonth()], s].join(" ");
  }
  e.log = function() {
    console.log("%s - %s", Xn(), e.format.apply(e, arguments));
  }, e.inherits = Ro, e._extend = function(f, s) {
    if (!s || !z(s))
      return f;
    for (var d = Object.keys(s), S = d.length; S--; )
      f[d[S]] = s[d[S]];
    return f;
  };
  function Be(f, s) {
    return Object.prototype.hasOwnProperty.call(f, s);
  }
})(Gn);
var Oo = process.platform === "win32";
var j = Gn;
function ge(e, n) {
  for (var r = [], o = 0; o < e.length; o++) {
    var i = e[o];
    !i || i === "." || (i === ".." ? r.length && r[r.length - 1] !== ".." ? r.pop() : n && r.push("..") : r.push(i));
  }
  return r;
}
function X(e) {
  for (var n = e.length - 1, r = 0; r <= n && !e[r]; r++)
    ;
  for (var o = n; o >= 0 && !e[o]; o--)
    ;
  return r === 0 && o === n ? e : r > o ? [] : e.slice(r, o + 1);
}
var Kn = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
var Fo = /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;
var E = {};
function xe(e) {
  var n = Kn.exec(e), r = (n[1] || "") + (n[2] || ""), o = n[3] || "", i = Fo.exec(o), l = i[1], t = i[2], u = i[3];
  return [r, l, t, u];
}
function Me(e) {
  var n = Kn.exec(e), r = n[1] || "", o = !!r && r[1] !== ":";
  return {
    device: r,
    isUnc: o,
    isAbsolute: o || !!n[2],
    // UNC paths are always absolute
    tail: n[3]
  };
}
function Wn(e) {
  return "\\\\" + e.replace(/^[\\\/]+/, "").replace(/[\\\/]+/g, "\\");
}
E.resolve = function() {
  for (var e = "", n = "", r = false, o = arguments.length - 1; o >= -1; o--) {
    var i;
    if (o >= 0 ? i = arguments[o] : e ? (i = process.env["=" + e], (!i || i.substr(0, 3).toLowerCase() !== e.toLowerCase() + "\\") && (i = e + "\\")) : i = process.cwd(), j.isString(i)) {
      if (!i)
        continue;
    } else
      throw new TypeError("Arguments to path.resolve must be strings");
    var l = Me(i), t = l.device, u = l.isUnc, a = l.isAbsolute, c = l.tail;
    if (!(t && e && t.toLowerCase() !== e.toLowerCase()) && (e || (e = t), r || (n = c + "\\" + n, r = a), e && r))
      break;
  }
  return u && (e = Wn(e)), n = ge(
    n.split(/[\\\/]+/),
    !r
  ).join("\\"), e + (r ? "\\" : "") + n || ".";
};
E.normalize = function(e) {
  var n = Me(e), r = n.device, o = n.isUnc, i = n.isAbsolute, l = n.tail, t = /[\\\/]$/.test(l);
  return l = ge(l.split(/[\\\/]+/), !i).join("\\"), !l && !i && (l = "."), l && t && (l += "\\"), o && (r = Wn(r)), r + (i ? "\\" : "") + l;
};
E.isAbsolute = function(e) {
  return Me(e).isAbsolute;
};
E.join = function() {
  for (var e = [], n = 0; n < arguments.length; n++) {
    var r = arguments[n];
    if (!j.isString(r))
      throw new TypeError("Arguments to path.join must be strings");
    r && e.push(r);
  }
  var o = e.join("\\");
  return /^[\\\/]{2}[^\\\/]/.test(e[0]) || (o = o.replace(/^[\\\/]{2,}/, "\\")), E.normalize(o);
};
E.relative = function(e, n) {
  e = E.resolve(e), n = E.resolve(n);
  for (var r = e.toLowerCase(), o = n.toLowerCase(), i = X(n.split("\\")), l = X(r.split("\\")), t = X(o.split("\\")), u = Math.min(l.length, t.length), a = u, c = 0; c < u; c++)
    if (l[c] !== t[c]) {
      a = c;
      break;
    }
  if (a == 0)
    return n;
  for (var h = [], c = a; c < l.length; c++)
    h.push("..");
  return h = h.concat(i.slice(a)), h.join("\\");
};
E._makeLong = function(e) {
  if (!j.isString(e))
    return e;
  if (!e)
    return "";
  var n = E.resolve(e);
  return /^[a-zA-Z]\:\\/.test(n) ? "\\\\?\\" + n : /^\\\\[^?.]/.test(n) ? "\\\\?\\UNC\\" + n.substring(2) : e;
};
E.dirname = function(e) {
  var n = xe(e), r = n[0], o = n[1];
  return !r && !o ? "." : (o && (o = o.substr(0, o.length - 1)), r + o);
};
E.basename = function(e, n) {
  var r = xe(e)[2];
  return n && r.substr(-1 * n.length) === n && (r = r.substr(0, r.length - n.length)), r;
};
E.extname = function(e) {
  return xe(e)[3];
};
E.format = function(e) {
  if (!j.isObject(e))
    throw new TypeError(
      "Parameter 'pathObject' must be an object, not " + typeof e
    );
  var n = e.root || "";
  if (!j.isString(n))
    throw new TypeError(
      "'pathObject.root' must be a string or undefined, not " + typeof e.root
    );
  var r = e.dir, o = e.base || "";
  return r ? r[r.length - 1] === E.sep ? r + o : r + E.sep + o : o;
};
E.parse = function(e) {
  if (!j.isString(e))
    throw new TypeError(
      "Parameter 'pathString' must be a string, not " + typeof e
    );
  var n = xe(e);
  if (!n || n.length !== 4)
    throw new TypeError("Invalid path '" + e + "'");
  return {
    root: n[0],
    dir: n[0] + n[1].slice(0, -1),
    base: n[2],
    ext: n[3],
    name: n[2].slice(0, n[2].length - n[3].length)
  };
};
E.sep = "\\";
E.delimiter = ";";
var To = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var O = {};
function ve(e) {
  return To.exec(e).slice(1);
}
O.resolve = function() {
  for (var e = "", n = false, r = arguments.length - 1; r >= -1 && !n; r--) {
    var o = r >= 0 ? arguments[r] : process.cwd();
    if (j.isString(o)) {
      if (!o)
        continue;
    } else
      throw new TypeError("Arguments to path.resolve must be strings");
    e = o + "/" + e, n = o[0] === "/";
  }
  return e = ge(
    e.split("/"),
    !n
  ).join("/"), (n ? "/" : "") + e || ".";
};
O.normalize = function(e) {
  var n = O.isAbsolute(e), r = e && e[e.length - 1] === "/";
  return e = ge(e.split("/"), !n).join("/"), !e && !n && (e = "."), e && r && (e += "/"), (n ? "/" : "") + e;
};
O.isAbsolute = function(e) {
  return e.charAt(0) === "/";
};
O.join = function() {
  for (var e = "", n = 0; n < arguments.length; n++) {
    var r = arguments[n];
    if (!j.isString(r))
      throw new TypeError("Arguments to path.join must be strings");
    r && (e ? e += "/" + r : e += r);
  }
  return O.normalize(e);
};
O.relative = function(e, n) {
  e = O.resolve(e).substr(1), n = O.resolve(n).substr(1);
  for (var r = X(e.split("/")), o = X(n.split("/")), i = Math.min(r.length, o.length), l = i, t = 0; t < i; t++)
    if (r[t] !== o[t]) {
      l = t;
      break;
    }
  for (var u = [], t = l; t < r.length; t++)
    u.push("..");
  return u = u.concat(o.slice(l)), u.join("/");
};
O._makeLong = function(e) {
  return e;
};
O.dirname = function(e) {
  var n = ve(e), r = n[0], o = n[1];
  return !r && !o ? "." : (o && (o = o.substr(0, o.length - 1)), r + o);
};
O.basename = function(e, n) {
  var r = ve(e)[2];
  return n && r.substr(-1 * n.length) === n && (r = r.substr(0, r.length - n.length)), r;
};
O.extname = function(e) {
  return ve(e)[3];
};
O.format = function(e) {
  if (!j.isObject(e))
    throw new TypeError(
      "Parameter 'pathObject' must be an object, not " + typeof e
    );
  var n = e.root || "";
  if (!j.isString(n))
    throw new TypeError(
      "'pathObject.root' must be a string or undefined, not " + typeof e.root
    );
  var r = e.dir ? e.dir + O.sep : "", o = e.base || "";
  return r + o;
};
O.parse = function(e) {
  if (!j.isString(e))
    throw new TypeError(
      "Parameter 'pathString' must be a string, not " + typeof e
    );
  var n = ve(e);
  if (!n || n.length !== 4)
    throw new TypeError("Invalid path '" + e + "'");
  return n[1] = n[1] || "", n[2] = n[2] || "", n[3] = n[3] || "", {
    root: n[0],
    dir: n[0] + n[1].slice(0, -1),
    base: n[2],
    ext: n[3],
    name: n[2].slice(0, n[2].length - n[3].length)
  };
};
O.sep = "/";
O.delimiter = ":";
Oo ? oe.exports = E : oe.exports = O;
oe.exports.posix = O;
oe.exports.win32 = E;
var No = oe.exports;
var Qn = /* @__PURE__ */ _o(No);
var rn = Qn.resolve();
async function Lo(e) {
  const n = e.split("/").filter((a) => a.trim() !== ""), r = n[n.length - 1], o = {}, i = `**/${r}/`, l = await He(i, {
    cwd: rn,
    // 设置当前工作目录
    onlyDirectories: true,
    // 只匹配目录
    // deep: 5, // 限制搜索深度，例如最多搜索 5 层子目录
    ignore: ["**/node_modules/**"]
    // 忽略 node_modules 目录
  }), t = rn + "/" + l[0] + "/**/*.vue", u = await He(t, {
    ignore: [Qn.join("**/src")],
    onlyFiles: true
  });
  for (const a of u) {
    const c = rr.readFileSync(a, "utf8");
    if (c) {
      const h = /<route[^>]*lang=(["'])([^"']*)\1[^>]*>([\s\S]*?)<\/route>/i, p = c.match(h);
      if (p) {
        const m = p[2].trim(), x = p[3].trim(), A = a.split(r)[1].replace(/.vue/g, "");
        let b = {};
        m === "yaml" && (b = zn.load(x), o[A] = b);
      }
    }
  }
  return o;
}
function Po(e) {
  console.log("\x1B[31m%s\x1B[0m", e);
}
var J = "vite-plugin-auto-vue-router";
function Do(e) {
  const n = "virtual:auto-vue-router", r = "\0" + n;
  e || (e = {});
  const o = [(e.dir || "/") + "**/*.vue", "!**/src", "!**/components"], i = e.ignore ? e.ignore : [];
  e = Object.assign({
    debug: false,
    dir: null,
    ignore: [],
    // ! 反面匹配模式，!**/src 这种是过滤的目录
    glob: Array.from(/* @__PURE__ */ new Set([...o, ...i])),
    eager: true
    // true=默认是一次全部加载完页面 相反则是动态加载
  }, e);
  const l = e.glob[0];
  return !e.dir && l && l.indexOf("!") < 0 && (e.dir = l), e.debug && console.log(J + ":", e), {
    name: n,
    resolveId(t) {
      if (t === n)
        return r;
    },
    transform(t, u) {
      if (!(!/vue&type=route/.test(u) || !/\.ya?ml$/.test(u)))
        return /\.ya?ml$/.test(u) && (t = JSON.stringify(zn.load(t.trim()))), `export default Comp => {
                Comp.route = {
                    ...${t}
                }
            }`;
    },
    async load(t) {
      if (t === r) {
        if (!e.dir) {
          const x = "vite-plugin-auto-vue-router: The specified page to generate the route does not exist!";
          return Po(x), `export default {}
console.error('${x}')`;
        }
        const u = await Lo(e.dir), a = new RegExp(`\\/\\*#${J}-path\\*\\/`, "g"), c = new RegExp(`\\/\\*#${J}-glob-rules\\*\\/`, "g"), h = new RegExp(`\\/\\*#${J}-options\\*\\/`, "g"), p = new RegExp(`\\/\\*#${J}-route-query\\*\\/`, "g");
        let m = ir.replace(a, `${JSON.stringify(e.glob)}`);
        return m = m.replace(c, `,{ eager: ${e.eager} }`), m = m.replace(h, `const configs = ${JSON.stringify(e)}`), m = m.replace(p, `const RouteQuery = ${JSON.stringify(u)}`), `
${m}`;
      }
    }
  };
}

// demo/vite.config.mjs
var __vite_injected_original_import_meta_url = "file:///Users/shuang/web/Plugin/vite-plugin-auto-vue-router/demo/vite.config.mjs";
var vite_config_default = defineConfig({
  resolve: {
    alias: [{
      find: "@",
      replacement: fileURLToPath(new URL("/src", __vite_injected_original_import_meta_url))
    }]
  },
  plugins: [
    vue(),
    Do({
      /* 
      dir、glob 只能2选1，如果2个都在设置那么glob优先，
      并不推荐直接在调用插件时配置glob！
      但依然保留了glob参数可通过调用时配置。
      指定目录生成路由的推荐通过dir参数配置path
      要指定过滤的目录推荐用ignore 参数去配置
      */
      dir: fileURLToPath(new URL("/src/pages/", __vite_injected_original_import_meta_url))
      // glob: [fileURLToPath(new URL('/src/pages/**/*.vue', import.meta.url)), '!**/components','!**/max'],
      // ignore: ['!**/components','!**/max'] 配置的最终会合并到glob中，但不会重复
    })
  ]
});
export {
  vite_config_default as default
};
/*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZGVtby92aXRlLmNvbmZpZy5tanMiLCAiZGlzdC9pbmRleC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zaHVhbmcvd2ViL1BsdWdpbi92aXRlLXBsdWdpbi1hdXRvLXZ1ZS1yb3V0ZXIvZGVtb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3NodWFuZy93ZWIvUGx1Z2luL3ZpdGUtcGx1Z2luLWF1dG8tdnVlLXJvdXRlci9kZW1vL3ZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc2h1YW5nL3dlYi9QbHVnaW4vdml0ZS1wbHVnaW4tYXV0by12dWUtcm91dGVyL2RlbW8vdml0ZS5jb25maWcubWpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gXCJ1cmxcIjtcbi8vIGltcG9ydCBBdXRvVnVlUm91dGVyIGZyb20gJ3ZpdGUtcGx1Z2luLWF1dG8tdnVlLXJvdXRlcic7XG5pbXBvcnQgQXV0b1Z1ZVJvdXRlciBmcm9tICcuLi9kaXN0L2luZGV4JztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcmVzb2x2ZToge1xuICAgICAgICBhbGlhczogW3tcbiAgICAgICAgICAgIGZpbmQ6ICdAJywgcmVwbGFjZW1lbnQ6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgICAgIH1dXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIHZ1ZSgpLFxuICAgICAgICBBdXRvVnVlUm91dGVyKHtcbiAgICAgICAgICAgIC8qIFxuICAgICAgICAgICAgZGlyXHUzMDAxZ2xvYiBcdTUzRUFcdTgwRkQyXHU5MDA5MVx1RkYwQ1x1NTk4Mlx1Njc5QzJcdTRFMkFcdTkwRkRcdTU3MjhcdThCQkVcdTdGNkVcdTkwQTNcdTRFNDhnbG9iXHU0RjE4XHU1MTQ4XHVGRjBDXG4gICAgICAgICAgICBcdTVFNzZcdTRFMERcdTYzQThcdTgzNTBcdTc2RjRcdTYzQTVcdTU3MjhcdThDMDNcdTc1MjhcdTYzRDJcdTRFRjZcdTY1RjZcdTkxNERcdTdGNkVnbG9iXHVGRjAxXG4gICAgICAgICAgICBcdTRGNDZcdTRGOURcdTcxMzZcdTRGRERcdTc1NTlcdTRFODZnbG9iXHU1M0MyXHU2NTcwXHU1M0VGXHU5MDFBXHU4RkM3XHU4QzAzXHU3NTI4XHU2NUY2XHU5MTREXHU3RjZFXHUzMDAyXG4gICAgICAgICAgICBcdTYzMDdcdTVCOUFcdTc2RUVcdTVGNTVcdTc1MUZcdTYyMTBcdThERUZcdTc1MzFcdTc2ODRcdTYzQThcdTgzNTBcdTkwMUFcdThGQzdkaXJcdTUzQzJcdTY1NzBcdTkxNERcdTdGNkVwYXRoXG4gICAgICAgICAgICBcdTg5ODFcdTYzMDdcdTVCOUFcdThGQzdcdTZFRTRcdTc2ODRcdTc2RUVcdTVGNTVcdTYzQThcdTgzNTBcdTc1MjhpZ25vcmUgXHU1M0MyXHU2NTcwXHU1M0JCXHU5MTREXHU3RjZFXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGlyOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy9zcmMvcGFnZXMvJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAgICAgICAvLyBnbG9iOiBbZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcvc3JjL3BhZ2VzLyoqLyoudnVlJywgaW1wb3J0Lm1ldGEudXJsKSksICchKiovY29tcG9uZW50cycsJyEqKi9tYXgnXSxcbiAgICAgICAgICAgIC8vIGlnbm9yZTogWychKiovY29tcG9uZW50cycsJyEqKi9tYXgnXSBcdTkxNERcdTdGNkVcdTc2ODRcdTY3MDBcdTdFQzhcdTRGMUFcdTU0MDhcdTVFNzZcdTUyMzBnbG9iXHU0RTJEXHVGRjBDXHU0RjQ2XHU0RTBEXHU0RjFBXHU5MUNEXHU1OTBEXG4gICAgICAgIH0pLFxuICAgIF0sXG59KTsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zaHVhbmcvd2ViL1BsdWdpbi92aXRlLXBsdWdpbi1hdXRvLXZ1ZS1yb3V0ZXIvZGlzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3NodWFuZy93ZWIvUGx1Z2luL3ZpdGUtcGx1Z2luLWF1dG8tdnVlLXJvdXRlci9kaXN0L2luZGV4LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zaHVhbmcvd2ViL1BsdWdpbi92aXRlLXBsdWdpbi1hdXRvLXZ1ZS1yb3V0ZXIvZGlzdC9pbmRleC5qc1wiO2ltcG9ydCBIZSBmcm9tIFwiZmFzdC1nbG9iXCI7XG5pbXBvcnQgcnIgZnJvbSBcImZzXCI7XG5jb25zdCBpciA9IGBpbXBvcnQgeyBjcmVhdGVQaW5pYSwgZGVmaW5lU3RvcmUgfSBmcm9tICdwaW5pYSc7XG5pbXBvcnQgeyBjcmVhdGVSb3V0ZXIsIGNyZWF0ZVdlYkhhc2hIaXN0b3J5LCBjcmVhdGVNZW1vcnlIaXN0b3J5LCBjcmVhdGVXZWJIaXN0b3J5IH0gZnJvbSAndnVlLXJvdXRlcic7XG5cbi8vXHU1M0VGXHU1MTk5XHU4MUVBXHU1QjlBXHU0RTQ5XHU4RjZDXHU2MzYyXHU2M0QyXHU0RUY2XHU2NUI5XHU2ODQ4IGh0dHBzOi8vY24udml0ZWpzLmRldi9ndWlkZS9taWdyYXRpb24tZnJvbS12MS5odG1sI2N1c3RvbS1ibG9ja3MtdHJhbnNmb3Jtc1xuXG5jb25zdCBwaW5pYSA9IGNyZWF0ZVBpbmlhKCk7XG5cbi8qI3ZpdGUtcGx1Z2luLWF1dG8tdnVlLXJvdXRlci1yb3V0ZS1xdWVyeSovXG5cbi8qIFx1OEZEOVx1OTFDQ1x1NEYxQVx1NzUxRlx1NjIxMFx1NEUwMFx1NkJCNVx1OEZEOVx1NjgzN1x1NzY4NFx1NEVFM1x1NzgwMVxuY29uc3QgUm91dGVRdWVyeSA9IHtcbiAgICBcIi9sb2dpblwiOiB7XG4gICAgICAgIFwibWV0YVwiOiB7XG4gICAgICAgICAgICBcImxheW91dFwiOiBcIm5vQXV0aFwiXG4gICAgICAgIH1cbiAgICB9XG59XG4qL1xuXG4vLyAhIC8qI3h4eCovIFx1OEZEOVx1NzlDRFx1NTkwN1x1NkNFOFx1NEUwMFx1NUI5QVx1ODk4MVx1NkNFOFx1NjEwRlx1MzAwMVx1NkNFOFx1NjEwRlx1MzAwMVx1NkNFOFx1NjEwRlx1RkYwQ1x1NUI4M1x1ODBDQ1x1NUU3Nlx1NEUwRFx1NjYyRlx1NkNFOFx1OTFDQVx1OEZEOVx1NEU0OFx1N0I4MFx1NTM1NVxuLy8gISAvKiN4eHgqLyBcdThGRDlcdTc5Q0RcdTU5MDdcdTZDRThcdTRFMDBcdTVCOUFcdTg5ODFcdTZDRThcdTYxMEZcdTMwMDFcdTZDRThcdTYxMEZcdTMwMDFcdTZDRThcdTYxMEZcdUZGMENcdTVCODNcdTgwQ0NcdTVFNzZcdTRFMERcdTY2MkZcdTZDRThcdTkxQ0FcdThGRDlcdTRFNDhcdTdCODBcdTUzNTVcbi8vICEgLyojeHh4Ki8gXHU4RkQ5XHU3OUNEXHU1OTA3XHU2Q0U4XHU0RTAwXHU1QjlBXHU4OTgxXHU2Q0U4XHU2MTBGXHUzMDAxXHU2Q0U4XHU2MTBGXHUzMDAxXHU2Q0U4XHU2MTBGXHVGRjBDXHU1QjgzXHU4MENDXHU1RTc2XHU0RTBEXHU2NjJGXHU2Q0U4XHU5MUNBXHU4RkQ5XHU0RTQ4XHU3QjgwXHU1MzU1XG5cbi8qKlxuICogXG4gKiBAcGFyYW0geyp9IGNvbXAgXG4gKiBAcGFyYW0geyp9IHJvdXRlIFxuICogQHBhcmFtIHsqfSBpc0VhZ2VyIFx1NjYyRlx1NTQyNlx1NjYyRlx1NTQwQ1x1NkI2NVx1NTJBMFx1OEY3RFxuICovXG5mdW5jdGlvbiBnZXRSb3V0ZUl0ZW0oY29tcCwgcm91dGUsIGlzRWFnZXIgPSB0cnVlKSB7XG4gICAgY29uc3Qgcm91dGVJdGVtID0ge1xuICAgICAgICBiZWZvcmVFbnRlcjogbnVsbCxcbiAgICAgICAgcmVkaXJlY3Q6IG51bGwsXG4gICAgICAgIGFsaWFzT2Y6IG51bGwsXG4gICAgICAgIHBhdGg6IG51bGwsXG4gICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgIHByb3BzOiBmYWxzZSxcbiAgICAgICAgLi4ucm91dGUsXG4gICAgICAgIGNvbXBvbmVudDogY29tcFxuICAgIH1cbiAgICByZXR1cm4gcm91dGVJdGVtO1xufVxuXG5mdW5jdGlvbiBnZXRSb3V0ZU5hbWUocGF0aFN0cikgeyAvLyBwYXRoU3RyID0gL3h4eC94eHgudnVlXG4gICAgY29uc3QgcmVnZXggPSAvW15cXFxcL10rXFxcXC9wYWdlc1xcXFwvKC4qKS87XG4gICAgY29uc3QgbWF0Y2ggPSBwYXRoU3RyLm1hdGNoKHJlZ2V4KTsgXG4gICAgY29uc3QgcGF0aFdpdGhTdWZmaXggPSBtYXRjaCA/IG1hdGNoWzFdIDogJyc7IC8vIFx1OEZEOVx1OTFDQ1x1NzY4NCBtYXRjaFsxXSBcdTg4NjhcdTc5M0FcdTgzQjdcdTUzRDZcdTdCMkNcdTRFMDBcdTRFMkFcdTYzNTVcdTgzQjdcdTdFQzRcdTc2ODRcdTUxODVcdTVCQjlcbiAgICBsZXQgUm91dGVQYXRoID0gcGF0aFdpdGhTdWZmaXg/LnJlcGxhY2UoLy52dWUvLCAnJyk7IC8vIHh4eC94eHhcbiAgICBjb25zdCBwYXRoQXJycyA9IFJvdXRlUGF0aC5zcGxpdCgnLycpOyAgICAgICAgICAgICAgICAgIC8vIFsneHh4JywgJ3h4eCddXG4gICAgY29uc3QgUGF0aExhc3ROYW1lID0gcGF0aEFycnNbcGF0aEFycnMubGVuZ3RoLTFdOyAgICAgICAgLy8gXHU1M0Q2XHU2NzAwXHU1NDBFXHU0RTAwXHU0RTJBXHU2NTg3XHU0RUY2XHU1NDBEXG4gICAgbGV0IFJvdXRlTmFtZSA9IFJvdXRlUGF0aD8ucmVwbGFjZSgvXFxcXC8vZywgJy0nKTsgICAgICAgLy8geHh4LXh4eFxuICAgIGNvbnN0IHF1ZXJ5UmVnZXggPSAvXlxcXFxbKFxcXFx3KykoLFxcXFxzKlxcXFx3KykqXFxcXF0kLztcbiAgICAgLyoqIFxuICAgICAqIFx1NTMzOVx1OTE0RFx1NTkxQVx1NEUyQXBhdGhcdTRFM0FcdTUzQzJcdTY1NzBcbiAgICAgKiBcdTY1ODdcdTRFRjZcdTU0N0RcdTU0MERcdTg5QzRcdTUyMTlcdTVGQzVcdTk3MDBcdTkwNzVcdTVCODhcbiAgICAgKiBfLnZ1ZSA9IC86cXVlcnkrIFx1NTMzOVx1OTE0RDogL29uZSwgL29uZS90d28sIC9vbmUvdHdvL3RocmVlLCBcdTdCNDkuLi5cbiAgICAgKiB1c2VyL18udnVlID0gdXNlci86cXVlcnkrIFx1NTMzOVx1OTE0RDogdXNlci9vbmUsIHVzZXIvb25lL3R3bywgdXNlci9vbmUvdHdvL3RocmVlLCBcdTdCNDkuLi5cbiAgICAgKiBcdTRFMERcdThGQzdcdTc5Q0RcdTVFRkFcdThCQUVcdTU3MjhcdTUzNTVcdTY1ODdcdTRFRjZcdTc2RUVcdTVGNTVcdTRFMEJcdTVCOUFcdTRFNDlcdUZGMENcdTRGOEJcdTU5ODJcdUZGMUFcbiAgICAgKiAgdXNlclxuICAgICAqICAgICAgZGV0YWlsXG4gICAgICogICAgICAgICAgXy52dWUgLCBcbiAgICAgKiAgXHU4MDBDXHU0RTBEXHU2NjJGXG4gICAgICogIHVzZXJcbiAgICAgKiAgICAgIF8udnVlXG4gICAgICogICAgICBbaWRdLnZ1ZVxuICAgICAqIFx1NTZFMFx1NEUzQV8udnVlXHU0RjFBXHU1MzM5XHU5MTREXHU2Mzg5dXNlci9cdTRFNEJcdTU0MEVcdTc2ODRcdTRFMDBcdTUyMDdcbiAgICAgKi9cbiAgICBpZiAoUGF0aExhc3ROYW1lPT09J18nKSB7XG4gICAgICAgIFJvdXRlUGF0aCA9IFJvdXRlUGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoUGF0aExhc3ROYW1lKSwnJykgLy8gXHU0RjhCXHU1OTgyXHVGRjFBdXNlci9fICwgXHU2RTA1XHU5NjY0cGF0aFx1NjcwMFx1NTQwRVx1NEUwMFx1ODI4Mlx1NzY4NCBfICA9IHVzZXIvXG4gICAgICAgIFJvdXRlTmFtZSA9IFJvdXRlTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoUGF0aExhc3ROYW1lKSwnJykgLy8gXHU0RjhCXHU1OTgyXHVGRjFBdXNlci1fICwgXHU2RTA1XHU5NjY0cGF0aFx1NjcwMFx1NTQwRVx1NEUwMFx1ODI4Mlx1NzY4NCBfICA9IHVzZXItXG4gICAgICAgIFJvdXRlTmFtZSA9IFJvdXRlTmFtZS5yZXBsYWNlKC8tLywnJykgLy8gXHU0RjhCXHU1OTgyXHVGRjFBdXNlci0gLCBcdTZFMDVcdTk2NjQtICA9IHVzZXJcbiAgICAgICAgUm91dGVQYXRoID0gUm91dGVQYXRoICsnOnF1ZXJ5Kyc7IC8vIFx1N0VEM1x1Njc5Q1x1NzkzQVx1NEY4Qlx1RkYxQSBzZXR0aW5nLzpxdWVyeStcbiAgICB9IGVsc2UgaWYgKHF1ZXJ5UmVnZXgudGVzdChQYXRoTGFzdE5hbWUpKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBcdTUzMzlcdTkxNERcdTUzNTVcdTRFMkFcdTMwMDFcdTU5MUFcdTRFMkFcdTYzMDdcdTVCOUFcdTUzQzJcdTY1NzBcdTU0MERcdTc5RjAsIFx1OEZEOVx1NzlDRFx1NTczQVx1NjY2Rlx1NUU5NFx1OEJFNVx1NUY4OFx1NUMxMVx1NzUyOFx1NTIzMFxuICAgICAgICAgKiBcdTY1ODdcdTRFRjZcdTU0N0RcdTU0MERcdTg5QzRcdTUyMTlcdTVGQzVcdTk3MDBcdTkwNzVcdTVCODgsIFx1ODY3RFx1NzEzNlx1NjUyRlx1NjMwMVx1N0E3QVx1NjgzQ1x1NUI5QVx1NEU0OVx1RkYwQ1x1NEY0Nlx1NUVGQVx1OEJBRVx1NEUwRFx1ODk4MVx1NTJBMFx1N0E3QVx1NjgzQ1xuICAgICAgICAgKiBbaWRdID0gLzppZFxuICAgICAgICAgKiBbaWQsIHVpZCwgLi4uXSA9IC86aWQvOnVpZC8gXHU0RUU1XHU2QjY0XHU3QzdCXHU2M0E4XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBRdWVyeVJ1bGUgPSBuZXcgUmVnRXhwKC9bL1tdLis/XS8sICdnJyk7XG4gICAgICAgIGNvbnN0IHF1ZXJ5TmFtZVN0cmluZyA9IFBhdGhMYXN0TmFtZS5yZXBsYWNlKC9bXFxcXFtcXFxcXV0vZywgJycpOyAvLyBcdTRGN0ZcdTc1MjhcdTZCNjNcdTUyMTlcdTg4NjhcdThGQkVcdTVGMEZcdTY2RkZcdTYzNjJcdTYzODkgJ1t4eHgseHh4XScgXHU3RUQzXHU2NzlDXHU3QjQ5XHU0RThFXHVGRjFBeHh4LHh4eFxuICAgICAgICBjb25zdCBxdWVyeU5hbWVzID0gcXVlcnlOYW1lU3RyaW5nLnNwbGl0KCcsJyk7IC8vIFx1N0VEM1x1Njc5Q1x1N0I0OVx1NEU4RVx1RkYxQVt4eHgsIHh4eF1cbiAgICAgICAgUm91dGVQYXRoID0gUm91dGVQYXRoLnJlcGxhY2UoUXVlcnlSdWxlLCcnKTsgLy8gXHU0RjhCXHU1OTgyXHVGRjFBdXNlci9baWRdIFx1N0VEM1x1Njc5Q1x1N0I0OVx1NEU4RVx1RkYxQXVzZXIvXG4gICAgICAgIFJvdXRlTmFtZSA9IFJvdXRlTmFtZS5yZXBsYWNlKFF1ZXJ5UnVsZSwnJyk7IC8vIFx1NEY4Qlx1NTk4Mlx1RkYxQXVzZXItW2lkXSBcdTdFRDNcdTY3OUNcdTdCNDlcdTRFOEVcdUZGMUF1c2VyLVxuICAgICAgICBSb3V0ZU5hbWUgPSBSb3V0ZU5hbWUucmVwbGFjZSgvLS8sJycpIC8vIFx1NEY4Qlx1NTk4Mlx1RkYxQXVzZXItICwgXHU2RTA1XHU5NjY0LSAgPSB1c2VyXG4gICAgICAgIGxldCBwYXRoUSA9ICcvOicrcXVlcnlOYW1lcy5qb2luKCcvOicpOyAvLyBcdTdFRDNcdTY3OUNcdTdCNDlcdTRFOEVcdUZGMUEvOnh4eC86eHh4LCBcdTU5ODJcdTY3OUNcdTVCNThcdTU3MjhcdTdBN0FcdTY4M0MvOnh4eC86IHh4eFxuICAgICAgICBwYXRoUSA9IHBhdGhRLnJlcGxhY2UoL1xcXFxzKy9nLCAnJyk7IC8vIFx1NkUwNVx1OTY2NFx1N0E3QVx1NjgzQ1xuICAgICAgICBSb3V0ZVBhdGggPSBSb3V0ZVBhdGgrcGF0aFE7XG4gICAgfVxuXG4gICAgUm91dGVQYXRoID0gJy8nKyBSb3V0ZVBhdGg7XG4gICAgZnVuY3Rpb24gZGVsZXRlTGFzdFZhbHVlRnJvbUFycmF5KGFycikge1xuICAgICAgICBpZiAoYXJyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFyci5wb3AoKTsgLy8gXHU0RjdGXHU3NTI4IEFycmF5LnBvcCgpIFx1NjVCOVx1NkNENVx1NTIyMFx1OTY2NFx1NjcwMFx1NTQwRVx1NEUwMFx1NEUyQVx1NTAzQ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfVxuICAgIGNvbnN0IGFsaWFzUGF0aHMgPSBkZWxldGVMYXN0VmFsdWVGcm9tQXJyYXkocGF0aEFycnMpO1xuICAgIGxldCBhbGlhcyA9IFtdO1xuICAgIGlmIChhbGlhc1BhdGhzICYmIGFsaWFzUGF0aHMubGVuZ3RoICYmIFJvdXRlUGF0aC5pbmRleE9mKCcvaW5kZXgnKT49MCkge1xuICAgICAgICBhbGlhcy5wdXNoKCcvJythbGlhc1BhdGhzLmpvaW4oJy8nKSk7XG4gICAgICAgIGFsaWFzLnB1c2goJy8nK2FsaWFzUGF0aHMuam9pbignLycpKycvJyk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIFJvdXRlUGF0aCxcbiAgICAgICAgUm91dGVOYW1lLFxuICAgICAgICBhbGlhc1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVzZVJvdXRlU3RhdGUgPSBkZWZpbmVTdG9yZSgnUm91dGVTdGF0ZScsICgpPT4ge1xuICAgIGxldCBSb3V0ZVN0YXRlID0ge307XG4gICAgY29uc3QgUm91dGVTdGF0ZURhdGEgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwiUm91dGVTdGF0ZVwiKSB8fCAnJztcblxuICAgIHRyeSB7XG4gICAgICAgIFJvdXRlU3RhdGUgPSBKU09OLnBhcnNlKFJvdXRlU3RhdGVEYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBSb3V0ZVN0YXRlID0ge31cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbmNyZW1lbnQocGF0aCwgcXVlcnkgPSB7fSkge1xuICAgICAgICBSb3V0ZVN0YXRlW3BhdGhdID0gcXVlcnk7XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oXCJSb3V0ZVN0YXRlXCIsIEpTT04uc3RyaW5naWZ5KFJvdXRlU3RhdGUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBSb3V0ZVN0YXRlLFxuICAgICAgICBpbmNyZW1lbnRcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGluc3RhbGwoYXBwLCBvcHRpb25zKSB7XG4gICAgICAgIGlmICghYXBwIHx8ICFhcHAudXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcignVnVlIEFwcC51c2UgZXJyb3InKVxuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIGhpc3Rvcnk6ICdoNScsXG4gICAgICAgICAgICBpbmRleDogJy9pbmRleCcsIC8vIFx1OUVEOFx1OEJBNFx1OTk5Nlx1OTg3NVxuICAgICAgICAgICAgZXJyb3JQYWdlUGF0aDogJy80MDQnLFxuICAgICAgICAgICAgUm91dGVCZWZvcmU6eyAgLy8gJ3BhdGgnOiB7IC4uLnJvdXRlIH1cbiAgICAgICAgICAgICAgICAvKiBwYXRoOiAnbG9naW4nIFxuICAgICAgICAgICAgICAgICcvbG9naW4nOntcbiAgICAgICAgICAgICAgICAgICAgYmVmb3JlRW50ZXI6KCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKDk4OTg4OSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKi8gXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIG9wdGlvbnMpO1xuICAgICAgICBcbiAgICAgICAgYXBwLnVzZShwaW5pYSk7XG4gICAgICAgIGxldCByb3V0ZXJBcnJheSA9IFtdO1xuICAgICAgICAvKiN2aXRlLXBsdWdpbi1hdXRvLXZ1ZS1yb3V0ZXItb3B0aW9ucyovXG4gICAgICAgIGNvbnN0IG1vZHVsZXMgPSBpbXBvcnQubWV0YS5nbG9iKC8qI3ZpdGUtcGx1Z2luLWF1dG8tdnVlLXJvdXRlci1wYXRoKi8gLyojdml0ZS1wbHVnaW4tYXV0by12dWUtcm91dGVyLWdsb2ItcnVsZXMqLyk7XG4gICAgICAgIGlmICghY29uZmlncy5lYWdlcikgeyAvLyBcdTUyQThcdTYwMDFcdTVCRkNcdTUxNjVcdTc2ODRcdTkwM0JcdThGOTEsIGNvbnBvbWVudDogKCk9PiBpbXBvcnQoJ3h4eC94eHgudnVlJylcbiAgICAgICAgICAgIGZvciAobGV0IGsgaW4gbW9kdWxlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXAgPSBtb2R1bGVzW2tdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgUm91dGVOYW1lLCBSb3V0ZVBhdGgsIGFsaWFzIH0gPSBnZXRSb3V0ZU5hbWUoayk7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbUNvbXAgPSBnZXRSb3V0ZUl0ZW0oY29tcCwgeyBwYXRoOiBSb3V0ZVBhdGgsIG5hbWU6IFJvdXRlTmFtZSB9LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgUm91dGVPYmpzID0gb3B0aW9ucy5Sb3V0ZUJlZm9yZVtSb3V0ZVBhdGh8fFJvdXRlTmFtZV0gfHwge307XG4gICAgICAgICAgICAgICAgbGV0IExhenlMb2FkUm91dGUgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIFJvdXRlUXVlcnkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIExhenlMb2FkUm91dGUgPSBSb3V0ZVF1ZXJ5W1JvdXRlUGF0aF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oaXRlbUNvbXAseyAuLi5Sb3V0ZU9ianMsIC4uLkxhenlMb2FkUm91dGUsIGFsaWFzIH0pO1xuICAgICAgICAgICAgICAgIHJvdXRlckFycmF5LnB1c2goaXRlbUNvbXApO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoUm91dGVQYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2Ugb3B0aW9ucy5pbmRleDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlckFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLml0ZW1Db21wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6Jy8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICcvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBvcHRpb25zLmVycm9yUGFnZVBhdGg6XG4gICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXJBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5pdGVtQ29tcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOicvOnBhdGhNYXRjaCguKikqJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnTm90Rm91bmQnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGsgaW4gbW9kdWxlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXAgPSBtb2R1bGVzW2tdLmRlZmF1bHQ7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBSb3V0ZU5hbWUsIFJvdXRlUGF0aCwgYWxpYXMgfSA9IGdldFJvdXRlTmFtZShrKTtcbiAgICAgICAgICAgICAgICBjb25zdCByb3V0ZSA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgICAgICAgICBwcm9wczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFJvdXRlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogUm91dGVQYXRoLFxuICAgICAgICAgICAgICAgICAgICBhbGlhc1xuICAgICAgICAgICAgICAgIH0sIGNvbXAucm91dGUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1Db21wID0gZ2V0Um91dGVJdGVtKGNvbXAsIHJvdXRlKTtcbiAgICAgICAgICAgICAgICByb3V0ZXJBcnJheS5wdXNoKGl0ZW1Db21wKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHJvdXRlLnBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBvcHRpb25zLmluZGV4OlxuICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVyQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uaXRlbUNvbXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDonLycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJy8nXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIG9wdGlvbnMuZXJyb3JQYWdlUGF0aDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlckFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLml0ZW1Db21wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6Jy86cGF0aE1hdGNoKC4qKSonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdOb3RGb3VuZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKG9wdGlvbnMuaGlzdG9yeSwgJ29wdGlvbnMuaGlzdG9yeScpXG4gICAgICAgIGNvbnN0IFJvdXRlckFQUCA9IGNyZWF0ZVJvdXRlcih7XG4gICAgICAgICAgICBoaXN0b3J5OiBvcHRpb25zLmhpc3Rvcnk9PT0naGFzaCc/IGNyZWF0ZVdlYkhhc2hIaXN0b3J5KCk6IG9wdGlvbnMuaGlzdG9yeT09PSdzc3InPyBjcmVhdGVNZW1vcnlIaXN0b3J5KCk6IG9wdGlvbnMuaGlzdG9yeT09PSdoNSc/IGNyZWF0ZVdlYkhpc3RvcnkoKTogY3JlYXRlV2ViSGlzdG9yeSgpLFxuICAgICAgICAgICAgcm91dGVzOiByb3V0ZXJBcnJheVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IFJvdXRlU3RhdGVyID0gdXNlUm91dGVTdGF0ZSgpO1xuXG4gICAgICAgIFJvdXRlckFQUC5wYWdlID0gKHRvLCBtb2RlPSdwdXNoJyk9PiB7XG4gICAgICAgICAgICBjb25zdCBwYXRoU3RyID0gdG8ucGF0aCB8fCB0by5uYW1lO1xuICAgICAgICAgICAgUm91dGVTdGF0ZXIuaW5jcmVtZW50KHBhdGhTdHIsIHRvLmhpZGRlblBhcmFtcyk7XG4gICAgICAgICAgICByZXR1cm4gUm91dGVyQVBQW21vZGVdKHRvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJvdXRlckFQUC5iZWZvcmVSZXNvbHZlKHRvID0+IHtcbiAgICAgICAgICAgIGxldCBkID0ge307XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoUm91dGVTdGF0ZXIuUm91dGVTdGF0ZSkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZCA9IFJvdXRlU3RhdGVyLlJvdXRlU3RhdGVbdG8ucGF0aF0gfHwgUm91dGVTdGF0ZXIuUm91dGVTdGF0ZVt0by5uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRvLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24odG8ucGFyYW1zLCBkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFJvdXRlckFQUCwgJ1JvdXRlckFQUCcpO1xuICAgICAgICBhcHAudXNlKFJvdXRlckFQUCk7XG4gICAgfVxufWA7XG4vKiEganMteWFtbCA0LjEuMCBodHRwczovL2dpdGh1Yi5jb20vbm9kZWNhL2pzLXlhbWwgQGxpY2Vuc2UgTUlUICovXG5mdW5jdGlvbiBvbihlKSB7XG4gIHJldHVybiB0eXBlb2YgZSA+IFwidVwiIHx8IGUgPT09IG51bGw7XG59XG5mdW5jdGlvbiBvcihlKSB7XG4gIHJldHVybiB0eXBlb2YgZSA9PSBcIm9iamVjdFwiICYmIGUgIT09IG51bGw7XG59XG5mdW5jdGlvbiB0cihlKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGUpID8gZSA6IG9uKGUpID8gW10gOiBbZV07XG59XG5mdW5jdGlvbiBscihlLCBuKSB7XG4gIHZhciByLCBvLCBpLCBsO1xuICBpZiAobilcbiAgICBmb3IgKGwgPSBPYmplY3Qua2V5cyhuKSwgciA9IDAsIG8gPSBsLmxlbmd0aDsgciA8IG87IHIgKz0gMSlcbiAgICAgIGkgPSBsW3JdLCBlW2ldID0gbltpXTtcbiAgcmV0dXJuIGU7XG59XG5mdW5jdGlvbiB1cihlLCBuKSB7XG4gIHZhciByID0gXCJcIiwgbztcbiAgZm9yIChvID0gMDsgbyA8IG47IG8gKz0gMSlcbiAgICByICs9IGU7XG4gIHJldHVybiByO1xufVxuZnVuY3Rpb24gYXIoZSkge1xuICByZXR1cm4gZSA9PT0gMCAmJiBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFkgPT09IDEgLyBlO1xufVxudmFyIGZyID0gb24sIGNyID0gb3IsIHNyID0gdHIsIHByID0gdXIsIGhyID0gYXIsIGRyID0gbHIsIEYgPSB7XG4gIGlzTm90aGluZzogZnIsXG4gIGlzT2JqZWN0OiBjcixcbiAgdG9BcnJheTogc3IsXG4gIHJlcGVhdDogcHIsXG4gIGlzTmVnYXRpdmVaZXJvOiBocixcbiAgZXh0ZW5kOiBkclxufTtcbmZ1bmN0aW9uIHRuKGUsIG4pIHtcbiAgdmFyIHIgPSBcIlwiLCBvID0gZS5yZWFzb24gfHwgXCIodW5rbm93biByZWFzb24pXCI7XG4gIHJldHVybiBlLm1hcmsgPyAoZS5tYXJrLm5hbWUgJiYgKHIgKz0gJ2luIFwiJyArIGUubWFyay5uYW1lICsgJ1wiICcpLCByICs9IFwiKFwiICsgKGUubWFyay5saW5lICsgMSkgKyBcIjpcIiArIChlLm1hcmsuY29sdW1uICsgMSkgKyBcIilcIiwgIW4gJiYgZS5tYXJrLnNuaXBwZXQgJiYgKHIgKz0gYFxuXG5gICsgZS5tYXJrLnNuaXBwZXQpLCBvICsgXCIgXCIgKyByKSA6IG87XG59XG5mdW5jdGlvbiBlZShlLCBuKSB7XG4gIEVycm9yLmNhbGwodGhpcyksIHRoaXMubmFtZSA9IFwiWUFNTEV4Y2VwdGlvblwiLCB0aGlzLnJlYXNvbiA9IGUsIHRoaXMubWFyayA9IG4sIHRoaXMubWVzc2FnZSA9IHRuKHRoaXMsICExKSwgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UgPyBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKSA6IHRoaXMuc3RhY2sgPSBuZXcgRXJyb3IoKS5zdGFjayB8fCBcIlwiO1xufVxuZWUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuZWUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gZWU7XG5lZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbihuKSB7XG4gIHJldHVybiB0aGlzLm5hbWUgKyBcIjogXCIgKyB0bih0aGlzLCBuKTtcbn07XG52YXIgSSA9IGVlO1xuZnVuY3Rpb24gU2UoZSwgbiwgciwgbywgaSkge1xuICB2YXIgbCA9IFwiXCIsIHQgPSBcIlwiLCB1ID0gTWF0aC5mbG9vcihpIC8gMikgLSAxO1xuICByZXR1cm4gbyAtIG4gPiB1ICYmIChsID0gXCIgLi4uIFwiLCBuID0gbyAtIHUgKyBsLmxlbmd0aCksIHIgLSBvID4gdSAmJiAodCA9IFwiIC4uLlwiLCByID0gbyArIHUgLSB0Lmxlbmd0aCksIHtcbiAgICBzdHI6IGwgKyBlLnNsaWNlKG4sIHIpLnJlcGxhY2UoL1xcdC9nLCBcIlx1MjE5MlwiKSArIHQsXG4gICAgcG9zOiBvIC0gbiArIGwubGVuZ3RoXG4gICAgLy8gcmVsYXRpdmUgcG9zaXRpb25cbiAgfTtcbn1cbmZ1bmN0aW9uIENlKGUsIG4pIHtcbiAgcmV0dXJuIEYucmVwZWF0KFwiIFwiLCBuIC0gZS5sZW5ndGgpICsgZTtcbn1cbmZ1bmN0aW9uIG1yKGUsIG4pIHtcbiAgaWYgKG4gPSBPYmplY3QuY3JlYXRlKG4gfHwgbnVsbCksICFlLmJ1ZmZlcilcbiAgICByZXR1cm4gbnVsbDtcbiAgbi5tYXhMZW5ndGggfHwgKG4ubWF4TGVuZ3RoID0gNzkpLCB0eXBlb2Ygbi5pbmRlbnQgIT0gXCJudW1iZXJcIiAmJiAobi5pbmRlbnQgPSAxKSwgdHlwZW9mIG4ubGluZXNCZWZvcmUgIT0gXCJudW1iZXJcIiAmJiAobi5saW5lc0JlZm9yZSA9IDMpLCB0eXBlb2Ygbi5saW5lc0FmdGVyICE9IFwibnVtYmVyXCIgJiYgKG4ubGluZXNBZnRlciA9IDIpO1xuICBmb3IgKHZhciByID0gL1xccj9cXG58XFxyfFxcMC9nLCBvID0gWzBdLCBpID0gW10sIGwsIHQgPSAtMTsgbCA9IHIuZXhlYyhlLmJ1ZmZlcik7IClcbiAgICBpLnB1c2gobC5pbmRleCksIG8ucHVzaChsLmluZGV4ICsgbFswXS5sZW5ndGgpLCBlLnBvc2l0aW9uIDw9IGwuaW5kZXggJiYgdCA8IDAgJiYgKHQgPSBvLmxlbmd0aCAtIDIpO1xuICB0IDwgMCAmJiAodCA9IG8ubGVuZ3RoIC0gMSk7XG4gIHZhciB1ID0gXCJcIiwgYSwgYywgaCA9IE1hdGgubWluKGUubGluZSArIG4ubGluZXNBZnRlciwgaS5sZW5ndGgpLnRvU3RyaW5nKCkubGVuZ3RoLCBwID0gbi5tYXhMZW5ndGggLSAobi5pbmRlbnQgKyBoICsgMyk7XG4gIGZvciAoYSA9IDE7IGEgPD0gbi5saW5lc0JlZm9yZSAmJiAhKHQgLSBhIDwgMCk7IGErKylcbiAgICBjID0gU2UoXG4gICAgICBlLmJ1ZmZlcixcbiAgICAgIG9bdCAtIGFdLFxuICAgICAgaVt0IC0gYV0sXG4gICAgICBlLnBvc2l0aW9uIC0gKG9bdF0gLSBvW3QgLSBhXSksXG4gICAgICBwXG4gICAgKSwgdSA9IEYucmVwZWF0KFwiIFwiLCBuLmluZGVudCkgKyBDZSgoZS5saW5lIC0gYSArIDEpLnRvU3RyaW5nKCksIGgpICsgXCIgfCBcIiArIGMuc3RyICsgYFxuYCArIHU7XG4gIGZvciAoYyA9IFNlKGUuYnVmZmVyLCBvW3RdLCBpW3RdLCBlLnBvc2l0aW9uLCBwKSwgdSArPSBGLnJlcGVhdChcIiBcIiwgbi5pbmRlbnQpICsgQ2UoKGUubGluZSArIDEpLnRvU3RyaW5nKCksIGgpICsgXCIgfCBcIiArIGMuc3RyICsgYFxuYCwgdSArPSBGLnJlcGVhdChcIi1cIiwgbi5pbmRlbnQgKyBoICsgMyArIGMucG9zKSArIGBeXG5gLCBhID0gMTsgYSA8PSBuLmxpbmVzQWZ0ZXIgJiYgISh0ICsgYSA+PSBpLmxlbmd0aCk7IGErKylcbiAgICBjID0gU2UoXG4gICAgICBlLmJ1ZmZlcixcbiAgICAgIG9bdCArIGFdLFxuICAgICAgaVt0ICsgYV0sXG4gICAgICBlLnBvc2l0aW9uIC0gKG9bdF0gLSBvW3QgKyBhXSksXG4gICAgICBwXG4gICAgKSwgdSArPSBGLnJlcGVhdChcIiBcIiwgbi5pbmRlbnQpICsgQ2UoKGUubGluZSArIGEgKyAxKS50b1N0cmluZygpLCBoKSArIFwiIHwgXCIgKyBjLnN0ciArIGBcbmA7XG4gIHJldHVybiB1LnJlcGxhY2UoL1xcbiQvLCBcIlwiKTtcbn1cbnZhciBnciA9IG1yLCB4ciA9IFtcbiAgXCJraW5kXCIsXG4gIFwibXVsdGlcIixcbiAgXCJyZXNvbHZlXCIsXG4gIFwiY29uc3RydWN0XCIsXG4gIFwiaW5zdGFuY2VPZlwiLFxuICBcInByZWRpY2F0ZVwiLFxuICBcInJlcHJlc2VudFwiLFxuICBcInJlcHJlc2VudE5hbWVcIixcbiAgXCJkZWZhdWx0U3R5bGVcIixcbiAgXCJzdHlsZUFsaWFzZXNcIlxuXSwgdnIgPSBbXG4gIFwic2NhbGFyXCIsXG4gIFwic2VxdWVuY2VcIixcbiAgXCJtYXBwaW5nXCJcbl07XG5mdW5jdGlvbiB5cihlKSB7XG4gIHZhciBuID0ge307XG4gIHJldHVybiBlICE9PSBudWxsICYmIE9iamVjdC5rZXlzKGUpLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgIGVbcl0uZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBuW1N0cmluZyhvKV0gPSByO1xuICAgIH0pO1xuICB9KSwgbjtcbn1cbmZ1bmN0aW9uIEFyKGUsIG4pIHtcbiAgaWYgKG4gPSBuIHx8IHt9LCBPYmplY3Qua2V5cyhuKS5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICBpZiAoeHIuaW5kZXhPZihyKSA9PT0gLTEpXG4gICAgICB0aHJvdyBuZXcgSSgnVW5rbm93biBvcHRpb24gXCInICsgciArICdcIiBpcyBtZXQgaW4gZGVmaW5pdGlvbiBvZiBcIicgKyBlICsgJ1wiIFlBTUwgdHlwZS4nKTtcbiAgfSksIHRoaXMub3B0aW9ucyA9IG4sIHRoaXMudGFnID0gZSwgdGhpcy5raW5kID0gbi5raW5kIHx8IG51bGwsIHRoaXMucmVzb2x2ZSA9IG4ucmVzb2x2ZSB8fCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gITA7XG4gIH0sIHRoaXMuY29uc3RydWN0ID0gbi5jb25zdHJ1Y3QgfHwgZnVuY3Rpb24ocikge1xuICAgIHJldHVybiByO1xuICB9LCB0aGlzLmluc3RhbmNlT2YgPSBuLmluc3RhbmNlT2YgfHwgbnVsbCwgdGhpcy5wcmVkaWNhdGUgPSBuLnByZWRpY2F0ZSB8fCBudWxsLCB0aGlzLnJlcHJlc2VudCA9IG4ucmVwcmVzZW50IHx8IG51bGwsIHRoaXMucmVwcmVzZW50TmFtZSA9IG4ucmVwcmVzZW50TmFtZSB8fCBudWxsLCB0aGlzLmRlZmF1bHRTdHlsZSA9IG4uZGVmYXVsdFN0eWxlIHx8IG51bGwsIHRoaXMubXVsdGkgPSBuLm11bHRpIHx8ICExLCB0aGlzLnN0eWxlQWxpYXNlcyA9IHlyKG4uc3R5bGVBbGlhc2VzIHx8IG51bGwpLCB2ci5pbmRleE9mKHRoaXMua2luZCkgPT09IC0xKVxuICAgIHRocm93IG5ldyBJKCdVbmtub3duIGtpbmQgXCInICsgdGhpcy5raW5kICsgJ1wiIGlzIHNwZWNpZmllZCBmb3IgXCInICsgZSArICdcIiBZQU1MIHR5cGUuJyk7XG59XG52YXIgTiA9IEFyO1xuZnVuY3Rpb24gWWUoZSwgbikge1xuICB2YXIgciA9IFtdO1xuICByZXR1cm4gZVtuXS5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgaSA9IHIubGVuZ3RoO1xuICAgIHIuZm9yRWFjaChmdW5jdGlvbihsLCB0KSB7XG4gICAgICBsLnRhZyA9PT0gby50YWcgJiYgbC5raW5kID09PSBvLmtpbmQgJiYgbC5tdWx0aSA9PT0gby5tdWx0aSAmJiAoaSA9IHQpO1xuICAgIH0pLCByW2ldID0gbztcbiAgfSksIHI7XG59XG5mdW5jdGlvbiBicigpIHtcbiAgdmFyIGUgPSB7XG4gICAgc2NhbGFyOiB7fSxcbiAgICBzZXF1ZW5jZToge30sXG4gICAgbWFwcGluZzoge30sXG4gICAgZmFsbGJhY2s6IHt9LFxuICAgIG11bHRpOiB7XG4gICAgICBzY2FsYXI6IFtdLFxuICAgICAgc2VxdWVuY2U6IFtdLFxuICAgICAgbWFwcGluZzogW10sXG4gICAgICBmYWxsYmFjazogW11cbiAgICB9XG4gIH0sIG4sIHI7XG4gIGZ1bmN0aW9uIG8oaSkge1xuICAgIGkubXVsdGkgPyAoZS5tdWx0aVtpLmtpbmRdLnB1c2goaSksIGUubXVsdGkuZmFsbGJhY2sucHVzaChpKSkgOiBlW2kua2luZF1baS50YWddID0gZS5mYWxsYmFja1tpLnRhZ10gPSBpO1xuICB9XG4gIGZvciAobiA9IDAsIHIgPSBhcmd1bWVudHMubGVuZ3RoOyBuIDwgcjsgbiArPSAxKVxuICAgIGFyZ3VtZW50c1tuXS5mb3JFYWNoKG8pO1xuICByZXR1cm4gZTtcbn1cbmZ1bmN0aW9uIEVlKGUpIHtcbiAgcmV0dXJuIHRoaXMuZXh0ZW5kKGUpO1xufVxuRWUucHJvdG90eXBlLmV4dGVuZCA9IGZ1bmN0aW9uKG4pIHtcbiAgdmFyIHIgPSBbXSwgbyA9IFtdO1xuICBpZiAobiBpbnN0YW5jZW9mIE4pXG4gICAgby5wdXNoKG4pO1xuICBlbHNlIGlmIChBcnJheS5pc0FycmF5KG4pKVxuICAgIG8gPSBvLmNvbmNhdChuKTtcbiAgZWxzZSBpZiAobiAmJiAoQXJyYXkuaXNBcnJheShuLmltcGxpY2l0KSB8fCBBcnJheS5pc0FycmF5KG4uZXhwbGljaXQpKSlcbiAgICBuLmltcGxpY2l0ICYmIChyID0gci5jb25jYXQobi5pbXBsaWNpdCkpLCBuLmV4cGxpY2l0ICYmIChvID0gby5jb25jYXQobi5leHBsaWNpdCkpO1xuICBlbHNlXG4gICAgdGhyb3cgbmV3IEkoXCJTY2hlbWEuZXh0ZW5kIGFyZ3VtZW50IHNob3VsZCBiZSBhIFR5cGUsIFsgVHlwZSBdLCBvciBhIHNjaGVtYSBkZWZpbml0aW9uICh7IGltcGxpY2l0OiBbLi4uXSwgZXhwbGljaXQ6IFsuLi5dIH0pXCIpO1xuICByLmZvckVhY2goZnVuY3Rpb24obCkge1xuICAgIGlmICghKGwgaW5zdGFuY2VvZiBOKSlcbiAgICAgIHRocm93IG5ldyBJKFwiU3BlY2lmaWVkIGxpc3Qgb2YgWUFNTCB0eXBlcyAob3IgYSBzaW5nbGUgVHlwZSBvYmplY3QpIGNvbnRhaW5zIGEgbm9uLVR5cGUgb2JqZWN0LlwiKTtcbiAgICBpZiAobC5sb2FkS2luZCAmJiBsLmxvYWRLaW5kICE9PSBcInNjYWxhclwiKVxuICAgICAgdGhyb3cgbmV3IEkoXCJUaGVyZSBpcyBhIG5vbi1zY2FsYXIgdHlwZSBpbiB0aGUgaW1wbGljaXQgbGlzdCBvZiBhIHNjaGVtYS4gSW1wbGljaXQgcmVzb2x2aW5nIG9mIHN1Y2ggdHlwZXMgaXMgbm90IHN1cHBvcnRlZC5cIik7XG4gICAgaWYgKGwubXVsdGkpXG4gICAgICB0aHJvdyBuZXcgSShcIlRoZXJlIGlzIGEgbXVsdGkgdHlwZSBpbiB0aGUgaW1wbGljaXQgbGlzdCBvZiBhIHNjaGVtYS4gTXVsdGkgdGFncyBjYW4gb25seSBiZSBsaXN0ZWQgYXMgZXhwbGljaXQuXCIpO1xuICB9KSwgby5mb3JFYWNoKGZ1bmN0aW9uKGwpIHtcbiAgICBpZiAoIShsIGluc3RhbmNlb2YgTikpXG4gICAgICB0aHJvdyBuZXcgSShcIlNwZWNpZmllZCBsaXN0IG9mIFlBTUwgdHlwZXMgKG9yIGEgc2luZ2xlIFR5cGUgb2JqZWN0KSBjb250YWlucyBhIG5vbi1UeXBlIG9iamVjdC5cIik7XG4gIH0pO1xuICB2YXIgaSA9IE9iamVjdC5jcmVhdGUoRWUucHJvdG90eXBlKTtcbiAgcmV0dXJuIGkuaW1wbGljaXQgPSAodGhpcy5pbXBsaWNpdCB8fCBbXSkuY29uY2F0KHIpLCBpLmV4cGxpY2l0ID0gKHRoaXMuZXhwbGljaXQgfHwgW10pLmNvbmNhdChvKSwgaS5jb21waWxlZEltcGxpY2l0ID0gWWUoaSwgXCJpbXBsaWNpdFwiKSwgaS5jb21waWxlZEV4cGxpY2l0ID0gWWUoaSwgXCJleHBsaWNpdFwiKSwgaS5jb21waWxlZFR5cGVNYXAgPSBicihpLmNvbXBpbGVkSW1wbGljaXQsIGkuY29tcGlsZWRFeHBsaWNpdCksIGk7XG59O1xudmFyIGxuID0gRWUsIHVuID0gbmV3IE4oXCJ0YWc6eWFtbC5vcmcsMjAwMjpzdHJcIiwge1xuICBraW5kOiBcInNjYWxhclwiLFxuICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZSAhPT0gbnVsbCA/IGUgOiBcIlwiO1xuICB9XG59KSwgYW4gPSBuZXcgTihcInRhZzp5YW1sLm9yZywyMDAyOnNlcVwiLCB7XG4gIGtpbmQ6IFwic2VxdWVuY2VcIixcbiAgY29uc3RydWN0OiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGUgIT09IG51bGwgPyBlIDogW107XG4gIH1cbn0pLCBmbiA9IG5ldyBOKFwidGFnOnlhbWwub3JnLDIwMDI6bWFwXCIsIHtcbiAga2luZDogXCJtYXBwaW5nXCIsXG4gIGNvbnN0cnVjdDogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBlICE9PSBudWxsID8gZSA6IHt9O1xuICB9XG59KSwgY24gPSBuZXcgbG4oe1xuICBleHBsaWNpdDogW1xuICAgIHVuLFxuICAgIGFuLFxuICAgIGZuXG4gIF1cbn0pO1xuZnVuY3Rpb24gd3IoZSkge1xuICBpZiAoZSA9PT0gbnVsbClcbiAgICByZXR1cm4gITA7XG4gIHZhciBuID0gZS5sZW5ndGg7XG4gIHJldHVybiBuID09PSAxICYmIGUgPT09IFwiflwiIHx8IG4gPT09IDQgJiYgKGUgPT09IFwibnVsbFwiIHx8IGUgPT09IFwiTnVsbFwiIHx8IGUgPT09IFwiTlVMTFwiKTtcbn1cbmZ1bmN0aW9uIFNyKCkge1xuICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIENyKGUpIHtcbiAgcmV0dXJuIGUgPT09IG51bGw7XG59XG52YXIgc24gPSBuZXcgTihcInRhZzp5YW1sLm9yZywyMDAyOm51bGxcIiwge1xuICBraW5kOiBcInNjYWxhclwiLFxuICByZXNvbHZlOiB3cixcbiAgY29uc3RydWN0OiBTcixcbiAgcHJlZGljYXRlOiBDcixcbiAgcmVwcmVzZW50OiB7XG4gICAgY2Fub25pY2FsOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBcIn5cIjtcbiAgICB9LFxuICAgIGxvd2VyY2FzZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXCJudWxsXCI7XG4gICAgfSxcbiAgICB1cHBlcmNhc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFwiTlVMTFwiO1xuICAgIH0sXG4gICAgY2FtZWxjYXNlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBcIk51bGxcIjtcbiAgICB9LFxuICAgIGVtcHR5OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgfSxcbiAgZGVmYXVsdFN0eWxlOiBcImxvd2VyY2FzZVwiXG59KTtcbmZ1bmN0aW9uIF9yKGUpIHtcbiAgaWYgKGUgPT09IG51bGwpXG4gICAgcmV0dXJuICExO1xuICB2YXIgbiA9IGUubGVuZ3RoO1xuICByZXR1cm4gbiA9PT0gNCAmJiAoZSA9PT0gXCJ0cnVlXCIgfHwgZSA9PT0gXCJUcnVlXCIgfHwgZSA9PT0gXCJUUlVFXCIpIHx8IG4gPT09IDUgJiYgKGUgPT09IFwiZmFsc2VcIiB8fCBlID09PSBcIkZhbHNlXCIgfHwgZSA9PT0gXCJGQUxTRVwiKTtcbn1cbmZ1bmN0aW9uIEVyKGUpIHtcbiAgcmV0dXJuIGUgPT09IFwidHJ1ZVwiIHx8IGUgPT09IFwiVHJ1ZVwiIHx8IGUgPT09IFwiVFJVRVwiO1xufVxuZnVuY3Rpb24gUnIoZSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGUpID09PSBcIltvYmplY3QgQm9vbGVhbl1cIjtcbn1cbnZhciBwbiA9IG5ldyBOKFwidGFnOnlhbWwub3JnLDIwMDI6Ym9vbFwiLCB7XG4gIGtpbmQ6IFwic2NhbGFyXCIsXG4gIHJlc29sdmU6IF9yLFxuICBjb25zdHJ1Y3Q6IEVyLFxuICBwcmVkaWNhdGU6IFJyLFxuICByZXByZXNlbnQ6IHtcbiAgICBsb3dlcmNhc2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiBlID8gXCJ0cnVlXCIgOiBcImZhbHNlXCI7XG4gICAgfSxcbiAgICB1cHBlcmNhc2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiBlID8gXCJUUlVFXCIgOiBcIkZBTFNFXCI7XG4gICAgfSxcbiAgICBjYW1lbGNhc2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiBlID8gXCJUcnVlXCIgOiBcIkZhbHNlXCI7XG4gICAgfVxuICB9LFxuICBkZWZhdWx0U3R5bGU6IFwibG93ZXJjYXNlXCJcbn0pO1xuZnVuY3Rpb24gT3IoZSkge1xuICByZXR1cm4gNDggPD0gZSAmJiBlIDw9IDU3IHx8IDY1IDw9IGUgJiYgZSA8PSA3MCB8fCA5NyA8PSBlICYmIGUgPD0gMTAyO1xufVxuZnVuY3Rpb24gRnIoZSkge1xuICByZXR1cm4gNDggPD0gZSAmJiBlIDw9IDU1O1xufVxuZnVuY3Rpb24gVHIoZSkge1xuICByZXR1cm4gNDggPD0gZSAmJiBlIDw9IDU3O1xufVxuZnVuY3Rpb24gTnIoZSkge1xuICBpZiAoZSA9PT0gbnVsbClcbiAgICByZXR1cm4gITE7XG4gIHZhciBuID0gZS5sZW5ndGgsIHIgPSAwLCBvID0gITEsIGk7XG4gIGlmICghbilcbiAgICByZXR1cm4gITE7XG4gIGlmIChpID0gZVtyXSwgKGkgPT09IFwiLVwiIHx8IGkgPT09IFwiK1wiKSAmJiAoaSA9IGVbKytyXSksIGkgPT09IFwiMFwiKSB7XG4gICAgaWYgKHIgKyAxID09PSBuKVxuICAgICAgcmV0dXJuICEwO1xuICAgIGlmIChpID0gZVsrK3JdLCBpID09PSBcImJcIikge1xuICAgICAgZm9yIChyKys7IHIgPCBuOyByKyspXG4gICAgICAgIGlmIChpID0gZVtyXSwgaSAhPT0gXCJfXCIpIHtcbiAgICAgICAgICBpZiAoaSAhPT0gXCIwXCIgJiYgaSAhPT0gXCIxXCIpXG4gICAgICAgICAgICByZXR1cm4gITE7XG4gICAgICAgICAgbyA9ICEwO1xuICAgICAgICB9XG4gICAgICByZXR1cm4gbyAmJiBpICE9PSBcIl9cIjtcbiAgICB9XG4gICAgaWYgKGkgPT09IFwieFwiKSB7XG4gICAgICBmb3IgKHIrKzsgciA8IG47IHIrKylcbiAgICAgICAgaWYgKGkgPSBlW3JdLCBpICE9PSBcIl9cIikge1xuICAgICAgICAgIGlmICghT3IoZS5jaGFyQ29kZUF0KHIpKSlcbiAgICAgICAgICAgIHJldHVybiAhMTtcbiAgICAgICAgICBvID0gITA7XG4gICAgICAgIH1cbiAgICAgIHJldHVybiBvICYmIGkgIT09IFwiX1wiO1xuICAgIH1cbiAgICBpZiAoaSA9PT0gXCJvXCIpIHtcbiAgICAgIGZvciAocisrOyByIDwgbjsgcisrKVxuICAgICAgICBpZiAoaSA9IGVbcl0sIGkgIT09IFwiX1wiKSB7XG4gICAgICAgICAgaWYgKCFGcihlLmNoYXJDb2RlQXQocikpKVxuICAgICAgICAgICAgcmV0dXJuICExO1xuICAgICAgICAgIG8gPSAhMDtcbiAgICAgICAgfVxuICAgICAgcmV0dXJuIG8gJiYgaSAhPT0gXCJfXCI7XG4gICAgfVxuICB9XG4gIGlmIChpID09PSBcIl9cIilcbiAgICByZXR1cm4gITE7XG4gIGZvciAoOyByIDwgbjsgcisrKVxuICAgIGlmIChpID0gZVtyXSwgaSAhPT0gXCJfXCIpIHtcbiAgICAgIGlmICghVHIoZS5jaGFyQ29kZUF0KHIpKSlcbiAgICAgICAgcmV0dXJuICExO1xuICAgICAgbyA9ICEwO1xuICAgIH1cbiAgcmV0dXJuICEoIW8gfHwgaSA9PT0gXCJfXCIpO1xufVxuZnVuY3Rpb24gTHIoZSkge1xuICB2YXIgbiA9IGUsIHIgPSAxLCBvO1xuICBpZiAobi5pbmRleE9mKFwiX1wiKSAhPT0gLTEgJiYgKG4gPSBuLnJlcGxhY2UoL18vZywgXCJcIikpLCBvID0gblswXSwgKG8gPT09IFwiLVwiIHx8IG8gPT09IFwiK1wiKSAmJiAobyA9PT0gXCItXCIgJiYgKHIgPSAtMSksIG4gPSBuLnNsaWNlKDEpLCBvID0gblswXSksIG4gPT09IFwiMFwiKVxuICAgIHJldHVybiAwO1xuICBpZiAobyA9PT0gXCIwXCIpIHtcbiAgICBpZiAoblsxXSA9PT0gXCJiXCIpXG4gICAgICByZXR1cm4gciAqIHBhcnNlSW50KG4uc2xpY2UoMiksIDIpO1xuICAgIGlmIChuWzFdID09PSBcInhcIilcbiAgICAgIHJldHVybiByICogcGFyc2VJbnQobi5zbGljZSgyKSwgMTYpO1xuICAgIGlmIChuWzFdID09PSBcIm9cIilcbiAgICAgIHJldHVybiByICogcGFyc2VJbnQobi5zbGljZSgyKSwgOCk7XG4gIH1cbiAgcmV0dXJuIHIgKiBwYXJzZUludChuLCAxMCk7XG59XG5mdW5jdGlvbiBQcihlKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCIgJiYgZSAlIDEgPT09IDAgJiYgIUYuaXNOZWdhdGl2ZVplcm8oZSk7XG59XG52YXIgaG4gPSBuZXcgTihcInRhZzp5YW1sLm9yZywyMDAyOmludFwiLCB7XG4gIGtpbmQ6IFwic2NhbGFyXCIsXG4gIHJlc29sdmU6IE5yLFxuICBjb25zdHJ1Y3Q6IExyLFxuICBwcmVkaWNhdGU6IFByLFxuICByZXByZXNlbnQ6IHtcbiAgICBiaW5hcnk6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiBlID49IDAgPyBcIjBiXCIgKyBlLnRvU3RyaW5nKDIpIDogXCItMGJcIiArIGUudG9TdHJpbmcoMikuc2xpY2UoMSk7XG4gICAgfSxcbiAgICBvY3RhbDogZnVuY3Rpb24oZSkge1xuICAgICAgcmV0dXJuIGUgPj0gMCA/IFwiMG9cIiArIGUudG9TdHJpbmcoOCkgOiBcIi0wb1wiICsgZS50b1N0cmluZyg4KS5zbGljZSgxKTtcbiAgICB9LFxuICAgIGRlY2ltYWw6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHJldHVybiBlLnRvU3RyaW5nKDEwKTtcbiAgICB9LFxuICAgIC8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbiAgICBoZXhhZGVjaW1hbDogZnVuY3Rpb24oZSkge1xuICAgICAgcmV0dXJuIGUgPj0gMCA/IFwiMHhcIiArIGUudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkgOiBcIi0weFwiICsgZS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKS5zbGljZSgxKTtcbiAgICB9XG4gIH0sXG4gIGRlZmF1bHRTdHlsZTogXCJkZWNpbWFsXCIsXG4gIHN0eWxlQWxpYXNlczoge1xuICAgIGJpbmFyeTogWzIsIFwiYmluXCJdLFxuICAgIG9jdGFsOiBbOCwgXCJvY3RcIl0sXG4gICAgZGVjaW1hbDogWzEwLCBcImRlY1wiXSxcbiAgICBoZXhhZGVjaW1hbDogWzE2LCBcImhleFwiXVxuICB9XG59KSwgSXIgPSBuZXcgUmVnRXhwKFxuICAvLyAyLjVlNCwgMi41IGFuZCBpbnRlZ2Vyc1xuICBcIl4oPzpbLStdPyg/OlswLTldWzAtOV9dKikoPzpcXFxcLlswLTlfXSopPyg/OltlRV1bLStdP1swLTldKyk/fFxcXFwuWzAtOV9dKyg/OltlRV1bLStdP1swLTldKyk/fFstK10/XFxcXC4oPzppbmZ8SW5mfElORil8XFxcXC4oPzpuYW58TmFOfE5BTikpJFwiXG4pO1xuZnVuY3Rpb24ga3IoZSkge1xuICByZXR1cm4gIShlID09PSBudWxsIHx8ICFJci50ZXN0KGUpIHx8IC8vIFF1aWNrIGhhY2sgdG8gbm90IGFsbG93IGludGVnZXJzIGVuZCB3aXRoIGBfYFxuICAvLyBQcm9iYWJseSBzaG91bGQgdXBkYXRlIHJlZ2V4cCAmIGNoZWNrIHNwZWVkXG4gIGVbZS5sZW5ndGggLSAxXSA9PT0gXCJfXCIpO1xufVxuZnVuY3Rpb24gRHIoZSkge1xuICB2YXIgbiwgcjtcbiAgcmV0dXJuIG4gPSBlLnJlcGxhY2UoL18vZywgXCJcIikudG9Mb3dlckNhc2UoKSwgciA9IG5bMF0gPT09IFwiLVwiID8gLTEgOiAxLCBcIistXCIuaW5kZXhPZihuWzBdKSA+PSAwICYmIChuID0gbi5zbGljZSgxKSksIG4gPT09IFwiLmluZlwiID8gciA9PT0gMSA/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSA6IE51bWJlci5ORUdBVElWRV9JTkZJTklUWSA6IG4gPT09IFwiLm5hblwiID8gTmFOIDogciAqIHBhcnNlRmxvYXQobiwgMTApO1xufVxudmFyIGpyID0gL15bLStdP1swLTldK2UvO1xuZnVuY3Rpb24gTXIoZSwgbikge1xuICB2YXIgcjtcbiAgaWYgKGlzTmFOKGUpKVxuICAgIHN3aXRjaCAobikge1xuICAgICAgY2FzZSBcImxvd2VyY2FzZVwiOlxuICAgICAgICByZXR1cm4gXCIubmFuXCI7XG4gICAgICBjYXNlIFwidXBwZXJjYXNlXCI6XG4gICAgICAgIHJldHVybiBcIi5OQU5cIjtcbiAgICAgIGNhc2UgXCJjYW1lbGNhc2VcIjpcbiAgICAgICAgcmV0dXJuIFwiLk5hTlwiO1xuICAgIH1cbiAgZWxzZSBpZiAoTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZID09PSBlKVxuICAgIHN3aXRjaCAobikge1xuICAgICAgY2FzZSBcImxvd2VyY2FzZVwiOlxuICAgICAgICByZXR1cm4gXCIuaW5mXCI7XG4gICAgICBjYXNlIFwidXBwZXJjYXNlXCI6XG4gICAgICAgIHJldHVybiBcIi5JTkZcIjtcbiAgICAgIGNhc2UgXCJjYW1lbGNhc2VcIjpcbiAgICAgICAgcmV0dXJuIFwiLkluZlwiO1xuICAgIH1cbiAgZWxzZSBpZiAoTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZID09PSBlKVxuICAgIHN3aXRjaCAobikge1xuICAgICAgY2FzZSBcImxvd2VyY2FzZVwiOlxuICAgICAgICByZXR1cm4gXCItLmluZlwiO1xuICAgICAgY2FzZSBcInVwcGVyY2FzZVwiOlxuICAgICAgICByZXR1cm4gXCItLklORlwiO1xuICAgICAgY2FzZSBcImNhbWVsY2FzZVwiOlxuICAgICAgICByZXR1cm4gXCItLkluZlwiO1xuICAgIH1cbiAgZWxzZSBpZiAoRi5pc05lZ2F0aXZlWmVybyhlKSlcbiAgICByZXR1cm4gXCItMC4wXCI7XG4gIHJldHVybiByID0gZS50b1N0cmluZygxMCksIGpyLnRlc3QocikgPyByLnJlcGxhY2UoXCJlXCIsIFwiLmVcIikgOiByO1xufVxuZnVuY3Rpb24gQnIoZSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGUpID09PSBcIltvYmplY3QgTnVtYmVyXVwiICYmIChlICUgMSAhPT0gMCB8fCBGLmlzTmVnYXRpdmVaZXJvKGUpKTtcbn1cbnZhciBkbiA9IG5ldyBOKFwidGFnOnlhbWwub3JnLDIwMDI6ZmxvYXRcIiwge1xuICBraW5kOiBcInNjYWxhclwiLFxuICByZXNvbHZlOiBrcixcbiAgY29uc3RydWN0OiBEcixcbiAgcHJlZGljYXRlOiBCcixcbiAgcmVwcmVzZW50OiBNcixcbiAgZGVmYXVsdFN0eWxlOiBcImxvd2VyY2FzZVwiXG59KSwgbW4gPSBjbi5leHRlbmQoe1xuICBpbXBsaWNpdDogW1xuICAgIHNuLFxuICAgIHBuLFxuICAgIGhuLFxuICAgIGRuXG4gIF1cbn0pLCBnbiA9IG1uLCB4biA9IG5ldyBSZWdFeHAoXG4gIFwiXihbMC05XVswLTldWzAtOV1bMC05XSktKFswLTldWzAtOV0pLShbMC05XVswLTldKSRcIlxuKSwgdm4gPSBuZXcgUmVnRXhwKFxuICBcIl4oWzAtOV1bMC05XVswLTldWzAtOV0pLShbMC05XVswLTldPyktKFswLTldWzAtOV0/KSg/OltUdF18WyBcXFxcdF0rKShbMC05XVswLTldPyk6KFswLTldWzAtOV0pOihbMC05XVswLTldKSg/OlxcXFwuKFswLTldKikpPyg/OlsgXFxcXHRdKihafChbLStdKShbMC05XVswLTldPykoPzo6KFswLTldWzAtOV0pKT8pKT8kXCJcbik7XG5mdW5jdGlvbiBIcihlKSB7XG4gIHJldHVybiBlID09PSBudWxsID8gITEgOiB4bi5leGVjKGUpICE9PSBudWxsIHx8IHZuLmV4ZWMoZSkgIT09IG51bGw7XG59XG5mdW5jdGlvbiBZcihlKSB7XG4gIHZhciBuLCByLCBvLCBpLCBsLCB0LCB1LCBhID0gMCwgYyA9IG51bGwsIGgsIHAsIG07XG4gIGlmIChuID0geG4uZXhlYyhlKSwgbiA9PT0gbnVsbCAmJiAobiA9IHZuLmV4ZWMoZSkpLCBuID09PSBudWxsKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGUgcmVzb2x2ZSBlcnJvclwiKTtcbiAgaWYgKHIgPSArblsxXSwgbyA9ICtuWzJdIC0gMSwgaSA9ICtuWzNdLCAhbls0XSlcbiAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMociwgbywgaSkpO1xuICBpZiAobCA9ICtuWzRdLCB0ID0gK25bNV0sIHUgPSArbls2XSwgbls3XSkge1xuICAgIGZvciAoYSA9IG5bN10uc2xpY2UoMCwgMyk7IGEubGVuZ3RoIDwgMzsgKVxuICAgICAgYSArPSBcIjBcIjtcbiAgICBhID0gK2E7XG4gIH1cbiAgcmV0dXJuIG5bOV0gJiYgKGggPSArblsxMF0sIHAgPSArKG5bMTFdIHx8IDApLCBjID0gKGggKiA2MCArIHApICogNmU0LCBuWzldID09PSBcIi1cIiAmJiAoYyA9IC1jKSksIG0gPSBuZXcgRGF0ZShEYXRlLlVUQyhyLCBvLCBpLCBsLCB0LCB1LCBhKSksIGMgJiYgbS5zZXRUaW1lKG0uZ2V0VGltZSgpIC0gYyksIG07XG59XG5mdW5jdGlvbiBVcihlKSB7XG4gIHJldHVybiBlLnRvSVNPU3RyaW5nKCk7XG59XG52YXIgeW4gPSBuZXcgTihcInRhZzp5YW1sLm9yZywyMDAyOnRpbWVzdGFtcFwiLCB7XG4gIGtpbmQ6IFwic2NhbGFyXCIsXG4gIHJlc29sdmU6IEhyLFxuICBjb25zdHJ1Y3Q6IFlyLFxuICBpbnN0YW5jZU9mOiBEYXRlLFxuICByZXByZXNlbnQ6IFVyXG59KTtcbmZ1bmN0aW9uICRyKGUpIHtcbiAgcmV0dXJuIGUgPT09IFwiPDxcIiB8fCBlID09PSBudWxsO1xufVxudmFyIEFuID0gbmV3IE4oXCJ0YWc6eWFtbC5vcmcsMjAwMjptZXJnZVwiLCB7XG4gIGtpbmQ6IFwic2NhbGFyXCIsXG4gIHJlc29sdmU6ICRyXG59KSwgTGUgPSBgQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz1cblxccmA7XG5mdW5jdGlvbiBxcihlKSB7XG4gIGlmIChlID09PSBudWxsKVxuICAgIHJldHVybiAhMTtcbiAgdmFyIG4sIHIsIG8gPSAwLCBpID0gZS5sZW5ndGgsIGwgPSBMZTtcbiAgZm9yIChyID0gMDsgciA8IGk7IHIrKylcbiAgICBpZiAobiA9IGwuaW5kZXhPZihlLmNoYXJBdChyKSksICEobiA+IDY0KSkge1xuICAgICAgaWYgKG4gPCAwKVxuICAgICAgICByZXR1cm4gITE7XG4gICAgICBvICs9IDY7XG4gICAgfVxuICByZXR1cm4gbyAlIDggPT09IDA7XG59XG5mdW5jdGlvbiB6cihlKSB7XG4gIHZhciBuLCByLCBvID0gZS5yZXBsYWNlKC9bXFxyXFxuPV0vZywgXCJcIiksIGkgPSBvLmxlbmd0aCwgbCA9IExlLCB0ID0gMCwgdSA9IFtdO1xuICBmb3IgKG4gPSAwOyBuIDwgaTsgbisrKVxuICAgIG4gJSA0ID09PSAwICYmIG4gJiYgKHUucHVzaCh0ID4+IDE2ICYgMjU1KSwgdS5wdXNoKHQgPj4gOCAmIDI1NSksIHUucHVzaCh0ICYgMjU1KSksIHQgPSB0IDw8IDYgfCBsLmluZGV4T2Yoby5jaGFyQXQobikpO1xuICByZXR1cm4gciA9IGkgJSA0ICogNiwgciA9PT0gMCA/ICh1LnB1c2godCA+PiAxNiAmIDI1NSksIHUucHVzaCh0ID4+IDggJiAyNTUpLCB1LnB1c2godCAmIDI1NSkpIDogciA9PT0gMTggPyAodS5wdXNoKHQgPj4gMTAgJiAyNTUpLCB1LnB1c2godCA+PiAyICYgMjU1KSkgOiByID09PSAxMiAmJiB1LnB1c2godCA+PiA0ICYgMjU1KSwgbmV3IFVpbnQ4QXJyYXkodSk7XG59XG5mdW5jdGlvbiBHcihlKSB7XG4gIHZhciBuID0gXCJcIiwgciA9IDAsIG8sIGksIGwgPSBlLmxlbmd0aCwgdCA9IExlO1xuICBmb3IgKG8gPSAwOyBvIDwgbDsgbysrKVxuICAgIG8gJSAzID09PSAwICYmIG8gJiYgKG4gKz0gdFtyID4+IDE4ICYgNjNdLCBuICs9IHRbciA+PiAxMiAmIDYzXSwgbiArPSB0W3IgPj4gNiAmIDYzXSwgbiArPSB0W3IgJiA2M10pLCByID0gKHIgPDwgOCkgKyBlW29dO1xuICByZXR1cm4gaSA9IGwgJSAzLCBpID09PSAwID8gKG4gKz0gdFtyID4+IDE4ICYgNjNdLCBuICs9IHRbciA+PiAxMiAmIDYzXSwgbiArPSB0W3IgPj4gNiAmIDYzXSwgbiArPSB0W3IgJiA2M10pIDogaSA9PT0gMiA/IChuICs9IHRbciA+PiAxMCAmIDYzXSwgbiArPSB0W3IgPj4gNCAmIDYzXSwgbiArPSB0W3IgPDwgMiAmIDYzXSwgbiArPSB0WzY0XSkgOiBpID09PSAxICYmIChuICs9IHRbciA+PiAyICYgNjNdLCBuICs9IHRbciA8PCA0ICYgNjNdLCBuICs9IHRbNjRdLCBuICs9IHRbNjRdKSwgbjtcbn1cbmZ1bmN0aW9uIEtyKGUpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKSA9PT0gXCJbb2JqZWN0IFVpbnQ4QXJyYXldXCI7XG59XG52YXIgYm4gPSBuZXcgTihcInRhZzp5YW1sLm9yZywyMDAyOmJpbmFyeVwiLCB7XG4gIGtpbmQ6IFwic2NhbGFyXCIsXG4gIHJlc29sdmU6IHFyLFxuICBjb25zdHJ1Y3Q6IHpyLFxuICBwcmVkaWNhdGU6IEtyLFxuICByZXByZXNlbnQ6IEdyXG59KSwgV3IgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LCBRciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5mdW5jdGlvbiBWcihlKSB7XG4gIGlmIChlID09PSBudWxsKVxuICAgIHJldHVybiAhMDtcbiAgdmFyIG4gPSBbXSwgciwgbywgaSwgbCwgdCwgdSA9IGU7XG4gIGZvciAociA9IDAsIG8gPSB1Lmxlbmd0aDsgciA8IG87IHIgKz0gMSkge1xuICAgIGlmIChpID0gdVtyXSwgdCA9ICExLCBRci5jYWxsKGkpICE9PSBcIltvYmplY3QgT2JqZWN0XVwiKVxuICAgICAgcmV0dXJuICExO1xuICAgIGZvciAobCBpbiBpKVxuICAgICAgaWYgKFdyLmNhbGwoaSwgbCkpXG4gICAgICAgIGlmICghdClcbiAgICAgICAgICB0ID0gITA7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gITE7XG4gICAgaWYgKCF0KVxuICAgICAgcmV0dXJuICExO1xuICAgIGlmIChuLmluZGV4T2YobCkgPT09IC0xKVxuICAgICAgbi5wdXNoKGwpO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiAhMTtcbiAgfVxuICByZXR1cm4gITA7XG59XG5mdW5jdGlvbiBKcihlKSB7XG4gIHJldHVybiBlICE9PSBudWxsID8gZSA6IFtdO1xufVxudmFyIHduID0gbmV3IE4oXCJ0YWc6eWFtbC5vcmcsMjAwMjpvbWFwXCIsIHtcbiAga2luZDogXCJzZXF1ZW5jZVwiLFxuICByZXNvbHZlOiBWcixcbiAgY29uc3RydWN0OiBKclxufSksIFpyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmZ1bmN0aW9uIFhyKGUpIHtcbiAgaWYgKGUgPT09IG51bGwpXG4gICAgcmV0dXJuICEwO1xuICB2YXIgbiwgciwgbywgaSwgbCwgdCA9IGU7XG4gIGZvciAobCA9IG5ldyBBcnJheSh0Lmxlbmd0aCksIG4gPSAwLCByID0gdC5sZW5ndGg7IG4gPCByOyBuICs9IDEpIHtcbiAgICBpZiAobyA9IHRbbl0sIFpyLmNhbGwobykgIT09IFwiW29iamVjdCBPYmplY3RdXCIgfHwgKGkgPSBPYmplY3Qua2V5cyhvKSwgaS5sZW5ndGggIT09IDEpKVxuICAgICAgcmV0dXJuICExO1xuICAgIGxbbl0gPSBbaVswXSwgb1tpWzBdXV07XG4gIH1cbiAgcmV0dXJuICEwO1xufVxuZnVuY3Rpb24gZWkoZSkge1xuICBpZiAoZSA9PT0gbnVsbClcbiAgICByZXR1cm4gW107XG4gIHZhciBuLCByLCBvLCBpLCBsLCB0ID0gZTtcbiAgZm9yIChsID0gbmV3IEFycmF5KHQubGVuZ3RoKSwgbiA9IDAsIHIgPSB0Lmxlbmd0aDsgbiA8IHI7IG4gKz0gMSlcbiAgICBvID0gdFtuXSwgaSA9IE9iamVjdC5rZXlzKG8pLCBsW25dID0gW2lbMF0sIG9baVswXV1dO1xuICByZXR1cm4gbDtcbn1cbnZhciBTbiA9IG5ldyBOKFwidGFnOnlhbWwub3JnLDIwMDI6cGFpcnNcIiwge1xuICBraW5kOiBcInNlcXVlbmNlXCIsXG4gIHJlc29sdmU6IFhyLFxuICBjb25zdHJ1Y3Q6IGVpXG59KSwgbmkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuZnVuY3Rpb24gcmkoZSkge1xuICBpZiAoZSA9PT0gbnVsbClcbiAgICByZXR1cm4gITA7XG4gIHZhciBuLCByID0gZTtcbiAgZm9yIChuIGluIHIpXG4gICAgaWYgKG5pLmNhbGwociwgbikgJiYgcltuXSAhPT0gbnVsbClcbiAgICAgIHJldHVybiAhMTtcbiAgcmV0dXJuICEwO1xufVxuZnVuY3Rpb24gaWkoZSkge1xuICByZXR1cm4gZSAhPT0gbnVsbCA/IGUgOiB7fTtcbn1cbnZhciBDbiA9IG5ldyBOKFwidGFnOnlhbWwub3JnLDIwMDI6c2V0XCIsIHtcbiAga2luZDogXCJtYXBwaW5nXCIsXG4gIHJlc29sdmU6IHJpLFxuICBjb25zdHJ1Y3Q6IGlpXG59KSwgUGUgPSBnbi5leHRlbmQoe1xuICBpbXBsaWNpdDogW1xuICAgIHluLFxuICAgIEFuXG4gIF0sXG4gIGV4cGxpY2l0OiBbXG4gICAgYm4sXG4gICAgd24sXG4gICAgU24sXG4gICAgQ25cbiAgXVxufSksICQgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LCBjZSA9IDEsIF9uID0gMiwgRW4gPSAzLCBzZSA9IDQsIF9lID0gMSwgb2kgPSAyLCBVZSA9IDMsIHRpID0gL1tcXHgwMC1cXHgwOFxceDBCXFx4MENcXHgwRS1cXHgxRlxceDdGLVxceDg0XFx4ODYtXFx4OUZcXHVGRkZFXFx1RkZGRl18W1xcdUQ4MDAtXFx1REJGRl0oPyFbXFx1REMwMC1cXHVERkZGXSl8KD86W15cXHVEODAwLVxcdURCRkZdfF4pW1xcdURDMDAtXFx1REZGRl0vLCBsaSA9IC9bXFx4ODVcXHUyMDI4XFx1MjAyOV0vLCB1aSA9IC9bLFxcW1xcXVxce1xcfV0vLCBSbiA9IC9eKD86IXwhIXwhW2EtelxcLV0rISkkL2ksIE9uID0gL14oPzohfFteLFxcW1xcXVxce1xcfV0pKD86JVswLTlhLWZdezJ9fFswLTlhLXpcXC0jO1xcL1xcPzpAJj1cXCtcXCQsX1xcLiF+XFwqJ1xcKFxcKVxcW1xcXV0pKiQvaTtcbmZ1bmN0aW9uICRlKGUpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKTtcbn1cbmZ1bmN0aW9uIE0oZSkge1xuICByZXR1cm4gZSA9PT0gMTAgfHwgZSA9PT0gMTM7XG59XG5mdW5jdGlvbiBxKGUpIHtcbiAgcmV0dXJuIGUgPT09IDkgfHwgZSA9PT0gMzI7XG59XG5mdW5jdGlvbiBrKGUpIHtcbiAgcmV0dXJuIGUgPT09IDkgfHwgZSA9PT0gMzIgfHwgZSA9PT0gMTAgfHwgZSA9PT0gMTM7XG59XG5mdW5jdGlvbiBXKGUpIHtcbiAgcmV0dXJuIGUgPT09IDQ0IHx8IGUgPT09IDkxIHx8IGUgPT09IDkzIHx8IGUgPT09IDEyMyB8fCBlID09PSAxMjU7XG59XG5mdW5jdGlvbiBhaShlKSB7XG4gIHZhciBuO1xuICByZXR1cm4gNDggPD0gZSAmJiBlIDw9IDU3ID8gZSAtIDQ4IDogKG4gPSBlIHwgMzIsIDk3IDw9IG4gJiYgbiA8PSAxMDIgPyBuIC0gOTcgKyAxMCA6IC0xKTtcbn1cbmZ1bmN0aW9uIGZpKGUpIHtcbiAgcmV0dXJuIGUgPT09IDEyMCA/IDIgOiBlID09PSAxMTcgPyA0IDogZSA9PT0gODUgPyA4IDogMDtcbn1cbmZ1bmN0aW9uIGNpKGUpIHtcbiAgcmV0dXJuIDQ4IDw9IGUgJiYgZSA8PSA1NyA/IGUgLSA0OCA6IC0xO1xufVxuZnVuY3Rpb24gcWUoZSkge1xuICByZXR1cm4gZSA9PT0gNDggPyBcIlxcMFwiIDogZSA9PT0gOTcgPyBcIlxceDA3XCIgOiBlID09PSA5OCA/IFwiXFxiXCIgOiBlID09PSAxMTYgfHwgZSA9PT0gOSA/IFwiXHRcIiA6IGUgPT09IDExMCA/IGBcbmAgOiBlID09PSAxMTggPyBcIlxcdlwiIDogZSA9PT0gMTAyID8gXCJcXGZcIiA6IGUgPT09IDExNCA/IFwiXFxyXCIgOiBlID09PSAxMDEgPyBcIlxceDFCXCIgOiBlID09PSAzMiA/IFwiIFwiIDogZSA9PT0gMzQgPyAnXCInIDogZSA9PT0gNDcgPyBcIi9cIiA6IGUgPT09IDkyID8gXCJcXFxcXCIgOiBlID09PSA3OCA/IFwiXHUwMDg1XCIgOiBlID09PSA5NSA/IFwiXHUwMEEwXCIgOiBlID09PSA3NiA/IFwiXFx1MjAyOFwiIDogZSA9PT0gODAgPyBcIlxcdTIwMjlcIiA6IFwiXCI7XG59XG5mdW5jdGlvbiBzaShlKSB7XG4gIHJldHVybiBlIDw9IDY1NTM1ID8gU3RyaW5nLmZyb21DaGFyQ29kZShlKSA6IFN0cmluZy5mcm9tQ2hhckNvZGUoXG4gICAgKGUgLSA2NTUzNiA+PiAxMCkgKyA1NTI5NixcbiAgICAoZSAtIDY1NTM2ICYgMTAyMykgKyA1NjMyMFxuICApO1xufVxudmFyIEZuID0gbmV3IEFycmF5KDI1NiksIFRuID0gbmV3IEFycmF5KDI1Nik7XG5mb3IgKHZhciBHID0gMDsgRyA8IDI1NjsgRysrKVxuICBGbltHXSA9IHFlKEcpID8gMSA6IDAsIFRuW0ddID0gcWUoRyk7XG5mdW5jdGlvbiBwaShlLCBuKSB7XG4gIHRoaXMuaW5wdXQgPSBlLCB0aGlzLmZpbGVuYW1lID0gbi5maWxlbmFtZSB8fCBudWxsLCB0aGlzLnNjaGVtYSA9IG4uc2NoZW1hIHx8IFBlLCB0aGlzLm9uV2FybmluZyA9IG4ub25XYXJuaW5nIHx8IG51bGwsIHRoaXMubGVnYWN5ID0gbi5sZWdhY3kgfHwgITEsIHRoaXMuanNvbiA9IG4uanNvbiB8fCAhMSwgdGhpcy5saXN0ZW5lciA9IG4ubGlzdGVuZXIgfHwgbnVsbCwgdGhpcy5pbXBsaWNpdFR5cGVzID0gdGhpcy5zY2hlbWEuY29tcGlsZWRJbXBsaWNpdCwgdGhpcy50eXBlTWFwID0gdGhpcy5zY2hlbWEuY29tcGlsZWRUeXBlTWFwLCB0aGlzLmxlbmd0aCA9IGUubGVuZ3RoLCB0aGlzLnBvc2l0aW9uID0gMCwgdGhpcy5saW5lID0gMCwgdGhpcy5saW5lU3RhcnQgPSAwLCB0aGlzLmxpbmVJbmRlbnQgPSAwLCB0aGlzLmZpcnN0VGFiSW5MaW5lID0gLTEsIHRoaXMuZG9jdW1lbnRzID0gW107XG59XG5mdW5jdGlvbiBObihlLCBuKSB7XG4gIHZhciByID0ge1xuICAgIG5hbWU6IGUuZmlsZW5hbWUsXG4gICAgYnVmZmVyOiBlLmlucHV0LnNsaWNlKDAsIC0xKSxcbiAgICAvLyBvbWl0IHRyYWlsaW5nIFxcMFxuICAgIHBvc2l0aW9uOiBlLnBvc2l0aW9uLFxuICAgIGxpbmU6IGUubGluZSxcbiAgICBjb2x1bW46IGUucG9zaXRpb24gLSBlLmxpbmVTdGFydFxuICB9O1xuICByZXR1cm4gci5zbmlwcGV0ID0gZ3IociksIG5ldyBJKG4sIHIpO1xufVxuZnVuY3Rpb24gZyhlLCBuKSB7XG4gIHRocm93IE5uKGUsIG4pO1xufVxuZnVuY3Rpb24gcGUoZSwgbikge1xuICBlLm9uV2FybmluZyAmJiBlLm9uV2FybmluZy5jYWxsKG51bGwsIE5uKGUsIG4pKTtcbn1cbnZhciB6ZSA9IHtcbiAgWUFNTDogZnVuY3Rpb24obiwgciwgbykge1xuICAgIHZhciBpLCBsLCB0O1xuICAgIG4udmVyc2lvbiAhPT0gbnVsbCAmJiBnKG4sIFwiZHVwbGljYXRpb24gb2YgJVlBTUwgZGlyZWN0aXZlXCIpLCBvLmxlbmd0aCAhPT0gMSAmJiBnKG4sIFwiWUFNTCBkaXJlY3RpdmUgYWNjZXB0cyBleGFjdGx5IG9uZSBhcmd1bWVudFwiKSwgaSA9IC9eKFswLTldKylcXC4oWzAtOV0rKSQvLmV4ZWMob1swXSksIGkgPT09IG51bGwgJiYgZyhuLCBcImlsbC1mb3JtZWQgYXJndW1lbnQgb2YgdGhlIFlBTUwgZGlyZWN0aXZlXCIpLCBsID0gcGFyc2VJbnQoaVsxXSwgMTApLCB0ID0gcGFyc2VJbnQoaVsyXSwgMTApLCBsICE9PSAxICYmIGcobiwgXCJ1bmFjY2VwdGFibGUgWUFNTCB2ZXJzaW9uIG9mIHRoZSBkb2N1bWVudFwiKSwgbi52ZXJzaW9uID0gb1swXSwgbi5jaGVja0xpbmVCcmVha3MgPSB0IDwgMiwgdCAhPT0gMSAmJiB0ICE9PSAyICYmIHBlKG4sIFwidW5zdXBwb3J0ZWQgWUFNTCB2ZXJzaW9uIG9mIHRoZSBkb2N1bWVudFwiKTtcbiAgfSxcbiAgVEFHOiBmdW5jdGlvbihuLCByLCBvKSB7XG4gICAgdmFyIGksIGw7XG4gICAgby5sZW5ndGggIT09IDIgJiYgZyhuLCBcIlRBRyBkaXJlY3RpdmUgYWNjZXB0cyBleGFjdGx5IHR3byBhcmd1bWVudHNcIiksIGkgPSBvWzBdLCBsID0gb1sxXSwgUm4udGVzdChpKSB8fCBnKG4sIFwiaWxsLWZvcm1lZCB0YWcgaGFuZGxlIChmaXJzdCBhcmd1bWVudCkgb2YgdGhlIFRBRyBkaXJlY3RpdmVcIiksICQuY2FsbChuLnRhZ01hcCwgaSkgJiYgZyhuLCAndGhlcmUgaXMgYSBwcmV2aW91c2x5IGRlY2xhcmVkIHN1ZmZpeCBmb3IgXCInICsgaSArICdcIiB0YWcgaGFuZGxlJyksIE9uLnRlc3QobCkgfHwgZyhuLCBcImlsbC1mb3JtZWQgdGFnIHByZWZpeCAoc2Vjb25kIGFyZ3VtZW50KSBvZiB0aGUgVEFHIGRpcmVjdGl2ZVwiKTtcbiAgICB0cnkge1xuICAgICAgbCA9IGRlY29kZVVSSUNvbXBvbmVudChsKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIGcobiwgXCJ0YWcgcHJlZml4IGlzIG1hbGZvcm1lZDogXCIgKyBsKTtcbiAgICB9XG4gICAgbi50YWdNYXBbaV0gPSBsO1xuICB9XG59O1xuZnVuY3Rpb24gVShlLCBuLCByLCBvKSB7XG4gIHZhciBpLCBsLCB0LCB1O1xuICBpZiAobiA8IHIpIHtcbiAgICBpZiAodSA9IGUuaW5wdXQuc2xpY2UobiwgciksIG8pXG4gICAgICBmb3IgKGkgPSAwLCBsID0gdS5sZW5ndGg7IGkgPCBsOyBpICs9IDEpXG4gICAgICAgIHQgPSB1LmNoYXJDb2RlQXQoaSksIHQgPT09IDkgfHwgMzIgPD0gdCAmJiB0IDw9IDExMTQxMTEgfHwgZyhlLCBcImV4cGVjdGVkIHZhbGlkIEpTT04gY2hhcmFjdGVyXCIpO1xuICAgIGVsc2VcbiAgICAgIHRpLnRlc3QodSkgJiYgZyhlLCBcInRoZSBzdHJlYW0gY29udGFpbnMgbm9uLXByaW50YWJsZSBjaGFyYWN0ZXJzXCIpO1xuICAgIGUucmVzdWx0ICs9IHU7XG4gIH1cbn1cbmZ1bmN0aW9uIEdlKGUsIG4sIHIsIG8pIHtcbiAgdmFyIGksIGwsIHQsIHU7XG4gIGZvciAoRi5pc09iamVjdChyKSB8fCBnKGUsIFwiY2Fubm90IG1lcmdlIG1hcHBpbmdzOyB0aGUgcHJvdmlkZWQgc291cmNlIG9iamVjdCBpcyB1bmFjY2VwdGFibGVcIiksIGkgPSBPYmplY3Qua2V5cyhyKSwgdCA9IDAsIHUgPSBpLmxlbmd0aDsgdCA8IHU7IHQgKz0gMSlcbiAgICBsID0gaVt0XSwgJC5jYWxsKG4sIGwpIHx8IChuW2xdID0gcltsXSwgb1tsXSA9ICEwKTtcbn1cbmZ1bmN0aW9uIFEoZSwgbiwgciwgbywgaSwgbCwgdCwgdSwgYSkge1xuICB2YXIgYywgaDtcbiAgaWYgKEFycmF5LmlzQXJyYXkoaSkpXG4gICAgZm9yIChpID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoaSksIGMgPSAwLCBoID0gaS5sZW5ndGg7IGMgPCBoOyBjICs9IDEpXG4gICAgICBBcnJheS5pc0FycmF5KGlbY10pICYmIGcoZSwgXCJuZXN0ZWQgYXJyYXlzIGFyZSBub3Qgc3VwcG9ydGVkIGluc2lkZSBrZXlzXCIpLCB0eXBlb2YgaSA9PSBcIm9iamVjdFwiICYmICRlKGlbY10pID09PSBcIltvYmplY3QgT2JqZWN0XVwiICYmIChpW2NdID0gXCJbb2JqZWN0IE9iamVjdF1cIik7XG4gIGlmICh0eXBlb2YgaSA9PSBcIm9iamVjdFwiICYmICRlKGkpID09PSBcIltvYmplY3QgT2JqZWN0XVwiICYmIChpID0gXCJbb2JqZWN0IE9iamVjdF1cIiksIGkgPSBTdHJpbmcoaSksIG4gPT09IG51bGwgJiYgKG4gPSB7fSksIG8gPT09IFwidGFnOnlhbWwub3JnLDIwMDI6bWVyZ2VcIilcbiAgICBpZiAoQXJyYXkuaXNBcnJheShsKSlcbiAgICAgIGZvciAoYyA9IDAsIGggPSBsLmxlbmd0aDsgYyA8IGg7IGMgKz0gMSlcbiAgICAgICAgR2UoZSwgbiwgbFtjXSwgcik7XG4gICAgZWxzZVxuICAgICAgR2UoZSwgbiwgbCwgcik7XG4gIGVsc2VcbiAgICAhZS5qc29uICYmICEkLmNhbGwociwgaSkgJiYgJC5jYWxsKG4sIGkpICYmIChlLmxpbmUgPSB0IHx8IGUubGluZSwgZS5saW5lU3RhcnQgPSB1IHx8IGUubGluZVN0YXJ0LCBlLnBvc2l0aW9uID0gYSB8fCBlLnBvc2l0aW9uLCBnKGUsIFwiZHVwbGljYXRlZCBtYXBwaW5nIGtleVwiKSksIGkgPT09IFwiX19wcm90b19fXCIgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkobiwgaSwge1xuICAgICAgY29uZmlndXJhYmxlOiAhMCxcbiAgICAgIGVudW1lcmFibGU6ICEwLFxuICAgICAgd3JpdGFibGU6ICEwLFxuICAgICAgdmFsdWU6IGxcbiAgICB9KSA6IG5baV0gPSBsLCBkZWxldGUgcltpXTtcbiAgcmV0dXJuIG47XG59XG5mdW5jdGlvbiBJZShlKSB7XG4gIHZhciBuO1xuICBuID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24pLCBuID09PSAxMCA/IGUucG9zaXRpb24rKyA6IG4gPT09IDEzID8gKGUucG9zaXRpb24rKywgZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24pID09PSAxMCAmJiBlLnBvc2l0aW9uKyspIDogZyhlLCBcImEgbGluZSBicmVhayBpcyBleHBlY3RlZFwiKSwgZS5saW5lICs9IDEsIGUubGluZVN0YXJ0ID0gZS5wb3NpdGlvbiwgZS5maXJzdFRhYkluTGluZSA9IC0xO1xufVxuZnVuY3Rpb24gUihlLCBuLCByKSB7XG4gIGZvciAodmFyIG8gPSAwLCBpID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24pOyBpICE9PSAwOyApIHtcbiAgICBmb3IgKDsgcShpKTsgKVxuICAgICAgaSA9PT0gOSAmJiBlLmZpcnN0VGFiSW5MaW5lID09PSAtMSAmJiAoZS5maXJzdFRhYkluTGluZSA9IGUucG9zaXRpb24pLCBpID0gZS5pbnB1dC5jaGFyQ29kZUF0KCsrZS5wb3NpdGlvbik7XG4gICAgaWYgKG4gJiYgaSA9PT0gMzUpXG4gICAgICBkb1xuICAgICAgICBpID0gZS5pbnB1dC5jaGFyQ29kZUF0KCsrZS5wb3NpdGlvbik7XG4gICAgICB3aGlsZSAoaSAhPT0gMTAgJiYgaSAhPT0gMTMgJiYgaSAhPT0gMCk7XG4gICAgaWYgKE0oaSkpXG4gICAgICBmb3IgKEllKGUpLCBpID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24pLCBvKyssIGUubGluZUluZGVudCA9IDA7IGkgPT09IDMyOyApXG4gICAgICAgIGUubGluZUluZGVudCsrLCBpID0gZS5pbnB1dC5jaGFyQ29kZUF0KCsrZS5wb3NpdGlvbik7XG4gICAgZWxzZVxuICAgICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIHIgIT09IC0xICYmIG8gIT09IDAgJiYgZS5saW5lSW5kZW50IDwgciAmJiBwZShlLCBcImRlZmljaWVudCBpbmRlbnRhdGlvblwiKSwgbztcbn1cbmZ1bmN0aW9uIG1lKGUpIHtcbiAgdmFyIG4gPSBlLnBvc2l0aW9uLCByO1xuICByZXR1cm4gciA9IGUuaW5wdXQuY2hhckNvZGVBdChuKSwgISEoKHIgPT09IDQ1IHx8IHIgPT09IDQ2KSAmJiByID09PSBlLmlucHV0LmNoYXJDb2RlQXQobiArIDEpICYmIHIgPT09IGUuaW5wdXQuY2hhckNvZGVBdChuICsgMikgJiYgKG4gKz0gMywgciA9IGUuaW5wdXQuY2hhckNvZGVBdChuKSwgciA9PT0gMCB8fCBrKHIpKSk7XG59XG5mdW5jdGlvbiBrZShlLCBuKSB7XG4gIG4gPT09IDEgPyBlLnJlc3VsdCArPSBcIiBcIiA6IG4gPiAxICYmIChlLnJlc3VsdCArPSBGLnJlcGVhdChgXG5gLCBuIC0gMSkpO1xufVxuZnVuY3Rpb24gaGkoZSwgbiwgcikge1xuICB2YXIgbywgaSwgbCwgdCwgdSwgYSwgYywgaCwgcCA9IGUua2luZCwgbSA9IGUucmVzdWx0LCB4O1xuICBpZiAoeCA9IGUuaW5wdXQuY2hhckNvZGVBdChlLnBvc2l0aW9uKSwgayh4KSB8fCBXKHgpIHx8IHggPT09IDM1IHx8IHggPT09IDM4IHx8IHggPT09IDQyIHx8IHggPT09IDMzIHx8IHggPT09IDEyNCB8fCB4ID09PSA2MiB8fCB4ID09PSAzOSB8fCB4ID09PSAzNCB8fCB4ID09PSAzNyB8fCB4ID09PSA2NCB8fCB4ID09PSA5NiB8fCAoeCA9PT0gNjMgfHwgeCA9PT0gNDUpICYmIChpID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24gKyAxKSwgayhpKSB8fCByICYmIFcoaSkpKVxuICAgIHJldHVybiAhMTtcbiAgZm9yIChlLmtpbmQgPSBcInNjYWxhclwiLCBlLnJlc3VsdCA9IFwiXCIsIGwgPSB0ID0gZS5wb3NpdGlvbiwgdSA9ICExOyB4ICE9PSAwOyApIHtcbiAgICBpZiAoeCA9PT0gNTgpIHtcbiAgICAgIGlmIChpID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24gKyAxKSwgayhpKSB8fCByICYmIFcoaSkpXG4gICAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSBpZiAoeCA9PT0gMzUpIHtcbiAgICAgIGlmIChvID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24gLSAxKSwgayhvKSlcbiAgICAgICAgYnJlYWs7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChlLnBvc2l0aW9uID09PSBlLmxpbmVTdGFydCAmJiBtZShlKSB8fCByICYmIFcoeCkpXG4gICAgICAgIGJyZWFrO1xuICAgICAgaWYgKE0oeCkpXG4gICAgICAgIGlmIChhID0gZS5saW5lLCBjID0gZS5saW5lU3RhcnQsIGggPSBlLmxpbmVJbmRlbnQsIFIoZSwgITEsIC0xKSwgZS5saW5lSW5kZW50ID49IG4pIHtcbiAgICAgICAgICB1ID0gITAsIHggPSBlLmlucHV0LmNoYXJDb2RlQXQoZS5wb3NpdGlvbik7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZS5wb3NpdGlvbiA9IHQsIGUubGluZSA9IGEsIGUubGluZVN0YXJ0ID0gYywgZS5saW5lSW5kZW50ID0gaDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICB1ICYmIChVKGUsIGwsIHQsICExKSwga2UoZSwgZS5saW5lIC0gYSksIGwgPSB0ID0gZS5wb3NpdGlvbiwgdSA9ICExKSwgcSh4KSB8fCAodCA9IGUucG9zaXRpb24gKyAxKSwgeCA9IGUuaW5wdXQuY2hhckNvZGVBdCgrK2UucG9zaXRpb24pO1xuICB9XG4gIHJldHVybiBVKGUsIGwsIHQsICExKSwgZS5yZXN1bHQgPyAhMCA6IChlLmtpbmQgPSBwLCBlLnJlc3VsdCA9IG0sICExKTtcbn1cbmZ1bmN0aW9uIGRpKGUsIG4pIHtcbiAgdmFyIHIsIG8sIGk7XG4gIGlmIChyID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24pLCByICE9PSAzOSlcbiAgICByZXR1cm4gITE7XG4gIGZvciAoZS5raW5kID0gXCJzY2FsYXJcIiwgZS5yZXN1bHQgPSBcIlwiLCBlLnBvc2l0aW9uKyssIG8gPSBpID0gZS5wb3NpdGlvbjsgKHIgPSBlLmlucHV0LmNoYXJDb2RlQXQoZS5wb3NpdGlvbikpICE9PSAwOyApXG4gICAgaWYgKHIgPT09IDM5KVxuICAgICAgaWYgKFUoZSwgbywgZS5wb3NpdGlvbiwgITApLCByID0gZS5pbnB1dC5jaGFyQ29kZUF0KCsrZS5wb3NpdGlvbiksIHIgPT09IDM5KVxuICAgICAgICBvID0gZS5wb3NpdGlvbiwgZS5wb3NpdGlvbisrLCBpID0gZS5wb3NpdGlvbjtcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuICEwO1xuICAgIGVsc2VcbiAgICAgIE0ocikgPyAoVShlLCBvLCBpLCAhMCksIGtlKGUsIFIoZSwgITEsIG4pKSwgbyA9IGkgPSBlLnBvc2l0aW9uKSA6IGUucG9zaXRpb24gPT09IGUubGluZVN0YXJ0ICYmIG1lKGUpID8gZyhlLCBcInVuZXhwZWN0ZWQgZW5kIG9mIHRoZSBkb2N1bWVudCB3aXRoaW4gYSBzaW5nbGUgcXVvdGVkIHNjYWxhclwiKSA6IChlLnBvc2l0aW9uKyssIGkgPSBlLnBvc2l0aW9uKTtcbiAgZyhlLCBcInVuZXhwZWN0ZWQgZW5kIG9mIHRoZSBzdHJlYW0gd2l0aGluIGEgc2luZ2xlIHF1b3RlZCBzY2FsYXJcIik7XG59XG5mdW5jdGlvbiBtaShlLCBuKSB7XG4gIHZhciByLCBvLCBpLCBsLCB0LCB1O1xuICBpZiAodSA9IGUuaW5wdXQuY2hhckNvZGVBdChlLnBvc2l0aW9uKSwgdSAhPT0gMzQpXG4gICAgcmV0dXJuICExO1xuICBmb3IgKGUua2luZCA9IFwic2NhbGFyXCIsIGUucmVzdWx0ID0gXCJcIiwgZS5wb3NpdGlvbisrLCByID0gbyA9IGUucG9zaXRpb247ICh1ID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24pKSAhPT0gMDsgKSB7XG4gICAgaWYgKHUgPT09IDM0KVxuICAgICAgcmV0dXJuIFUoZSwgciwgZS5wb3NpdGlvbiwgITApLCBlLnBvc2l0aW9uKyssICEwO1xuICAgIGlmICh1ID09PSA5Mikge1xuICAgICAgaWYgKFUoZSwgciwgZS5wb3NpdGlvbiwgITApLCB1ID0gZS5pbnB1dC5jaGFyQ29kZUF0KCsrZS5wb3NpdGlvbiksIE0odSkpXG4gICAgICAgIFIoZSwgITEsIG4pO1xuICAgICAgZWxzZSBpZiAodSA8IDI1NiAmJiBGblt1XSlcbiAgICAgICAgZS5yZXN1bHQgKz0gVG5bdV0sIGUucG9zaXRpb24rKztcbiAgICAgIGVsc2UgaWYgKCh0ID0gZmkodSkpID4gMCkge1xuICAgICAgICBmb3IgKGkgPSB0LCBsID0gMDsgaSA+IDA7IGktLSlcbiAgICAgICAgICB1ID0gZS5pbnB1dC5jaGFyQ29kZUF0KCsrZS5wb3NpdGlvbiksICh0ID0gYWkodSkpID49IDAgPyBsID0gKGwgPDwgNCkgKyB0IDogZyhlLCBcImV4cGVjdGVkIGhleGFkZWNpbWFsIGNoYXJhY3RlclwiKTtcbiAgICAgICAgZS5yZXN1bHQgKz0gc2kobCksIGUucG9zaXRpb24rKztcbiAgICAgIH0gZWxzZVxuICAgICAgICBnKGUsIFwidW5rbm93biBlc2NhcGUgc2VxdWVuY2VcIik7XG4gICAgICByID0gbyA9IGUucG9zaXRpb247XG4gICAgfSBlbHNlXG4gICAgICBNKHUpID8gKFUoZSwgciwgbywgITApLCBrZShlLCBSKGUsICExLCBuKSksIHIgPSBvID0gZS5wb3NpdGlvbikgOiBlLnBvc2l0aW9uID09PSBlLmxpbmVTdGFydCAmJiBtZShlKSA/IGcoZSwgXCJ1bmV4cGVjdGVkIGVuZCBvZiB0aGUgZG9jdW1lbnQgd2l0aGluIGEgZG91YmxlIHF1b3RlZCBzY2FsYXJcIikgOiAoZS5wb3NpdGlvbisrLCBvID0gZS5wb3NpdGlvbik7XG4gIH1cbiAgZyhlLCBcInVuZXhwZWN0ZWQgZW5kIG9mIHRoZSBzdHJlYW0gd2l0aGluIGEgZG91YmxlIHF1b3RlZCBzY2FsYXJcIik7XG59XG5mdW5jdGlvbiBnaShlLCBuKSB7XG4gIHZhciByID0gITAsIG8sIGksIGwsIHQgPSBlLnRhZywgdSwgYSA9IGUuYW5jaG9yLCBjLCBoLCBwLCBtLCB4LCB2ID0gLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCksIEEsIGIsIEQsIHk7XG4gIGlmICh5ID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24pLCB5ID09PSA5MSlcbiAgICBoID0gOTMsIHggPSAhMSwgdSA9IFtdO1xuICBlbHNlIGlmICh5ID09PSAxMjMpXG4gICAgaCA9IDEyNSwgeCA9ICEwLCB1ID0ge307XG4gIGVsc2VcbiAgICByZXR1cm4gITE7XG4gIGZvciAoZS5hbmNob3IgIT09IG51bGwgJiYgKGUuYW5jaG9yTWFwW2UuYW5jaG9yXSA9IHUpLCB5ID0gZS5pbnB1dC5jaGFyQ29kZUF0KCsrZS5wb3NpdGlvbik7IHkgIT09IDA7ICkge1xuICAgIGlmIChSKGUsICEwLCBuKSwgeSA9IGUuaW5wdXQuY2hhckNvZGVBdChlLnBvc2l0aW9uKSwgeSA9PT0gaClcbiAgICAgIHJldHVybiBlLnBvc2l0aW9uKyssIGUudGFnID0gdCwgZS5hbmNob3IgPSBhLCBlLmtpbmQgPSB4ID8gXCJtYXBwaW5nXCIgOiBcInNlcXVlbmNlXCIsIGUucmVzdWx0ID0gdSwgITA7XG4gICAgciA/IHkgPT09IDQ0ICYmIGcoZSwgXCJleHBlY3RlZCB0aGUgbm9kZSBjb250ZW50LCBidXQgZm91bmQgJywnXCIpIDogZyhlLCBcIm1pc3NlZCBjb21tYSBiZXR3ZWVuIGZsb3cgY29sbGVjdGlvbiBlbnRyaWVzXCIpLCBiID0gQSA9IEQgPSBudWxsLCBwID0gbSA9ICExLCB5ID09PSA2MyAmJiAoYyA9IGUuaW5wdXQuY2hhckNvZGVBdChlLnBvc2l0aW9uICsgMSksIGsoYykgJiYgKHAgPSBtID0gITAsIGUucG9zaXRpb24rKywgUihlLCAhMCwgbikpKSwgbyA9IGUubGluZSwgaSA9IGUubGluZVN0YXJ0LCBsID0gZS5wb3NpdGlvbiwgVihlLCBuLCBjZSwgITEsICEwKSwgYiA9IGUudGFnLCBBID0gZS5yZXN1bHQsIFIoZSwgITAsIG4pLCB5ID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24pLCAobSB8fCBlLmxpbmUgPT09IG8pICYmIHkgPT09IDU4ICYmIChwID0gITAsIHkgPSBlLmlucHV0LmNoYXJDb2RlQXQoKytlLnBvc2l0aW9uKSwgUihlLCAhMCwgbiksIFYoZSwgbiwgY2UsICExLCAhMCksIEQgPSBlLnJlc3VsdCksIHggPyBRKGUsIHUsIHYsIGIsIEEsIEQsIG8sIGksIGwpIDogcCA/IHUucHVzaChRKGUsIG51bGwsIHYsIGIsIEEsIEQsIG8sIGksIGwpKSA6IHUucHVzaChBKSwgUihlLCAhMCwgbiksIHkgPSBlLmlucHV0LmNoYXJDb2RlQXQoZS5wb3NpdGlvbiksIHkgPT09IDQ0ID8gKHIgPSAhMCwgeSA9IGUuaW5wdXQuY2hhckNvZGVBdCgrK2UucG9zaXRpb24pKSA6IHIgPSAhMTtcbiAgfVxuICBnKGUsIFwidW5leHBlY3RlZCBlbmQgb2YgdGhlIHN0cmVhbSB3aXRoaW4gYSBmbG93IGNvbGxlY3Rpb25cIik7XG59XG5mdW5jdGlvbiB4aShlLCBuKSB7XG4gIHZhciByLCBvLCBpID0gX2UsIGwgPSAhMSwgdCA9ICExLCB1ID0gbiwgYSA9IDAsIGMgPSAhMSwgaCwgcDtcbiAgaWYgKHAgPSBlLmlucHV0LmNoYXJDb2RlQXQoZS5wb3NpdGlvbiksIHAgPT09IDEyNClcbiAgICBvID0gITE7XG4gIGVsc2UgaWYgKHAgPT09IDYyKVxuICAgIG8gPSAhMDtcbiAgZWxzZVxuICAgIHJldHVybiAhMTtcbiAgZm9yIChlLmtpbmQgPSBcInNjYWxhclwiLCBlLnJlc3VsdCA9IFwiXCI7IHAgIT09IDA7IClcbiAgICBpZiAocCA9IGUuaW5wdXQuY2hhckNvZGVBdCgrK2UucG9zaXRpb24pLCBwID09PSA0MyB8fCBwID09PSA0NSlcbiAgICAgIF9lID09PSBpID8gaSA9IHAgPT09IDQzID8gVWUgOiBvaSA6IGcoZSwgXCJyZXBlYXQgb2YgYSBjaG9tcGluZyBtb2RlIGlkZW50aWZpZXJcIik7XG4gICAgZWxzZSBpZiAoKGggPSBjaShwKSkgPj0gMClcbiAgICAgIGggPT09IDAgPyBnKGUsIFwiYmFkIGV4cGxpY2l0IGluZGVudGF0aW9uIHdpZHRoIG9mIGEgYmxvY2sgc2NhbGFyOyBpdCBjYW5ub3QgYmUgbGVzcyB0aGFuIG9uZVwiKSA6IHQgPyBnKGUsIFwicmVwZWF0IG9mIGFuIGluZGVudGF0aW9uIHdpZHRoIGlkZW50aWZpZXJcIikgOiAodSA9IG4gKyBoIC0gMSwgdCA9ICEwKTtcbiAgICBlbHNlXG4gICAgICBicmVhaztcbiAgaWYgKHEocCkpIHtcbiAgICBkb1xuICAgICAgcCA9IGUuaW5wdXQuY2hhckNvZGVBdCgrK2UucG9zaXRpb24pO1xuICAgIHdoaWxlIChxKHApKTtcbiAgICBpZiAocCA9PT0gMzUpXG4gICAgICBkb1xuICAgICAgICBwID0gZS5pbnB1dC5jaGFyQ29kZUF0KCsrZS5wb3NpdGlvbik7XG4gICAgICB3aGlsZSAoIU0ocCkgJiYgcCAhPT0gMCk7XG4gIH1cbiAgZm9yICg7IHAgIT09IDA7ICkge1xuICAgIGZvciAoSWUoZSksIGUubGluZUluZGVudCA9IDAsIHAgPSBlLmlucHV0LmNoYXJDb2RlQXQoZS5wb3NpdGlvbik7ICghdCB8fCBlLmxpbmVJbmRlbnQgPCB1KSAmJiBwID09PSAzMjsgKVxuICAgICAgZS5saW5lSW5kZW50KyssIHAgPSBlLmlucHV0LmNoYXJDb2RlQXQoKytlLnBvc2l0aW9uKTtcbiAgICBpZiAoIXQgJiYgZS5saW5lSW5kZW50ID4gdSAmJiAodSA9IGUubGluZUluZGVudCksIE0ocCkpIHtcbiAgICAgIGErKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoZS5saW5lSW5kZW50IDwgdSkge1xuICAgICAgaSA9PT0gVWUgPyBlLnJlc3VsdCArPSBGLnJlcGVhdChgXG5gLCBsID8gMSArIGEgOiBhKSA6IGkgPT09IF9lICYmIGwgJiYgKGUucmVzdWx0ICs9IGBcbmApO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGZvciAobyA/IHEocCkgPyAoYyA9ICEwLCBlLnJlc3VsdCArPSBGLnJlcGVhdChgXG5gLCBsID8gMSArIGEgOiBhKSkgOiBjID8gKGMgPSAhMSwgZS5yZXN1bHQgKz0gRi5yZXBlYXQoYFxuYCwgYSArIDEpKSA6IGEgPT09IDAgPyBsICYmIChlLnJlc3VsdCArPSBcIiBcIikgOiBlLnJlc3VsdCArPSBGLnJlcGVhdChgXG5gLCBhKSA6IGUucmVzdWx0ICs9IEYucmVwZWF0KGBcbmAsIGwgPyAxICsgYSA6IGEpLCBsID0gITAsIHQgPSAhMCwgYSA9IDAsIHIgPSBlLnBvc2l0aW9uOyAhTShwKSAmJiBwICE9PSAwOyApXG4gICAgICBwID0gZS5pbnB1dC5jaGFyQ29kZUF0KCsrZS5wb3NpdGlvbik7XG4gICAgVShlLCByLCBlLnBvc2l0aW9uLCAhMSk7XG4gIH1cbiAgcmV0dXJuICEwO1xufVxuZnVuY3Rpb24gS2UoZSwgbikge1xuICB2YXIgciwgbyA9IGUudGFnLCBpID0gZS5hbmNob3IsIGwgPSBbXSwgdCwgdSA9ICExLCBhO1xuICBpZiAoZS5maXJzdFRhYkluTGluZSAhPT0gLTEpXG4gICAgcmV0dXJuICExO1xuICBmb3IgKGUuYW5jaG9yICE9PSBudWxsICYmIChlLmFuY2hvck1hcFtlLmFuY2hvcl0gPSBsKSwgYSA9IGUuaW5wdXQuY2hhckNvZGVBdChlLnBvc2l0aW9uKTsgYSAhPT0gMCAmJiAoZS5maXJzdFRhYkluTGluZSAhPT0gLTEgJiYgKGUucG9zaXRpb24gPSBlLmZpcnN0VGFiSW5MaW5lLCBnKGUsIFwidGFiIGNoYXJhY3RlcnMgbXVzdCBub3QgYmUgdXNlZCBpbiBpbmRlbnRhdGlvblwiKSksICEoYSAhPT0gNDUgfHwgKHQgPSBlLmlucHV0LmNoYXJDb2RlQXQoZS5wb3NpdGlvbiArIDEpLCAhayh0KSkpKTsgKSB7XG4gICAgaWYgKHUgPSAhMCwgZS5wb3NpdGlvbisrLCBSKGUsICEwLCAtMSkgJiYgZS5saW5lSW5kZW50IDw9IG4pIHtcbiAgICAgIGwucHVzaChudWxsKSwgYSA9IGUuaW5wdXQuY2hhckNvZGVBdChlLnBvc2l0aW9uKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAociA9IGUubGluZSwgVihlLCBuLCBFbiwgITEsICEwKSwgbC5wdXNoKGUucmVzdWx0KSwgUihlLCAhMCwgLTEpLCBhID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24pLCAoZS5saW5lID09PSByIHx8IGUubGluZUluZGVudCA+IG4pICYmIGEgIT09IDApXG4gICAgICBnKGUsIFwiYmFkIGluZGVudGF0aW9uIG9mIGEgc2VxdWVuY2UgZW50cnlcIik7XG4gICAgZWxzZSBpZiAoZS5saW5lSW5kZW50IDwgbilcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiB1ID8gKGUudGFnID0gbywgZS5hbmNob3IgPSBpLCBlLmtpbmQgPSBcInNlcXVlbmNlXCIsIGUucmVzdWx0ID0gbCwgITApIDogITE7XG59XG5mdW5jdGlvbiB2aShlLCBuLCByKSB7XG4gIHZhciBvLCBpLCBsLCB0LCB1LCBhLCBjID0gZS50YWcsIGggPSBlLmFuY2hvciwgcCA9IHt9LCBtID0gLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCksIHggPSBudWxsLCB2ID0gbnVsbCwgQSA9IG51bGwsIGIgPSAhMSwgRCA9ICExLCB5O1xuICBpZiAoZS5maXJzdFRhYkluTGluZSAhPT0gLTEpXG4gICAgcmV0dXJuICExO1xuICBmb3IgKGUuYW5jaG9yICE9PSBudWxsICYmIChlLmFuY2hvck1hcFtlLmFuY2hvcl0gPSBwKSwgeSA9IGUuaW5wdXQuY2hhckNvZGVBdChlLnBvc2l0aW9uKTsgeSAhPT0gMDsgKSB7XG4gICAgaWYgKCFiICYmIGUuZmlyc3RUYWJJbkxpbmUgIT09IC0xICYmIChlLnBvc2l0aW9uID0gZS5maXJzdFRhYkluTGluZSwgZyhlLCBcInRhYiBjaGFyYWN0ZXJzIG11c3Qgbm90IGJlIHVzZWQgaW4gaW5kZW50YXRpb25cIikpLCBvID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24gKyAxKSwgbCA9IGUubGluZSwgKHkgPT09IDYzIHx8IHkgPT09IDU4KSAmJiBrKG8pKVxuICAgICAgeSA9PT0gNjMgPyAoYiAmJiAoUShlLCBwLCBtLCB4LCB2LCBudWxsLCB0LCB1LCBhKSwgeCA9IHYgPSBBID0gbnVsbCksIEQgPSAhMCwgYiA9ICEwLCBpID0gITApIDogYiA/IChiID0gITEsIGkgPSAhMCkgOiBnKGUsIFwiaW5jb21wbGV0ZSBleHBsaWNpdCBtYXBwaW5nIHBhaXI7IGEga2V5IG5vZGUgaXMgbWlzc2VkOyBvciBmb2xsb3dlZCBieSBhIG5vbi10YWJ1bGF0ZWQgZW1wdHkgbGluZVwiKSwgZS5wb3NpdGlvbiArPSAxLCB5ID0gbztcbiAgICBlbHNlIHtcbiAgICAgIGlmICh0ID0gZS5saW5lLCB1ID0gZS5saW5lU3RhcnQsIGEgPSBlLnBvc2l0aW9uLCAhVihlLCByLCBfbiwgITEsICEwKSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBpZiAoZS5saW5lID09PSBsKSB7XG4gICAgICAgIGZvciAoeSA9IGUuaW5wdXQuY2hhckNvZGVBdChlLnBvc2l0aW9uKTsgcSh5KTsgKVxuICAgICAgICAgIHkgPSBlLmlucHV0LmNoYXJDb2RlQXQoKytlLnBvc2l0aW9uKTtcbiAgICAgICAgaWYgKHkgPT09IDU4KVxuICAgICAgICAgIHkgPSBlLmlucHV0LmNoYXJDb2RlQXQoKytlLnBvc2l0aW9uKSwgayh5KSB8fCBnKGUsIFwiYSB3aGl0ZXNwYWNlIGNoYXJhY3RlciBpcyBleHBlY3RlZCBhZnRlciB0aGUga2V5LXZhbHVlIHNlcGFyYXRvciB3aXRoaW4gYSBibG9jayBtYXBwaW5nXCIpLCBiICYmIChRKGUsIHAsIG0sIHgsIHYsIG51bGwsIHQsIHUsIGEpLCB4ID0gdiA9IEEgPSBudWxsKSwgRCA9ICEwLCBiID0gITEsIGkgPSAhMSwgeCA9IGUudGFnLCB2ID0gZS5yZXN1bHQ7XG4gICAgICAgIGVsc2UgaWYgKEQpXG4gICAgICAgICAgZyhlLCBcImNhbiBub3QgcmVhZCBhbiBpbXBsaWNpdCBtYXBwaW5nIHBhaXI7IGEgY29sb24gaXMgbWlzc2VkXCIpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGUudGFnID0gYywgZS5hbmNob3IgPSBoLCAhMDtcbiAgICAgIH0gZWxzZSBpZiAoRClcbiAgICAgICAgZyhlLCBcImNhbiBub3QgcmVhZCBhIGJsb2NrIG1hcHBpbmcgZW50cnk7IGEgbXVsdGlsaW5lIGtleSBtYXkgbm90IGJlIGFuIGltcGxpY2l0IGtleVwiKTtcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGUudGFnID0gYywgZS5hbmNob3IgPSBoLCAhMDtcbiAgICB9XG4gICAgaWYgKChlLmxpbmUgPT09IGwgfHwgZS5saW5lSW5kZW50ID4gbikgJiYgKGIgJiYgKHQgPSBlLmxpbmUsIHUgPSBlLmxpbmVTdGFydCwgYSA9IGUucG9zaXRpb24pLCBWKGUsIG4sIHNlLCAhMCwgaSkgJiYgKGIgPyB2ID0gZS5yZXN1bHQgOiBBID0gZS5yZXN1bHQpLCBiIHx8IChRKGUsIHAsIG0sIHgsIHYsIEEsIHQsIHUsIGEpLCB4ID0gdiA9IEEgPSBudWxsKSwgUihlLCAhMCwgLTEpLCB5ID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24pKSwgKGUubGluZSA9PT0gbCB8fCBlLmxpbmVJbmRlbnQgPiBuKSAmJiB5ICE9PSAwKVxuICAgICAgZyhlLCBcImJhZCBpbmRlbnRhdGlvbiBvZiBhIG1hcHBpbmcgZW50cnlcIik7XG4gICAgZWxzZSBpZiAoZS5saW5lSW5kZW50IDwgbilcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiBiICYmIFEoZSwgcCwgbSwgeCwgdiwgbnVsbCwgdCwgdSwgYSksIEQgJiYgKGUudGFnID0gYywgZS5hbmNob3IgPSBoLCBlLmtpbmQgPSBcIm1hcHBpbmdcIiwgZS5yZXN1bHQgPSBwKSwgRDtcbn1cbmZ1bmN0aW9uIHlpKGUpIHtcbiAgdmFyIG4sIHIgPSAhMSwgbyA9ICExLCBpLCBsLCB0O1xuICBpZiAodCA9IGUuaW5wdXQuY2hhckNvZGVBdChlLnBvc2l0aW9uKSwgdCAhPT0gMzMpXG4gICAgcmV0dXJuICExO1xuICBpZiAoZS50YWcgIT09IG51bGwgJiYgZyhlLCBcImR1cGxpY2F0aW9uIG9mIGEgdGFnIHByb3BlcnR5XCIpLCB0ID0gZS5pbnB1dC5jaGFyQ29kZUF0KCsrZS5wb3NpdGlvbiksIHQgPT09IDYwID8gKHIgPSAhMCwgdCA9IGUuaW5wdXQuY2hhckNvZGVBdCgrK2UucG9zaXRpb24pKSA6IHQgPT09IDMzID8gKG8gPSAhMCwgaSA9IFwiISFcIiwgdCA9IGUuaW5wdXQuY2hhckNvZGVBdCgrK2UucG9zaXRpb24pKSA6IGkgPSBcIiFcIiwgbiA9IGUucG9zaXRpb24sIHIpIHtcbiAgICBkb1xuICAgICAgdCA9IGUuaW5wdXQuY2hhckNvZGVBdCgrK2UucG9zaXRpb24pO1xuICAgIHdoaWxlICh0ICE9PSAwICYmIHQgIT09IDYyKTtcbiAgICBlLnBvc2l0aW9uIDwgZS5sZW5ndGggPyAobCA9IGUuaW5wdXQuc2xpY2UobiwgZS5wb3NpdGlvbiksIHQgPSBlLmlucHV0LmNoYXJDb2RlQXQoKytlLnBvc2l0aW9uKSkgOiBnKGUsIFwidW5leHBlY3RlZCBlbmQgb2YgdGhlIHN0cmVhbSB3aXRoaW4gYSB2ZXJiYXRpbSB0YWdcIik7XG4gIH0gZWxzZSB7XG4gICAgZm9yICg7IHQgIT09IDAgJiYgIWsodCk7IClcbiAgICAgIHQgPT09IDMzICYmIChvID8gZyhlLCBcInRhZyBzdWZmaXggY2Fubm90IGNvbnRhaW4gZXhjbGFtYXRpb24gbWFya3NcIikgOiAoaSA9IGUuaW5wdXQuc2xpY2UobiAtIDEsIGUucG9zaXRpb24gKyAxKSwgUm4udGVzdChpKSB8fCBnKGUsIFwibmFtZWQgdGFnIGhhbmRsZSBjYW5ub3QgY29udGFpbiBzdWNoIGNoYXJhY3RlcnNcIiksIG8gPSAhMCwgbiA9IGUucG9zaXRpb24gKyAxKSksIHQgPSBlLmlucHV0LmNoYXJDb2RlQXQoKytlLnBvc2l0aW9uKTtcbiAgICBsID0gZS5pbnB1dC5zbGljZShuLCBlLnBvc2l0aW9uKSwgdWkudGVzdChsKSAmJiBnKGUsIFwidGFnIHN1ZmZpeCBjYW5ub3QgY29udGFpbiBmbG93IGluZGljYXRvciBjaGFyYWN0ZXJzXCIpO1xuICB9XG4gIGwgJiYgIU9uLnRlc3QobCkgJiYgZyhlLCBcInRhZyBuYW1lIGNhbm5vdCBjb250YWluIHN1Y2ggY2hhcmFjdGVyczogXCIgKyBsKTtcbiAgdHJ5IHtcbiAgICBsID0gZGVjb2RlVVJJQ29tcG9uZW50KGwpO1xuICB9IGNhdGNoIHtcbiAgICBnKGUsIFwidGFnIG5hbWUgaXMgbWFsZm9ybWVkOiBcIiArIGwpO1xuICB9XG4gIHJldHVybiByID8gZS50YWcgPSBsIDogJC5jYWxsKGUudGFnTWFwLCBpKSA/IGUudGFnID0gZS50YWdNYXBbaV0gKyBsIDogaSA9PT0gXCIhXCIgPyBlLnRhZyA9IFwiIVwiICsgbCA6IGkgPT09IFwiISFcIiA/IGUudGFnID0gXCJ0YWc6eWFtbC5vcmcsMjAwMjpcIiArIGwgOiBnKGUsICd1bmRlY2xhcmVkIHRhZyBoYW5kbGUgXCInICsgaSArICdcIicpLCAhMDtcbn1cbmZ1bmN0aW9uIEFpKGUpIHtcbiAgdmFyIG4sIHI7XG4gIGlmIChyID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24pLCByICE9PSAzOClcbiAgICByZXR1cm4gITE7XG4gIGZvciAoZS5hbmNob3IgIT09IG51bGwgJiYgZyhlLCBcImR1cGxpY2F0aW9uIG9mIGFuIGFuY2hvciBwcm9wZXJ0eVwiKSwgciA9IGUuaW5wdXQuY2hhckNvZGVBdCgrK2UucG9zaXRpb24pLCBuID0gZS5wb3NpdGlvbjsgciAhPT0gMCAmJiAhayhyKSAmJiAhVyhyKTsgKVxuICAgIHIgPSBlLmlucHV0LmNoYXJDb2RlQXQoKytlLnBvc2l0aW9uKTtcbiAgcmV0dXJuIGUucG9zaXRpb24gPT09IG4gJiYgZyhlLCBcIm5hbWUgb2YgYW4gYW5jaG9yIG5vZGUgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSBjaGFyYWN0ZXJcIiksIGUuYW5jaG9yID0gZS5pbnB1dC5zbGljZShuLCBlLnBvc2l0aW9uKSwgITA7XG59XG5mdW5jdGlvbiBiaShlKSB7XG4gIHZhciBuLCByLCBvO1xuICBpZiAobyA9IGUuaW5wdXQuY2hhckNvZGVBdChlLnBvc2l0aW9uKSwgbyAhPT0gNDIpXG4gICAgcmV0dXJuICExO1xuICBmb3IgKG8gPSBlLmlucHV0LmNoYXJDb2RlQXQoKytlLnBvc2l0aW9uKSwgbiA9IGUucG9zaXRpb247IG8gIT09IDAgJiYgIWsobykgJiYgIVcobyk7IClcbiAgICBvID0gZS5pbnB1dC5jaGFyQ29kZUF0KCsrZS5wb3NpdGlvbik7XG4gIHJldHVybiBlLnBvc2l0aW9uID09PSBuICYmIGcoZSwgXCJuYW1lIG9mIGFuIGFsaWFzIG5vZGUgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSBjaGFyYWN0ZXJcIiksIHIgPSBlLmlucHV0LnNsaWNlKG4sIGUucG9zaXRpb24pLCAkLmNhbGwoZS5hbmNob3JNYXAsIHIpIHx8IGcoZSwgJ3VuaWRlbnRpZmllZCBhbGlhcyBcIicgKyByICsgJ1wiJyksIGUucmVzdWx0ID0gZS5hbmNob3JNYXBbcl0sIFIoZSwgITAsIC0xKSwgITA7XG59XG5mdW5jdGlvbiBWKGUsIG4sIHIsIG8sIGkpIHtcbiAgdmFyIGwsIHQsIHUsIGEgPSAxLCBjID0gITEsIGggPSAhMSwgcCwgbSwgeCwgdiwgQSwgYjtcbiAgaWYgKGUubGlzdGVuZXIgIT09IG51bGwgJiYgZS5saXN0ZW5lcihcIm9wZW5cIiwgZSksIGUudGFnID0gbnVsbCwgZS5hbmNob3IgPSBudWxsLCBlLmtpbmQgPSBudWxsLCBlLnJlc3VsdCA9IG51bGwsIGwgPSB0ID0gdSA9IHNlID09PSByIHx8IEVuID09PSByLCBvICYmIFIoZSwgITAsIC0xKSAmJiAoYyA9ICEwLCBlLmxpbmVJbmRlbnQgPiBuID8gYSA9IDEgOiBlLmxpbmVJbmRlbnQgPT09IG4gPyBhID0gMCA6IGUubGluZUluZGVudCA8IG4gJiYgKGEgPSAtMSkpLCBhID09PSAxKVxuICAgIGZvciAoOyB5aShlKSB8fCBBaShlKTsgKVxuICAgICAgUihlLCAhMCwgLTEpID8gKGMgPSAhMCwgdSA9IGwsIGUubGluZUluZGVudCA+IG4gPyBhID0gMSA6IGUubGluZUluZGVudCA9PT0gbiA/IGEgPSAwIDogZS5saW5lSW5kZW50IDwgbiAmJiAoYSA9IC0xKSkgOiB1ID0gITE7XG4gIGlmICh1ICYmICh1ID0gYyB8fCBpKSwgKGEgPT09IDEgfHwgc2UgPT09IHIpICYmIChjZSA9PT0gciB8fCBfbiA9PT0gciA/IEEgPSBuIDogQSA9IG4gKyAxLCBiID0gZS5wb3NpdGlvbiAtIGUubGluZVN0YXJ0LCBhID09PSAxID8gdSAmJiAoS2UoZSwgYikgfHwgdmkoZSwgYiwgQSkpIHx8IGdpKGUsIEEpID8gaCA9ICEwIDogKHQgJiYgeGkoZSwgQSkgfHwgZGkoZSwgQSkgfHwgbWkoZSwgQSkgPyBoID0gITAgOiBiaShlKSA/IChoID0gITAsIChlLnRhZyAhPT0gbnVsbCB8fCBlLmFuY2hvciAhPT0gbnVsbCkgJiYgZyhlLCBcImFsaWFzIG5vZGUgc2hvdWxkIG5vdCBoYXZlIGFueSBwcm9wZXJ0aWVzXCIpKSA6IGhpKGUsIEEsIGNlID09PSByKSAmJiAoaCA9ICEwLCBlLnRhZyA9PT0gbnVsbCAmJiAoZS50YWcgPSBcIj9cIikpLCBlLmFuY2hvciAhPT0gbnVsbCAmJiAoZS5hbmNob3JNYXBbZS5hbmNob3JdID0gZS5yZXN1bHQpKSA6IGEgPT09IDAgJiYgKGggPSB1ICYmIEtlKGUsIGIpKSksIGUudGFnID09PSBudWxsKVxuICAgIGUuYW5jaG9yICE9PSBudWxsICYmIChlLmFuY2hvck1hcFtlLmFuY2hvcl0gPSBlLnJlc3VsdCk7XG4gIGVsc2UgaWYgKGUudGFnID09PSBcIj9cIikge1xuICAgIGZvciAoZS5yZXN1bHQgIT09IG51bGwgJiYgZS5raW5kICE9PSBcInNjYWxhclwiICYmIGcoZSwgJ3VuYWNjZXB0YWJsZSBub2RlIGtpbmQgZm9yICE8Pz4gdGFnOyBpdCBzaG91bGQgYmUgXCJzY2FsYXJcIiwgbm90IFwiJyArIGUua2luZCArICdcIicpLCBwID0gMCwgbSA9IGUuaW1wbGljaXRUeXBlcy5sZW5ndGg7IHAgPCBtOyBwICs9IDEpXG4gICAgICBpZiAodiA9IGUuaW1wbGljaXRUeXBlc1twXSwgdi5yZXNvbHZlKGUucmVzdWx0KSkge1xuICAgICAgICBlLnJlc3VsdCA9IHYuY29uc3RydWN0KGUucmVzdWx0KSwgZS50YWcgPSB2LnRhZywgZS5hbmNob3IgIT09IG51bGwgJiYgKGUuYW5jaG9yTWFwW2UuYW5jaG9yXSA9IGUucmVzdWx0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gIH0gZWxzZSBpZiAoZS50YWcgIT09IFwiIVwiKSB7XG4gICAgaWYgKCQuY2FsbChlLnR5cGVNYXBbZS5raW5kIHx8IFwiZmFsbGJhY2tcIl0sIGUudGFnKSlcbiAgICAgIHYgPSBlLnR5cGVNYXBbZS5raW5kIHx8IFwiZmFsbGJhY2tcIl1bZS50YWddO1xuICAgIGVsc2VcbiAgICAgIGZvciAodiA9IG51bGwsIHggPSBlLnR5cGVNYXAubXVsdGlbZS5raW5kIHx8IFwiZmFsbGJhY2tcIl0sIHAgPSAwLCBtID0geC5sZW5ndGg7IHAgPCBtOyBwICs9IDEpXG4gICAgICAgIGlmIChlLnRhZy5zbGljZSgwLCB4W3BdLnRhZy5sZW5ndGgpID09PSB4W3BdLnRhZykge1xuICAgICAgICAgIHYgPSB4W3BdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgdiB8fCBnKGUsIFwidW5rbm93biB0YWcgITxcIiArIGUudGFnICsgXCI+XCIpLCBlLnJlc3VsdCAhPT0gbnVsbCAmJiB2LmtpbmQgIT09IGUua2luZCAmJiBnKGUsIFwidW5hY2NlcHRhYmxlIG5vZGUga2luZCBmb3IgITxcIiArIGUudGFnICsgJz4gdGFnOyBpdCBzaG91bGQgYmUgXCInICsgdi5raW5kICsgJ1wiLCBub3QgXCInICsgZS5raW5kICsgJ1wiJyksIHYucmVzb2x2ZShlLnJlc3VsdCwgZS50YWcpID8gKGUucmVzdWx0ID0gdi5jb25zdHJ1Y3QoZS5yZXN1bHQsIGUudGFnKSwgZS5hbmNob3IgIT09IG51bGwgJiYgKGUuYW5jaG9yTWFwW2UuYW5jaG9yXSA9IGUucmVzdWx0KSkgOiBnKGUsIFwiY2Fubm90IHJlc29sdmUgYSBub2RlIHdpdGggITxcIiArIGUudGFnICsgXCI+IGV4cGxpY2l0IHRhZ1wiKTtcbiAgfVxuICByZXR1cm4gZS5saXN0ZW5lciAhPT0gbnVsbCAmJiBlLmxpc3RlbmVyKFwiY2xvc2VcIiwgZSksIGUudGFnICE9PSBudWxsIHx8IGUuYW5jaG9yICE9PSBudWxsIHx8IGg7XG59XG5mdW5jdGlvbiB3aShlKSB7XG4gIHZhciBuID0gZS5wb3NpdGlvbiwgciwgbywgaSwgbCA9ICExLCB0O1xuICBmb3IgKGUudmVyc2lvbiA9IG51bGwsIGUuY2hlY2tMaW5lQnJlYWtzID0gZS5sZWdhY3ksIGUudGFnTWFwID0gLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCksIGUuYW5jaG9yTWFwID0gLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCk7ICh0ID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24pKSAhPT0gMCAmJiAoUihlLCAhMCwgLTEpLCB0ID0gZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24pLCAhKGUubGluZUluZGVudCA+IDAgfHwgdCAhPT0gMzcpKTsgKSB7XG4gICAgZm9yIChsID0gITAsIHQgPSBlLmlucHV0LmNoYXJDb2RlQXQoKytlLnBvc2l0aW9uKSwgciA9IGUucG9zaXRpb247IHQgIT09IDAgJiYgIWsodCk7IClcbiAgICAgIHQgPSBlLmlucHV0LmNoYXJDb2RlQXQoKytlLnBvc2l0aW9uKTtcbiAgICBmb3IgKG8gPSBlLmlucHV0LnNsaWNlKHIsIGUucG9zaXRpb24pLCBpID0gW10sIG8ubGVuZ3RoIDwgMSAmJiBnKGUsIFwiZGlyZWN0aXZlIG5hbWUgbXVzdCBub3QgYmUgbGVzcyB0aGFuIG9uZSBjaGFyYWN0ZXIgaW4gbGVuZ3RoXCIpOyB0ICE9PSAwOyApIHtcbiAgICAgIGZvciAoOyBxKHQpOyApXG4gICAgICAgIHQgPSBlLmlucHV0LmNoYXJDb2RlQXQoKytlLnBvc2l0aW9uKTtcbiAgICAgIGlmICh0ID09PSAzNSkge1xuICAgICAgICBkb1xuICAgICAgICAgIHQgPSBlLmlucHV0LmNoYXJDb2RlQXQoKytlLnBvc2l0aW9uKTtcbiAgICAgICAgd2hpbGUgKHQgIT09IDAgJiYgIU0odCkpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChNKHQpKVxuICAgICAgICBicmVhaztcbiAgICAgIGZvciAociA9IGUucG9zaXRpb247IHQgIT09IDAgJiYgIWsodCk7IClcbiAgICAgICAgdCA9IGUuaW5wdXQuY2hhckNvZGVBdCgrK2UucG9zaXRpb24pO1xuICAgICAgaS5wdXNoKGUuaW5wdXQuc2xpY2UociwgZS5wb3NpdGlvbikpO1xuICAgIH1cbiAgICB0ICE9PSAwICYmIEllKGUpLCAkLmNhbGwoemUsIG8pID8gemVbb10oZSwgbywgaSkgOiBwZShlLCAndW5rbm93biBkb2N1bWVudCBkaXJlY3RpdmUgXCInICsgbyArICdcIicpO1xuICB9XG4gIGlmIChSKGUsICEwLCAtMSksIGUubGluZUluZGVudCA9PT0gMCAmJiBlLmlucHV0LmNoYXJDb2RlQXQoZS5wb3NpdGlvbikgPT09IDQ1ICYmIGUuaW5wdXQuY2hhckNvZGVBdChlLnBvc2l0aW9uICsgMSkgPT09IDQ1ICYmIGUuaW5wdXQuY2hhckNvZGVBdChlLnBvc2l0aW9uICsgMikgPT09IDQ1ID8gKGUucG9zaXRpb24gKz0gMywgUihlLCAhMCwgLTEpKSA6IGwgJiYgZyhlLCBcImRpcmVjdGl2ZXMgZW5kIG1hcmsgaXMgZXhwZWN0ZWRcIiksIFYoZSwgZS5saW5lSW5kZW50IC0gMSwgc2UsICExLCAhMCksIFIoZSwgITAsIC0xKSwgZS5jaGVja0xpbmVCcmVha3MgJiYgbGkudGVzdChlLmlucHV0LnNsaWNlKG4sIGUucG9zaXRpb24pKSAmJiBwZShlLCBcIm5vbi1BU0NJSSBsaW5lIGJyZWFrcyBhcmUgaW50ZXJwcmV0ZWQgYXMgY29udGVudFwiKSwgZS5kb2N1bWVudHMucHVzaChlLnJlc3VsdCksIGUucG9zaXRpb24gPT09IGUubGluZVN0YXJ0ICYmIG1lKGUpKSB7XG4gICAgZS5pbnB1dC5jaGFyQ29kZUF0KGUucG9zaXRpb24pID09PSA0NiAmJiAoZS5wb3NpdGlvbiArPSAzLCBSKGUsICEwLCAtMSkpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZS5wb3NpdGlvbiA8IGUubGVuZ3RoIC0gMSlcbiAgICBnKGUsIFwiZW5kIG9mIHRoZSBzdHJlYW0gb3IgYSBkb2N1bWVudCBzZXBhcmF0b3IgaXMgZXhwZWN0ZWRcIik7XG4gIGVsc2VcbiAgICByZXR1cm47XG59XG5mdW5jdGlvbiBMbihlLCBuKSB7XG4gIGUgPSBTdHJpbmcoZSksIG4gPSBuIHx8IHt9LCBlLmxlbmd0aCAhPT0gMCAmJiAoZS5jaGFyQ29kZUF0KGUubGVuZ3RoIC0gMSkgIT09IDEwICYmIGUuY2hhckNvZGVBdChlLmxlbmd0aCAtIDEpICE9PSAxMyAmJiAoZSArPSBgXG5gKSwgZS5jaGFyQ29kZUF0KDApID09PSA2NTI3OSAmJiAoZSA9IGUuc2xpY2UoMSkpKTtcbiAgdmFyIHIgPSBuZXcgcGkoZSwgbiksIG8gPSBlLmluZGV4T2YoXCJcXDBcIik7XG4gIGZvciAobyAhPT0gLTEgJiYgKHIucG9zaXRpb24gPSBvLCBnKHIsIFwibnVsbCBieXRlIGlzIG5vdCBhbGxvd2VkIGluIGlucHV0XCIpKSwgci5pbnB1dCArPSBcIlxcMFwiOyByLmlucHV0LmNoYXJDb2RlQXQoci5wb3NpdGlvbikgPT09IDMyOyApXG4gICAgci5saW5lSW5kZW50ICs9IDEsIHIucG9zaXRpb24gKz0gMTtcbiAgZm9yICg7IHIucG9zaXRpb24gPCByLmxlbmd0aCAtIDE7IClcbiAgICB3aShyKTtcbiAgcmV0dXJuIHIuZG9jdW1lbnRzO1xufVxuZnVuY3Rpb24gU2koZSwgbiwgcikge1xuICBuICE9PSBudWxsICYmIHR5cGVvZiBuID09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHIgPiBcInVcIiAmJiAociA9IG4sIG4gPSBudWxsKTtcbiAgdmFyIG8gPSBMbihlLCByKTtcbiAgaWYgKHR5cGVvZiBuICE9IFwiZnVuY3Rpb25cIilcbiAgICByZXR1cm4gbztcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBvLmxlbmd0aDsgaSA8IGw7IGkgKz0gMSlcbiAgICBuKG9baV0pO1xufVxuZnVuY3Rpb24gQ2koZSwgbikge1xuICB2YXIgciA9IExuKGUsIG4pO1xuICBpZiAoci5sZW5ndGggIT09IDApIHtcbiAgICBpZiAoci5sZW5ndGggPT09IDEpXG4gICAgICByZXR1cm4gclswXTtcbiAgICB0aHJvdyBuZXcgSShcImV4cGVjdGVkIGEgc2luZ2xlIGRvY3VtZW50IGluIHRoZSBzdHJlYW0sIGJ1dCBmb3VuZCBtb3JlXCIpO1xuICB9XG59XG52YXIgX2kgPSBTaSwgRWkgPSBDaSwgUG4gPSB7XG4gIGxvYWRBbGw6IF9pLFxuICBsb2FkOiBFaVxufSwgSW4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLCBrbiA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksIERlID0gNjUyNzksIFJpID0gOSwgbmUgPSAxMCwgT2kgPSAxMywgRmkgPSAzMiwgVGkgPSAzMywgTmkgPSAzNCwgUmUgPSAzNSwgTGkgPSAzNywgUGkgPSAzOCwgSWkgPSAzOSwga2kgPSA0MiwgRG4gPSA0NCwgRGkgPSA0NSwgaGUgPSA1OCwgamkgPSA2MSwgTWkgPSA2MiwgQmkgPSA2MywgSGkgPSA2NCwgam4gPSA5MSwgTW4gPSA5MywgWWkgPSA5NiwgQm4gPSAxMjMsIFVpID0gMTI0LCBIbiA9IDEyNSwgUCA9IHt9O1xuUFswXSA9IFwiXFxcXDBcIjtcblBbN10gPSBcIlxcXFxhXCI7XG5QWzhdID0gXCJcXFxcYlwiO1xuUFs5XSA9IFwiXFxcXHRcIjtcblBbMTBdID0gXCJcXFxcblwiO1xuUFsxMV0gPSBcIlxcXFx2XCI7XG5QWzEyXSA9IFwiXFxcXGZcIjtcblBbMTNdID0gXCJcXFxcclwiO1xuUFsyN10gPSBcIlxcXFxlXCI7XG5QWzM0XSA9ICdcXFxcXCInO1xuUFs5Ml0gPSBcIlxcXFxcXFxcXCI7XG5QWzEzM10gPSBcIlxcXFxOXCI7XG5QWzE2MF0gPSBcIlxcXFxfXCI7XG5QWzgyMzJdID0gXCJcXFxcTFwiO1xuUFs4MjMzXSA9IFwiXFxcXFBcIjtcbnZhciAkaSA9IFtcbiAgXCJ5XCIsXG4gIFwiWVwiLFxuICBcInllc1wiLFxuICBcIlllc1wiLFxuICBcIllFU1wiLFxuICBcIm9uXCIsXG4gIFwiT25cIixcbiAgXCJPTlwiLFxuICBcIm5cIixcbiAgXCJOXCIsXG4gIFwibm9cIixcbiAgXCJOb1wiLFxuICBcIk5PXCIsXG4gIFwib2ZmXCIsXG4gIFwiT2ZmXCIsXG4gIFwiT0ZGXCJcbl0sIHFpID0gL15bLStdP1swLTlfXSsoPzo6WzAtOV9dKykrKD86XFwuWzAtOV9dKik/JC87XG5mdW5jdGlvbiB6aShlLCBuKSB7XG4gIHZhciByLCBvLCBpLCBsLCB0LCB1LCBhO1xuICBpZiAobiA9PT0gbnVsbClcbiAgICByZXR1cm4ge307XG4gIGZvciAociA9IHt9LCBvID0gT2JqZWN0LmtleXMobiksIGkgPSAwLCBsID0gby5sZW5ndGg7IGkgPCBsOyBpICs9IDEpXG4gICAgdCA9IG9baV0sIHUgPSBTdHJpbmcoblt0XSksIHQuc2xpY2UoMCwgMikgPT09IFwiISFcIiAmJiAodCA9IFwidGFnOnlhbWwub3JnLDIwMDI6XCIgKyB0LnNsaWNlKDIpKSwgYSA9IGUuY29tcGlsZWRUeXBlTWFwLmZhbGxiYWNrW3RdLCBhICYmIGtuLmNhbGwoYS5zdHlsZUFsaWFzZXMsIHUpICYmICh1ID0gYS5zdHlsZUFsaWFzZXNbdV0pLCByW3RdID0gdTtcbiAgcmV0dXJuIHI7XG59XG5mdW5jdGlvbiBHaShlKSB7XG4gIHZhciBuLCByLCBvO1xuICBpZiAobiA9IGUudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCksIGUgPD0gMjU1KVxuICAgIHIgPSBcInhcIiwgbyA9IDI7XG4gIGVsc2UgaWYgKGUgPD0gNjU1MzUpXG4gICAgciA9IFwidVwiLCBvID0gNDtcbiAgZWxzZSBpZiAoZSA8PSA0Mjk0OTY3Mjk1KVxuICAgIHIgPSBcIlVcIiwgbyA9IDg7XG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgSShcImNvZGUgcG9pbnQgd2l0aGluIGEgc3RyaW5nIG1heSBub3QgYmUgZ3JlYXRlciB0aGFuIDB4RkZGRkZGRkZcIik7XG4gIHJldHVybiBcIlxcXFxcIiArIHIgKyBGLnJlcGVhdChcIjBcIiwgbyAtIG4ubGVuZ3RoKSArIG47XG59XG52YXIgS2kgPSAxLCByZSA9IDI7XG5mdW5jdGlvbiBXaShlKSB7XG4gIHRoaXMuc2NoZW1hID0gZS5zY2hlbWEgfHwgUGUsIHRoaXMuaW5kZW50ID0gTWF0aC5tYXgoMSwgZS5pbmRlbnQgfHwgMiksIHRoaXMubm9BcnJheUluZGVudCA9IGUubm9BcnJheUluZGVudCB8fCAhMSwgdGhpcy5za2lwSW52YWxpZCA9IGUuc2tpcEludmFsaWQgfHwgITEsIHRoaXMuZmxvd0xldmVsID0gRi5pc05vdGhpbmcoZS5mbG93TGV2ZWwpID8gLTEgOiBlLmZsb3dMZXZlbCwgdGhpcy5zdHlsZU1hcCA9IHppKHRoaXMuc2NoZW1hLCBlLnN0eWxlcyB8fCBudWxsKSwgdGhpcy5zb3J0S2V5cyA9IGUuc29ydEtleXMgfHwgITEsIHRoaXMubGluZVdpZHRoID0gZS5saW5lV2lkdGggfHwgODAsIHRoaXMubm9SZWZzID0gZS5ub1JlZnMgfHwgITEsIHRoaXMubm9Db21wYXRNb2RlID0gZS5ub0NvbXBhdE1vZGUgfHwgITEsIHRoaXMuY29uZGVuc2VGbG93ID0gZS5jb25kZW5zZUZsb3cgfHwgITEsIHRoaXMucXVvdGluZ1R5cGUgPSBlLnF1b3RpbmdUeXBlID09PSAnXCInID8gcmUgOiBLaSwgdGhpcy5mb3JjZVF1b3RlcyA9IGUuZm9yY2VRdW90ZXMgfHwgITEsIHRoaXMucmVwbGFjZXIgPSB0eXBlb2YgZS5yZXBsYWNlciA9PSBcImZ1bmN0aW9uXCIgPyBlLnJlcGxhY2VyIDogbnVsbCwgdGhpcy5pbXBsaWNpdFR5cGVzID0gdGhpcy5zY2hlbWEuY29tcGlsZWRJbXBsaWNpdCwgdGhpcy5leHBsaWNpdFR5cGVzID0gdGhpcy5zY2hlbWEuY29tcGlsZWRFeHBsaWNpdCwgdGhpcy50YWcgPSBudWxsLCB0aGlzLnJlc3VsdCA9IFwiXCIsIHRoaXMuZHVwbGljYXRlcyA9IFtdLCB0aGlzLnVzZWREdXBsaWNhdGVzID0gbnVsbDtcbn1cbmZ1bmN0aW9uIFdlKGUsIG4pIHtcbiAgZm9yICh2YXIgciA9IEYucmVwZWF0KFwiIFwiLCBuKSwgbyA9IDAsIGkgPSAtMSwgbCA9IFwiXCIsIHQsIHUgPSBlLmxlbmd0aDsgbyA8IHU7IClcbiAgICBpID0gZS5pbmRleE9mKGBcbmAsIG8pLCBpID09PSAtMSA/ICh0ID0gZS5zbGljZShvKSwgbyA9IHUpIDogKHQgPSBlLnNsaWNlKG8sIGkgKyAxKSwgbyA9IGkgKyAxKSwgdC5sZW5ndGggJiYgdCAhPT0gYFxuYCAmJiAobCArPSByKSwgbCArPSB0O1xuICByZXR1cm4gbDtcbn1cbmZ1bmN0aW9uIE9lKGUsIG4pIHtcbiAgcmV0dXJuIGBcbmAgKyBGLnJlcGVhdChcIiBcIiwgZS5pbmRlbnQgKiBuKTtcbn1cbmZ1bmN0aW9uIFFpKGUsIG4pIHtcbiAgdmFyIHIsIG8sIGk7XG4gIGZvciAociA9IDAsIG8gPSBlLmltcGxpY2l0VHlwZXMubGVuZ3RoOyByIDwgbzsgciArPSAxKVxuICAgIGlmIChpID0gZS5pbXBsaWNpdFR5cGVzW3JdLCBpLnJlc29sdmUobikpXG4gICAgICByZXR1cm4gITA7XG4gIHJldHVybiAhMTtcbn1cbmZ1bmN0aW9uIGRlKGUpIHtcbiAgcmV0dXJuIGUgPT09IEZpIHx8IGUgPT09IFJpO1xufVxuZnVuY3Rpb24gaWUoZSkge1xuICByZXR1cm4gMzIgPD0gZSAmJiBlIDw9IDEyNiB8fCAxNjEgPD0gZSAmJiBlIDw9IDU1Mjk1ICYmIGUgIT09IDgyMzIgJiYgZSAhPT0gODIzMyB8fCA1NzM0NCA8PSBlICYmIGUgPD0gNjU1MzMgJiYgZSAhPT0gRGUgfHwgNjU1MzYgPD0gZSAmJiBlIDw9IDExMTQxMTE7XG59XG5mdW5jdGlvbiBRZShlKSB7XG4gIHJldHVybiBpZShlKSAmJiBlICE9PSBEZSAmJiBlICE9PSBPaSAmJiBlICE9PSBuZTtcbn1cbmZ1bmN0aW9uIFZlKGUsIG4sIHIpIHtcbiAgdmFyIG8gPSBRZShlKSwgaSA9IG8gJiYgIWRlKGUpO1xuICByZXR1cm4gKFxuICAgIC8vIG5zLXBsYWluLXNhZmVcbiAgICAociA/IChcbiAgICAgIC8vIGMgPSBmbG93LWluXG4gICAgICBvXG4gICAgKSA6IG8gJiYgZSAhPT0gRG4gJiYgZSAhPT0gam4gJiYgZSAhPT0gTW4gJiYgZSAhPT0gQm4gJiYgZSAhPT0gSG4pICYmIGUgIT09IFJlICYmICEobiA9PT0gaGUgJiYgIWkpIHx8IFFlKG4pICYmICFkZShuKSAmJiBlID09PSBSZSB8fCBuID09PSBoZSAmJiBpXG4gICk7XG59XG5mdW5jdGlvbiBWaShlKSB7XG4gIHJldHVybiBpZShlKSAmJiBlICE9PSBEZSAmJiAhZGUoZSkgJiYgZSAhPT0gRGkgJiYgZSAhPT0gQmkgJiYgZSAhPT0gaGUgJiYgZSAhPT0gRG4gJiYgZSAhPT0gam4gJiYgZSAhPT0gTW4gJiYgZSAhPT0gQm4gJiYgZSAhPT0gSG4gJiYgZSAhPT0gUmUgJiYgZSAhPT0gUGkgJiYgZSAhPT0ga2kgJiYgZSAhPT0gVGkgJiYgZSAhPT0gVWkgJiYgZSAhPT0gamkgJiYgZSAhPT0gTWkgJiYgZSAhPT0gSWkgJiYgZSAhPT0gTmkgJiYgZSAhPT0gTGkgJiYgZSAhPT0gSGkgJiYgZSAhPT0gWWk7XG59XG5mdW5jdGlvbiBKaShlKSB7XG4gIHJldHVybiAhZGUoZSkgJiYgZSAhPT0gaGU7XG59XG5mdW5jdGlvbiBaKGUsIG4pIHtcbiAgdmFyIHIgPSBlLmNoYXJDb2RlQXQobiksIG87XG4gIHJldHVybiByID49IDU1Mjk2ICYmIHIgPD0gNTYzMTkgJiYgbiArIDEgPCBlLmxlbmd0aCAmJiAobyA9IGUuY2hhckNvZGVBdChuICsgMSksIG8gPj0gNTYzMjAgJiYgbyA8PSA1NzM0MykgPyAociAtIDU1Mjk2KSAqIDEwMjQgKyBvIC0gNTYzMjAgKyA2NTUzNiA6IHI7XG59XG5mdW5jdGlvbiBZbihlKSB7XG4gIHZhciBuID0gL15cXG4qIC87XG4gIHJldHVybiBuLnRlc3QoZSk7XG59XG52YXIgVW4gPSAxLCBGZSA9IDIsICRuID0gMywgcW4gPSA0LCBLID0gNTtcbmZ1bmN0aW9uIFppKGUsIG4sIHIsIG8sIGksIGwsIHQsIHUpIHtcbiAgdmFyIGEsIGMgPSAwLCBoID0gbnVsbCwgcCA9ICExLCBtID0gITEsIHggPSBvICE9PSAtMSwgdiA9IC0xLCBBID0gVmkoWihlLCAwKSkgJiYgSmkoWihlLCBlLmxlbmd0aCAtIDEpKTtcbiAgaWYgKG4gfHwgdClcbiAgICBmb3IgKGEgPSAwOyBhIDwgZS5sZW5ndGg7IGMgPj0gNjU1MzYgPyBhICs9IDIgOiBhKyspIHtcbiAgICAgIGlmIChjID0gWihlLCBhKSwgIWllKGMpKVxuICAgICAgICByZXR1cm4gSztcbiAgICAgIEEgPSBBICYmIFZlKGMsIGgsIHUpLCBoID0gYztcbiAgICB9XG4gIGVsc2Uge1xuICAgIGZvciAoYSA9IDA7IGEgPCBlLmxlbmd0aDsgYyA+PSA2NTUzNiA/IGEgKz0gMiA6IGErKykge1xuICAgICAgaWYgKGMgPSBaKGUsIGEpLCBjID09PSBuZSlcbiAgICAgICAgcCA9ICEwLCB4ICYmIChtID0gbSB8fCAvLyBGb2xkYWJsZSBsaW5lID0gdG9vIGxvbmcsIGFuZCBub3QgbW9yZS1pbmRlbnRlZC5cbiAgICAgICAgYSAtIHYgLSAxID4gbyAmJiBlW3YgKyAxXSAhPT0gXCIgXCIsIHYgPSBhKTtcbiAgICAgIGVsc2UgaWYgKCFpZShjKSlcbiAgICAgICAgcmV0dXJuIEs7XG4gICAgICBBID0gQSAmJiBWZShjLCBoLCB1KSwgaCA9IGM7XG4gICAgfVxuICAgIG0gPSBtIHx8IHggJiYgYSAtIHYgLSAxID4gbyAmJiBlW3YgKyAxXSAhPT0gXCIgXCI7XG4gIH1cbiAgcmV0dXJuICFwICYmICFtID8gQSAmJiAhdCAmJiAhaShlKSA/IFVuIDogbCA9PT0gcmUgPyBLIDogRmUgOiByID4gOSAmJiBZbihlKSA/IEsgOiB0ID8gbCA9PT0gcmUgPyBLIDogRmUgOiBtID8gcW4gOiAkbjtcbn1cbmZ1bmN0aW9uIFhpKGUsIG4sIHIsIG8sIGkpIHtcbiAgZS5kdW1wID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKG4ubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIGUucXVvdGluZ1R5cGUgPT09IHJlID8gJ1wiXCInIDogXCInJ1wiO1xuICAgIGlmICghZS5ub0NvbXBhdE1vZGUgJiYgKCRpLmluZGV4T2YobikgIT09IC0xIHx8IHFpLnRlc3QobikpKVxuICAgICAgcmV0dXJuIGUucXVvdGluZ1R5cGUgPT09IHJlID8gJ1wiJyArIG4gKyAnXCInIDogXCInXCIgKyBuICsgXCInXCI7XG4gICAgdmFyIGwgPSBlLmluZGVudCAqIE1hdGgubWF4KDEsIHIpLCB0ID0gZS5saW5lV2lkdGggPT09IC0xID8gLTEgOiBNYXRoLm1heChNYXRoLm1pbihlLmxpbmVXaWR0aCwgNDApLCBlLmxpbmVXaWR0aCAtIGwpLCB1ID0gbyB8fCBlLmZsb3dMZXZlbCA+IC0xICYmIHIgPj0gZS5mbG93TGV2ZWw7XG4gICAgZnVuY3Rpb24gYShjKSB7XG4gICAgICByZXR1cm4gUWkoZSwgYyk7XG4gICAgfVxuICAgIHN3aXRjaCAoWmkoXG4gICAgICBuLFxuICAgICAgdSxcbiAgICAgIGUuaW5kZW50LFxuICAgICAgdCxcbiAgICAgIGEsXG4gICAgICBlLnF1b3RpbmdUeXBlLFxuICAgICAgZS5mb3JjZVF1b3RlcyAmJiAhbyxcbiAgICAgIGlcbiAgICApKSB7XG4gICAgICBjYXNlIFVuOlxuICAgICAgICByZXR1cm4gbjtcbiAgICAgIGNhc2UgRmU6XG4gICAgICAgIHJldHVybiBcIidcIiArIG4ucmVwbGFjZSgvJy9nLCBcIicnXCIpICsgXCInXCI7XG4gICAgICBjYXNlICRuOlxuICAgICAgICByZXR1cm4gXCJ8XCIgKyBKZShuLCBlLmluZGVudCkgKyBaZShXZShuLCBsKSk7XG4gICAgICBjYXNlIHFuOlxuICAgICAgICByZXR1cm4gXCI+XCIgKyBKZShuLCBlLmluZGVudCkgKyBaZShXZShlbyhuLCB0KSwgbCkpO1xuICAgICAgY2FzZSBLOlxuICAgICAgICByZXR1cm4gJ1wiJyArIG5vKG4pICsgJ1wiJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBJKFwiaW1wb3NzaWJsZSBlcnJvcjogaW52YWxpZCBzY2FsYXIgc3R5bGVcIik7XG4gICAgfVxuICB9KCk7XG59XG5mdW5jdGlvbiBKZShlLCBuKSB7XG4gIHZhciByID0gWW4oZSkgPyBTdHJpbmcobikgOiBcIlwiLCBvID0gZVtlLmxlbmd0aCAtIDFdID09PSBgXG5gLCBpID0gbyAmJiAoZVtlLmxlbmd0aCAtIDJdID09PSBgXG5gIHx8IGUgPT09IGBcbmApLCBsID0gaSA/IFwiK1wiIDogbyA/IFwiXCIgOiBcIi1cIjtcbiAgcmV0dXJuIHIgKyBsICsgYFxuYDtcbn1cbmZ1bmN0aW9uIFplKGUpIHtcbiAgcmV0dXJuIGVbZS5sZW5ndGggLSAxXSA9PT0gYFxuYCA/IGUuc2xpY2UoMCwgLTEpIDogZTtcbn1cbmZ1bmN0aW9uIGVvKGUsIG4pIHtcbiAgZm9yICh2YXIgciA9IC8oXFxuKykoW15cXG5dKikvZywgbyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjID0gZS5pbmRleE9mKGBcbmApO1xuICAgIHJldHVybiBjID0gYyAhPT0gLTEgPyBjIDogZS5sZW5ndGgsIHIubGFzdEluZGV4ID0gYywgWGUoZS5zbGljZSgwLCBjKSwgbik7XG4gIH0oKSwgaSA9IGVbMF0gPT09IGBcbmAgfHwgZVswXSA9PT0gXCIgXCIsIGwsIHQ7IHQgPSByLmV4ZWMoZSk7ICkge1xuICAgIHZhciB1ID0gdFsxXSwgYSA9IHRbMl07XG4gICAgbCA9IGFbMF0gPT09IFwiIFwiLCBvICs9IHUgKyAoIWkgJiYgIWwgJiYgYSAhPT0gXCJcIiA/IGBcbmAgOiBcIlwiKSArIFhlKGEsIG4pLCBpID0gbDtcbiAgfVxuICByZXR1cm4gbztcbn1cbmZ1bmN0aW9uIFhlKGUsIG4pIHtcbiAgaWYgKGUgPT09IFwiXCIgfHwgZVswXSA9PT0gXCIgXCIpXG4gICAgcmV0dXJuIGU7XG4gIGZvciAodmFyIHIgPSAvIFteIF0vZywgbywgaSA9IDAsIGwsIHQgPSAwLCB1ID0gMCwgYSA9IFwiXCI7IG8gPSByLmV4ZWMoZSk7IClcbiAgICB1ID0gby5pbmRleCwgdSAtIGkgPiBuICYmIChsID0gdCA+IGkgPyB0IDogdSwgYSArPSBgXG5gICsgZS5zbGljZShpLCBsKSwgaSA9IGwgKyAxKSwgdCA9IHU7XG4gIHJldHVybiBhICs9IGBcbmAsIGUubGVuZ3RoIC0gaSA+IG4gJiYgdCA+IGkgPyBhICs9IGUuc2xpY2UoaSwgdCkgKyBgXG5gICsgZS5zbGljZSh0ICsgMSkgOiBhICs9IGUuc2xpY2UoaSksIGEuc2xpY2UoMSk7XG59XG5mdW5jdGlvbiBubyhlKSB7XG4gIGZvciAodmFyIG4gPSBcIlwiLCByID0gMCwgbywgaSA9IDA7IGkgPCBlLmxlbmd0aDsgciA+PSA2NTUzNiA/IGkgKz0gMiA6IGkrKylcbiAgICByID0gWihlLCBpKSwgbyA9IFBbcl0sICFvICYmIGllKHIpID8gKG4gKz0gZVtpXSwgciA+PSA2NTUzNiAmJiAobiArPSBlW2kgKyAxXSkpIDogbiArPSBvIHx8IEdpKHIpO1xuICByZXR1cm4gbjtcbn1cbmZ1bmN0aW9uIHJvKGUsIG4sIHIpIHtcbiAgdmFyIG8gPSBcIlwiLCBpID0gZS50YWcsIGwsIHQsIHU7XG4gIGZvciAobCA9IDAsIHQgPSByLmxlbmd0aDsgbCA8IHQ7IGwgKz0gMSlcbiAgICB1ID0gcltsXSwgZS5yZXBsYWNlciAmJiAodSA9IGUucmVwbGFjZXIuY2FsbChyLCBTdHJpbmcobCksIHUpKSwgKEgoZSwgbiwgdSwgITEsICExKSB8fCB0eXBlb2YgdSA+IFwidVwiICYmIEgoZSwgbiwgbnVsbCwgITEsICExKSkgJiYgKG8gIT09IFwiXCIgJiYgKG8gKz0gXCIsXCIgKyAoZS5jb25kZW5zZUZsb3cgPyBcIlwiIDogXCIgXCIpKSwgbyArPSBlLmR1bXApO1xuICBlLnRhZyA9IGksIGUuZHVtcCA9IFwiW1wiICsgbyArIFwiXVwiO1xufVxuZnVuY3Rpb24gZW4oZSwgbiwgciwgbykge1xuICB2YXIgaSA9IFwiXCIsIGwgPSBlLnRhZywgdCwgdSwgYTtcbiAgZm9yICh0ID0gMCwgdSA9IHIubGVuZ3RoOyB0IDwgdTsgdCArPSAxKVxuICAgIGEgPSByW3RdLCBlLnJlcGxhY2VyICYmIChhID0gZS5yZXBsYWNlci5jYWxsKHIsIFN0cmluZyh0KSwgYSkpLCAoSChlLCBuICsgMSwgYSwgITAsICEwLCAhMSwgITApIHx8IHR5cGVvZiBhID4gXCJ1XCIgJiYgSChlLCBuICsgMSwgbnVsbCwgITAsICEwLCAhMSwgITApKSAmJiAoKCFvIHx8IGkgIT09IFwiXCIpICYmIChpICs9IE9lKGUsIG4pKSwgZS5kdW1wICYmIG5lID09PSBlLmR1bXAuY2hhckNvZGVBdCgwKSA/IGkgKz0gXCItXCIgOiBpICs9IFwiLSBcIiwgaSArPSBlLmR1bXApO1xuICBlLnRhZyA9IGwsIGUuZHVtcCA9IGkgfHwgXCJbXVwiO1xufVxuZnVuY3Rpb24gaW8oZSwgbiwgcikge1xuICB2YXIgbyA9IFwiXCIsIGkgPSBlLnRhZywgbCA9IE9iamVjdC5rZXlzKHIpLCB0LCB1LCBhLCBjLCBoO1xuICBmb3IgKHQgPSAwLCB1ID0gbC5sZW5ndGg7IHQgPCB1OyB0ICs9IDEpXG4gICAgaCA9IFwiXCIsIG8gIT09IFwiXCIgJiYgKGggKz0gXCIsIFwiKSwgZS5jb25kZW5zZUZsb3cgJiYgKGggKz0gJ1wiJyksIGEgPSBsW3RdLCBjID0gclthXSwgZS5yZXBsYWNlciAmJiAoYyA9IGUucmVwbGFjZXIuY2FsbChyLCBhLCBjKSksIEgoZSwgbiwgYSwgITEsICExKSAmJiAoZS5kdW1wLmxlbmd0aCA+IDEwMjQgJiYgKGggKz0gXCI/IFwiKSwgaCArPSBlLmR1bXAgKyAoZS5jb25kZW5zZUZsb3cgPyAnXCInIDogXCJcIikgKyBcIjpcIiArIChlLmNvbmRlbnNlRmxvdyA/IFwiXCIgOiBcIiBcIiksIEgoZSwgbiwgYywgITEsICExKSAmJiAoaCArPSBlLmR1bXAsIG8gKz0gaCkpO1xuICBlLnRhZyA9IGksIGUuZHVtcCA9IFwie1wiICsgbyArIFwifVwiO1xufVxuZnVuY3Rpb24gb28oZSwgbiwgciwgbykge1xuICB2YXIgaSA9IFwiXCIsIGwgPSBlLnRhZywgdCA9IE9iamVjdC5rZXlzKHIpLCB1LCBhLCBjLCBoLCBwLCBtO1xuICBpZiAoZS5zb3J0S2V5cyA9PT0gITApXG4gICAgdC5zb3J0KCk7XG4gIGVsc2UgaWYgKHR5cGVvZiBlLnNvcnRLZXlzID09IFwiZnVuY3Rpb25cIilcbiAgICB0LnNvcnQoZS5zb3J0S2V5cyk7XG4gIGVsc2UgaWYgKGUuc29ydEtleXMpXG4gICAgdGhyb3cgbmV3IEkoXCJzb3J0S2V5cyBtdXN0IGJlIGEgYm9vbGVhbiBvciBhIGZ1bmN0aW9uXCIpO1xuICBmb3IgKHUgPSAwLCBhID0gdC5sZW5ndGg7IHUgPCBhOyB1ICs9IDEpXG4gICAgbSA9IFwiXCIsICghbyB8fCBpICE9PSBcIlwiKSAmJiAobSArPSBPZShlLCBuKSksIGMgPSB0W3VdLCBoID0gcltjXSwgZS5yZXBsYWNlciAmJiAoaCA9IGUucmVwbGFjZXIuY2FsbChyLCBjLCBoKSksIEgoZSwgbiArIDEsIGMsICEwLCAhMCwgITApICYmIChwID0gZS50YWcgIT09IG51bGwgJiYgZS50YWcgIT09IFwiP1wiIHx8IGUuZHVtcCAmJiBlLmR1bXAubGVuZ3RoID4gMTAyNCwgcCAmJiAoZS5kdW1wICYmIG5lID09PSBlLmR1bXAuY2hhckNvZGVBdCgwKSA/IG0gKz0gXCI/XCIgOiBtICs9IFwiPyBcIiksIG0gKz0gZS5kdW1wLCBwICYmIChtICs9IE9lKGUsIG4pKSwgSChlLCBuICsgMSwgaCwgITAsIHApICYmIChlLmR1bXAgJiYgbmUgPT09IGUuZHVtcC5jaGFyQ29kZUF0KDApID8gbSArPSBcIjpcIiA6IG0gKz0gXCI6IFwiLCBtICs9IGUuZHVtcCwgaSArPSBtKSk7XG4gIGUudGFnID0gbCwgZS5kdW1wID0gaSB8fCBcInt9XCI7XG59XG5mdW5jdGlvbiBubihlLCBuLCByKSB7XG4gIHZhciBvLCBpLCBsLCB0LCB1LCBhO1xuICBmb3IgKGkgPSByID8gZS5leHBsaWNpdFR5cGVzIDogZS5pbXBsaWNpdFR5cGVzLCBsID0gMCwgdCA9IGkubGVuZ3RoOyBsIDwgdDsgbCArPSAxKVxuICAgIGlmICh1ID0gaVtsXSwgKHUuaW5zdGFuY2VPZiB8fCB1LnByZWRpY2F0ZSkgJiYgKCF1Lmluc3RhbmNlT2YgfHwgdHlwZW9mIG4gPT0gXCJvYmplY3RcIiAmJiBuIGluc3RhbmNlb2YgdS5pbnN0YW5jZU9mKSAmJiAoIXUucHJlZGljYXRlIHx8IHUucHJlZGljYXRlKG4pKSkge1xuICAgICAgaWYgKHIgPyB1Lm11bHRpICYmIHUucmVwcmVzZW50TmFtZSA/IGUudGFnID0gdS5yZXByZXNlbnROYW1lKG4pIDogZS50YWcgPSB1LnRhZyA6IGUudGFnID0gXCI/XCIsIHUucmVwcmVzZW50KSB7XG4gICAgICAgIGlmIChhID0gZS5zdHlsZU1hcFt1LnRhZ10gfHwgdS5kZWZhdWx0U3R5bGUsIEluLmNhbGwodS5yZXByZXNlbnQpID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCIpXG4gICAgICAgICAgbyA9IHUucmVwcmVzZW50KG4sIGEpO1xuICAgICAgICBlbHNlIGlmIChrbi5jYWxsKHUucmVwcmVzZW50LCBhKSlcbiAgICAgICAgICBvID0gdS5yZXByZXNlbnRbYV0obiwgYSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgSShcIiE8XCIgKyB1LnRhZyArICc+IHRhZyByZXNvbHZlciBhY2NlcHRzIG5vdCBcIicgKyBhICsgJ1wiIHN0eWxlJyk7XG4gICAgICAgIGUuZHVtcCA9IG87XG4gICAgICB9XG4gICAgICByZXR1cm4gITA7XG4gICAgfVxuICByZXR1cm4gITE7XG59XG5mdW5jdGlvbiBIKGUsIG4sIHIsIG8sIGksIGwsIHQpIHtcbiAgZS50YWcgPSBudWxsLCBlLmR1bXAgPSByLCBubihlLCByLCAhMSkgfHwgbm4oZSwgciwgITApO1xuICB2YXIgdSA9IEluLmNhbGwoZS5kdW1wKSwgYSA9IG8sIGM7XG4gIG8gJiYgKG8gPSBlLmZsb3dMZXZlbCA8IDAgfHwgZS5mbG93TGV2ZWwgPiBuKTtcbiAgdmFyIGggPSB1ID09PSBcIltvYmplY3QgT2JqZWN0XVwiIHx8IHUgPT09IFwiW29iamVjdCBBcnJheV1cIiwgcCwgbTtcbiAgaWYgKGggJiYgKHAgPSBlLmR1cGxpY2F0ZXMuaW5kZXhPZihyKSwgbSA9IHAgIT09IC0xKSwgKGUudGFnICE9PSBudWxsICYmIGUudGFnICE9PSBcIj9cIiB8fCBtIHx8IGUuaW5kZW50ICE9PSAyICYmIG4gPiAwKSAmJiAoaSA9ICExKSwgbSAmJiBlLnVzZWREdXBsaWNhdGVzW3BdKVxuICAgIGUuZHVtcCA9IFwiKnJlZl9cIiArIHA7XG4gIGVsc2Uge1xuICAgIGlmIChoICYmIG0gJiYgIWUudXNlZER1cGxpY2F0ZXNbcF0gJiYgKGUudXNlZER1cGxpY2F0ZXNbcF0gPSAhMCksIHUgPT09IFwiW29iamVjdCBPYmplY3RdXCIpXG4gICAgICBvICYmIE9iamVjdC5rZXlzKGUuZHVtcCkubGVuZ3RoICE9PSAwID8gKG9vKGUsIG4sIGUuZHVtcCwgaSksIG0gJiYgKGUuZHVtcCA9IFwiJnJlZl9cIiArIHAgKyBlLmR1bXApKSA6IChpbyhlLCBuLCBlLmR1bXApLCBtICYmIChlLmR1bXAgPSBcIiZyZWZfXCIgKyBwICsgXCIgXCIgKyBlLmR1bXApKTtcbiAgICBlbHNlIGlmICh1ID09PSBcIltvYmplY3QgQXJyYXldXCIpXG4gICAgICBvICYmIGUuZHVtcC5sZW5ndGggIT09IDAgPyAoZS5ub0FycmF5SW5kZW50ICYmICF0ICYmIG4gPiAwID8gZW4oZSwgbiAtIDEsIGUuZHVtcCwgaSkgOiBlbihlLCBuLCBlLmR1bXAsIGkpLCBtICYmIChlLmR1bXAgPSBcIiZyZWZfXCIgKyBwICsgZS5kdW1wKSkgOiAocm8oZSwgbiwgZS5kdW1wKSwgbSAmJiAoZS5kdW1wID0gXCImcmVmX1wiICsgcCArIFwiIFwiICsgZS5kdW1wKSk7XG4gICAgZWxzZSBpZiAodSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIilcbiAgICAgIGUudGFnICE9PSBcIj9cIiAmJiBYaShlLCBlLmR1bXAsIG4sIGwsIGEpO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKHUgPT09IFwiW29iamVjdCBVbmRlZmluZWRdXCIpXG4gICAgICAgIHJldHVybiAhMTtcbiAgICAgIGlmIChlLnNraXBJbnZhbGlkKVxuICAgICAgICByZXR1cm4gITE7XG4gICAgICB0aHJvdyBuZXcgSShcInVuYWNjZXB0YWJsZSBraW5kIG9mIGFuIG9iamVjdCB0byBkdW1wIFwiICsgdSk7XG4gICAgfVxuICAgIGUudGFnICE9PSBudWxsICYmIGUudGFnICE9PSBcIj9cIiAmJiAoYyA9IGVuY29kZVVSSShcbiAgICAgIGUudGFnWzBdID09PSBcIiFcIiA/IGUudGFnLnNsaWNlKDEpIDogZS50YWdcbiAgICApLnJlcGxhY2UoLyEvZywgXCIlMjFcIiksIGUudGFnWzBdID09PSBcIiFcIiA/IGMgPSBcIiFcIiArIGMgOiBjLnNsaWNlKDAsIDE4KSA9PT0gXCJ0YWc6eWFtbC5vcmcsMjAwMjpcIiA/IGMgPSBcIiEhXCIgKyBjLnNsaWNlKDE4KSA6IGMgPSBcIiE8XCIgKyBjICsgXCI+XCIsIGUuZHVtcCA9IGMgKyBcIiBcIiArIGUuZHVtcCk7XG4gIH1cbiAgcmV0dXJuICEwO1xufVxuZnVuY3Rpb24gdG8oZSwgbikge1xuICB2YXIgciA9IFtdLCBvID0gW10sIGksIGw7XG4gIGZvciAoVGUoZSwgciwgbyksIGkgPSAwLCBsID0gby5sZW5ndGg7IGkgPCBsOyBpICs9IDEpXG4gICAgbi5kdXBsaWNhdGVzLnB1c2gocltvW2ldXSk7XG4gIG4udXNlZER1cGxpY2F0ZXMgPSBuZXcgQXJyYXkobCk7XG59XG5mdW5jdGlvbiBUZShlLCBuLCByKSB7XG4gIHZhciBvLCBpLCBsO1xuICBpZiAoZSAhPT0gbnVsbCAmJiB0eXBlb2YgZSA9PSBcIm9iamVjdFwiKVxuICAgIGlmIChpID0gbi5pbmRleE9mKGUpLCBpICE9PSAtMSlcbiAgICAgIHIuaW5kZXhPZihpKSA9PT0gLTEgJiYgci5wdXNoKGkpO1xuICAgIGVsc2UgaWYgKG4ucHVzaChlKSwgQXJyYXkuaXNBcnJheShlKSlcbiAgICAgIGZvciAoaSA9IDAsIGwgPSBlLmxlbmd0aDsgaSA8IGw7IGkgKz0gMSlcbiAgICAgICAgVGUoZVtpXSwgbiwgcik7XG4gICAgZWxzZVxuICAgICAgZm9yIChvID0gT2JqZWN0LmtleXMoZSksIGkgPSAwLCBsID0gby5sZW5ndGg7IGkgPCBsOyBpICs9IDEpXG4gICAgICAgIFRlKGVbb1tpXV0sIG4sIHIpO1xufVxuZnVuY3Rpb24gbG8oZSwgbikge1xuICBuID0gbiB8fCB7fTtcbiAgdmFyIHIgPSBuZXcgV2kobik7XG4gIHIubm9SZWZzIHx8IHRvKGUsIHIpO1xuICB2YXIgbyA9IGU7XG4gIHJldHVybiByLnJlcGxhY2VyICYmIChvID0gci5yZXBsYWNlci5jYWxsKHsgXCJcIjogbyB9LCBcIlwiLCBvKSksIEgociwgMCwgbywgITAsICEwKSA/IHIuZHVtcCArIGBcbmAgOiBcIlwiO1xufVxudmFyIHVvID0gbG8sIGFvID0ge1xuICBkdW1wOiB1b1xufTtcbmZ1bmN0aW9uIGplKGUsIG4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkZ1bmN0aW9uIHlhbWwuXCIgKyBlICsgXCIgaXMgcmVtb3ZlZCBpbiBqcy15YW1sIDQuIFVzZSB5YW1sLlwiICsgbiArIFwiIGluc3RlYWQsIHdoaWNoIGlzIG5vdyBzYWZlIGJ5IGRlZmF1bHQuXCIpO1xuICB9O1xufVxudmFyIGZvID0gTiwgY28gPSBsbiwgc28gPSBjbiwgcG8gPSBtbiwgaG8gPSBnbiwgbW8gPSBQZSwgZ28gPSBQbi5sb2FkLCB4byA9IFBuLmxvYWRBbGwsIHZvID0gYW8uZHVtcCwgeW8gPSBJLCBBbyA9IHtcbiAgYmluYXJ5OiBibixcbiAgZmxvYXQ6IGRuLFxuICBtYXA6IGZuLFxuICBudWxsOiBzbixcbiAgcGFpcnM6IFNuLFxuICBzZXQ6IENuLFxuICB0aW1lc3RhbXA6IHluLFxuICBib29sOiBwbixcbiAgaW50OiBobixcbiAgbWVyZ2U6IEFuLFxuICBvbWFwOiB3bixcbiAgc2VxOiBhbixcbiAgc3RyOiB1blxufSwgYm8gPSBqZShcInNhZmVMb2FkXCIsIFwibG9hZFwiKSwgd28gPSBqZShcInNhZmVMb2FkQWxsXCIsIFwibG9hZEFsbFwiKSwgU28gPSBqZShcInNhZmVEdW1wXCIsIFwiZHVtcFwiKSwgem4gPSB7XG4gIFR5cGU6IGZvLFxuICBTY2hlbWE6IGNvLFxuICBGQUlMU0FGRV9TQ0hFTUE6IHNvLFxuICBKU09OX1NDSEVNQTogcG8sXG4gIENPUkVfU0NIRU1BOiBobyxcbiAgREVGQVVMVF9TQ0hFTUE6IG1vLFxuICBsb2FkOiBnbyxcbiAgbG9hZEFsbDogeG8sXG4gIGR1bXA6IHZvLFxuICBZQU1MRXhjZXB0aW9uOiB5byxcbiAgdHlwZXM6IEFvLFxuICBzYWZlTG9hZDogYm8sXG4gIHNhZmVMb2FkQWxsOiB3byxcbiAgc2FmZUR1bXA6IFNvXG59LCBDbyA9IHR5cGVvZiBnbG9iYWxUaGlzIDwgXCJ1XCIgPyBnbG9iYWxUaGlzIDogdHlwZW9mIHdpbmRvdyA8IFwidVwiID8gd2luZG93IDogdHlwZW9mIGdsb2JhbCA8IFwidVwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgPCBcInVcIiA/IHNlbGYgOiB7fTtcbmZ1bmN0aW9uIF9vKGUpIHtcbiAgcmV0dXJuIGUgJiYgZS5fX2VzTW9kdWxlICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlLCBcImRlZmF1bHRcIikgPyBlLmRlZmF1bHQgOiBlO1xufVxudmFyIG9lID0geyBleHBvcnRzOiB7fSB9LCBHbiA9IHt9LCBFbyA9IGZ1bmN0aW9uKG4pIHtcbiAgcmV0dXJuIG4gJiYgdHlwZW9mIG4gPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygbi5jb3B5ID09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2Ygbi5maWxsID09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2Ygbi5yZWFkVUludDggPT0gXCJmdW5jdGlvblwiO1xufSwgTmUgPSB7IGV4cG9ydHM6IHt9IH07XG50eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PSBcImZ1bmN0aW9uXCIgPyBOZS5leHBvcnRzID0gZnVuY3Rpb24obiwgcikge1xuICBuLnN1cGVyXyA9IHIsIG4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShyLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogbixcbiAgICAgIGVudW1lcmFibGU6ICExLFxuICAgICAgd3JpdGFibGU6ICEwLFxuICAgICAgY29uZmlndXJhYmxlOiAhMFxuICAgIH1cbiAgfSk7XG59IDogTmUuZXhwb3J0cyA9IGZ1bmN0aW9uKG4sIHIpIHtcbiAgbi5zdXBlcl8gPSByO1xuICB2YXIgbyA9IGZ1bmN0aW9uKCkge1xuICB9O1xuICBvLnByb3RvdHlwZSA9IHIucHJvdG90eXBlLCBuLnByb3RvdHlwZSA9IG5ldyBvKCksIG4ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbjtcbn07XG52YXIgUm8gPSBOZS5leHBvcnRzO1xuKGZ1bmN0aW9uKGUpIHtcbiAgdmFyIG4gPSAvJVtzZGolXS9nO1xuICBlLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgICBpZiAoIXRlKGYpKSB7XG4gICAgICBmb3IgKHZhciBzID0gW10sIGQgPSAwOyBkIDwgYXJndW1lbnRzLmxlbmd0aDsgZCsrKVxuICAgICAgICBzLnB1c2goaShhcmd1bWVudHNbZF0pKTtcbiAgICAgIHJldHVybiBzLmpvaW4oXCIgXCIpO1xuICAgIH1cbiAgICBmb3IgKHZhciBkID0gMSwgUyA9IGFyZ3VtZW50cywgTCA9IFMubGVuZ3RoLCBDID0gU3RyaW5nKGYpLnJlcGxhY2UobiwgZnVuY3Rpb24oXykge1xuICAgICAgaWYgKF8gPT09IFwiJSVcIilcbiAgICAgICAgcmV0dXJuIFwiJVwiO1xuICAgICAgaWYgKGQgPj0gTClcbiAgICAgICAgcmV0dXJuIF87XG4gICAgICBzd2l0Y2ggKF8pIHtcbiAgICAgICAgY2FzZSBcIiVzXCI6XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyhTW2QrK10pO1xuICAgICAgICBjYXNlIFwiJWRcIjpcbiAgICAgICAgICByZXR1cm4gTnVtYmVyKFNbZCsrXSk7XG4gICAgICAgIGNhc2UgXCIlalwiOlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoU1tkKytdKTtcbiAgICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiBcIltDaXJjdWxhcl1cIjtcbiAgICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIF87XG4gICAgICB9XG4gICAgfSksIHcgPSBTW2RdOyBkIDwgTDsgdyA9IFNbKytkXSlcbiAgICAgIGIodykgfHwgIXoodykgPyBDICs9IFwiIFwiICsgdyA6IEMgKz0gXCIgXCIgKyBpKHcpO1xuICAgIHJldHVybiBDO1xuICB9LCBlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGYsIHMpIHtcbiAgICBpZiAoQihDby5wcm9jZXNzKSlcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGUuZGVwcmVjYXRlKGYsIHMpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09ICEwKVxuICAgICAgcmV0dXJuIGY7XG4gICAgdmFyIGQgPSAhMTtcbiAgICBmdW5jdGlvbiBTKCkge1xuICAgICAgaWYgKCFkKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHMpO1xuICAgICAgICBwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24gPyBjb25zb2xlLnRyYWNlKHMpIDogY29uc29sZS5lcnJvcihzKSwgZCA9ICEwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGYuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIFM7XG4gIH07XG4gIHZhciByID0ge30sIG87XG4gIGUuZGVidWdsb2cgPSBmdW5jdGlvbihmKSB7XG4gICAgaWYgKEIobykgJiYgKG8gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8IFwiXCIpLCBmID0gZi50b1VwcGVyQ2FzZSgpLCAhcltmXSlcbiAgICAgIGlmIChuZXcgUmVnRXhwKFwiXFxcXGJcIiArIGYgKyBcIlxcXFxiXCIsIFwiaVwiKS50ZXN0KG8pKSB7XG4gICAgICAgIHZhciBzID0gcHJvY2Vzcy5waWQ7XG4gICAgICAgIHJbZl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgZCA9IGUuZm9ybWF0LmFwcGx5KGUsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIiVzICVkOiAlc1wiLCBmLCBzLCBkKTtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZVxuICAgICAgICByW2ZdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIH07XG4gICAgcmV0dXJuIHJbZl07XG4gIH07XG4gIGZ1bmN0aW9uIGkoZiwgcykge1xuICAgIHZhciBkID0ge1xuICAgICAgc2VlbjogW10sXG4gICAgICBzdHlsaXplOiB0XG4gICAgfTtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+PSAzICYmIChkLmRlcHRoID0gYXJndW1lbnRzWzJdKSwgYXJndW1lbnRzLmxlbmd0aCA+PSA0ICYmIChkLmNvbG9ycyA9IGFyZ3VtZW50c1szXSksIEEocykgPyBkLnNob3dIaWRkZW4gPSBzIDogcyAmJiBlLl9leHRlbmQoZCwgcyksIEIoZC5zaG93SGlkZGVuKSAmJiAoZC5zaG93SGlkZGVuID0gITEpLCBCKGQuZGVwdGgpICYmIChkLmRlcHRoID0gMiksIEIoZC5jb2xvcnMpICYmIChkLmNvbG9ycyA9ICExKSwgQihkLmN1c3RvbUluc3BlY3QpICYmIChkLmN1c3RvbUluc3BlY3QgPSAhMCksIGQuY29sb3JzICYmIChkLnN0eWxpemUgPSBsKSwgYShkLCBmLCBkLmRlcHRoKTtcbiAgfVxuICBlLmluc3BlY3QgPSBpLCBpLmNvbG9ycyA9IHtcbiAgICBib2xkOiBbMSwgMjJdLFxuICAgIGl0YWxpYzogWzMsIDIzXSxcbiAgICB1bmRlcmxpbmU6IFs0LCAyNF0sXG4gICAgaW52ZXJzZTogWzcsIDI3XSxcbiAgICB3aGl0ZTogWzM3LCAzOV0sXG4gICAgZ3JleTogWzkwLCAzOV0sXG4gICAgYmxhY2s6IFszMCwgMzldLFxuICAgIGJsdWU6IFszNCwgMzldLFxuICAgIGN5YW46IFszNiwgMzldLFxuICAgIGdyZWVuOiBbMzIsIDM5XSxcbiAgICBtYWdlbnRhOiBbMzUsIDM5XSxcbiAgICByZWQ6IFszMSwgMzldLFxuICAgIHllbGxvdzogWzMzLCAzOV1cbiAgfSwgaS5zdHlsZXMgPSB7XG4gICAgc3BlY2lhbDogXCJjeWFuXCIsXG4gICAgbnVtYmVyOiBcInllbGxvd1wiLFxuICAgIGJvb2xlYW46IFwieWVsbG93XCIsXG4gICAgdW5kZWZpbmVkOiBcImdyZXlcIixcbiAgICBudWxsOiBcImJvbGRcIixcbiAgICBzdHJpbmc6IFwiZ3JlZW5cIixcbiAgICBkYXRlOiBcIm1hZ2VudGFcIixcbiAgICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAgIHJlZ2V4cDogXCJyZWRcIlxuICB9O1xuICBmdW5jdGlvbiBsKGYsIHMpIHtcbiAgICB2YXIgZCA9IGkuc3R5bGVzW3NdO1xuICAgIHJldHVybiBkID8gXCJcXHgxQltcIiArIGkuY29sb3JzW2RdWzBdICsgXCJtXCIgKyBmICsgXCJcXHgxQltcIiArIGkuY29sb3JzW2RdWzFdICsgXCJtXCIgOiBmO1xuICB9XG4gIGZ1bmN0aW9uIHQoZiwgcykge1xuICAgIHJldHVybiBmO1xuICB9XG4gIGZ1bmN0aW9uIHUoZikge1xuICAgIHZhciBzID0ge307XG4gICAgcmV0dXJuIGYuZm9yRWFjaChmdW5jdGlvbihkLCBTKSB7XG4gICAgICBzW2RdID0gITA7XG4gICAgfSksIHM7XG4gIH1cbiAgZnVuY3Rpb24gYShmLCBzLCBkKSB7XG4gICAgaWYgKGYuY3VzdG9tSW5zcGVjdCAmJiBzICYmIGFlKHMuaW5zcGVjdCkgJiYgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgcy5pbnNwZWN0ICE9PSBlLmluc3BlY3QgJiYgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgIShzLmNvbnN0cnVjdG9yICYmIHMuY29uc3RydWN0b3IucHJvdG90eXBlID09PSBzKSkge1xuICAgICAgdmFyIFMgPSBzLmluc3BlY3QoZCwgZik7XG4gICAgICByZXR1cm4gdGUoUykgfHwgKFMgPSBhKGYsIFMsIGQpKSwgUztcbiAgICB9XG4gICAgdmFyIEwgPSBjKGYsIHMpO1xuICAgIGlmIChMKVxuICAgICAgcmV0dXJuIEw7XG4gICAgdmFyIEMgPSBPYmplY3Qua2V5cyhzKSwgdyA9IHUoQyk7XG4gICAgaWYgKGYuc2hvd0hpZGRlbiAmJiAoQyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHMpKSwgdWUocykgJiYgKEMuaW5kZXhPZihcIm1lc3NhZ2VcIikgPj0gMCB8fCBDLmluZGV4T2YoXCJkZXNjcmlwdGlvblwiKSA+PSAwKSlcbiAgICAgIHJldHVybiBoKHMpO1xuICAgIGlmIChDLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKGFlKHMpKSB7XG4gICAgICAgIHZhciBfID0gcy5uYW1lID8gXCI6IFwiICsgcy5uYW1lIDogXCJcIjtcbiAgICAgICAgcmV0dXJuIGYuc3R5bGl6ZShcIltGdW5jdGlvblwiICsgXyArIFwiXVwiLCBcInNwZWNpYWxcIik7XG4gICAgICB9XG4gICAgICBpZiAobGUocykpXG4gICAgICAgIHJldHVybiBmLnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHMpLCBcInJlZ2V4cFwiKTtcbiAgICAgIGlmICh5ZShzKSlcbiAgICAgICAgcmV0dXJuIGYuc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHMpLCBcImRhdGVcIik7XG4gICAgICBpZiAodWUocykpXG4gICAgICAgIHJldHVybiBoKHMpO1xuICAgIH1cbiAgICB2YXIgVCA9IFwiXCIsIFkgPSAhMSwgZmUgPSBbXCJ7XCIsIFwifVwiXTtcbiAgICBpZiAodihzKSAmJiAoWSA9ICEwLCBmZSA9IFtcIltcIiwgXCJdXCJdKSwgYWUocykpIHtcbiAgICAgIHZhciBlciA9IHMubmFtZSA/IFwiOiBcIiArIHMubmFtZSA6IFwiXCI7XG4gICAgICBUID0gXCIgW0Z1bmN0aW9uXCIgKyBlciArIFwiXVwiO1xuICAgIH1cbiAgICBpZiAobGUocykgJiYgKFQgPSBcIiBcIiArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzKSksIHllKHMpICYmIChUID0gXCIgXCIgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHMpKSwgdWUocykgJiYgKFQgPSBcIiBcIiArIGgocykpLCBDLmxlbmd0aCA9PT0gMCAmJiAoIVkgfHwgcy5sZW5ndGggPT0gMCkpXG4gICAgICByZXR1cm4gZmVbMF0gKyBUICsgZmVbMV07XG4gICAgaWYgKGQgPCAwKVxuICAgICAgcmV0dXJuIGxlKHMpID8gZi5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzKSwgXCJyZWdleHBcIikgOiBmLnN0eWxpemUoXCJbT2JqZWN0XVwiLCBcInNwZWNpYWxcIik7XG4gICAgZi5zZWVuLnB1c2gocyk7XG4gICAgdmFyIHdlO1xuICAgIHJldHVybiBZID8gd2UgPSBwKGYsIHMsIGQsIHcsIEMpIDogd2UgPSBDLm1hcChmdW5jdGlvbihucikge1xuICAgICAgcmV0dXJuIG0oZiwgcywgZCwgdywgbnIsIFkpO1xuICAgIH0pLCBmLnNlZW4ucG9wKCksIHgod2UsIFQsIGZlKTtcbiAgfVxuICBmdW5jdGlvbiBjKGYsIHMpIHtcbiAgICBpZiAoQihzKSlcbiAgICAgIHJldHVybiBmLnN0eWxpemUoXCJ1bmRlZmluZWRcIiwgXCJ1bmRlZmluZWRcIik7XG4gICAgaWYgKHRlKHMpKSB7XG4gICAgICB2YXIgZCA9IFwiJ1wiICsgSlNPTi5zdHJpbmdpZnkocykucmVwbGFjZSgvXlwifFwiJC9nLCBcIlwiKS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIikucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgXCInXCI7XG4gICAgICByZXR1cm4gZi5zdHlsaXplKGQsIFwic3RyaW5nXCIpO1xuICAgIH1cbiAgICBpZiAoeShzKSlcbiAgICAgIHJldHVybiBmLnN0eWxpemUoXCJcIiArIHMsIFwibnVtYmVyXCIpO1xuICAgIGlmIChBKHMpKVxuICAgICAgcmV0dXJuIGYuc3R5bGl6ZShcIlwiICsgcywgXCJib29sZWFuXCIpO1xuICAgIGlmIChiKHMpKVxuICAgICAgcmV0dXJuIGYuc3R5bGl6ZShcIm51bGxcIiwgXCJudWxsXCIpO1xuICB9XG4gIGZ1bmN0aW9uIGgoZikge1xuICAgIHJldHVybiBcIltcIiArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGYpICsgXCJdXCI7XG4gIH1cbiAgZnVuY3Rpb24gcChmLCBzLCBkLCBTLCBMKSB7XG4gICAgZm9yICh2YXIgQyA9IFtdLCB3ID0gMCwgXyA9IHMubGVuZ3RoOyB3IDwgXzsgKyt3KVxuICAgICAgQmUocywgU3RyaW5nKHcpKSA/IEMucHVzaChtKFxuICAgICAgICBmLFxuICAgICAgICBzLFxuICAgICAgICBkLFxuICAgICAgICBTLFxuICAgICAgICBTdHJpbmcodyksXG4gICAgICAgICEwXG4gICAgICApKSA6IEMucHVzaChcIlwiKTtcbiAgICByZXR1cm4gTC5mb3JFYWNoKGZ1bmN0aW9uKFQpIHtcbiAgICAgIFQubWF0Y2goL15cXGQrJC8pIHx8IEMucHVzaChtKFxuICAgICAgICBmLFxuICAgICAgICBzLFxuICAgICAgICBkLFxuICAgICAgICBTLFxuICAgICAgICBULFxuICAgICAgICAhMFxuICAgICAgKSk7XG4gICAgfSksIEM7XG4gIH1cbiAgZnVuY3Rpb24gbShmLCBzLCBkLCBTLCBMLCBDKSB7XG4gICAgdmFyIHcsIF8sIFQ7XG4gICAgaWYgKFQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHMsIEwpIHx8IHsgdmFsdWU6IHNbTF0gfSwgVC5nZXQgPyBULnNldCA/IF8gPSBmLnN0eWxpemUoXCJbR2V0dGVyL1NldHRlcl1cIiwgXCJzcGVjaWFsXCIpIDogXyA9IGYuc3R5bGl6ZShcIltHZXR0ZXJdXCIsIFwic3BlY2lhbFwiKSA6IFQuc2V0ICYmIChfID0gZi5zdHlsaXplKFwiW1NldHRlcl1cIiwgXCJzcGVjaWFsXCIpKSwgQmUoUywgTCkgfHwgKHcgPSBcIltcIiArIEwgKyBcIl1cIiksIF8gfHwgKGYuc2Vlbi5pbmRleE9mKFQudmFsdWUpIDwgMCA/IChiKGQpID8gXyA9IGEoZiwgVC52YWx1ZSwgbnVsbCkgOiBfID0gYShmLCBULnZhbHVlLCBkIC0gMSksIF8uaW5kZXhPZihgXG5gKSA+IC0xICYmIChDID8gXyA9IF8uc3BsaXQoYFxuYCkubWFwKGZ1bmN0aW9uKFkpIHtcbiAgICAgIHJldHVybiBcIiAgXCIgKyBZO1xuICAgIH0pLmpvaW4oYFxuYCkuc3Vic3RyKDIpIDogXyA9IGBcbmAgKyBfLnNwbGl0KGBcbmApLm1hcChmdW5jdGlvbihZKSB7XG4gICAgICByZXR1cm4gXCIgICBcIiArIFk7XG4gICAgfSkuam9pbihgXG5gKSkpIDogXyA9IGYuc3R5bGl6ZShcIltDaXJjdWxhcl1cIiwgXCJzcGVjaWFsXCIpKSwgQih3KSkge1xuICAgICAgaWYgKEMgJiYgTC5tYXRjaCgvXlxcZCskLykpXG4gICAgICAgIHJldHVybiBfO1xuICAgICAgdyA9IEpTT04uc3RyaW5naWZ5KFwiXCIgKyBMKSwgdy5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykgPyAodyA9IHcuc3Vic3RyKDEsIHcubGVuZ3RoIC0gMiksIHcgPSBmLnN0eWxpemUodywgXCJuYW1lXCIpKSA6ICh3ID0gdy5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIikucmVwbGFjZSgvXFxcXFwiL2csICdcIicpLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIiksIHcgPSBmLnN0eWxpemUodywgXCJzdHJpbmdcIikpO1xuICAgIH1cbiAgICByZXR1cm4gdyArIFwiOiBcIiArIF87XG4gIH1cbiAgZnVuY3Rpb24geChmLCBzLCBkKSB7XG4gICAgdmFyIFMgPSBmLnJlZHVjZShmdW5jdGlvbihMLCBDKSB7XG4gICAgICByZXR1cm4gQy5pbmRleE9mKGBcbmApID49IDAsIEwgKyBDLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCBcIlwiKS5sZW5ndGggKyAxO1xuICAgIH0sIDApO1xuICAgIHJldHVybiBTID4gNjAgPyBkWzBdICsgKHMgPT09IFwiXCIgPyBcIlwiIDogcyArIGBcbiBgKSArIFwiIFwiICsgZi5qb2luKGAsXG4gIGApICsgXCIgXCIgKyBkWzFdIDogZFswXSArIHMgKyBcIiBcIiArIGYuam9pbihcIiwgXCIpICsgXCIgXCIgKyBkWzFdO1xuICB9XG4gIGZ1bmN0aW9uIHYoZikge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGYpO1xuICB9XG4gIGUuaXNBcnJheSA9IHY7XG4gIGZ1bmN0aW9uIEEoZikge1xuICAgIHJldHVybiB0eXBlb2YgZiA9PSBcImJvb2xlYW5cIjtcbiAgfVxuICBlLmlzQm9vbGVhbiA9IEE7XG4gIGZ1bmN0aW9uIGIoZikge1xuICAgIHJldHVybiBmID09PSBudWxsO1xuICB9XG4gIGUuaXNOdWxsID0gYjtcbiAgZnVuY3Rpb24gRChmKSB7XG4gICAgcmV0dXJuIGYgPT0gbnVsbDtcbiAgfVxuICBlLmlzTnVsbE9yVW5kZWZpbmVkID0gRDtcbiAgZnVuY3Rpb24geShmKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBmID09IFwibnVtYmVyXCI7XG4gIH1cbiAgZS5pc051bWJlciA9IHk7XG4gIGZ1bmN0aW9uIHRlKGYpIHtcbiAgICByZXR1cm4gdHlwZW9mIGYgPT0gXCJzdHJpbmdcIjtcbiAgfVxuICBlLmlzU3RyaW5nID0gdGU7XG4gIGZ1bmN0aW9uIFZuKGYpIHtcbiAgICByZXR1cm4gdHlwZW9mIGYgPT0gXCJzeW1ib2xcIjtcbiAgfVxuICBlLmlzU3ltYm9sID0gVm47XG4gIGZ1bmN0aW9uIEIoZikge1xuICAgIHJldHVybiBmID09PSB2b2lkIDA7XG4gIH1cbiAgZS5pc1VuZGVmaW5lZCA9IEI7XG4gIGZ1bmN0aW9uIGxlKGYpIHtcbiAgICByZXR1cm4geihmKSAmJiBBZShmKSA9PT0gXCJbb2JqZWN0IFJlZ0V4cF1cIjtcbiAgfVxuICBlLmlzUmVnRXhwID0gbGU7XG4gIGZ1bmN0aW9uIHooZikge1xuICAgIHJldHVybiB0eXBlb2YgZiA9PSBcIm9iamVjdFwiICYmIGYgIT09IG51bGw7XG4gIH1cbiAgZS5pc09iamVjdCA9IHo7XG4gIGZ1bmN0aW9uIHllKGYpIHtcbiAgICByZXR1cm4geihmKSAmJiBBZShmKSA9PT0gXCJbb2JqZWN0IERhdGVdXCI7XG4gIH1cbiAgZS5pc0RhdGUgPSB5ZTtcbiAgZnVuY3Rpb24gdWUoZikge1xuICAgIHJldHVybiB6KGYpICYmIChBZShmKSA9PT0gXCJbb2JqZWN0IEVycm9yXVwiIHx8IGYgaW5zdGFuY2VvZiBFcnJvcik7XG4gIH1cbiAgZS5pc0Vycm9yID0gdWU7XG4gIGZ1bmN0aW9uIGFlKGYpIHtcbiAgICByZXR1cm4gdHlwZW9mIGYgPT0gXCJmdW5jdGlvblwiO1xuICB9XG4gIGUuaXNGdW5jdGlvbiA9IGFlO1xuICBmdW5jdGlvbiBKbihmKSB7XG4gICAgcmV0dXJuIGYgPT09IG51bGwgfHwgdHlwZW9mIGYgPT0gXCJib29sZWFuXCIgfHwgdHlwZW9mIGYgPT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgZiA9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBmID09IFwic3ltYm9sXCIgfHwgLy8gRVM2IHN5bWJvbFxuICAgIHR5cGVvZiBmID4gXCJ1XCI7XG4gIH1cbiAgZS5pc1ByaW1pdGl2ZSA9IEpuLCBlLmlzQnVmZmVyID0gRW87XG4gIGZ1bmN0aW9uIEFlKGYpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGYpO1xuICB9XG4gIGZ1bmN0aW9uIGJlKGYpIHtcbiAgICByZXR1cm4gZiA8IDEwID8gXCIwXCIgKyBmLnRvU3RyaW5nKDEwKSA6IGYudG9TdHJpbmcoMTApO1xuICB9XG4gIHZhciBabiA9IFtcbiAgICBcIkphblwiLFxuICAgIFwiRmViXCIsXG4gICAgXCJNYXJcIixcbiAgICBcIkFwclwiLFxuICAgIFwiTWF5XCIsXG4gICAgXCJKdW5cIixcbiAgICBcIkp1bFwiLFxuICAgIFwiQXVnXCIsXG4gICAgXCJTZXBcIixcbiAgICBcIk9jdFwiLFxuICAgIFwiTm92XCIsXG4gICAgXCJEZWNcIlxuICBdO1xuICBmdW5jdGlvbiBYbigpIHtcbiAgICB2YXIgZiA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgRGF0ZSgpLCBzID0gW1xuICAgICAgYmUoZi5nZXRIb3VycygpKSxcbiAgICAgIGJlKGYuZ2V0TWludXRlcygpKSxcbiAgICAgIGJlKGYuZ2V0U2Vjb25kcygpKVxuICAgIF0uam9pbihcIjpcIik7XG4gICAgcmV0dXJuIFtmLmdldERhdGUoKSwgWm5bZi5nZXRNb250aCgpXSwgc10uam9pbihcIiBcIik7XG4gIH1cbiAgZS5sb2cgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcIiVzIC0gJXNcIiwgWG4oKSwgZS5mb3JtYXQuYXBwbHkoZSwgYXJndW1lbnRzKSk7XG4gIH0sIGUuaW5oZXJpdHMgPSBSbywgZS5fZXh0ZW5kID0gZnVuY3Rpb24oZiwgcykge1xuICAgIGlmICghcyB8fCAheihzKSlcbiAgICAgIHJldHVybiBmO1xuICAgIGZvciAodmFyIGQgPSBPYmplY3Qua2V5cyhzKSwgUyA9IGQubGVuZ3RoOyBTLS07IClcbiAgICAgIGZbZFtTXV0gPSBzW2RbU11dO1xuICAgIHJldHVybiBmO1xuICB9O1xuICBmdW5jdGlvbiBCZShmLCBzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChmLCBzKTtcbiAgfVxufSkoR24pO1xudmFyIE9vID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiLCBqID0gR247XG5mdW5jdGlvbiBnZShlLCBuKSB7XG4gIGZvciAodmFyIHIgPSBbXSwgbyA9IDA7IG8gPCBlLmxlbmd0aDsgbysrKSB7XG4gICAgdmFyIGkgPSBlW29dO1xuICAgICFpIHx8IGkgPT09IFwiLlwiIHx8IChpID09PSBcIi4uXCIgPyByLmxlbmd0aCAmJiByW3IubGVuZ3RoIC0gMV0gIT09IFwiLi5cIiA/IHIucG9wKCkgOiBuICYmIHIucHVzaChcIi4uXCIpIDogci5wdXNoKGkpKTtcbiAgfVxuICByZXR1cm4gcjtcbn1cbmZ1bmN0aW9uIFgoZSkge1xuICBmb3IgKHZhciBuID0gZS5sZW5ndGggLSAxLCByID0gMDsgciA8PSBuICYmICFlW3JdOyByKyspXG4gICAgO1xuICBmb3IgKHZhciBvID0gbjsgbyA+PSAwICYmICFlW29dOyBvLS0pXG4gICAgO1xuICByZXR1cm4gciA9PT0gMCAmJiBvID09PSBuID8gZSA6IHIgPiBvID8gW10gOiBlLnNsaWNlKHIsIG8gKyAxKTtcbn1cbnZhciBLbiA9IC9eKFthLXpBLVpdOnxbXFxcXFxcL117Mn1bXlxcXFxcXC9dK1tcXFxcXFwvXStbXlxcXFxcXC9dKyk/KFtcXFxcXFwvXSk/KFtcXHNcXFNdKj8pJC8sIEZvID0gL14oW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXFxcXFwvXSs/fCkoXFwuW14uXFwvXFxcXF0qfCkpKD86W1xcXFxcXC9dKikkLywgRSA9IHt9O1xuZnVuY3Rpb24geGUoZSkge1xuICB2YXIgbiA9IEtuLmV4ZWMoZSksIHIgPSAoblsxXSB8fCBcIlwiKSArIChuWzJdIHx8IFwiXCIpLCBvID0gblszXSB8fCBcIlwiLCBpID0gRm8uZXhlYyhvKSwgbCA9IGlbMV0sIHQgPSBpWzJdLCB1ID0gaVszXTtcbiAgcmV0dXJuIFtyLCBsLCB0LCB1XTtcbn1cbmZ1bmN0aW9uIE1lKGUpIHtcbiAgdmFyIG4gPSBLbi5leGVjKGUpLCByID0gblsxXSB8fCBcIlwiLCBvID0gISFyICYmIHJbMV0gIT09IFwiOlwiO1xuICByZXR1cm4ge1xuICAgIGRldmljZTogcixcbiAgICBpc1VuYzogbyxcbiAgICBpc0Fic29sdXRlOiBvIHx8ICEhblsyXSxcbiAgICAvLyBVTkMgcGF0aHMgYXJlIGFsd2F5cyBhYnNvbHV0ZVxuICAgIHRhaWw6IG5bM11cbiAgfTtcbn1cbmZ1bmN0aW9uIFduKGUpIHtcbiAgcmV0dXJuIFwiXFxcXFxcXFxcIiArIGUucmVwbGFjZSgvXltcXFxcXFwvXSsvLCBcIlwiKS5yZXBsYWNlKC9bXFxcXFxcL10rL2csIFwiXFxcXFwiKTtcbn1cbkUucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBlID0gXCJcIiwgbiA9IFwiXCIsIHIgPSAhMSwgbyA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBvID49IC0xOyBvLS0pIHtcbiAgICB2YXIgaTtcbiAgICBpZiAobyA+PSAwID8gaSA9IGFyZ3VtZW50c1tvXSA6IGUgPyAoaSA9IHByb2Nlc3MuZW52W1wiPVwiICsgZV0sICghaSB8fCBpLnN1YnN0cigwLCAzKS50b0xvd2VyQ2FzZSgpICE9PSBlLnRvTG93ZXJDYXNlKCkgKyBcIlxcXFxcIikgJiYgKGkgPSBlICsgXCJcXFxcXCIpKSA6IGkgPSBwcm9jZXNzLmN3ZCgpLCBqLmlzU3RyaW5nKGkpKSB7XG4gICAgICBpZiAoIWkpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzXCIpO1xuICAgIHZhciBsID0gTWUoaSksIHQgPSBsLmRldmljZSwgdSA9IGwuaXNVbmMsIGEgPSBsLmlzQWJzb2x1dGUsIGMgPSBsLnRhaWw7XG4gICAgaWYgKCEodCAmJiBlICYmIHQudG9Mb3dlckNhc2UoKSAhPT0gZS50b0xvd2VyQ2FzZSgpKSAmJiAoZSB8fCAoZSA9IHQpLCByIHx8IChuID0gYyArIFwiXFxcXFwiICsgbiwgciA9IGEpLCBlICYmIHIpKVxuICAgICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIHUgJiYgKGUgPSBXbihlKSksIG4gPSBnZShcbiAgICBuLnNwbGl0KC9bXFxcXFxcL10rLyksXG4gICAgIXJcbiAgKS5qb2luKFwiXFxcXFwiKSwgZSArIChyID8gXCJcXFxcXCIgOiBcIlwiKSArIG4gfHwgXCIuXCI7XG59O1xuRS5ub3JtYWxpemUgPSBmdW5jdGlvbihlKSB7XG4gIHZhciBuID0gTWUoZSksIHIgPSBuLmRldmljZSwgbyA9IG4uaXNVbmMsIGkgPSBuLmlzQWJzb2x1dGUsIGwgPSBuLnRhaWwsIHQgPSAvW1xcXFxcXC9dJC8udGVzdChsKTtcbiAgcmV0dXJuIGwgPSBnZShsLnNwbGl0KC9bXFxcXFxcL10rLyksICFpKS5qb2luKFwiXFxcXFwiKSwgIWwgJiYgIWkgJiYgKGwgPSBcIi5cIiksIGwgJiYgdCAmJiAobCArPSBcIlxcXFxcIiksIG8gJiYgKHIgPSBXbihyKSksIHIgKyAoaSA/IFwiXFxcXFwiIDogXCJcIikgKyBsO1xufTtcbkUuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKGUpIHtcbiAgcmV0dXJuIE1lKGUpLmlzQWJzb2x1dGU7XG59O1xuRS5qb2luID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGUgPSBbXSwgbiA9IDA7IG4gPCBhcmd1bWVudHMubGVuZ3RoOyBuKyspIHtcbiAgICB2YXIgciA9IGFyZ3VtZW50c1tuXTtcbiAgICBpZiAoIWouaXNTdHJpbmcocikpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3NcIik7XG4gICAgciAmJiBlLnB1c2gocik7XG4gIH1cbiAgdmFyIG8gPSBlLmpvaW4oXCJcXFxcXCIpO1xuICByZXR1cm4gL15bXFxcXFxcL117Mn1bXlxcXFxcXC9dLy50ZXN0KGVbMF0pIHx8IChvID0gby5yZXBsYWNlKC9eW1xcXFxcXC9dezIsfS8sIFwiXFxcXFwiKSksIEUubm9ybWFsaXplKG8pO1xufTtcbkUucmVsYXRpdmUgPSBmdW5jdGlvbihlLCBuKSB7XG4gIGUgPSBFLnJlc29sdmUoZSksIG4gPSBFLnJlc29sdmUobik7XG4gIGZvciAodmFyIHIgPSBlLnRvTG93ZXJDYXNlKCksIG8gPSBuLnRvTG93ZXJDYXNlKCksIGkgPSBYKG4uc3BsaXQoXCJcXFxcXCIpKSwgbCA9IFgoci5zcGxpdChcIlxcXFxcIikpLCB0ID0gWChvLnNwbGl0KFwiXFxcXFwiKSksIHUgPSBNYXRoLm1pbihsLmxlbmd0aCwgdC5sZW5ndGgpLCBhID0gdSwgYyA9IDA7IGMgPCB1OyBjKyspXG4gICAgaWYgKGxbY10gIT09IHRbY10pIHtcbiAgICAgIGEgPSBjO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICBpZiAoYSA9PSAwKVxuICAgIHJldHVybiBuO1xuICBmb3IgKHZhciBoID0gW10sIGMgPSBhOyBjIDwgbC5sZW5ndGg7IGMrKylcbiAgICBoLnB1c2goXCIuLlwiKTtcbiAgcmV0dXJuIGggPSBoLmNvbmNhdChpLnNsaWNlKGEpKSwgaC5qb2luKFwiXFxcXFwiKTtcbn07XG5FLl9tYWtlTG9uZyA9IGZ1bmN0aW9uKGUpIHtcbiAgaWYgKCFqLmlzU3RyaW5nKGUpKVxuICAgIHJldHVybiBlO1xuICBpZiAoIWUpXG4gICAgcmV0dXJuIFwiXCI7XG4gIHZhciBuID0gRS5yZXNvbHZlKGUpO1xuICByZXR1cm4gL15bYS16QS1aXVxcOlxcXFwvLnRlc3QobikgPyBcIlxcXFxcXFxcP1xcXFxcIiArIG4gOiAvXlxcXFxcXFxcW14/Ll0vLnRlc3QobikgPyBcIlxcXFxcXFxcP1xcXFxVTkNcXFxcXCIgKyBuLnN1YnN0cmluZygyKSA6IGU7XG59O1xuRS5kaXJuYW1lID0gZnVuY3Rpb24oZSkge1xuICB2YXIgbiA9IHhlKGUpLCByID0gblswXSwgbyA9IG5bMV07XG4gIHJldHVybiAhciAmJiAhbyA/IFwiLlwiIDogKG8gJiYgKG8gPSBvLnN1YnN0cigwLCBvLmxlbmd0aCAtIDEpKSwgciArIG8pO1xufTtcbkUuYmFzZW5hbWUgPSBmdW5jdGlvbihlLCBuKSB7XG4gIHZhciByID0geGUoZSlbMl07XG4gIHJldHVybiBuICYmIHIuc3Vic3RyKC0xICogbi5sZW5ndGgpID09PSBuICYmIChyID0gci5zdWJzdHIoMCwgci5sZW5ndGggLSBuLmxlbmd0aCkpLCByO1xufTtcbkUuZXh0bmFtZSA9IGZ1bmN0aW9uKGUpIHtcbiAgcmV0dXJuIHhlKGUpWzNdO1xufTtcbkUuZm9ybWF0ID0gZnVuY3Rpb24oZSkge1xuICBpZiAoIWouaXNPYmplY3QoZSkpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgIFwiUGFyYW1ldGVyICdwYXRoT2JqZWN0JyBtdXN0IGJlIGFuIG9iamVjdCwgbm90IFwiICsgdHlwZW9mIGVcbiAgICApO1xuICB2YXIgbiA9IGUucm9vdCB8fCBcIlwiO1xuICBpZiAoIWouaXNTdHJpbmcobikpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgIFwiJ3BhdGhPYmplY3Qucm9vdCcgbXVzdCBiZSBhIHN0cmluZyBvciB1bmRlZmluZWQsIG5vdCBcIiArIHR5cGVvZiBlLnJvb3RcbiAgICApO1xuICB2YXIgciA9IGUuZGlyLCBvID0gZS5iYXNlIHx8IFwiXCI7XG4gIHJldHVybiByID8gcltyLmxlbmd0aCAtIDFdID09PSBFLnNlcCA/IHIgKyBvIDogciArIEUuc2VwICsgbyA6IG87XG59O1xuRS5wYXJzZSA9IGZ1bmN0aW9uKGUpIHtcbiAgaWYgKCFqLmlzU3RyaW5nKGUpKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICBcIlBhcmFtZXRlciAncGF0aFN0cmluZycgbXVzdCBiZSBhIHN0cmluZywgbm90IFwiICsgdHlwZW9mIGVcbiAgICApO1xuICB2YXIgbiA9IHhlKGUpO1xuICBpZiAoIW4gfHwgbi5sZW5ndGggIT09IDQpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgcGF0aCAnXCIgKyBlICsgXCInXCIpO1xuICByZXR1cm4ge1xuICAgIHJvb3Q6IG5bMF0sXG4gICAgZGlyOiBuWzBdICsgblsxXS5zbGljZSgwLCAtMSksXG4gICAgYmFzZTogblsyXSxcbiAgICBleHQ6IG5bM10sXG4gICAgbmFtZTogblsyXS5zbGljZSgwLCBuWzJdLmxlbmd0aCAtIG5bM10ubGVuZ3RoKVxuICB9O1xufTtcbkUuc2VwID0gXCJcXFxcXCI7XG5FLmRlbGltaXRlciA9IFwiO1wiO1xudmFyIFRvID0gL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC8sIE8gPSB7fTtcbmZ1bmN0aW9uIHZlKGUpIHtcbiAgcmV0dXJuIFRvLmV4ZWMoZSkuc2xpY2UoMSk7XG59XG5PLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgZSA9IFwiXCIsIG4gPSAhMSwgciA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyByID49IC0xICYmICFuOyByLS0pIHtcbiAgICB2YXIgbyA9IHIgPj0gMCA/IGFyZ3VtZW50c1tyXSA6IHByb2Nlc3MuY3dkKCk7XG4gICAgaWYgKGouaXNTdHJpbmcobykpIHtcbiAgICAgIGlmICghbylcbiAgICAgICAgY29udGludWU7XG4gICAgfSBlbHNlXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3NcIik7XG4gICAgZSA9IG8gKyBcIi9cIiArIGUsIG4gPSBvWzBdID09PSBcIi9cIjtcbiAgfVxuICByZXR1cm4gZSA9IGdlKFxuICAgIGUuc3BsaXQoXCIvXCIpLFxuICAgICFuXG4gICkuam9pbihcIi9cIiksIChuID8gXCIvXCIgOiBcIlwiKSArIGUgfHwgXCIuXCI7XG59O1xuTy5ub3JtYWxpemUgPSBmdW5jdGlvbihlKSB7XG4gIHZhciBuID0gTy5pc0Fic29sdXRlKGUpLCByID0gZSAmJiBlW2UubGVuZ3RoIC0gMV0gPT09IFwiL1wiO1xuICByZXR1cm4gZSA9IGdlKGUuc3BsaXQoXCIvXCIpLCAhbikuam9pbihcIi9cIiksICFlICYmICFuICYmIChlID0gXCIuXCIpLCBlICYmIHIgJiYgKGUgKz0gXCIvXCIpLCAobiA/IFwiL1wiIDogXCJcIikgKyBlO1xufTtcbk8uaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKGUpIHtcbiAgcmV0dXJuIGUuY2hhckF0KDApID09PSBcIi9cIjtcbn07XG5PLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgZSA9IFwiXCIsIG4gPSAwOyBuIDwgYXJndW1lbnRzLmxlbmd0aDsgbisrKSB7XG4gICAgdmFyIHIgPSBhcmd1bWVudHNbbl07XG4gICAgaWYgKCFqLmlzU3RyaW5nKHIpKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzXCIpO1xuICAgIHIgJiYgKGUgPyBlICs9IFwiL1wiICsgciA6IGUgKz0gcik7XG4gIH1cbiAgcmV0dXJuIE8ubm9ybWFsaXplKGUpO1xufTtcbk8ucmVsYXRpdmUgPSBmdW5jdGlvbihlLCBuKSB7XG4gIGUgPSBPLnJlc29sdmUoZSkuc3Vic3RyKDEpLCBuID0gTy5yZXNvbHZlKG4pLnN1YnN0cigxKTtcbiAgZm9yICh2YXIgciA9IFgoZS5zcGxpdChcIi9cIikpLCBvID0gWChuLnNwbGl0KFwiL1wiKSksIGkgPSBNYXRoLm1pbihyLmxlbmd0aCwgby5sZW5ndGgpLCBsID0gaSwgdCA9IDA7IHQgPCBpOyB0KyspXG4gICAgaWYgKHJbdF0gIT09IG9bdF0pIHtcbiAgICAgIGwgPSB0O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICBmb3IgKHZhciB1ID0gW10sIHQgPSBsOyB0IDwgci5sZW5ndGg7IHQrKylcbiAgICB1LnB1c2goXCIuLlwiKTtcbiAgcmV0dXJuIHUgPSB1LmNvbmNhdChvLnNsaWNlKGwpKSwgdS5qb2luKFwiL1wiKTtcbn07XG5PLl9tYWtlTG9uZyA9IGZ1bmN0aW9uKGUpIHtcbiAgcmV0dXJuIGU7XG59O1xuTy5kaXJuYW1lID0gZnVuY3Rpb24oZSkge1xuICB2YXIgbiA9IHZlKGUpLCByID0gblswXSwgbyA9IG5bMV07XG4gIHJldHVybiAhciAmJiAhbyA/IFwiLlwiIDogKG8gJiYgKG8gPSBvLnN1YnN0cigwLCBvLmxlbmd0aCAtIDEpKSwgciArIG8pO1xufTtcbk8uYmFzZW5hbWUgPSBmdW5jdGlvbihlLCBuKSB7XG4gIHZhciByID0gdmUoZSlbMl07XG4gIHJldHVybiBuICYmIHIuc3Vic3RyKC0xICogbi5sZW5ndGgpID09PSBuICYmIChyID0gci5zdWJzdHIoMCwgci5sZW5ndGggLSBuLmxlbmd0aCkpLCByO1xufTtcbk8uZXh0bmFtZSA9IGZ1bmN0aW9uKGUpIHtcbiAgcmV0dXJuIHZlKGUpWzNdO1xufTtcbk8uZm9ybWF0ID0gZnVuY3Rpb24oZSkge1xuICBpZiAoIWouaXNPYmplY3QoZSkpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgIFwiUGFyYW1ldGVyICdwYXRoT2JqZWN0JyBtdXN0IGJlIGFuIG9iamVjdCwgbm90IFwiICsgdHlwZW9mIGVcbiAgICApO1xuICB2YXIgbiA9IGUucm9vdCB8fCBcIlwiO1xuICBpZiAoIWouaXNTdHJpbmcobikpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgIFwiJ3BhdGhPYmplY3Qucm9vdCcgbXVzdCBiZSBhIHN0cmluZyBvciB1bmRlZmluZWQsIG5vdCBcIiArIHR5cGVvZiBlLnJvb3RcbiAgICApO1xuICB2YXIgciA9IGUuZGlyID8gZS5kaXIgKyBPLnNlcCA6IFwiXCIsIG8gPSBlLmJhc2UgfHwgXCJcIjtcbiAgcmV0dXJuIHIgKyBvO1xufTtcbk8ucGFyc2UgPSBmdW5jdGlvbihlKSB7XG4gIGlmICghai5pc1N0cmluZyhlKSlcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgXCJQYXJhbWV0ZXIgJ3BhdGhTdHJpbmcnIG11c3QgYmUgYSBzdHJpbmcsIG5vdCBcIiArIHR5cGVvZiBlXG4gICAgKTtcbiAgdmFyIG4gPSB2ZShlKTtcbiAgaWYgKCFuIHx8IG4ubGVuZ3RoICE9PSA0KVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIHBhdGggJ1wiICsgZSArIFwiJ1wiKTtcbiAgcmV0dXJuIG5bMV0gPSBuWzFdIHx8IFwiXCIsIG5bMl0gPSBuWzJdIHx8IFwiXCIsIG5bM10gPSBuWzNdIHx8IFwiXCIsIHtcbiAgICByb290OiBuWzBdLFxuICAgIGRpcjogblswXSArIG5bMV0uc2xpY2UoMCwgLTEpLFxuICAgIGJhc2U6IG5bMl0sXG4gICAgZXh0OiBuWzNdLFxuICAgIG5hbWU6IG5bMl0uc2xpY2UoMCwgblsyXS5sZW5ndGggLSBuWzNdLmxlbmd0aClcbiAgfTtcbn07XG5PLnNlcCA9IFwiL1wiO1xuTy5kZWxpbWl0ZXIgPSBcIjpcIjtcbk9vID8gb2UuZXhwb3J0cyA9IEUgOiBvZS5leHBvcnRzID0gTztcbm9lLmV4cG9ydHMucG9zaXggPSBPO1xub2UuZXhwb3J0cy53aW4zMiA9IEU7XG52YXIgTm8gPSBvZS5leHBvcnRzO1xuY29uc3QgUW4gPSAvKiBAX19QVVJFX18gKi8gX28oTm8pLCBybiA9IFFuLnJlc29sdmUoKTtcbmFzeW5jIGZ1bmN0aW9uIExvKGUpIHtcbiAgY29uc3QgbiA9IGUuc3BsaXQoXCIvXCIpLmZpbHRlcigoYSkgPT4gYS50cmltKCkgIT09IFwiXCIpLCByID0gbltuLmxlbmd0aCAtIDFdLCBvID0ge30sIGkgPSBgKiovJHtyfS9gLCBsID0gYXdhaXQgSGUoaSwge1xuICAgIGN3ZDogcm4sXG4gICAgLy8gXHU4QkJFXHU3RjZFXHU1RjUzXHU1MjREXHU1REU1XHU0RjVDXHU3NkVFXHU1RjU1XG4gICAgb25seURpcmVjdG9yaWVzOiAhMCxcbiAgICAvLyBcdTUzRUFcdTUzMzlcdTkxNERcdTc2RUVcdTVGNTVcbiAgICAvLyBkZWVwOiA1LCAvLyBcdTk2NTBcdTUyMzZcdTY0MUNcdTdEMjJcdTZERjFcdTVFQTZcdUZGMENcdTRGOEJcdTU5ODJcdTY3MDBcdTU5MUFcdTY0MUNcdTdEMjIgNSBcdTVDNDJcdTVCNTBcdTc2RUVcdTVGNTVcbiAgICBpZ25vcmU6IFtcIioqL25vZGVfbW9kdWxlcy8qKlwiXVxuICAgIC8vIFx1NUZGRFx1NzU2NSBub2RlX21vZHVsZXMgXHU3NkVFXHU1RjU1XG4gIH0pLCB0ID0gcm4gKyBcIi9cIiArIGxbMF0gKyBcIi8qKi8qLnZ1ZVwiLCB1ID0gYXdhaXQgSGUodCwge1xuICAgIGlnbm9yZTogW1FuLmpvaW4oXCIqKi9zcmNcIildLFxuICAgIG9ubHlGaWxlczogITBcbiAgfSk7XG4gIGZvciAoY29uc3QgYSBvZiB1KSB7XG4gICAgY29uc3QgYyA9IHJyLnJlYWRGaWxlU3luYyhhLCBcInV0ZjhcIik7XG4gICAgaWYgKGMpIHtcbiAgICAgIGNvbnN0IGggPSAvPHJvdXRlW14+XSpsYW5nPShbXCInXSkoW15cIiddKilcXDFbXj5dKj4oW1xcc1xcU10qPyk8XFwvcm91dGU+L2ksIHAgPSBjLm1hdGNoKGgpO1xuICAgICAgaWYgKHApIHtcbiAgICAgICAgY29uc3QgbSA9IHBbMl0udHJpbSgpLCB4ID0gcFszXS50cmltKCksIEEgPSBhLnNwbGl0KHIpWzFdLnJlcGxhY2UoLy52dWUvZywgXCJcIik7XG4gICAgICAgIGxldCBiID0ge307XG4gICAgICAgIG0gPT09IFwieWFtbFwiICYmIChiID0gem4ubG9hZCh4KSwgb1tBXSA9IGIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbztcbn1cbmZ1bmN0aW9uIFBvKGUpIHtcbiAgY29uc29sZS5sb2coXCJcXHgxQlszMW0lc1xceDFCWzBtXCIsIGUpO1xufVxuY29uc3QgSiA9IFwidml0ZS1wbHVnaW4tYXV0by12dWUtcm91dGVyXCI7XG5mdW5jdGlvbiBEbyhlKSB7XG4gIGNvbnN0IG4gPSBcInZpcnR1YWw6YXV0by12dWUtcm91dGVyXCIsIHIgPSBcIlxcMFwiICsgbjtcbiAgZSB8fCAoZSA9IHt9KTtcbiAgY29uc3QgbyA9IFsoZS5kaXIgfHwgXCIvXCIpICsgXCIqKi8qLnZ1ZVwiLCBcIiEqKi9zcmNcIiwgXCIhKiovY29tcG9uZW50c1wiXSwgaSA9IGUuaWdub3JlID8gZS5pZ25vcmUgOiBbXTtcbiAgZSA9IE9iamVjdC5hc3NpZ24oe1xuICAgIGRlYnVnOiAhMSxcbiAgICBkaXI6IG51bGwsXG4gICAgaWdub3JlOiBbXSxcbiAgICAvLyAhIFx1NTNDRFx1OTc2Mlx1NTMzOVx1OTE0RFx1NkEyMVx1NUYwRlx1RkYwQyEqKi9zcmMgXHU4RkQ5XHU3OUNEXHU2NjJGXHU4RkM3XHU2RUU0XHU3Njg0XHU3NkVFXHU1RjU1XG4gICAgZ2xvYjogQXJyYXkuZnJvbSgvKiBAX19QVVJFX18gKi8gbmV3IFNldChbLi4ubywgLi4uaV0pKSxcbiAgICBlYWdlcjogITBcbiAgICAvLyB0cnVlPVx1OUVEOFx1OEJBNFx1NjYyRlx1NEUwMFx1NkIyMVx1NTE2OFx1OTBFOFx1NTJBMFx1OEY3RFx1NUI4Q1x1OTg3NVx1OTc2MiBcdTc2RjhcdTUzQ0RcdTUyMTlcdTY2MkZcdTUyQThcdTYwMDFcdTUyQTBcdThGN0RcbiAgfSwgZSk7XG4gIGNvbnN0IGwgPSBlLmdsb2JbMF07XG4gIHJldHVybiAhZS5kaXIgJiYgbCAmJiBsLmluZGV4T2YoXCIhXCIpIDwgMCAmJiAoZS5kaXIgPSBsKSwgZS5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhKICsgXCI6XCIsIGUpLCB7XG4gICAgbmFtZTogbixcbiAgICByZXNvbHZlSWQodCkge1xuICAgICAgaWYgKHQgPT09IG4pXG4gICAgICAgIHJldHVybiByO1xuICAgIH0sXG4gICAgdHJhbnNmb3JtKHQsIHUpIHtcbiAgICAgIGlmICghKCEvdnVlJnR5cGU9cm91dGUvLnRlc3QodSkgfHwgIS9cXC55YT9tbCQvLnRlc3QodSkpKVxuICAgICAgICByZXR1cm4gL1xcLnlhP21sJC8udGVzdCh1KSAmJiAodCA9IEpTT04uc3RyaW5naWZ5KHpuLmxvYWQodC50cmltKCkpKSksIGBleHBvcnQgZGVmYXVsdCBDb21wID0+IHtcbiAgICAgICAgICAgICAgICBDb21wLnJvdXRlID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi4ke3R9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWA7XG4gICAgfSxcbiAgICBhc3luYyBsb2FkKHQpIHtcbiAgICAgIGlmICh0ID09PSByKSB7XG4gICAgICAgIGlmICghZS5kaXIpIHtcbiAgICAgICAgICBjb25zdCB4ID0gXCJ2aXRlLXBsdWdpbi1hdXRvLXZ1ZS1yb3V0ZXI6IFRoZSBzcGVjaWZpZWQgcGFnZSB0byBnZW5lcmF0ZSB0aGUgcm91dGUgZG9lcyBub3QgZXhpc3QhXCI7XG4gICAgICAgICAgcmV0dXJuIFBvKHgpLCBgZXhwb3J0IGRlZmF1bHQge31cbmNvbnNvbGUuZXJyb3IoJyR7eH0nKWA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdSA9IGF3YWl0IExvKGUuZGlyKSwgYSA9IG5ldyBSZWdFeHAoYFxcXFwvXFxcXCojJHtKfS1wYXRoXFxcXCpcXFxcL2AsIFwiZ1wiKSwgYyA9IG5ldyBSZWdFeHAoYFxcXFwvXFxcXCojJHtKfS1nbG9iLXJ1bGVzXFxcXCpcXFxcL2AsIFwiZ1wiKSwgaCA9IG5ldyBSZWdFeHAoYFxcXFwvXFxcXCojJHtKfS1vcHRpb25zXFxcXCpcXFxcL2AsIFwiZ1wiKSwgcCA9IG5ldyBSZWdFeHAoYFxcXFwvXFxcXCojJHtKfS1yb3V0ZS1xdWVyeVxcXFwqXFxcXC9gLCBcImdcIik7XG4gICAgICAgIGxldCBtID0gaXIucmVwbGFjZShhLCBgJHtKU09OLnN0cmluZ2lmeShlLmdsb2IpfWApO1xuICAgICAgICByZXR1cm4gbSA9IG0ucmVwbGFjZShjLCBgLHsgZWFnZXI6ICR7ZS5lYWdlcn0gfWApLCBtID0gbS5yZXBsYWNlKGgsIGBjb25zdCBjb25maWdzID0gJHtKU09OLnN0cmluZ2lmeShlKX1gKSwgbSA9IG0ucmVwbGFjZShwLCBgY29uc3QgUm91dGVRdWVyeSA9ICR7SlNPTi5zdHJpbmdpZnkodSl9YCksIGBcbiR7bX1gO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbmV4cG9ydCB7XG4gIERvIGFzIGRlZmF1bHRcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStWLFNBQVMsb0JBQW9CO0FBQzVYLE9BQU8sU0FBUztBQUVoQixTQUFTLGVBQWUsV0FBVzs7O0FDSDhTLE9BQU8sUUFBUTtBQUNoVyxPQUFPLFFBQVE7QUFDZixJQUFNLEtBQUs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWdQWCxTQUFTLEdBQUcsR0FBRztBQUNiLFNBQU8sT0FBTyxJQUFJLE9BQU8sTUFBTTtBQUNqQztBQUNBLFNBQVMsR0FBRyxHQUFHO0FBQ2IsU0FBTyxPQUFPLEtBQUssWUFB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
