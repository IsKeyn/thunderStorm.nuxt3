<script setup>
import BoardGameList from '@/modules/boardGame/components/pages/BoardGameList.vue';

import { settings } from '@/composables/settings.js'
const { getSettingFirstValue } = settings();
</script>

<template>
	<BoardGameList v-if="!Boolean(Number(getSettingFirstValue('disable-events')))" />
	<ui-itemBox
			v-else
			classes="red"
			message="В данный момент ивенты отключены"
	/>
</template>
