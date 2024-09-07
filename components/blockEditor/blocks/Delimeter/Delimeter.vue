<script setup>
import { blocks } from '@/composables/blocks.js';

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
	<div class="th-block paragraph-block">
		<ControlPanel
				v-if="previewMode"
				:blockIndex="blockIndex"
				:alwaysShow="true"
		/>
		<div :class="[
				blockStructure.value.settings?.marginTop.value,
				blockStructure.value.settings?.marginBottom.value
			]">
			<hr/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
hr {
	@apply border-[1px] border-[var(--second-border-color)];
}
</style>
