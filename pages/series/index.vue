<script setup>
import List from '@/components/entity/List.vue';

const usedFilters = [];
</script>

<template>
	<List
			entity="series"
			name="Серии"
			title="Серии"
			:usedFilters="usedFilters"
	/>
</template>
