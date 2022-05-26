<template>
    <div class="wd-layout-skeleton">
        <div class="wd-layout-skeleton-inner">
            <div class="wd-top-sider">
                <ul class="wd-tags">
                    <li style="width: 200px;flex: none;"></li>
                    <li v-for="item in 8" :key="item"></li>
                </ul>
            </div>
            <div class="wd-main-box">
                <div class="wd-left-sider">
                    <ul class="wd-items" style="width: 200px;">
                        <li v-for="item in 15" :key="item"></li>
                    </ul>
                </div>
                <div class="wd-main">
                    <ul class="wd-tags">
                        <li v-for="item in 5" :key="item"></li>
                    </ul>
                    <ul class="wd-tags">
                        <li v-for="item in 2" :key="item"></li>
                    </ul>
                    <ul class="wd-items">
                        <li v-for="item in 20" :key="item"></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@wd-skeleton-color: #f0f2f5;
@wd-fill-color-darker: #e6e8eb;
@keyframes wd-skeleton-loading{0%{background-position:100% 50%}to{background-position:0 50%}};
.li {
    background: #f9f9f9;
    height: 48px;
    flex: 1;
    margin: 0 10px;
    background: linear-gradient(90deg, @wd-skeleton-color 25%, @wd-fill-color-darker 37%,@wd-skeleton-color 63%);
    background-size: 400% 100%;
    animation: wd-skeleton-loading 1.4s ease infinite;
    border-radius: 4px;
}
.wd-layout-skeleton {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0px;
    top: 0px;
    background: #fff;
    .wd-tags {
        display: flex;
        align-items: center;
        list-style: none;
        padding: 0;
        li{
            .li();
        }
    }
    .wd-items {
        list-style: none;
        padding: 0;
        li {
            .li();
            margin: 20px 10px;
        }
    }
    .wd-top-sider {
        
    }
    .wd-main-box {
        display: flex;
        align-items: flex-start;
        .wd-left-sider {
            width: 200px;
            height: 100%;
        }
        .wd-main{
            flex: 1;
            li {
                height: 28px;
            }
        }
    }
}
</style>