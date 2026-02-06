<script setup>
const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<template v-if="item?.name">
		{{ item.name }}
	</template>
</template>
