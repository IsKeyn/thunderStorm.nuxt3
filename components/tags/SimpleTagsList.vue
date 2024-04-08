<script setup>
const props = defineProps({
	tags: {
		type: Array,
		default: [],
	},
	parentClasses: {
		type: String,
		default: '',
	},
});
</script>

<template>
	<div
			v-if="tags.length > 0"
			:class="parentClasses"
	>
		<span
				class="tag"
				v-for="tag in tags"
		>
			{{ tag.name }}
		</span>
	</div>
</template>

<style lang="scss" scoped></style>
