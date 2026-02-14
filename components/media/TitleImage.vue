<script setup>
const props = defineProps({
	image: {
		type: Object,
		default: {},
		required: true,
	},
	title: {
		type: String,
		default: null,
	},
	parentClass: {
		type: String,
		default: null,
	},
	withoutBorder: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<div
			v-if="Object.keys(image).length > 0"
			:class="['image-box', parentClass, withoutBorder ? 'without-border' : '']"
	>
		<img
				class="article-image media-obj"
				:media-id="image.id"
				:src="image.src"
				:alt="image.name"
				:name="image.name"
		/>
		<span
				v-if="title"
				class="flip-text-box left"
		>
			{{ title }}
		</span>
	</div>
</template>

<style lang="scss" scoped>
.image-box {
	@apply
		relative
		flex justify-center items-center
		h-[350px]
		truncate
		cursor-pointer
	;

	.article-image {
		@apply w-full h-full object-cover;
	}
}
</style>
