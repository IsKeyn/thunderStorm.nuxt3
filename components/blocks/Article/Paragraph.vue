<script setup>
import ControlPanel from '@/components/blocks/extensions/ControlPanel.vue';
import FragmentMedia from '@/components/blocks/fragments/FragmentMedia.vue';
import WysiwygEditor from '@/components/ui/WysiwygEditor.vue';

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
		text: 'Текст параграфа',
		image: {},
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
	<div class="th-block paragraph-block">
		<div :class="[blockStructure.settings.classes.value]">
			<ControlPanel
					v-if="editMode"
					:blockIndex="blockIndex"
			/>
			<FragmentMedia
					v-model="blockStructure.fields.image"
					:editMode="editMode"
					:imageClass="[blockStructure.settings.imagePosition.value, 'p-[8px] max-w-[26rem]']"
			/>
			<template v-if="editMode">
				<WysiwygEditor
						v-model="blockStructure.fields.text"
						:editMode="editMode"
				/>
			</template>
			<template v-else>
				<div v-html="blockStructure.fields.text" />
			</template>
		</div>
	</div>
</template>

<style lang="scss" scoped>
textarea {
	resize: block;
}

.paragraph-block {
	@apply text-justify;
}
</style>

<style lang="scss">
.item {
	color: var(--item-color);
	font-weight: 600;
}
</style>
