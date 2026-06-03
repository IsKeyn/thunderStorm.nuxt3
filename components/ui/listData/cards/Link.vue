<script setup>
const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<nuxt-link
			v-if="item.url && item.name"
			:to="item.url"
			target="_blank"
			rel="nofollow"
	>
		{{ item.name }}
	</nuxt-link>
</template>

<style lang="scss" scoped>
a {
	@apply text-[var(--main-text-color)];
}
</style>
