<script setup>
import FragmentMedia from '@/components/blockEditor/editor/blockFragments/FragmentMedia.vue';
import WysiwygEditor from '@/components/ui/WysiwygEditor.vue';

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
	<FragmentMedia
			v-model="blockStructure.fields.image"
			:editMode="!previewMode"
			:imageClass="[
					blockStructure.settings.imagePosition.value,
					'p-[8px]'
			]"
	/>
	<div :class="['whitespace-pre-wrap']">
		<template v-if="!previewMode">
			<WysiwygEditor
					v-model="blockStructure.fields.text"
					:editMode="!previewMode"
			/>
		</template>
		<template v-else>
			<div v-html="blockStructure.fields.text" />
		</template>
	</div>
</template>

<style lang="scss" scoped>
.whitespace-pre-wrap {}

textarea {
	resize: block;
}
</style>

<style lang="scss">
.Paragraph {
	@apply text-justify;
}

.item {
	color: var(--item-color);
	font-weight: 600;
}

.heal {
	color: var(--heal-color);
	font-weight: 600;
}

.ammo {
	color: var(--ammo-color);
	font-weight: 600;
}

.epic {
	color: var(--epic-color);
	font-weight: 600;
}
</style>
