<script setup>
definePageMeta({
	layout: 'board-game',
});

import PlayersList from '@/modules/boardGame/components/pages/PlayersList.vue';
</script>

<template>
	<PlayersList
			filterNamePostfix="main_players"
	/>
</template>
