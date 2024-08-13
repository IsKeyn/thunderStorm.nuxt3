<script setup>
import Repeater from '@/components/repeaters/Repeater.vue';
import ControlPanel from '@/components/blocks/extensions/ControlPanel.vue';
import FragmentMedia from '@/components/blocks/fragments/FragmentMedia.vue';

const repeaterComponent = ref(null);

import { blocks } from '@/composables/blocks.js';

const props = defineProps({
	structure: {
		type: Object,
		default: null,
	},
	blockIndex: { // Index блока в массиве, который находится в store
		type: Number,
		default: null,
	},
	editMode: { // Режим редактирования
		type: Boolean,
		default: false,
	},
});

const defaultStructure = {
	fields: {
		images: [],
	},
	settings: {
		active: {
			value: true,
		},
		position: {
			name: 'Количество элементов в строке',
			value: '2',
			type: 'select',
			options: [
				{
					name: '1',
					value: 'col-span-12',
				},
				{
					name: '2',
					value: 'col-span-6',
				},
				{
					name: '3',
					value: 'col-span-4',
				},
				{
					name: '4',
					value: 'col-span-3',
				},
				{
					name: '6',
					value: 'col-span-2',
				}
			],
		},
		sideIndent: {
			name: 'Боковой отступ (rem)',
			value: 0,
			type: 'number',
		},
		classes: {
			name: 'Классы',
			value: '',
			type: 'text',
		},
	},
};

const {
	blockStructure,
	setBlockStructure,
} = blocks(defaultStructure, props.structure, props.blockIndex, props.editMode);

setBlockStructure();

const sideIndent = computed(() => {
	return `ml-[${blockStructure.value.settings?.sideIndent.value}rem] mr-[${blockStructure.value.settings?.sideIndent.value}rem]`;
});
</script>

<template>
	<div class="th-block gallery-block">
		<ControlPanel
				v-if="editMode"
				:blockIndex="blockIndex"
		/>
		<div :class="['gallery-main', sideIndent, blockStructure.settings.classes.value]">
			<Repeater
					ref="repeaterComponent"
					:repeaterItem="{}"
					v-model="blockStructure.fields.images"
					#default="{repeaterItems}"
			>
				<div
						v-for="(item, index) in repeaterItems"
						:key="index"
						:class="['image-item', blockStructure.settings?.position.value]"
				>
					<FragmentMedia
							v-model="repeaterItems[index]"
							:editMode="editMode"
					/>
					<button
							v-if="repeaterItems.length > 1"
							class="btn btn-primary"
							@click="repeaterComponent.deleteRepeaterItem(index)"
					>
						<font-awesome-icon :icon="['fas', 'xmark']" />
					</button>
				</div>
				<button
						v-if="editMode"
						class="btn btn-primary block"
						@click="repeaterComponent.addRepeaterItem()"
				>
					Добавить
				</button>
			</Repeater>
		</div>
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
