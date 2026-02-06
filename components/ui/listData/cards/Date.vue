<script setup>
import { date } from '@/composables/date.js';
const {
	getFormattedDate
} = date();

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	{{ getFormattedDate('d ru_mouths_name Y', item.date) }}
	<template v-if="item?.game_platform?.name">
		({{ item.game_platform.name }})
	</template>
	<template v-if="item?.addInfo">
		({{ item.addInfo }})
	</template>
</template>
