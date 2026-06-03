<script setup>
const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
	urlListName: {
		type: String,
		default: null,
	},
});
</script>

<template>
	<nuxt-link
			v-if="urlListName"
			:to="`/${urlListName}/${item?.slug}`"
			target="_blank"
	>
		<template v-if="item?.name">
			{{ item.name }}
		</template>
	</nuxt-link>
	<template v-else-if="item?.name">
		{{ item.name }}
	</template>
</template>

<style lang="scss" scoped>
a {
	@apply text-[var(--main-text-color)];
}
</style>
