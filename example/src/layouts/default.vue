<template>
    <div>
        <img alt="Vue logo" src="./assets/logo.png" />
        <div><router-link to="/index">首页</router-link></div>
        <div><router-link to="/setting/index">设置页</router-link></div>
        <!-- <div><router-link to="/setting/23/67">设置参数</router-link></div> -->
        <div><router-link to="/user/28783/98767">user</router-link></div>
        <div><router-link to="/login">Login 不需要权限 走 layouts/noAuth.vue</router-link></div>
        <slot></slot>
    </div>
</template>