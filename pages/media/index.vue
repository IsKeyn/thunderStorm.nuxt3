<script setup>
import PageHeader from '@/components/layout/PageHeader.vue';
import GalleryType1Component from '@/components/media/GalleryType1Component.vue';

const breadCrumbs = ref([
	{
		name: 'Галерея',
		href: '/media/',
	},
]);
</script>

<template>
	<div>
		<PageHeader
			title="Галерея"
			:breadCrumbs="breadCrumbs"
		/>
		<GalleryType1Component />
	</div>
</template>
