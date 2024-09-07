<script setup>
import Repeater from '@/components/repeaters/Repeater.vue';
import FragmentMedia from '@/components/blockEditor/editor/blockFragments/FragmentMedia.vue';

const repeaterComponent = ref(null);

const props = defineProps({
	blockStructure: {
		type: Object,
		default: null,
	},
	blockIndex: { // Index блока в массиве, который находится в store
		type: Number,
		default: null,
	},
	previewMode: { // Режим редактирования
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<div :class="[
			'gallery-main',
			sideIndent,
			blockStructure.settings.classes.value
	]">
		<Repeater
				ref="repeaterComponent"
				:repeaterItem="{}"
				v-model="blockStructure.fields.images"
				#default="{repeaterItems}"
		>
			<div
					v-for="(item, index) in repeaterItems"
					:key="index"
					:class="['image-item', blockStructure.settings?.rowCount.value]"
			>
				<FragmentMedia
						v-model="repeaterItems[index]"
						:editMode="!previewMode"
				/>
				<button
						v-if="!previewMode && repeaterItems.length > 1"
						class="btn btn-primary"
						@click="repeaterComponent.deleteRepeaterItem(index)"
				>
					<font-awesome-icon :icon="['fas', 'xmark']" />
				</button>
			</div>
			<button
					v-if="!previewMode"
					class="btn btn-primary block"
					@click="repeaterComponent.addRepeaterItem()"
			>
				Добавить
			</button>
		</Repeater>
	</div>
</template>

<style lang="scss">
.gallery-main {
	@apply grid grid-cols-12 gap-x-[1rem] gap-y-[1rem];

	.image-item {
		@apply relative;

		img {
			@apply w-full;
		}

		&:hover button {
			@apply block;
		}

		button {
			@apply absolute top-0 right-0 hidden;
		}
	}
}
</style>
