<script setup>
import MainPageSlider from '@/components/sliders/MainPageSlider.vue';
</script>

<template>
	<MainPageSlider />
	<ArticlesList
			title="Новости"
			:type="1"
			:infinityScroll="true"
			:showPageHeader="false"
	/>
</template>
