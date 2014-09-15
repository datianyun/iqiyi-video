video
=====




> 这是个yeoman创建的APP，依据http://yeomanjs.org/搭建好环境，然后依次

   #  npm install 初始化node依赖的包

   #  bower install 初始化前端依赖的包

   #  grunt test 观看示例

   # grunt serve 
 




> css引用：

<pre>

#  引用css  main.css

#  style文件夹下，需创建font文件夹，拷贝两个字体文件，vjs.ttf\vjs.woff，主要是用做了播放器的播放按钮，可自定义图片替换删除这两个引用

</pre>

> script引用：

<pre>

   （1）jquery

   （2）ua.js  一个解析来源UA的组件，可复用

   （3）video.js  采用jquery组件的写法，挂在了jquery.fn下，初始化视频组件

   （4）main.js   页面初始化的init文件，包含了一些公用方法，初始化数据

</pre>

> html初始化：

``````javascript

     <div class="video_container" style="margin:10px 0">
          <div class="video">
               <video id="video" preload="none" width="100%"></video>
               <div class="video-bg">
                    <img src=""></img>
               </div>
               <div class="video-broad"></div>
          </div>
     </div>
     
``````

> 数据初始化：在main.js中

<pre>

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

   初始化函数包括两个函数，一个初始化数据，一个初始化事件，按照此函数写法写自己的业务即可。

</pre>
