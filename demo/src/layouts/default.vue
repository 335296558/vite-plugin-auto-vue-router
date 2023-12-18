<template>
    <div>
        <br />
        <br />
        <router-link class="link" to="/index">首页</router-link>
        <router-link class="link" to="/setting/index">设置页</router-link>
        <router-link class="link" to="/user/28783/98767">user</router-link>
        <router-link class="link" to="/login">Login 不需要权限 走 layouts/noAuth.vue</router-link>
        <br />
        <br />
    </div>
    <slot></slot>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style scoped>
.link {
    padding: 5px 15px;
    background: #0673fa;
    margin: 15px;
    color: #fff;
}
</style>