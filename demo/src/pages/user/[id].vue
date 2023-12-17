<template>
    <div>
        user[id]
    </div>
</template>

<script setup>
import { ref, provide, inject } from 'vue'
import { useRoute } from 'vue-router';
const route = useRoute();
console.log(route, '[id]');
</script>