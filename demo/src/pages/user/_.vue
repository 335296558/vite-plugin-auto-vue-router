<template>
    <div>
        user _.vue Query+
        <span class="link" @click="router.page({ name: 'setting-bedit_card', hiddenParams:{ testing: 123 }})">params</span>
    </div>
</template>

<script setup>
import { ref, provide, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
console.log(route, '-=-');
</script>