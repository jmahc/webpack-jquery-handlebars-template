/***
 * action中必须引入此工具类库，用于判断执行环境
 */
import action from '../utils/perform-action';

/**
 * 可以像这样引入第三方样式库
 */
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

/**
 * 本地环境根据resources里html页面中定义的actionName和dev值判断执行哪个action、是否请求本地mock数据
 * window.ENV={
        actionName:'test',
        dev:true
    };
 */
/**
 * 这种方式可以引入cortex包
 */

//import hippo from '@cortex/hippo';

//引入页面级依赖的less，页面中可能存在多个less文件，可以在resources/less下建立目录管理每个页面
//import testStyle from  '../resources/less/test.less';


alert('首页测试');



/*
这种方式可以按需加载某个文件
require.ensure(["jquery", "imgScroll"], function(require){
    var $ = require("jquery");
    require("imgScroll");
    $("#container").scroll({
        XXX
    })
})*/
