<script setup>
import ItemCard from '@/components/boardGame/inventory/ItemCard.vue';

const emit = defineEmits(['setOpenedImage']);

const props = defineProps({
	itemList: {
		type: Array,
		default: [],
	},
});
</script>

<template>
	<div class="wrapper">
		<span v-if="itemList.length === 0">Предметов нет</span>
		<ItemCard
				v-else
				v-for="(element, key) in itemList"
				:key="key"
				:element="element"
				:useLightBox="true"
				@setOpenedImage="emit('setOpenedImage', $event)"
		/>
	</div>
</template>

