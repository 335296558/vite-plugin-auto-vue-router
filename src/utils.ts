import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';
import JSYaml from 'js-yaml';
// 根目录
const __dirname = path.resolve();

export async function getPageRouteQuery(PagePath: string) {
    const paths = PagePath.split('/').filter(k => k.trim() !== ''); // 取最后一个目录名
    const lastPathName = paths[paths.length - 1]; // 生成路由的目录名称 例如： pages
    const RoutePaths: Record<string, any> = {};
    // 先找到这个目录在那，
    const pattern = `**/${lastPathName}/`;
    const matches = await fg(pattern, {
        cwd: __dirname, // 设置当前工作目录
        onlyDirectories: true, // 只匹配目录
        // deep: 5, // 限制搜索深度，例如最多搜索 5 层子目录
        ignore: ['**/node_modules/**'], // 忽略 node_modules 目录
    });
    // 得到绝对目录了
    const dir = __dirname+'/'+matches[0]+'/**/*.vue';
    // 读取.vue文件的绝对path
    const files = await fg(dir, {
        ignore: [path.join(`**/src`)],
        onlyFiles: true,
    });
    
    for (const filePath of files) {
        const codeText = fs.readFileSync(filePath, 'utf8');
        if (codeText) {
            const routeBlockRegex = /<route[^>]*lang=(["'])([^"']*)\1[^>]*>([\s\S]*?)<\/route>/i;
            const match = codeText.match(routeBlockRegex);
            if (match) {
                const lang = match[2].trim();
                const content = match[3].trim();
                const paths = filePath.split(lastPathName);
                const routePath = paths[1].replace(/.vue/g, '');
                let route = {};
                if (lang==='yaml') {
                    route = JSYaml.load(content);
                    RoutePaths[routePath] = route;
                }
            }
        }
    }
    return RoutePaths;
}

export function extractRouteLayout(scriptStr: string) {
    // 正则表达式解释：
    // //! @__ROUTE_LAYOUT__: - 匹配特定的注释开头
    // '([^']*)' - 匹配两个单引号之间的任何字符（非贪婪），并捕获这些字符
    // const regex = /\/\/! @__ROUTE_LAYOUT__:\s*'([^']*)'/;
    const regex = /\/\/! #__ROUTE_LAYOUT__=\s*'([^']*)'/;
    const match = regex.exec(scriptStr);
    return match ? match[1] : null; // 如果匹配到，返回捕获的组，否则返回 null
}
  