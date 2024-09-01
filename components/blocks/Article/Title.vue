<script setup>
import ControlPanel from '@/components/blocks/extensions/ControlPanel.vue';
import FragmentMedia from '@/components/blocks/fragments/FragmentMedia.vue';

import { blocks } from '@/composables/blocks.js';
import { watch } from "vue";

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
	// structure: { // Режим редактирования
	// 	type: Boolean,
	// 	default: false,
	// },
});

import defaultSettings from '@/components/blocks/defaultSettings.json';
import defaultGroups from '@/components/blocks/defaultGroups.json';

const defaultStructure = {
	fields: {
		text: 'Заголовок',
	},
	settings: {
		titlePosition: {
			name: 'Позиция заголовка',
			value: 'text-center',
			type: 'select',
			options: [
				{
					name: 'Слева',
					value: 'text-left',
				},
				{
					name: 'Центр',
					value: 'text-center',
				},
				{
					name: 'Справа',
					value: 'text-right',
				}
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
},{ deep: true });

setBlockStructure();
</script>

<template>
	<div
			:class="[
				'th-block paragraph-block',
				blockStructure.settings.overflow.value ? blockStructure.settings.overflow.value : '',
				blockStructure.settings.marginTop.value,
				blockStructure.settings.marginRight.value,
				blockStructure.settings.marginBottom.value,
				blockStructure.settings.marginLeft.value,
				blockStructure.settings.paddinTop.value,
				blockStructure.settings.paddinRight.value,
				blockStructure.settings.paddinBottom.value,
				blockStructure.settings.paddinLeft.value,
			]"
	>
		<ControlPanel
				v-if="editMode"
				:blockIndex="blockIndex"
		/>
		<span :class="[blockStructure.settings.titlePosition.value, blockStructure.settings.classes.value, 'title']">
			<template v-if="editMode">
				<input v-model="blockStructure.fields.text" />
			</template>
			<template v-else>
				{{ blockStructure.fields.text }}
			</template>
		</span>
	</div>
</template>

<style lang="scss" scoped>
span {
	display: block;
}
</style>
