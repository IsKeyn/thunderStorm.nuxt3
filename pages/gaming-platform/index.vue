<script setup>
import List from '@/components/entity/List.vue';

const usedFilters = [];
</script>

<template>
	<List
			entity="gaming-platform"
			name="Игровые платформы"
			title="Игровые платформы"
			:usedFilters="usedFilters"
	/>
</template>
