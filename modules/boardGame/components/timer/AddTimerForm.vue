<script setup>
import AlertBox from '@/components/notifications/AlertBlock.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

const emit = defineEmits(['updateTimerList']);

const route = useRoute();

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

import { validate } from '@/composables/validate.js';
const { validateForm } = validate();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const form = ref({});

form.value.name = {
	name: 'Название',
	value: null,
	type: 'text',
	placeholder: 'Введите название таймера',
	validateRules: 'required, minLength_1, maxLength_100',
	classes: 'w-full',
};

form.value.hours = {
	name: 'Часы',
	value: null,
	type: 'number',
	placeholder: '00',
	validateRules: 'minNumber_0, maxNumber_999',
	classes: 'w-[4rem]',
};

form.value.minuts = {
	name: 'Минуты',
	value: null,
	type: 'number',
	placeholder: '00',
	validateRules: 'minNumber_0, maxNumber_60',
	classes: 'w-[4rem]',
};

form.value.seconds = {
	name: 'Секунды',
	value: null,
	type: 'number',
	placeholder: '00',
	validateRules: 'minNumber_0, maxNumber_60',
	classes: 'w-[4rem]',
};

form.value.description = {
	name: 'Описание',
	value: null,
	type: 'textarea',
	placeholder: '',
	validateRules: 'minLength_2, maxLength_5000',
	classes: 'w-full',
};

const requestInProgress = ref(false);

const errorsMessages = ref([]);

const sendForm = async () => {
	errorsMessages.value = [];

	for (const formKey in form.value) {
		form.value[formKey].validateResult = '';
	}

	const { status, key, validateResult } = validateForm(form.value);

	if (status) {
		await sendRequest();
	} else {
		form.value[key].validateResult = validateResult;
		errorsMessages.value = [validateResult];
	}
}

const sendRequest = async () => {
	requestInProgress.value = true;

	try {
		const body = {};

		body.boardGameSlug = route.params.slug;
		body.name = form.value.name.value;
		body.description = form.value.description.value;

		body.limit = (form.value.hours.value * 60 + form.value.minuts.value) * 60 + form.value.seconds.value;

		const response = await sendApiRequest('board-game/timer/add', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			if (response.error) {
				error(response.error);
			} else {
				form.value.name.value = null;
				form.value.description.value = null;
				emit('updateTimerList');

				alert('Новый таймер успешно добавлен');
			}
		} else {
			error('Произошла ошибка');
			requestInProgress.value = false;
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
		<ui-OpeningBox
				title="Добавить таймер"
		>
			<AlertBox
					:errorsMessages="errorsMessages"
					class="mb-2"
			/>
			<FormGenerator
					name="name"
					:element="form.name"
					validateErrorPosition="bottom"
					labelClasses="lg:mr-4 mt-[10px] mb-[10px] block"
					:fieldClasses="form.name.classes"
			/>

			<label>Лимиты таймера, при необходимости</label>
			<div class="flex gap-4">
				<FormGenerator
						name="hours"
						:element="form.hours"
						validateErrorPosition="bottom"
						labelClasses="lg:mr-4 mt-[10px] mb-[10px] block"
						:fieldClasses="form.hours.classes"
				/>

				<FormGenerator
						name="minuts"
						:element="form.minuts"
						validateErrorPosition="bottom"
						labelClasses="lg:mr-4 mt-[10px] mb-[10px] block"
						:fieldClasses="form.minuts.classes"
				/>

				<FormGenerator
						name="seconds"
						:element="form.seconds"
						validateErrorPosition="bottom"
						labelClasses="lg:mr-4 mt-[10px] mb-[10px] block"
						:fieldClasses="form.seconds.classes"
				/>
			</div>

			<FormGenerator
					name="description"
					:element="form.description"
					validateErrorPosition="bottom"
					labelClasses="lg:mr-4 mt-[10px] mb-[10px] block"
					:fieldClasses="form.description.classes"
			/>
			<layout-buttons-ActionButton
					buttonClasses="btn btn-simple-1 w-1/2 mr-[1rem] w-full lg:w-auto"
					buttonName="Отправить"
					:actionInProgress="requestInProgress"
					@startAction="sendForm()"
			/>
		</ui-OpeningBox>
</template>
