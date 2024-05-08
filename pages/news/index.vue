<script setup>
import ArticlesList from '@/components/articles/ArticlesList.vue';
</script>

<template>
	<ArticlesList
			title="Новости"
			:type="1"
			:infinityScroll="true"
	/>
</template>
