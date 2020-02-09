//适配
(function () {
    //定义设计稿宽度
    var designW = 1080;
    //定义设计稿等宽 根元素字体大小
    var rootFontSize = designW/12
    //计算 设备宽度和设计稿宽度的比例
    var scale = document.documentElement.clientWidth/designW
    //设置设备宽度下，根元素的字体大小
    document.documentElement.style.fontSize = rootFontSize*scale + 'px'
})();

//取消所有元素的默认动作
(function () {
    //获取包裹元素
    var app = document.querySelector('#app')
    //阻止全局默认动作
    app.addEventListener('touchstart',function (event) {
        event.preventDefault()
    })

    //使所有的超链接可以触摸跳转
    var links = document.querySelectorAll('a[href]')
    //监听触摸结束事件
    links.forEach(function (linkNode) {
        linkNode.addEventListener('touchend',function () {
            location.href = this.href
        })
    })
})();

//头部交互
(function () {
    //是否垂直滑动

    //获取输入框元素
    var searchInput = document.querySelector('#header .search-input')
    //监听开始触摸
    searchInput.addEventListener('touchstart',function () {
        this.focus()
    })

    var app = document.querySelector('#app')
    app.addEventListener('touchstart',function (event) {
        if (event.target !== searchInput){
            searchInput.blur()
        }
    })

    //菜单点击展开
    var menuBtn = document.querySelector('#header .menu-btn')
    var menuList = document.querySelector('#header .menu-list')
    //监听事件
    menuBtn.addEventListener('touchstart',function () {
        this.classList.toggle('open')
        menuList.classList.toggle('open')
    })
})();

// 导航
(function () {
    //获取元素
    var nav = document.querySelector('#nav');
    var ul = nav.querySelector('ul');
    var navItems = nav.querySelectorAll('li');
    var dian = false

    // 触摸开始
    nav.addEventListener('touchstart', function (event) {

        window.aall = true

        //关闭transition
        ul.style.transition = "none"

        //获取起始时间
        this.stratTime = (new Date).getTime()

        //获取touch对象
        var touch = event.changedTouches[0];
        // 获取触点的初始位置
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        // 获取元素的初始位置
        this.eleX = transformCss(ul, 'translateX');
        this.dstX = 0
        dian = false
    });

    // 触摸移动
    nav.addEventListener('touchmove', function (event) {
        dian = true
        // 获取touch对象
        var touch = event.changedTouches[0];
        // 获取触点的结束位置
        var endX = touch.clientX;
        var endY = touch.clientY;
        // 获取触点移动的距离
        this.dstX = endX - this.startX;
        this.dstY = endY - this.startY;
        if (Math.abs(this.dstX) < Math.abs(this.dstY)){
            console.log(this.dstY,this.dstX)
            return
            window.aall = false
        }

        //阻止冒泡
        event.stopPropagation()
        // event.preventDefault():阻止默认行为，event.stopPropagation()：阻止冒泡

        // 计算ul新的位置:元素已经位移的距离加上触点移动的距离
        this.translateX = this.eleX + this.dstX;
        // 进行位置的限定
        if (this.translateX > 0) {
            //视口宽度和移动的比例

            //translateX是ul的位置，是数字，是一个大小，当它除以一个数字是，除出来的这个数字会随着translateX
            //的增大而增大，缩小而缩小。
            var bili = 1 - this.translateX / (nav.clientWidth*2)
            this.translateX = this.translateX * bili;
        } else if (this.translateX < nav.clientWidth - ul.offsetWidth) {
            //不能直接用translateX因为 -2000 * 0.8
            var weiyi = nav.clientWidth - ul.offsetWidth - this.translateX
            var bili = weiyi / (nav.clientWidth*2)
            weiyi *= bili
            this.translateX += weiyi
        }
        // 设置ul的位置
        transformCss(ul, 'translateX', this.translateX);
    })

    nav.addEventListener('touchend',function () {

        //加速事件
        //滑动的时间差
        var endTime = (new Date).getTime()
        var times = endTime - this.stratTime
        //求滑动的距离
        this.dstX /= times / 50
        this.translateX+=this.dstX

        var beisaier = " "
        //导航栏回弹事件
        if (this.translateX > 0){
            this.translateX = 0
            beisaier = " cubic-bezier(.17,.67,.63,2)"
        }else if (this.translateX < nav.clientWidth - ul.offsetWidth) {
            this.translateX = nav.clientWidth - ul.offsetWidth
            beisaier = " cubic-bezier(.17,.67,.63,2)"
        }
        ul.style.transition = "transform .5s" + beisaier
        transformCss(ul, 'translateX', this.translateX);
    })

    //点击切换
    navItems.forEach(function (lis) {
        lis.addEventListener('touchend',function () {
            if (dian){
                return
            }
            navItems.forEach(function (liss) {
                liss.classList.remove('active')
            })
            this.classList.add('active')
        })
    })
})();

