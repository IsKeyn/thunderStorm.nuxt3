<script setup>
import Preloader from '@/components/ui/Preloader.vue';
</script>

<template>
	<div class="preloader-container">
		<preloader />
	</div>
</template>

<style lang="scss" scoped>
.preloader-container {
	@apply flex justify-center items-center min-h-[10rem] text-[5rem] text-[var(--main-title-color)];
}
</style>
