<script setup>
import { blocks } from '@/composables/blocks.js'
const {
	getBlock,
	blockList,
} = blocks();

const emit = defineEmits(['selectBlock']);
</script>

<template>
	<div>
		<div
				v-for="(block, key) in blockList"
				:key="key"
				@click="$emit('selectBlock', block.componentName)"
		>
			{{ block.name }}
		</div>
	</div>
</template>
