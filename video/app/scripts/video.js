
window.QY = {};
(function($,QY) {
    'use strict';
    $.fn.videoPlayer = function(options) {
        var settings,root,cover,container,video;     
        settings = {};
        if(options) {
            $.extend(settings, options);
        }
        root = $('.'+settings.videoClass);
        cover = $('.'+settings.videoClass).find('.video-bg img');
        cover[0].src = settings.cover;
        container = $('.'+settings.container);
        video = root.find("video");
        return video.each(function(index,item) {
            item.addEventListener('loadedmetadata', function() {
                var $this = $(this),
                    $settings = settings,
                    $draggingProgress,
                    $that = $this.parent('.'+$settings.videoClass);
                /*jshint multistr: true */
                {
                    $( '<div class="player clearfix">\
                        <div class="play-pause pause">\
                            <span class="play-button"></span>\
                            <div class="pause-button">\
                                <span> </span>\
                                <span> </span>\
                            </div>\
                        </div>\
                        <div class="progress">\
                            <div class="progress-bar">\
                                <div class="button-holder">\
                                    <div class="progress-button"><span class="dot"></span></div>\
                                </div>\
                            </div>\
                            <div class="time">\
                                <span class="ctime">00:00</span>\
                                <span class="stime"> / </span>\
                                <span class="ttime">00:00</span>\
                            </div>\
                        </div>\
                        <div class="volume">\
                            <div class="volume-holder">\
                                <div class="volume-bar-holder">\
                                    <div class="volume-bar">\
                                        <div class="volume-button-holder">\
                                            <div class="volume-button"> </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        <div class="volume-icon v-change-0">\
                            <span> </span>\
                        </div>\
                        </div>\
                            <div class="video-icon"></div>\
                            <div class="fullscreen">\
                        </div>\
                    </div>').appendTo($that);
                }

                var $videoWidth = $this.width(),
                    $spc = $(this)[0],
                    $duration = $spc.duration,
                    $volume = $spc.volume,
                    currentTime,
                    $mclicking = false,
                    $vclicking = false,
                    $vidhover = false,
                    $volhover = false,
                    $playing = false,
                    $drop = false,
                    $begin = false,
                    $draggingProgess = false,
                    $storevol,
                    x = 0,
                    y = 0,
                    vtime = 0,
                    updProgWidth = 0,
                    volume = 0,
                    progWidth;
                $that.width($videoWidth+'px');
                $volume = $spc.volume;
                $that.bind('selectstart', function() { return false; });
                //兼容手机       
                //var progWidth = $that.find('.progress').width();
                progWidth = window.innerWidth-30;
                
                
                var bufferLength = function() {
                
                    var buffered = $spc.buffered;
                    
                    $that.find('[class^=buffered]').remove();
                    
                    if(buffered.length > 0) {       
                        var i = buffered.length;
                        while(i--) {
                            var $maxBuffer,$minBuffer,bufferOffset,bufferWidth;
                            $maxBuffer = buffered.end(i);
                            $minBuffer = buffered.start(i);
                            bufferOffset = ($minBuffer / $duration) * 100;
                            bufferWidth = (($maxBuffer - $minBuffer) / $duration) * 100;
                            $('<div class="buffered"></div>').css({'left' : bufferOffset+'%', 'width' : bufferWidth+'%'}).appendTo($that.find('.progress'));
                        }
                    }
                };

                bufferLength();
                
                var timeUpdate = function($ignore) {
                    //在手机端做兼容处理
                    if(!QY.data.removeVideo){
                        return;    
                    }else{
                        $duration = QY.data.duration;
                    }

                    if(!$duration||$duration===1){

                        if(QY.data.duration&&QY.data.duration!==1){
                            $duration = QY.data.duration;
                        }else{
                            return ;
                        }
                    }
                    
                    //统计处理

                    if(QY.data.videoCountStatus ===undefined){
                        QY.data.videoCountStatus = QY.setInterval();
                    }
                    var time = Math.round(($('.progress-bar').width() / progWidth) * $duration),
                        curTime = $spc.currentTime,
                        seconds = 0,
                        minutes = Math.floor(time / 60),
                        tminutes = parseInt($duration / 60),
                        tseconds = Math.round(($duration) - (tminutes*60));

                    if(time) {
                        seconds = Math.round(time) - (60*minutes);
                        if(seconds > 59) {
                            seconds = Math.round(time) - (60*minutes);
                            if(seconds === 60) {
                                minutes = Math.round(time / 60);
                                seconds = 0;
                            }
                        }
                    }
                    updProgWidth = (curTime / $duration) * progWidth;
                    if(seconds < 10) { seconds = '0'+seconds; }
                    if(tseconds < 10) { tseconds = '0'+tseconds; }
                    if($ignore !== true) {
                        $that.find('.progress-bar').css({'width' : updProgWidth+'px'});
                        $that.find('.progress-button').css({'left' : (updProgWidth-$that.find('.progress-button').width())+'px'});
                    }
                    $that.find('.ctime').html(minutes+':'+seconds);
                    $that.find('.ttime').html(tminutes+':'+tseconds);
                    if($spc.currentTime > 0 && $spc.paused === false && $spc.ended === false) {
                        bufferLength();
                    }
                };
                timeUpdate();
                $spc.addEventListener('timeupdate', timeUpdate);
                $that.find('.play-pause').bind('click', function() {
                    if($spc.currentTime > 0 && $spc.paused === false && $spc.ended === false) {
                        $playing = false;
                    } else {
                        $playing = true;
                    }
                    if($playing === false) {
                        $spc.pause();
                        $(this).addClass('play').removeClass('pause');
                        bufferLength();
                        clearTimeout(QY.hideControlBar);
                    } else {
                        $begin = true;
                        $spc.play();
                        $(this).addClass('pause').removeClass('play');
                        QY.hideControlBar = setTimeout(function(){
                            $(".video_container .player").css({"opacity":"0"});
                        },5000);
                    }
                });
                $that.find('.progress').bind('mousedown', function(e) {
                    $mclicking = true;
                    if($playing === true) {
                        $spc.pause();
                    }
                    
                    x = e.pageX - $that.find('.progress').offset().left;
                    
                    currentTime = (x / progWidth) * $duration;
                    
                    $spc.currentTime = currentTime;
                    
                });
                
                $that.find('.volume-bar-holder').bind('mousedown', function(e) {   
                    $vclicking = true;
                    y = $that.find('.volume-bar-holder').height() - (e.pageY - $that.find('.volume-bar-holder').offset().top);
                    if(y < 0 || y > $(this).height()) {
                        $vclicking = false;
                        return false;
                    }
                    
                    $that.find('.volume-bar').css({'height' : y+'px'});
                    $that.find('.volume-button').css({'top' : (y-($that.find('.volume-button').height()/2))+'px'});
                     
                    $spc.volume = $that.find('.volume-bar').height() / $(this).height();
                    $storevol = $that.find('.volume-bar').height() / $(this).height();
                    $volume = $that.find('.volume-bar').height() / $(this).height();
                    
                    volanim();
                    
                });
                
                var volanim = function() {
                
                    for(var i = 0; i < 1; i += 0.1) {
                                    
                        var fi = parseInt(Math.floor(i*10)) / 10,
                            volid = (fi * 10)+1;
                        
                        if($volume === 1) {
                            if($volhover === true) {
                                $that.find('.volume-icon').removeClass().addClass('volume-icon volume-icon-hover v-change-11');
                            } else {
                                $that.find('.volume-icon').removeClass().addClass('volume-icon v-change-11');
                            }
                        }
                        else if($volume === 0) {
                            if($volhover === true) {
                                $that.find('.volume-icon').removeClass().addClass('volume-icon volume-icon-hover v-change-1');
                            } else {
                                $that.find('.volume-icon').removeClass().addClass('volume-icon v-change-1');
                            }
                        }
                        else if($volume > (fi-0.1) && volume < fi && !$that.find('.volume-icon').hasClass('v-change-'+volid)) {
                            if($volhover === true) {
                                $that.find('.volume-icon').removeClass().addClass('volume-icon volume-icon-hover v-change-'+volid);
                            } else {
                                $that.find('.volume-icon').removeClass().addClass('volume-icon v-change-'+volid);
                            }
                        }
                    }
                };
                volanim();
                $that.find('.volume').hover(function() {
                    $volhover = true;
                }, function() {
                    $volhover = false;
                });
                
                
                $('body, html').bind('mousemove', function(e) {
                    clearTimeout(QY.hideControlBar);
                    $(".video_container .player").css({"opacity":"1"});
                    QY.hideControlBar = setTimeout(function(){
                        $(".video_container .player").css({"opacity":"0"});
                    },5000);
                    if($begin === true) {
                        $that.hover(function() {
                            $that.find('.player').stop(true, false).animate({'opacity' : '1'}, 0.5);
                        }, function() {
                            $that.find('.player').stop(true, false).animate({'opacity' : '0'}, 0.5);
                        });
                    }
                    
                    if($mclicking === true) {
                        $draggingProgress = true;
                        var progMove = 0,
                            buttonWidth = $that.find('.progress-button').width();
                        x = e.pageX - $that.find('.progress').offset().left;
                        if($playing === true) {
                            if(currentTime < $duration) {
                                $that.find('.play-pause').addClass('pause').removeClass('play');
                            }
                        }
                        if(x < 0) {
                            progMove = 0;
                            $spc.currentTime = 0;
                        }else if(x > progWidth) {
                            $spc.currentTime = $duration;
                            progMove = progWidth;
                        }else {
                            progMove = x;
                            currentTime = (x / progWidth) * $duration;
                            $spc.currentTime = currentTime;
                        }
                        $that.find('.progress-bar').css({'width' : progMove+'px'});
                        $that.find('.progress-button').css({'left' : (progMove-buttonWidth)+'px'});
                    }
                    if($vclicking === true){
                        y = $that.find('.volume-bar-holder').height() - (e.pageY - $that.find('.volume-bar-holder').offset().top);
                        var volMove = 0;
                        if($that.find('.volume-holder').css('display') === 'none'){
                            $vclicking = false;
                            return false;
                        }
                        if(!$that.find('.volume-icon').hasClass('volume-icon-hover')) {
                            $that.find('.volume-icon').addClass('volume-icon-hover');
                        }
                        if(y < 0 || y === 0) {
                            $volume = 0;
                            volMove = 0;
                            $that.find('.volume-icon').removeClass().addClass('volume-icon volume-icon-hover v-change-11');
                        } else if(y > $(this).find('.volume-bar-holder').height() || (y / $that.find('.volume-bar-holder').height()) === 1) {
                            $volume = 1;
                            volMove = $that.find('.volume-bar-holder').height();
                            $that.find('.volume-icon').removeClass().addClass('volume-icon volume-icon-hover v-change-1');
                        } else {
                            $volume = $that.find('.volume-bar').height() / $that.find('.volume-bar-holder').height();
                            volMove = y;
                        }
                        $that.find('.volume-bar').css({'height' : volMove+'px'});
                        $that.find('.volume-button').css({'top' : (volMove+$that.find('.volume-button').height())+'px'});
                        volanim();
                        $spc.volume = $volume;
                        $storevol = $volume;
                    }
                    if($volhover === false) {
                        $that.find('.volume-holder').stop(true, false).fadeOut(100);
                        $that.find('.volume-icon').removeClass('volume-icon-hover');
                    }else {
                        $that.find('.volume-icon').addClass('volume-icon-hover');
                        $that.find('.volume-holder').fadeIn(100);
                    }
                });

                $spc.addEventListener('ended', function() {
                    $playing = false;
                    try{
                        if($draggingProgress === false) {
                            $that.find('.play-pause').addClass('play').removeClass('pause');
                        }
                    }catch(e){
                        $that.find('.play-pause').addClass('play').removeClass('pause');
                    }finally{
                         $that.find('.play-pause').addClass('play').removeClass('pause');
                    }
                });
                $that.find('.volume-icon').bind('mousedown', function() {
                    $volume = $spc.volume;
                    if(typeof $storevol === 'undefined') {
                        $storevol = $spc.volume;
                    }
                    if($volume > 0) {
                        $spc.volume = 0;
                        $volume = 0;
                        $that.find('.volume-bar').css({'height' : '0'});
                        volanim();
                    }else {
                        $spc.volume = $storevol;
                        $volume = $storevol;
                        $that.find('.volume-bar').css({'height' : ($storevol*100)+'%'});
                        volanim();
                    }
                });

                $(".progress-button").bind(_EVT_MOVE,function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    x = e.originalEvent.changedTouches[0].pageX - $that.find('.progress').offset().left;
                    currentTime = (x / progWidth) * $duration;
                    $spc.currentTime = currentTime;
                });

                $(".progress-button").bind(_EVT_UP,function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    x = e.originalEvent.changedTouches[0].pageX  - $that.find('.progress').offset().left;
                    currentTime = (x / progWidth) * $duration;
                    $spc.currentTime = currentTime;
                });

                $('body').bind('mouseup', function() {
                    $mclicking = false;
                    $vclicking = false;
                    $draggingProgress = false;
                    if($playing === true) {
                        $spc.play();
                    }
                    bufferLength();
                });
                if(!$spc.requestFullscreen && !$spc.mozRequestFullScreen && !$spc.webkitRequestFullScreen) {
                    $('.fullscreen').hide();
                    $(".video-icon")[0].style.right="5px";
                }
                $('.fullscreen').click(function() {
                    if ($spc.requestFullscreen) {
                        $spc.requestFullscreen();
                    }else if ($spc.mozRequestFullScreen) {
                        $spc.mozRequestFullScreen();
                    }else if ($spc.webkitRequestFullScreen) {
                        $spc.webkitRequestFullScreen();
                    }
                });
            });
        });
    };
    
})(jQuery,window.QY);
