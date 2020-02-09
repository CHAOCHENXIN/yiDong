(function (w) {
    /**
     * 页面触摸滚动
     * @param app   内容的包裹元素
     * @param content   内容区域
     * @param scrollBar   滚动条元素
     */
    w.touchscroll = function(app, content, scrollBar){

        if (scrollBar) {
            // 计算比例
            var sliderScale = app.clientHeight / content.offsetHeight;
            //如果比例>=1
            if (sliderScale >= 1) {
                scrollBar.style.display = 'none';
            }
            // 计算滚动条高度
            scrollBar.style.height = app.clientHeight * sliderScale + 'px';
            // 强制把滚动条的不透明·度设置为0
            scrollBar.style.opacity = 0;
            //给滚动条添加过渡时间
            scrollBar.style.transition = 'opacity .3s';
        }



        // 手指按下 开始触摸
        content.addEventListener('touchstart', function (event) {
            // 停止定时
            clearInterval(this.intervalId);
            if (scrollBar) {
                clearInterval(scrollBar.intervalId);
            }
            // 获取触点对象
            var touch = event.changedTouches[0];
            // 获取触点的起始位置
            this.startY = touch.clientY;
            // 获取元素的起始位置
            this.eleY = transformCss(content, 'translateY');
            // 初始化手指滑动距离
            this.dstY = 0;
            // 计算当前时间
            this.startTime = (new Date).getTime();

            // 滚动条显示
            if (scrollBar) {
                scrollBar.style.opacity = 1;
            }

        });
        //手指移动 触摸移动
        content.addEventListener('touchmove', function (event) {
            //获取触点对象
            var touch = event.changedTouches[0];
            // 获取触点的结束位置
            var endY = touch.clientY;
            // 计算滑动的距离
            this.dstY = endY - this.startY;

            // 计算内容的位置
            var translateY = this.eleY + this.dstY;

            // 如果到达临界值，开始橡皮筋
            if(translateY > 0) {
                // 计算比例
                var scale = 1 - translateY / (app.clientHeight * 1.8);
                // 重新计算位置
                translateY *= scale

            } else if (translateY < app.clientHeight - content.offsetHeight) {
                // 计算内容距离视口下边的距离
                var bottomY = app.clientHeight - (content.offsetHeight + translateY) ;
                // 计算比例
                var scale =  1 - bottomY / (app.clientHeight * 1.8);
                // 重新计算容距离视口下边的距离
                bottomY *= scale;
                // 计算新的位置
                translateY = (app.clientHeight - bottomY) - content.offsetHeight
            }

            // 设置内容位置
            transformCss(content, 'translateY', translateY);

            // 计算滚动条的位置
            if (scrollBar) {
                transformCss(scrollBar, 'translateY', -translateY * sliderScale);
            }

        });
        //手指离开 触摸结束
        content.addEventListener('touchend', function(event){
            //计算结束事件
            var endTime = (new Date).getTime();
            // 计算时间间隔
            var dstTime = endTime - this.startTime;
            // 计算加速距离
            var speed = this.dstY / dstTime * 200;
            //获取当前位置
            var translateY = transformCss(content, 'translateY');
            // 加上加速距离
            translateY += speed;

            // 定义过渡类型
            var type = 'ease';
            // 临界值 执行回弹
            if (translateY > 0) {
                translateY = 0;
                type = 'backEaseOut';
            } else if (translateY < app.clientHeight - content.offsetHeight) {
                translateY =  app.clientHeight - content.offsetHeight;
                type = 'backEaseOut';
            }

            moveTo(content, translateY, 500, type);
            if (scrollBar) {
                moveTo(scrollBar, -translateY * sliderScale, 500, type);
            }

        });


        /*
        * 设置元素的位置， 带过渡效果
        * @param node 元素
        * @param target 目标值
        * @param duration  过渡时间
        * @param type  值： linear 、 ease 、 backEaseOut
        * */
        function moveTo(node, target, duration, type='ease') {
            /*Tween类*/
            var Tween = {
                linear: function(t,b,c,d){ return c*t/d + b; },
                ease: function(t,b,c,d){
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                },
                backEaseOut: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                }
            };

            // 定义tween算法的参数
            var t = 0;  //当前时间
            var b = transformCss(node, 'translateY'); //初始位置
            var c = target - b; //位置变化量
            var d = duration; //过渡总时间
            var delay = 20;  //定时时间间隔

            node.intervalId = setInterval(function(){
                // 时间变换
                t += delay;
                // 计算此时此刻元素的位置
                var translateY = Tween[type](t, b, c, d);
                // 设置元素的位置
                transformCss(node, 'translateY', translateY);
                // 判断定时是否停止
                if (t >= d) {
                    clearInterval(node.intervalId);
                    if (scrollBar) {
                        scrollBar.style.opacity = 0; //隐藏滚动条
                    }

                }

            }, delay)
        }
    }

})(window);