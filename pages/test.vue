<script setup>
import WysiwygEditor from '@/components/ui/WysiwygEditor.vue';

const val = ref('Большой текст');
</script>

<template>
	<div>
		<WysiwygEditor
			v-model="val"
		/>
	</div>
</template>
