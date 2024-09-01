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
		active: {
			value: true,
		},
		imagePosition: {
			name: 'Позиция картинки',
			value: 'float-right',
			type: 'select',
			options: [
				{
					name: 'Слева',
					value: 'float-left',
				},
				{
					name: 'Block',
					value: '',
				},
				{
					name: 'Справа',
					value: 'float-right',
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
	<div class="th-block repeater-list-with-image">
		<ControlPanel
				v-if="editMode"
				:blockIndex="blockIndex"
		/>
		<FragmentMedia
				v-model="blockStructure.fields.image"
				:editMode="editMode"
				:imageClass="[blockStructure.settings.imagePosition.value, 'p-[8px] max-w-[26rem]']"
		/>
		<div class="header">
			<span class="first-title">
				<template v-if="editMode">
					<input v-model="blockStructure.fields.firstTitle">
				</template>
				<template v-else-if="blockStructure.fields.firstTitle">
					{{ blockStructure.fields.firstTitle }}
				</template>
			</span>
			<span class="second-title">
				<template v-if="editMode">
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
						<template v-if="editMode">
							<input v-model="repeaterItems[index].title">
						</template>
						<template v-else-if="repeaterItems[index].title">
							{{ repeaterItems[index].title }}
						</template>
					</span>
					<template v-if="editMode">
						<textarea v-model="repeaterItems[index].description" />
					</template>
					<template v-else-if="repeaterItems[index].description">
						{{ repeaterItems[index].description }}
					</template>
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