//轮播图
(function () {
    swiper({
        el:document.querySelector('#swiper'),
        pagation:document.querySelector('#swiper .paganation'),
        isAutoPlay:true,
        duration:3000,
    })
})();

//内容滑动
(function () {

    var tabs = document.querySelectorAll('.tab')
    tabs.forEach(function (tab) {
        huadong(tab)
    })



    function huadong(tab) {
        var tabContent = tab.querySelector('.tab-content')
        var contentList = tab.querySelector('.content-list')
        var borderBottom = tab.querySelector('.border-bottom')
        var tabNavA = tab.querySelector('.tab-nav a')
        var tabNavAs = tab.querySelectorAll('.tab-nav a')
        var tabLoadings = tabContent.querySelectorAll('.tab-loading')
        var index = 0


        transformCss(tabContent,'translateX',-contentList.offsetWidth)

        tabContent.addEventListener('touchstart',function (event) {
            tabLoadings.forEach(function (gif) {
                gif.style.opacity = 0
            })
            this.juli = 0
            tabContent.style.transition = 'none'
            var touch = event.changedTouches[0]
            this.start = touch.clientX
            //元素已经位移的距离
            this.wiyi = transformCss(tabContent,'translateX')
        })

        contentList.addEventListener('touchmove',function (event) {

            // event.stopPropagation()

            var touch = event.changedTouches[0]
            var moves = touch.clientX

            //手指移动的距离
            tabContent.juli = moves - tabContent.start
            //元素的位置
            tabContent.weizhi = tabContent.juli + tabContent.wiyi
            if (tabContent.weizhi > -contentList.offsetWidth/2){
                tabContent.weizhi = 0
                tabContent.style.transition = 'transform .5s'
            }else if (tabContent.weizhi < -contentList.offsetWidth/2*3) {
                tabContent.weizhi = -contentList.offsetWidth*2
                tabContent.style.transition = 'transform .5s'
            }

            transformCss(tabContent,'translateX',tabContent.weizhi)
        })

        contentList.addEventListener('touchend',function () {
            if (Math.abs(tabContent.juli) < contentList.offsetWidth/2){
                tabContent.style.transition = 'transform .5s'
                transformCss(tabContent,'translateX',-contentList.offsetWidth)
            } else {

            }

        })

        //阻止a的过渡事件冒泡
        tabNavAs.forEach(function (a) {
            a.addEventListener('transitionend',function (event) {
                event.stopPropagation()
            })
        })

        tabContent.addEventListener('transitionend',function () {

            //如果translateX位置是 中间内容区域的位置。不加载新的数据
            if (this.translateX === -contentList.offsetWidth) {
                return;
            }

            //显示gif图片
            tabLoadings.forEach(function (gif) {
                gif.style.opacity = 1
                gif.addEventListener('transitionend',function (event) {
                    event.stopPropagation()
                })
            })

            //切换
            setTimeout(function () {
                tabContent.style.transition = 'none'
                transformCss(tabContent,'translateX',-contentList.offsetWidth)
            },2000)

            // 导航滚动条
            if (tabContent.juli > 0){
                index--
            } else {
                index++
            }
            if (index == -1){
                index = tabNavAs.length - 1
            }else if (index == tabNavAs.length){
                index = 0
            }
            transformCss(borderBottom,'translateX',index*tabNavA.offsetWidth)
        })
    }

})();

//滑动事件
(function () {
    var app = document.querySelector('#app');
    var main = document.querySelector('#main');
    var scrollBar = document.querySelector('#scrollBar');

    if (window.aall == false){
        return
    }
    touchscroll(app, main, scrollBar)
})();
