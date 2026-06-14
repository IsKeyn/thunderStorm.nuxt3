<script setup>
import { media } from '@/composables/media.js'
const { getResizeImg } = media();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
});
</script>

<template>
	<div
			v-if="element.item"
			class="item-small-card"
	>
		<VTooltip>
			<img
					v-if="element.item?.image"
					:src="getResizeImg(element.item.image)"
					:alt="element.item.name"
					:title="element.item.name"
					:class="['cursor-pointer media-obj']"
					:media-id="element.item.image.id"
			>
			<span v-if="element.quantity > 1" class="quantity">{{ element.quantity }}</span>
			<template #popper>
				<div class="description">
					<div class="mb-2">
						{{ element.item.name }}
					</div>
					<div>
						{{ element.item.short_description }}
					</div>
				</div>
			</template>
		</VTooltip>
	</div>
</template>

<style lang="scss" scoped>
.item-small-card {
	@apply relative w-[60px] h-[60px];

	border: 2px solid var(--third-block-color);

	img {
		width: 100%;
	}

	.quantity {
		@apply
			absolute bottom-[-2px] right-[-2px]
			bg-[var(--third-block-color)] text-[var(--main-dark-text-color)] text-[1rem]
			block w-[1.5rem] h-[1.5rem] text-center
			flex items-center justify-center;
	}

	.description {
		@apply bg-[var(--second-bg-color)] w-[150px] text-center mb-[2px] p-[5px] text-[var(--main-dark-text-color)];
	}
}
</style>
