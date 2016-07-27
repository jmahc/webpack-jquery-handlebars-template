//默认就是json数据请求

/**
 * 直接引用在本地不会被获取mocks下的数据，使用跟$.ajax一致
 * 通过两种方式调用，
 * 1. 一种是直接调用
 *      import fetch from '../utils/fetch';
 *      fetch('the/url',{});
 * 2. 一种是配合perform-action使用：
 *      import action from '../utils/perform-action';
 *      action('actionName',(fetch)=>{
 *
 *          fetch('the/url',{});
 *      });
 * */

function isMock() {
    let location = window.location,
        localhost =/127.0.0.1|localhost/.test(location.hostname) && location.href.indexOf('8080')<0,
        mockParam =(location.search && location.search.substring(1)).indexOf('mock=1')!=-1;
    return localhost || mockParam;
}

function fetch(url,options={}){
    if(isMock() ){
        url = url.split('?');
        url= (location.pathname.substr(0,location.pathname.lastIndexOf('/')+1))+'mocks'+url[0]+'.json';
        options.type = 'GET';
        options.method = 'GET';
    }
    //url = url instanceof Function ? url():url.indexOf('mock=1')!=-1 ? url:ENV.getAjaxUrl(url);
    return $.ajax($.extend(true,{
        dataType:'json',
        type:'GET'
    },options,{
        url:url
    } ) );
}

export default fetch;