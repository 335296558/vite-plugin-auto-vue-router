// uuid 测试过百W条不会重！😂😂😂
export const getMixName = ()=> {
    let str = '';
    for(let i =0;i<6;i++){
        str += String.fromCharCode(Math.floor(Math.random()*26+65))
    }
    return str
}

export const getRouteData = (filePath, viewPath)=> {
    // /aaa/bbb.vue
    const NewPath = filePath.replace(new RegExp(viewPath, 'g'), '/')
    // /aaa/bbb
    const PagePath = NewPath.replace(/.vue/, '')
    // [aaa,bbb]
    const PagePathArray = PagePath.split('/')
    // bbb
    const PathLastStr = PagePathArray[PagePathArray.length-1]
    // 取 带_后面的字符为参数，_b, b:'xxx'
    let match,name=PagePath;
    let RoutePath = PagePath
    const RoutePathFirst = PagePath.replace(new RegExp(PathLastStr),'') // 清除 最后节名称
    if (PathLastStr.indexOf('_')>=0) {
        name = RoutePathFirst.substring(1).replace(/\//g, '-')
        const param = PathLastStr.replace(/_/, '') // 文件以_开头的，取后面字符串当参数名
        if (!param) {
            match = `:query+`
            name = name+'all'
        } else {
            match = `:${param}`
            name = name+param
        }
        RoutePath = `${RoutePathFirst}${match}`
    }
    // ${RoutePath}
    // console.log('NewPath=>', NewPath)
    // console.log('PagePath=>', PagePath)
    // console.log('PagePathArray=>', PagePathArray)
    // console.log('PathLastStr=>', PathLastStr)
    // console.log('match=>', match)
    const varName = getMixName()+Date.now()
    let item = {
        filePath,
        path: RoutePath,
        match,
        name,
        varName,
        importStringFun: `()=>import('${filePath}')`,
        importString: `import ${varName? varName : `&nbsp;*&nbsp; as `} from '${filePath}'`
    }
    console.log('item=>', item)
    return item
}