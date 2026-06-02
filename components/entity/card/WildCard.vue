<script setup>
import { date } from '@/composables/date.js';
const {
	getFormattedDate
} = date();

const props = defineProps({
	data: {
		type: Object,
		default: {},
	},
	entity: {
		type: String,
		required: true,
	},
	target: {
		type: String,
		default: '',
	},
	listPage: {
		type: String,
		required: true,
	},
});
</script>

<template>
	<div class="wild-card">
		<div class="wrapper">
			<img :src="data?.covers?.[0]?.src ? data.covers[0].src : '/images/silent-hill/sh_no_image_cover.webp'">
			<div class="fields">
				<span class="name">{{ data.name }}</span>
				<span class="description">{{ data.description }}</span>

				<span v-if="data?.role?.name" class="mt-4">
					{{ data.role.name }}
				</span>
			</div>
		</div>
		<router-link
				v-if="data.slug"
				:target="target"
				class="full-block"
				:to="`/${listPage}/${data.slug}`"
		/>
	</div>
</template>

<style lang="scss" scoped>
.wild-card {
	@apply relative;

	.wrapper {
		@apply flex gap-6 w-full;

		img {
			@apply w-[90px];
		}

		.fields {
			span {
				@apply block;
			}
		}
	}

	a.full-block {
		@apply absolute w-full h-full bottom-0 left-0;
	}
}
</style>
