(function($,root){

    root.QY = root.QY||{};

    var hasPointerSupport = navigator.msPointerEnabled;

    root._EVT_DOWN = 'ontouchstart' in root ? 'touchstart' : hasPointerSupport ? 'MSPointerDown' : 'mousedown';
    root._EVT_MOVE = 'ontouchmove'  in root ? 'touchmove'  : hasPointerSupport ? 'MSPointerMove' : 'mousemove';
    root._EVT_UP   = 'ontouchend'   in root ? 'touchend'   : hasPointerSupport ? 'MSPointerUp'   : 'mouseup';

    //初始化函数，初始化临时数据和要绑定的事件
    QY.Init = function(){
        //初始化数据
        QY.InitData();
        //初始化事件
        QY.initEvents();
    };

    QY.InitData = function(){
        //简历一个存储临时数据的空间
        QY.data = QY.data||{};
        //页面打开生成一个GUID，用来标识此页面。
        QY.data.timestamp = QY.guid();
        //日志记录地址
        QY.data.staticUrl = "/apis/1.0/count/?";
        //初始化video组件时，需要获取的数据
        QY.data.videoInfo = {
            "aid" : 302158300,
            "url" : "http://video-js.zencoder.com/oceans-clip.mp4",
            "img" :"http://r1.ykimg.com/0515000053DACF9C6737B337730A9622",
            "container":"video_container"
        };
    };

    //生成guid
    QY.guid = (function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return function() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
        };
    })();

    //取得url上传递的参数0
    QY.getParams = function(strParamName){
        var strReturn = "",
            strHref = root.location.href.toUpperCase(),
            bFound = false,
            cmpstring = strParamName.toUpperCase() + "=",
            cmplen = cmpstring.length,
            strQueryString,
            aQueryString;
        if (strHref.indexOf("?") > -1){
            strQueryString = strHref.substr(strHref.indexOf("?") + 1);
            aQueryString = strQueryString.split("&");
            for (var iParam = 0; iParam < aQueryString.length; iParam++){
                if (aQueryString[iParam].substr(0, cmplen) == cmpstring){
                    var aParam = aQueryString[iParam].split("=");
                    strReturn = aParam[1];
                    bFound = true;
                    break;
                }
            }
        }
        if (bFound === false){
            return null;
        } 
        return strReturn.toLowerCase();
    };

    //发送统计码
    QY.statics = (function(QY,exports) {
        var $ = exports.Zepto || exports.jQuery;
        QY.Statistics = {
            base: '',
            params: function(code) {
                var i, params = {};
                if (typeof code === 'string') {
                    params._once_ = code;
                    params._dc = (+new Date());
                }
                else {
                    for (i in code) {
                        params[i] = code[i];
                    }
                }
                
                return this.appendParams(params);
            },
            appendParams: function(params) {
                var i, paramsArray = [];   
                for (i in params) {
                    if (params.hasOwnProperty(i)) {
                        paramsArray.push(i + '=' + params[i]);
                    }
                }
                return paramsArray.join('&');
            },
            addStatistics: function(code, base) {
                var image;         
                base = base || this.base;       
                image = new Image(1, 1);
                image.src = base + this.params(code);
            }, 
            /**
             * 委托事件发送统计请求 
             */
            addGlobalSupport: function() {
                var that = this;    
                $('body').on('touchend', '[data-code]', ontouchend);
                function ontouchend(e) {
                    var target, parent, code;
                    e.preventDefault();
                    e.stopPropagation();
                    
                    target = e.target;
                    parent = target.parentNode;
                    if ((code = target.getAttribute('data-code')) || (code = parent.getAttribute('data-code'))) {
                        that.addStatistics(code);
                    }
                }
            }     
        };
    })(QY,window);

    //iphone下，打开APP和下载APP一键解决方案
    QY.openApp =function(url, callback) {    
        if (!url) {
            return;
        }
        var node,body,timer,clear,hide,now;
        node = document.createElement('iframe');
        node.style.display = 'none';
        body = document.body;
        timer;
        clear = function(evt, isTimeout) {
            (typeof callback==='function') &&  callback(isTimeout);
            root.removeEventListener('pagehide', hide, true);
            root.removeEventListener('pageshow', hide, true);
            if (!node) {
                return;
            }
            node.onload = null;
            body.removeChild(node);
            node = null;
        };
        hide = function(e){
            clearTimeout(timer);
            clear(e, false);
            QY.buildData("openApp");
        };
        root.addEventListener('pagehide', hide, true);
        root.addEventListener('pageshow', hide, true);
        node.onload = clear;
        node.src = url;
        body.appendChild(node);
        now = +new Date();
        //如果事件失败，则1秒设置为空
        timer = setTimeout(function(){
            timer = setTimeout(function(){
              var newTime = +new Date();
              if(newTime-now>1285){
                clear(null, false);
              }else{
                clear(null, true);
              }

            }, 1200);
        }, 60);
    };

    QY.androidAPP = function(url, callback){
        if (!url) {
            return;
        }
        var node = document.createElement('iframe');
        node.style.display = 'none';
        var body = document.body;
        var timer;
        node.src = url;
        body.appendChild(node);
        QY.buildData("openApp");
        QY.timeOut = setTimeout(function() {
            body.removeChild(node);
            node = null;
        }, 1000);
    };

    QY.buildData = function(type,callback){
        var device_id,os,ua,platform,tt_from,type,url,parser,device,deviceType,duration,eventId,version;
        parser = $.ua;
        device = parser.device.type;
        eventType = type;
        if(device == "tablet"){
            if(parser.device.model=="iPad"){
                deviceType = "iPad";
            }else{
                deviceType = "GPad";
            }
        }else{
            if(parser.device.model=="iPhone"){
                deviceType ="iPhone";
            }else{
                deviceType ="GPhone";
            }
        }
        device_id = QY.getParams("device_id");
        os = QY.getParams("os")? QY.getParams("os"):(deviceType);
        ua = QY.getParams("ua")? QY.getParams("ua") :parser.os.version;
        platform = QY.getParams("platform");
        tt_from = QY.getParams("tt_from");
        eventId = QY.timestamp;
        version = '1.0';

        if(arguments.length ==3){
            duration = arguments[2]+"";       
        }else{
            duration = 0;
        }
        if(device_id){
            device_id = device_id.split("#")[0];
        }

        QY.Statistics.addStatistics({
            'device_id': device_id,
            'os': os,
            'ua': ua,
            'platform': platform,
            'tt_form': tt_from,
            'type': eventType,
            'duration': duration,
            'eventId': eventId,
            'version': version,
            'tvId': QY.data.videoInfo.aid
        },QY.data.staticUrl);

        (typeof callback==='function') &&  callback();
    };

    QY.countDuration = function(){
        var duration,tmpTime,totalTime,ua,video;
        video = $("video")[0];
        ua = navigator.userAgent.toLowerCase();   
        tmpTime = parseInt(video.currentTime);
        totalTime = parseInt(video.duration);
        if(tmpTime == totalTime){
            clearInterval(QY.videoStatic);
        }
        duration = tmpTime;
        QY.buildData("broad_video",null,duration);
    };

    QY.setInterval= function(){
        QY.videoStatic = setInterval(function(){
            QY.countDuration();
        },10000);
        return true;
    };

    //处理安卓4.04播放器黑屏BUG，无法统计数据问题，不准确
    QY.toutiaoBegin = function(){
        QY.data.startTime = new Date().getTime();
        localStorage.setItem("QY.data.startTime",QY.data.startTime);
        root.removeEventListener('pagehide', QY.toutiaoBegin, true);
    };

    //处理安卓4.04播放器黑屏BUG，无法统计数据问题，不准确
    QY.toutiaoEnd = function(){
        QY.data.endTime = new Date().getTime();
        var duration = (QY.data.endTime-localStorage.getItem("QY.data.startTime"))%(1000);
        QY.buildData("broad_video",null,duration);
        root.removeEventListener('pageshow', QY.toutiaoEnd, true);    
    };

    QY.initEvents = function(){
        
        (function($){
            QY.data.broadVideo = null;
            QY.buildData("page_view");
            var ua,parser;
           
            //处理兼容问题
            //parser = (new UAParser()).getResult();
            if(root.innerWidth <720||$.ua.device.type== 'mobile'){
                var tHeight,target;
                target = $(".video_container");
                tHeight = target.height();
                if(tHeight >= 200){
                    $(".video_container")[0].style.height ='200px';
                    $("#video")[0].style.height ='200px';
                    $(".video_container .video-bg")[0].style.height ='200px';
                }
            }
        })($);

        $('#video').videoPlayer({
            'playerWidth' : 0.95,
            'videoClass' : 'video',
            'url' : QY.data.videoInfo.url,
            'cover' :QY.data.videoInfo.img,
            'container':QY.data.videoInfo.container
        });
        
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)){
            QY.searchIosVideo = root.setInterval(function(){
                video = $("video")[0];               
                if(video.readyState > 0){
                    QY.videoNative = true;
                    if(QY.data.videoCountStatus ==undefined){
                        QY.data.videoCountStatus = QY.setInterval();
                        QY.buildData("video-main");    
                        clearInterval(QY.searchIosVideo);
                    }
                }
            },600);
            $(".video-broad").click(function(e){
                e.stopPropagation();
                e.preventDefault();
                var target,video,postImage,tvid;
                target = $(e.currentTarget);
                video = $("#video");
                postImage = $(".video-bg");
                postImage.hide();
                target.hide();

                if($(".player").length>0){
                    $(".player").show();
                }
                if (video.length > 0){
                    video[0].play();
                } 
            });
        }else{
            $(".video-broad").click(function(e){
                e.stopPropagation();
                e.preventDefault();
                QY.buildData("video-main");
                var target,video,postImage,tvid;
                target = $(e.currentTarget);
                video = $("#video");
                postImage = $(".video-bg");
                postImage.hide();
                target.hide();

                if($(".player").length>0){
                    $(".player").show();
                }
                if (video.length > 0){
                    video[0].play();
                } 
                
                QY.searchTime = root.setInterval(function(){
                    video = $("#video")[0];
                    if (video.readyState > 0) {
                        var duration = parseInt(video.duration);
                        if((duration!==1)&& isFinite(duration)){
                            QY.data.duration = duration;
                            QY.data.removeVideo = true;
                            clearInterval(QY.searchTime);
                        } 
                    } 
                },300);

                QY.hideControlBar = setTimeout(function(){
                    $(".video_container .player").css({"opacity":"0"});
                },5000);
            });    
        }
        
        QY.searchVideo= root.setInterval(function(){
            var video = $("#video");
            if (video.length > 0) {
                video = video[0] ;
                video.src = QY.data.videoInfo.url;
                clearInterval(QY.searchVideo);                  
            }
        },60);
    };
        
    document.addEventListener("DomContentLoaded",QY.Init(),false);
})($,this);





