<script setup>
const props = defineProps({
	seo: {
		type: Object,
		default: {},
	},
});

useHead({
	title: props.seo?.title ? props.seo.title : '',
	meta: [
		{
			name: 'description',
			content: props.seo?.description ? props.seo.description : '',
		},
		{
			name: 'keywords',
			content: props.seo?.keywords ? props.seo.keywords : '',
		},
	]
})
</script>

<template>
	<div></div>
</template>
