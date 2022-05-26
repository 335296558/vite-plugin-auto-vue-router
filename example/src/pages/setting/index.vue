<template>
    <div>
        我是pages/setting/index.vue
    </div>
</template>
<script>
export default {
    displayName: 'setting'
}
</script>

<script setup>
import { ref } from 'vue'
const YSHUNAG = ref(22323)
defineExpose({
	YSHUNAG
})
console.log(YSHUNAG, 'YSHUNAG')
</script>