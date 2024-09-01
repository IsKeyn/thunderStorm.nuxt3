<script setup>
import ControlPanel from '@/components/blocks/extensions/ControlPanel.vue';

import OlCard from '@/components/blocks/Article/RepeaterLists/fragments/OlCard.vue';
import UlCard from '@/components/blocks/Article/RepeaterLists/fragments/UlCard.vue';

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

const previewMode = ref(false);
previewMode.value = props.editMode;

const repeaterItem = {
	item: 'Элемент списка',
};

const defaultStructure = {
	fields: {
		elements: [
			{ ...repeaterItem },
		],
	},
	settings: {
		active: {
			value: true,
		},
		listType: {
			name: 'Тип списка',
			value: 'ul',
			type: 'select',
			options: [
				{
					name: 'Нумерованный',
					value: 'ol',
				},
				{
					name: 'Обычный',
					value: 'ul',
				}
			],
		},
		olStart: { // TODO сделать зависимоть и отображать только если listType === 'ol'
			name: 'Первый элемент нумерованного списка',
			value: 1,
			type: 'number',
		},
		editType: {
			name: 'Тип редактирования',
			value: 'simple',
			type: 'select',
			options: [
				{
					name: 'Простой',
					value: 'simple',
				},
				{
					name: 'Wysiwyg',
					value: 'wysiwyg',
				}
			],
		},

		overflow: {
			name: 'overflow',
			value: null,
			type: 'select',
			options: [
				{
					name: 'default',
					value: null,
				},
				{
					name: 'scroll',
					value: 'overflow-scroll',
				},
				{
					name: 'hidden',
					value: 'overflow-hidden',
				}
			],
		},
		marginTop: {
			name: 'Отступ сверху',
			value: 'mt-0',
			type: 'select',
			options: [
				{
					name: '0',
					value: 'mt-0',
				},
				{
					name: '1',
					value: 'mt-1',
				},
				{
					name: '2',
					value: 'mt-2',
				},
				{
					name: '3',
					value: 'mt-3',
				},
				{
					name: '4',
					value: 'mt-4',
				},
				{
					name: '5',
					value: 'mt-6',
				},
			],
		},
		marginRight: {
			name: 'Отступ справа',
			value: 'mr-0',
			type: 'select',
			options: [
				{
					name: '0',
					value: 'mr-0',
				},
				{
					name: '1',
					value: 'mr-1',
				},
				{
					name: '2',
					value: 'mr-2',
				},
				{
					name: '3',
					value: 'mr-3',
				},
				{
					name: '4',
					value: 'mr-4',
				},
				{
					name: '5',
					value: 'mr-6',
				},
			],
		},
		marginBottom: {
			name: 'Отступ снизу',
			value: 'mb-0',
			type: 'select',
			options: [
				{
					name: '0',
					value: 'mb-0',
				},
				{
					name: '1',
					value: 'mb-1',
				},
				{
					name: '2',
					value: 'mb-2',
				},
				{
					name: '3',
					value: 'mb-3',
				},
				{
					name: '4',
					value: 'mb-4',
				},
				{
					name: '5',
					value: 'mb-6',
				},
			],
		},
		marginLeft: {
			name: 'Отступ слева',
			value: 'ml-0',
			type: 'select',
			options: [
				{
					name: '0',
					value: 'ml-0',
				},
				{
					name: '1',
					value: 'ml-1',
				},
				{
					name: '2',
					value: 'ml-2',
				},
				{
					name: '3',
					value: 'ml-3',
				},
				{
					name: '4',
					value: 'ml-4',
				},
				{
					name: '5',
					value: 'ml-6',
				},
			],
		},
		paddinTop: {
			name: 'Внутренний отступ сверху',
			value: 'pt-0',
			type: 'select',
			options: [
				{
					name: '0',
					value: 'pt-0',
				},
				{
					name: '1',
					value: 'pt-1',
				},
				{
					name: '2',
					value: 'pt-2',
				},
				{
					name: '3',
					value: 'pt-3',
				},
				{
					name: '4',
					value: 'pt-4',
				},
				{
					name: '5',
					value: 'pt-6',
				},
			],
		},
		paddinRight: {
			name: 'Внутренний отступ справа',
			value: 'pr-0',
			type: 'select',
			options: [
				{
					name: '0',
					value: 'pr-0',
				},
				{
					name: '1',
					value: 'pr-1',
				},
				{
					name: '2',
					value: 'pr-2',
				},
				{
					name: '3',
					value: 'pr-3',
				},
				{
					name: '4',
					value: 'pr-4',
				},
				{
					name: '5',
					value: 'pr-6',
				},
			],
		},
		paddinBottom: {
			name: 'Внутренний отступ снизу',
			value: 'pb-0',
			type: 'select',
			options: [
				{
					name: '0',
					value: 'pb-0',
				},
				{
					name: '1',
					value: 'pb-1',
				},
				{
					name: '2',
					value: 'pb-2',
				},
				{
					name: '3',
					value: 'pb-3',
				},
				{
					name: '4',
					value: 'pb-4',
				},
				{
					name: '5',
					value: 'pb-6',
				},
			],
		},
		paddinLeft: {
			name: 'Внутренний отступ слева',
			value: 'pl-0',
			type: 'select',
			options: [
				{
					name: '0',
					value: 'pl-0',
				},
				{
					name: '1',
					value: 'pl-1',
				},
				{
					name: '2',
					value: 'pl-2',
				},
				{
					name: '3',
					value: 'pl-3',
				},
				{
					name: '4',
					value: 'pl-4',
				},
				{
					name: '5',
					value: 'pl-6',
				},
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
				:previewMode="previewMode"
				@setPreviewMode="previewMode = !previewMode"
		/>
		<OlCard
				v-if="blockStructure.settings.listType.value === 'ol'"
				:repeaterItem="repeaterItem"
				:blockStructure="blockStructure"
				:blockIndex="blockIndex"
				:editMode="previewMode"
		/>
		<UlCard
				v-if="blockStructure.settings.listType.value === 'ul'"
				:repeaterItem="repeaterItem"
				:blockStructure="blockStructure"
				:blockIndex="blockIndex"
				:editMode="previewMode"
		/>
	</div>
</template>

<style lang="scss">
.repeater-list-with-image {
	@apply mt-4 mb-4 overflow-auto;

	//img {
	//	@apply w-[10rem];
	//}

	.header {
		@apply text-center;

		.first-title,
		.second-title {
			@apply block;
		}

		.first-title {
			@apply font-bold text-[1.2rem];

			color: var(--main-title-color);
		}
	}

	.field-title {
		@apply font-bold mr-[0.3rem];
	}
}
</style>
