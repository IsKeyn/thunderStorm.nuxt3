<script setup>
import MainPageSlider from '@/components/sliders/MainPageSlider.vue';
import TitleImage from '@/components/media/TitleImage.vue';

useHead({
	title: 'Город, Покрытый Туманом - фан. сайт по вселенной Silent Hill',
	meta: [
		{
			name: 'description',
			content: 'Наш сайт представляет из себя всеобъемлящую базу знаний по вселенной Silent Hill',
		},
		{
			name: 'keywords',
			content: 'Silent Hill, The Room, Downpour, Remake, Silent Hill 2 Remake, Return to Silent Hill',
		},
	]
})
</script>

<template>
	<MainPageSlider />

<!--	<TitleImage-->
<!--			:image="{ src: '/slides/top.png', name: 'Город, покрытый туманом' }"-->
<!--			title="Город, покрытый туманом"-->
<!--			:withoutBorder="true"-->
<!--			parentClass="mb-[30px]"-->
<!--	/>-->

	<ArticlesList
			title="Новости"
			:type="1"
			:infinityScroll="true"
			:showPageHeader="false"
	/>
</template>
