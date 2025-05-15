<script setup>
import StatusEffectCard from '@/components/boardGame/user/StatusEffectCard.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
});

const currentPlayer = computed(() => {
	let curPlayer = props.boardGameInfo.players.filter((item) => item.user_id === userStore.user.id);

	if (curPlayer && curPlayer[0]) {
		return curPlayer[0];
	}
});
</script>

<template>
	<div>
		<span
				v-if="
				userStore.user && Object.keys(userStore.user).length > 0
				&& currentPlayer && currentPlayer.status_effects && currentPlayer.status_effects.filter((item) => item.active).length > 0"
				class="user-interface-title"
		>Эффекты статуса</span>
		<div class="wrapper">
			<StatusEffectCard
					v-for="(statusEffect, key) in currentPlayer.status_effects.filter((item) => item.active)"
					class="w-full"
					:element="statusEffect.statusEffect"
					:key="key"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.wrapper {
	@apply flex mb-[1rem] justify-center;
}
</style>
