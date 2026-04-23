<script setup>
import List from '@/components/entity/List.vue';

const usedFilters = [];
</script>

<template>
	<List
			entity="person"
			name="Персоны"
			title="Персоны"
			:usedFilters="usedFilters"
	/>
</template>
