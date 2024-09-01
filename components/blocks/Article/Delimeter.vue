<script setup>
import ControlPanel from '@/components/blocks/extensions/ControlPanel.vue';

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
		hiddenText: 'Текст параграфа',
	},
	settings: {
		active: {
			name: 'Активность',
			value: true,
			type: 'checkbox',
		},
		classes: {
			name: 'Классы',
			value: '',
			type: 'text',
		},
		marginTop: {
			name: 'Отступ сверху',
			value: 1,
			type: 'select',
			options: [
				{
					name: 1,
					value: 'mt-[1rem]',
				},
				{
					name: 2,
					value: 'mt-[2rem]',
				},
				{
					name: 3,
					value: 'mt-[3rem]',
				}
			],
		},
		marginBottom: {
			name: 'Отступ снизу',
			value: 1,
			type: 'select',
			options: [
				{
					name: 1,
					value: 'mb-[1rem]',
				},
				{
					name: 2,
					value: 'mb-[2rem]',
				},
				{
					name: 3,
					value: 'mb-[3rem]',
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

const paddingTop = computed(() => {
	return blockStructure.value.settings?.marginTop.value ? blockStructure.value.settings.marginTop.value : '';
});

const paddingBottom = computed(() => {
	return blockStructure.value.settings?.marginBottom.value ? blockStructure.value.settings.marginBottom.value : '';
});
</script>

<template>
	<div class="th-block paragraph-block">
		<ControlPanel
				v-if="editMode"
				:blockIndex="blockIndex"
				:alwaysShow="true"
		/>
		<div :class="[paddingTop, paddingBottom]">
			<hr/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
hr {
	@apply border-[1px] border-[var(--second-border-color)];
}
</style>
