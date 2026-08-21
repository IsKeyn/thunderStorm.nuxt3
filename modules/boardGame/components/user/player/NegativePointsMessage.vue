<script setup>
import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth, userStore } = userFunctions();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { getSettingValue } = boardGame();

const showMessage = computed(() => {
	if (!isAuth.value) {
		return false;
	}

	if (!userStore?.player) {
		return false;
	}

	if (userStore?.player?.points < 0 && getSettingValue('max_negative_points_for_roll_game')) {
		return true;
	}

	return false;
});

const message = computed(() => {
	if (!isAuth.value) {
		return;
	}

	if (!userStore?.player) {
		return;
	}

	const points = Number(userStore?.player?.points);
	const maxNegativePoints = Number(getSettingValue('max_negative_points_for_roll_game'));

	if (points < 0 && maxNegativePoints) {
		if (points === maxNegativePoints) {
			return `Вы достигли минимального доступного значения очков (${maxNegativePoints}) и не можете ролить игру`;
		} else if (points < maxNegativePoints) {
			return `Вы превысили минимального доступного значения очков (${maxNegativePoints}) и не можете ролить игру`;
		} else if (points > maxNegativePoints) {
			return `Если вы достигните или превысите минимальное доступного значения очков (${maxNegativePoints}), то вы не сможете ролить игру`;
		}
	}

	return;
});
</script>

<template>
	<ui-itemBox
			v-if="showMessage"
			classes="red"
			:message="message"
	/>
</template>

<style lang="scss" scoped />
