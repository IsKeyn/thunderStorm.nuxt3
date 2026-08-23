<script setup>
import { onMounted, onUnmounted, ref } from "vue";

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { addTextToPoints } = boardGame();

let playerResultMessageInterval = null;

const playerResultMessage = ref('');
const playerResultMessageStep = ref(0);

const pointsWithText = computed(() => {
	return addTextToPoints(userStore.player.points);
});

const changePlayerResultMessageSetInt = () => {
	playerResultMessageInterval = setInterval(() => {
		changePlayerResultMessage();
	}, 5000);
}

const changePlayerResultMessage = () => {
	playerResultMessageStep.value++;

	if (playerResultMessageStep.value > 3) {
		playerResultMessageStep.value = 1;
	}

	// Количество очков
	if (playerResultMessageStep.value === 1) {
		playerResultMessage.value = pointsWithText.value;
	}

	// Позиция на игровом поле
	if (playerResultMessageStep.value === 2) {
		playerResultMessage.value = 'позиция на поле ' + userStore.player.position.position;
	}

	// Финальный результат
	if (playerResultMessageStep.value === 3) {
		playerResultMessage.value = 'итог ' + userStore.player.full_points;
	}
}

onUnmounted(() => {
	if (playerResultMessageInterval) clearInterval(playerResultMessageInterval);
});

onMounted(() => {
	changePlayerResultMessage();
	changePlayerResultMessageSetInt();
});
</script>

<template>
	<template v-if="userStore.player && Object.keys(userStore.player).length > 0">
		<span v-if="userStore.player.active" class="points">
			<Transition name="fade" mode="out-in"><span :key="playerResultMessageStep" class="cursor-pointer" @click="changePlayerResultMessage()">{{ playerResultMessage }}</span></Transition> (<font-awesome-icon icon="fa-solid fa-bolt" />x{{ userStore.player.streak }})
		</span>
		<span v-else>
			<template v-if="userStore.player.not_active_reason">
				{{ userStore.player.not_active_reason }}
			</template>
			<template>
				Ваш профиль игрока не активен
			</template>
		</span>
	</template>
	<template v-else>
		<span>Вы не участник ивента, примите участие через страницу действия</span>
	</template>
</template>

<style lang="scss" scoped />
