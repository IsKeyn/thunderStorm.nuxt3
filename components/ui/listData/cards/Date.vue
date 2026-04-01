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

const dateFormat = computed(() => {
	let format = ' ';

	if (!props.item?.hideDay) format += 'd ';
	if (!props.item?.hideMonth) format += 'ru_mouths_name ';

	format += 'Y';

	return format;
});
</script>

<template>
	{{ getFormattedDate(dateFormat, item.date) }}
	<template v-if="item?.game_platform?.name">
		({{ item.game_platform.name }})
	</template>
	<template v-if="item?.addInfo">
		({{ item.addInfo }})
	</template>
</template>
