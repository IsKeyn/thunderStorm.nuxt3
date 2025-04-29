<script setup>
import ItemCard from '@/components/boardGame/inventory/ItemCard.vue';

const emit = defineEmits(['setOpenedImage']);

const props = defineProps({
	userInfo: {
		type: Object,
		default: {},
	},
});
</script>

<template>
	<div v-if="userInfo">
		<div class="mb-[2rem]">
			<h2 v-if="userInfo.player_info" class="inv-title">Предметы игрока {{ userInfo.player_info.user.name }}</h2>
			<span v-if="userInfo.inventory && userInfo.inventory.filter(item => !item.has_used).length === 0">Предметов нет</span>
			<div
					v-for="(element, key) in userInfo.inventory.filter(item => !item.has_used)"
					class="wrapper"
					:key="key"
			>
				<ItemCard
						:element="element.item"
						@setOpenedImage="emit('setOpenedImage', $event)"
				/>
			</div>
		</div>
		<div>
			<h2 v-if="userInfo.player_info" class="inv-title">Использованные предметы игрока {{ userInfo.player_info.user.name }}</h2>
			<span v-if="userInfo.inventory && userInfo.inventory.filter(item => item.has_used).length === 0">Предметов нет</span>
			<div
					v-for="(element, key) in userInfo.inventory.filter(item => item.has_used)"
					class="wrapper"
					:key="key"
			>
				<ItemCard
						:element="element.item"
						@setOpenedImage="emit('setOpenedImage', $event)"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.inv-title {
	@apply font-bold mb-4 uppercase;
}
</style>
