<script setup>
import FragmentMedia from '@/components/blockEditor/editor/blockFragments/FragmentMedia.vue';

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
	<span :class="[blockStructure.settings.titlePosition.value, 'title']">
		<template v-if="!previewMode">
			<input v-model="blockStructure.fields.text" />
		</template>
		<template v-else>
			{{ blockStructure.fields.text }}
		</template>
	</span>
</template>

<style lang="scss" scoped>
span {
	display: block;
}
</style>
