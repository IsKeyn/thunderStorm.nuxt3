<script setup>
const props = defineProps({
	showIcon: {
		type: Boolean,
		default: true,
	},
	message: {
		type: String,
		default: null,
	},
});
</script>

<template>
	<div class="disable-box">
		<span v-if="showIcon" class="icon"><font-awesome-icon :icon="['fas', 'xmark']" /></span>
		<Preloader v-if="showPreloader" />
		<div class="message" v-if="message">{{ message }}</div>
	</div>
</template>

<style lang="scss" scoped>
.disable-box {
	@apply absolute z-[10] flex flex-col gap-0 justify-center items-center h-full w-full bg-black/80;

	.icon {
		@apply block text-[6rem];
	}

	.message {
		@apply w-[70%] text-[1.5rem] text-center;
	}
}
</style>
