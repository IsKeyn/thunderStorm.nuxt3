<script setup>
import List from '@/components/entity/List.vue';

const usedFilters = [];
</script>

<template>
	<List
			entity="character"
			name="Персонажи"
			title="Персонажи"
			:usedFilters="usedFilters"
	/>
</template>
