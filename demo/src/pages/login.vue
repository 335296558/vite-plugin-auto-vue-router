<template>
    <div>
        Login
        <br />
        <router-link to="/index">Index</router-link>
    </div>
</template>

<script setup route="noAuth">
import { useRoute } from 'vue-router';
const route = useRoute();
route.meta.layout = 'noAuth';
</script>
