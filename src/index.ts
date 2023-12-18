// @ts-ignore
import AutoVueRouterCodeString from './AutoVueRouter.js?raw';
import { extractRouteLayout } from './utils.js';
import path from 'path';

function Log(text: string){
    console.log('\x1b[31m%s\x1b[0m', text);
}

interface IOptions {
    debug?: boolean;
    dir?: string | null;
    ignore: string[];
    glob: string | string[];
    eager: boolean;
}
const VitePluginName = 'vite-plugin-auto-vue-router';
export default function AutoVueRouter(options: IOptions) {
    const ModuleId = 'virtual:auto-vue-router';
    const resolvedModuleId = '\0' + ModuleId;
    if (!options) {
        options = {} as IOptions;
    }
    
    const defaultGlob = [(options.dir||'/')+'**/*.vue', '!**/src', '!**/components'];
    const ignores = options.ignore ? options.ignore:[];
    options = Object.assign({
        debug: false,
        dir: null,
        ignore: [], // ! 反面匹配模式，!**/src 这种是过滤的目录
        glob: Array.from(new Set([...defaultGlob, ...ignores])),
        eager: false, // true=默认是一次全部加载完页面 相反则是动态加载
    }, options);
    
    const RouterPath = options.glob[0];
    if (!options.dir && RouterPath && RouterPath.indexOf('!') < 0) { // dir 不存在时，找在glob第1个位置找，存在则把它赋给dir,否则不存在则不创建路由
        options.dir = RouterPath;
    }
   
    if (options.debug) {
        console.log(VitePluginName+':',options)
    }

    return {
        name: ModuleId,
        async resolveId(id: string) {
            if (id === ModuleId) {
                return resolvedModuleId;
            }
        },
        transform(code: string, id: string) {
            const sregex = /\.vue$/;
            if (!sregex.test(id)) {
                return;
            }
            const arrs = id.split('src');
            const PagePath = arrs[1];
            if (!PagePath || PagePath.indexOf('/src/') >=0) {
                return;
            }
            if (!/@__ROUTE_LAYOUT__/.test(code)) {
                return;
            }
            const RouteLayout = extractRouteLayout(code);
            code = code.replace(new RegExp(`${PagePath}"]`,'g'), `${PagePath}"],["__route_layout","${RouteLayout}"]`);
            return code;
        },
        async load(id: string) {
            if (id === resolvedModuleId) {
                if (!options.dir) {
                    const errText = 'vite-plugin-auto-vue-router: The specified page to generate the route does not exist!';
                    Log(errText);
                    return `export default {}\nconsole.error('${errText}')`;
                }

                // regex 示例： /\/\*#vite-plugin-auto-vue-router-path\*\//g;

                const pathRegex = new RegExp(`\\/\\*#${VitePluginName}-path\\*\\/`, 'g');
                const globOptionsRegex = new RegExp(`\\/\\*#${VitePluginName}-glob-rules\\*\\/`, 'g');
                const optionsRegex = new RegExp(`\\/\\*#${VitePluginName}-options\\*\\/`, 'g');
                let outinput = AutoVueRouterCodeString.replace(pathRegex, `${JSON.stringify(options.glob)}`);
                outinput = outinput.replace(globOptionsRegex, `,{ eager: ${options.eager} }`);
                outinput = outinput.replace(optionsRegex, `const configs = ${JSON.stringify(options)}`);
                // console.log(outinput, 'outinput');
                return `\n${outinput}`;
            }
        }
    }
}