<script setup>
import ControlPanel from '@/components/blocks/extensions/ControlPanel.vue';
import FragmentMedia from '@/components/blocks/fragments/FragmentMedia.vue';

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
		text: 'Заголовок',
	},
	settings: {
		active: {
			name: 'Активность',
			value: true,
			type: 'checkbox',
		},
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
	},
};

const {
	blockStructure,
	setBlockStructure,
} = blocks(defaultStructure, props.structure, props.blockIndex, props.editMode);

setBlockStructure();
</script>

<template>
	<div class="th-block paragraph-block">
		<ControlPanel
				v-if="editMode"
				:blockIndex="blockIndex"
		/>
		<span :class="blockStructure.settings.titlePosition.value">
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
