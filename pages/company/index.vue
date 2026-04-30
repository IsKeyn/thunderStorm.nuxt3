<script setup>
import List from '@/components/entity/List.vue';

const usedFilters = [];
</script>

<template>
	<List
			entity="company"
			name="Компании"
			title="Компании"
			:usedFilters="usedFilters"
	/>
</template>
