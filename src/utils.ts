export function extractRouteLayout(scriptStr: string) {
    // 正则表达式解释：
    // //! @__ROUTE_LAYOUT__: - 匹配特定的注释开头
    // '([^']*)' - 匹配两个单引号之间的任何字符（非贪婪），并捕获这些字符
    const regex = /\/\/! @__ROUTE_LAYOUT__:\s*'([^']*)'/;
    const match = regex.exec(scriptStr);
    return match ? match[1] : null; // 如果匹配到，返回捕获的组，否则返回 null
}
  