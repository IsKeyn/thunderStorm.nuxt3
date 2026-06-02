<script setup>
import List from '@/components/entity/List.vue';

const usedFilters = [];
</script>

<template>
	<List
			entity="genre"
			name="Жанры"
			title="Жанры"
			:usedFilters="usedFilters"
	/>
</template>
