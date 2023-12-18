<template>
	<div :class="$style.errorPage">
		<div :class="$style.errorCell">
            <div :class="$style.content">
                找不到该页面, <a @click="$router.back()">返回</a>
            </div>
		</div>
	</div>
</template>

<script setup>
import { useRoute } from 'vue-router';
//! @__ROUTE_LAYOUT__: 'noAuth'
</script>

<style module lang="scss" scoped>
.errorPage {
	width: 100%;
	// position: absolute;
	// left: 0px;
	// top: 0px;
	height: 100%;
	display: flex;
    align-items: center;
	justify-content: center;
	.icon {
		width: 400px;
		display: block;
		margin: 0 auto;
	}
	.content {
		display: block;
		text-align: center;
		padding-top: 60px;
		font-size: 16px;
	}
}
</style>
