//自定义转换 https://cn.vitejs.dev/guide/migration-from-v1.html#custom-blocks-transforms
export default function vitePluginVueRoute() {
    const ModuleId = 'virtual:route';
    const resolvedModuleId = '\0' + ModuleId;
    return {
        name: ModuleId,
        resolveId(id) {
            if (id === ModuleId) {
                return resolvedModuleId;
            }
        },
        transform(code, id) {
            console.log(id);
            if (!/vue&type=script/.test(id)) {
                return;
            }
            if (/\.ya?ml$/.test(id)) {
                // code = JSON.stringify(require('js-yaml').load(code.trim()))
            }
            return `export default Comp => {
                Comp.i18n = ${code}
            }`
            // if (code.indexOf('customOptions:') >=0 && code.indexOf('route:')>=0) {
            //     console.log(code, 'code')
            //     return `${code}`;
            // }
            // if (!/vue&type=script/.test(id)) {
            //     return
            // }
            
            // if (/\.js$/.test(id)) {
            //     code = JSON.stringify(code.trim())
            // }
            // return `export default {}`;
        }
    }
}