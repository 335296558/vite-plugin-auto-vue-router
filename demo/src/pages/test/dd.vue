<template>
	<div>
        xxxxx
    </div>
</template>

<script setup>
import { ref } from 'vue';
// const { attrs, emit, expose, slots } = useContext()
const props = defineProps({
	layout: 'default'
})
const YSHUNAG = ref(22323)

defineExpose({
	YSHUNAG
})
console.log(444)
</script>


