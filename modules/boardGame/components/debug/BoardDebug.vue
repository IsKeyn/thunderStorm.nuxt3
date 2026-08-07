<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { helper } from '@/composables/helper.js'
const { route } = helper();

const requestInProgress = ref(false);

const form = ref({
	position: {
		name: 'Номер ячейки',
		value: null,
		type: 'number',
		placeholder: 'Число',
		validateRules: 'minNumber_0',
		classes: 'w-[6rem]',
		min: 1,
	},
});

const setPosition = async () => {
	if (form.value.position.value < 1) {
		error('Минимальный номер позиции равен 1');
		return false;
	}

	setPositionRequest(form.value.position.value);
}

const setPositionRequest = async (position) => {
	requestInProgress.value = true;

	try {
		const body = {
			slug: route.params.slug,
			position: position,
		};

		const response = await sendApiRequest('board-game/v2/debug/set-board-position', 'POST', body);
		requestInProgress.value = false;

		if (response) {
			alert('Позиция установлена');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

const resetBoardSeRequest = async () => {
	requestInProgress.value = true;

	try {
		const body = {
			slug: route.params.slug,
		};

		const response = await sendApiRequest('board-game/v2/debug/reset-board-cell-effects', 'POST', body);
		requestInProgress.value = false;

		if (response) {
			alert('Эффекты игрового поля сброшены');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div>
		Ведите номер ячейки игрового поля и нажмите кнопку "Переместить"
		<form @submit.prevent="setPosition" class="flex">
			<FormGenerator
					name="cell"
					:element="form.position"
					:showTitle="false"
					validateErrorPosition="bottom"
					labelClasses="lg:mr-4 mt-[10px] mb-[10px] block"
					:fieldClasses="form.position.classes"
			/>
			<ActionButton
					buttonName="Переместить"
					:actionInProgress="requestInProgress"
			/>
		</form>
	</div>
	<ActionButton
			buttonName="Сбросить все использованные эффекты игрового поля"
			:actionInProgress="requestInProgress"
			@startAction="resetBoardSeRequest()"
	/>
</template>

<style lang="scss" scoped>

</style>
