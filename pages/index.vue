<script setup>
import MainPageSlider from '@/components/sliders/MainPageSlider.vue';
import TitleImage from '@/components/media/TitleImage.vue';
</script>

<template>
	<TitleImage
			:image="{ src: '/slides/top.png', name: 'Город, покрытый туманом' }"
			title="Город, покрытый туманом"
			:withoutBorder="true"
			parentClass="mb-[30px]"
	/>
<!--	<MainPageSlider />-->
	<ArticlesList
			title="Новости"
			:type="1"
			:infinityScroll="true"
			:showPageHeader="false"
	/>
</template>
