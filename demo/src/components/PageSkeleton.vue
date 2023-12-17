<template>
    <div class="wd-page-skeleton">
        <div class="wd-inner-skeleton">
            <ul class="wd-tags">
                <li v-for="item in 8" :key="item"></li>
            </ul>
            <ul class="wd-tags">
                <li v-for="item in 7" :key="item"></li>
            </ul>
            <ul class="wd-tags">
                <li v-for="item in 6" :key="item"></li>
            </ul>
            <ul class="wd-tags">
                <li v-for="item in 5" :key="item"></li>
            </ul>
            <ul class="wd-tags">
                <li v-for="item in 4" :key="item"></li>
            </ul>
            <ul class="wd-tags">
                <li v-for="item in 3" :key="item"></li>
            </ul>
            <ul class="wd-tags">
                <li v-for="item in 2" :key="item"></li>
            </ul>
            <ul class="wd-tags">
                <li v-for="item in 1" :key="item"></li>
            </ul>
            <ul class="wd-items">
                <li v-for="item in 20" :key="item"></li>
            </ul>
        </div>
    </div>
</template>

<style lang="less" scoped>
@wd-skeleton-color: #f0f2f5;
@wd-fill-color-darker: #e6e8eb;
@keyframes wd-skeleton-loading{0%{background-position:100% 50%}to{background-position:0 50%}};
.li {
    background: #f9f9f9;
    height: 30px;
    flex: 1;
    margin: 0 10px;
    background: linear-gradient(90deg, @wd-skeleton-color 25%, @wd-fill-color-darker 37%,@wd-skeleton-color 63%);
    background-size: 400% 100%;
    animation: wd-skeleton-loading 1.4s ease infinite;
    border-radius: 4px;
}
.wd-page-skeleton {
    .wd-inner-skeleton {
        .wd-tags {
            display: flex;
            align-items: center;
            list-style: none;
            flex-wrap: wrap;
            padding: 0;
            li {
                .li()
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
    }
}
</style>