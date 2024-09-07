<script setup>
import ControlPanel from '@/components/blocks/extensions/ControlPanel.vue';
import Repeater from '@/components/repeaters/Repeater.vue';
import FragmentMedia from '@/components/blocks/fragments/FragmentMedia.vue';

import defaultSettings from '@/components/blocks/json/defaultSettings.json';
import defaultGroups from '@/components/blocks/json/defaultGroups.json';

import { watch } from "vue";
import { blocks } from '@/composables/blocks.js';

const repeaterComponent = ref(null);

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
		rowCount: {
			name: 'Количество элементов в строке',
			value: 'md:col-span-3',
			type: 'select',
			options: [
				{
					name: '1',
					value: 'md:col-span-12',
				},
				{
					name: '2',
					value: 'md:col-span-6',
				},
				{
					name: '3',
					value: 'md:col-span-4',
				},
				{
					name: '4',
					value: 'md:col-span-3',
				},
				{
					name: '6',
					value: 'md:col-span-2',
				}
			],
		},
		sideIndent: {
			name: 'Боковой отступ (rem)',
			value: 'md:ml-0 md-mr-0',
			type: 'select',
			options: [
				{
					name: '0',
					value: 'md:ml-0 md-mr-0',
				},
				{
					name: '50px',
					value: 'md:ml-[50px] md:mr-[50px]',
				},
				{
					name: '100px',
					value: 'md:ml-[100px] md:mr-[100px]',
				},
			],
		},
		...defaultSettings,
	},
	settingGroups: {
		...defaultGroups,
	},
};

const {
	blockStructure,
	setBlockStructure,
} = blocks(defaultStructure, props.structure, props.blockIndex, props.editMode);

watch(() => props.structure, (newValue) => { // TODO костылИЩЕ! Спасает от ситуации когда меняешь местами два одинаковых блока
	setBlockStructure();
}, { deep: true });

setBlockStructure();

</script>

<template>
	<div class="th-block gallery-block">
		<ControlPanel
				v-if="editMode"
				:blockIndex="blockIndex"
		/>
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
							:editMode="editMode"
					/>
					<button
							v-if="editMode && repeaterItems.length > 1"
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
