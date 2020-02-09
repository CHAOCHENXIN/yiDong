(function (w) {

    /**
     * @param options 指定配置选项
     */
    w.swiper = function(options){
        // 获取选项
        var swiper = options.el;  //获取包裹元素  必须
        var pagation = options.pagation || false;  // 获取小圆点的包裹元素  可选
        var isAutoPlay = options.isAutoPlay || false; //是否自动播放， 默认是false
        var duration = options.duration || 5000; //自动播放的时间间隔

        // 获取元素
        var swiperWrapper = swiper.querySelector('.swiper-wrapper');
        var swiperItems = swiper.querySelectorAll('.swiper-item');
        var index = 0;  //表示轮播图的索引
        var itemLength = swiperItems.length; // 为克隆前， 轮播项目的数量

        // 给包裹元素添加类名
        swiper.classList.add('swiper.less');

        // 判断是否有小圆点
        if (pagation) {
            //给pagation添加类型
            pagation.classList.add('pagation');
            // 创建小圆点
            for (var i = 0; i < itemLength; i ++) {
                var span = document.createElement('span');
                pagation.appendChild(span);
            }
            //获取小圆点组成的集合
            var pagationItems = swiper.querySelectorAll('.pagation span');
        }



        // 把所有的图片克隆一份加入 swiperWrapper
        swiperWrapper.innerHTML += swiperWrapper.innerHTML;
        // 重新获取轮播图项目的集合
        swiperItems = swiper.querySelectorAll('.swiper-item');


        // 动态的设置swiperWrapper和swiperItem的宽度
        swiperWrapper.style.width = swiperItems.length * 100 + '%';
        swiperItems.forEach(function (swiperItem) {
            swiperItem.style.width = 100 / swiperItems.length + '%';
        });


        // 初始化
        setSwiper(index);

        // swiperWrpper可以被拖动
        // 手指按下
        swiper.addEventListener('touchstart', function (event) {
            // 去掉过渡
            swiperWrapper.style.transition = 'none';

            // 关闭定时器
            if (isAutoPlay) {
                clearInterval(intervalId);
            }


            // 如果此时索引是0 刷的一下，变为索引是 itemLength
            if (index <= 0) {
                index = itemLength;
                transformCss(swiperWrapper, 'translateX', -index * swiper.clientWidth)
            } else if (index >= swiperItems.length - 1) {
                index = itemLength - 1;
                transformCss(swiperWrapper, 'translateX', -index * swiper.clientWidth)
            }

            // 获取触点对象
            var touch = event.changedTouches[0];
            // 获取触点的初始位置 水平方向
            this.startX = touch.clientX;
            // 获取触点的初始位置 垂直方向
            this.startY = touch.clientY;
            // 获取swiperWrapper的初始位置
            this.eleX = transformCss(swiperWrapper, 'translateX');
            //设置滑动距离的初始值
            this.dstX = 0;
            // 计算开始触摸时的时间
            this.startTime = (new Date).getTime();
            // 标记是否是第一次触发touchmove
            this.isFirstMove = true;
            // 记录是水平滑动还是垂直滑动
            this.isHorizontal = true;   //默认水平滑动
        });
        // 手指移动
        swiper.addEventListener('touchmove', function (event) {
            //是否是水平滑动
            if (!this.isHorizontal) {
                return; //不执行水平滑动的逻辑
            }

            // 获取触点对象
            var touch = event.changedTouches[0];
            // 获取触点此时的位置 水平方向
            var endX = touch.clientX;
            // 获取触点此时位置 垂直方向
            var endY = touch.clientY;
            //计算手指滑动的距离 水平方向
            this.dstX = endX - this.startX;
            // 计算手指滑动距离 垂直方向
            var dstY = endY - this.startY;

            //是否是第一次触发 touchmove
            if (this.isFirstMove) {
                this.isFirstMove = false; //已经不是第一次了
                //判断是水平移动还是垂直移动
                if (Math.abs(dstY) > Math.abs(this.dstX)) { //垂直移动
                    this.dstX = 0; //清空水平方向的滑动距离
                    this.isHorizontal = false;
                    return;
                }
            }


            // 计算swiperWrapper的位置
            transformCss(swiperWrapper, 'translateX', this.eleX + this.dstX);
            //  阻止垂直方向的滑动
            event.preventDefault();
        });
        //手指离开
        swiper.addEventListener('touchend', function () {
            // 添加过渡
            swiperWrapper.style.transition = 'transform .5s';

            // 获取触摸结束时的时间
            var endTime = (new Date).getTime();
            // 计算时间间隔
            var dstTime = endTime - this.startTime;

            // 判断时间间隔
            if (dstTime < 300) { // 用户滑得快
                if (this.dstX < 0) { //下一张 从右往左
                    index ++;
                } else if (this.dstX > 0) { // 上一张
                    index --;
                }
            } else {  //用户滑得慢
                // 判断上一张下一张 当前张
                index = -Math.round(transformCss(swiperWrapper, 'translateX') / swiper.clientWidth);
            }

            // 设置位置
            setSwiper(index);

            if (isAutoPlay) {
                // 开启定时器
                intervalId = setInterval(runPlay, duration);
            }

        });

        // 定时轮播
        if (isAutoPlay) {
            var intervalId = setInterval(runPlay, duration);
        }


        // swiperWrapper过渡完成之后
        swiperWrapper.addEventListener('transitionend', function () {
            // 等到过渡结束之后再判断
            if (index >= swiperItems.length - 1) {
                //快速切换至 itemLength-1
                index = itemLength - 1;
                swiperWrapper.style.transition = 'none';
                setSwiper(index);
            }
        });

        /**
         * 定时器函数
         * */
        function runPlay(){
            // 索引值+1
            index ++;
            // 添加过渡效果
            swiperWrapper.style.transition = 'transform .5s';
            setSwiper(index);
        }

        /**
         * 设置ul的位置和按钮高亮
         * */
        function setSwiper(m){
            // 设置swiperWrapper的位置
            var translateX = -m * swiper.clientWidth;
            transformCss(swiperWrapper, 'translateX', translateX);

            //如果设置开启小圆点
            if (pagation) {
                // 对应的控制按钮高亮
                pagationItems.forEach(function (pagationItem) {
                    pagationItem.classList.remove('active');
                });
                pagationItems[m%itemLength].classList.add('active');
            }
        }
    }

})(window);