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

const previewMode = ref(false);
previewMode.value = !props.editMode;

const repeaterItem = {
	title: 'Заголовок: ',
	description: 'Описание',
};

const defaultStructure = {
	fields: {
		firstTitle: 'Заголовок 1',
		secondTitle: '(Заголовок 2)',
		image: {},
		elements: [
			{ ...repeaterItem },
		],
	},
	settings: {
		imagePosition: {
			name: 'Позиция картинки',
			value: 'md:float-right',
			type: 'select',
			options: [
				{
					name: 'Слева',
					value: 'md:float-left',
				},
				{
					name: 'md:block md:m-auto',
					value: '',
				},
				{
					name: 'Справа',
					value: 'md:float-right',
				}
			],
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
					name: 'По центру',
					value: 'text-center',
				},
				{
					name: 'Справа',
					value: 'text-right',
				}
			],
		},
		marginFromTitle: {
			name: "Отступ от заголовков сверху",
			value: "mb-0",
			type: "select",
			options: [
				{
					"name": "0",
					"value": "mb-0"
				},
				{
					"name": "1",
					"value": "mb-1"
				},
				{
					"name": "2",
					"value": "mb-2"
				},
				{
					"name": "3",
					"value": "mb-3"
				},
				{
					"name": "4",
					"value": "mb-4"
				},
				{
					"name": "5",
					"value": "mb-6"
				},
			]
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
	<div
			:class="[
				'th-block repeater-list-with-image',
				blockStructure.settings.overflow.value,
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
		<FragmentMedia
				v-model="blockStructure.fields.image"
				:editMode="!previewMode"
				:imageClass="[blockStructure.settings.imagePosition.value, 'p-[8px]']"
		/>
		<div
				:class="[
						'header',
						blockStructure.settings.titlePosition.value,
						blockStructure.settings.marginFromTitle.value,
				]"
		>
			<span class="first-title">
				<template v-if="!previewMode">
					<input v-model="blockStructure.fields.firstTitle">
				</template>
				<template v-else-if="blockStructure.fields.firstTitle">
					{{ blockStructure.fields.firstTitle }}
				</template>
			</span>
			<span class="second-title">
				<template v-if="!previewMode">
					<input v-model="blockStructure.fields.secondTitle">
				</template>
				<template v-else-if="blockStructure.fields.secondTitle">
					{{ blockStructure.fields.secondTitle }}
				</template>
			</span>
		</div>
		<div>
			<Repeater
					ref="repeaterComponent"
					:repeaterItem="repeaterItem"
					v-model="blockStructure.fields.elements"
					#default="{repeaterItems}"
			>
				<div
						v-for="(item, index) in repeaterItems"
						:key="index"
						class="mb-1"
				>
					<span class="field-title">
						<template v-if="!previewMode">
							<input v-model="repeaterItems[index].title">
						</template>
						<template v-else-if="repeaterItems[index].title">
							{{ repeaterItems[index].title }}
						</template>
					</span>
					<template v-if="!previewMode">
						<textarea v-model="repeaterItems[index].description" />
					</template>
					<template v-else-if="repeaterItems[index].description">
						{{ repeaterItems[index].description }}
					</template>
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
	</div>
</template>

<style lang="scss">
.repeater-list-with-image {
	.header {
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
