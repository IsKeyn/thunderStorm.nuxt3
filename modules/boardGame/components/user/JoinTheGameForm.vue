<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { ref } from "vue";

const { stars } = useConfetti();

import { helper } from '@/composables/helper.js'
const { route, hasWebSocked } = helper();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { refreshLayoutData } = boardGame();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { validate } from '@/composables/validate.js';
const { validateElement } = validate();

const form = ref(
		{
			accept_with_rules: {
				name: 'Я ознакомился с правилами и описанием ивента',
				showTitle: false,
				html: `Я ознакомился с <a href="/e/${route.params.slug}/rules/" class="underline" target="_blank">правилами и описанием ивента</a> и согласен с ними`,
				value: false,
				type: 'checkbox',
				validateRules: 'required',
				validateErrorText: 'Ознакомление и соглашение с правилами и описанием ивента обязательно для участия в ивенте',
				classes: ['w-full', 'mt-[5px]'],
			},
		}
);

const formError = ref(null);

const buttonClickHandler = async () => {
	formError.value = '';

	const rawData = toRaw(form)._rawValue;

	for (var key in rawData) {
		form.value[key].validateResult = validateElement(rawData[key].value, rawData[key].validateRules, rawData, rawData[key]?.validateErrorText);

		if (typeof form.value[key].validateResult === 'string') {
			form.value[key].validateResult = form.value[key].validateResult.replaceAll('{fieldName}', form.value[key].name);
			formError.value = form.value[key].validateResult;
			break;
		}
	}

	if (!formError.value) {
		stars();
		await goIn();
	}
}

const requestInProgress = ref(false);

const goIn = async () => {
	requestInProgress.value = true;

	try {
		const body = {
			slug: route.params.slug,
		}

		const response = await sendApiRequest('board-game/v2/player/add', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			if (response.status === 'error') {
				error(response.status_message);
			} else if (response.status === 'success') {
				if (!hasWebSocked()) refreshLayoutData();

				alert(response.status_message);
			}
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div class="text-center">
		<FormGenerator
				v-for="(field, index) in form"
				:key="index"
				:name="index"
				:element="field"
				:showValidateError=true
				:showTitle="field.hasOwnProperty('showTitle') ? field.showTitle : true"
				validateErrorPosition="bottom"
				:labelClasses="['block', 'mb-[10px]']"
				:fieldClasses="field.classes"
		/>
		<layout-buttons-ActionButton
				class="btn btn-primary"
				buttonName="Участвовать в ивенте"
				:actionInProgress="requestInProgress"
				@startAction="buttonClickHandler()"
		/>
	</div>
</template>
