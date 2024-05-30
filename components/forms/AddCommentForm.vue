<script setup>
import { onMounted } from 'vue'

import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';
import AlertBox from '@/components/notifications/AlertBlock.vue';
import VerifyEmailBlock from '@/components/user/VerifyEmailBlock.vue';
import RecommendMessageForRegistration from '@/components/user/registration/RecommendMessageForRegistration.vue';
import OpeningBox from '@/components/interface/OpeningBox.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { validate } from '@/composables/validate.js';
const { validateForm } = validate();

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const props = defineProps({
	entityType: {
		type: String,
		required: true,
	},
	entityId: {
		type: Number,
		required: true,
	},
	firstParent: {
		type: Number,
		default: null,
	},
	answerTo: {
		type: Number,
		default: null,
	},
});

/**
 * Создание формы комментария
 * Создание формы (createForm()) также вызывается если пользователь авторизовался, убирает более не нужные поля (Ваше имя и Ваш e-mail)
 * доабавляем значение message если пользователь уже начал его заполнять и очищаем ошибки валидации
 **/

const form = ref({});

const createForm = () => {
	if (errorsMessages) {
		errorsMessages.value = [];
	}

	const createdForm = {};

	if (!(userStore.user && Object.keys(userStore.user).length > 0)) {
		createdForm.name = {
				name: 'Ваше имя',
				value: sessionStorage.getItem('guest_name') ? sessionStorage.getItem('guest_name') : '',
				type: 'text',
				placeholder: 'Ваше имя',
				validateRules: 'required, minLength_2, maxLength_50',
				classes: 'min-w-[30%]',
			};

		createdForm.email = {
				name: 'Ваш e-mail',
				value: sessionStorage.getItem('guest_email') ? sessionStorage.getItem('guest_email') : '',
				type: 'text',
				placeholder: 'Ваш e-mail',
				validateRules: 'required, email, minLength_2, maxLength_50',
				classes: 'min-w-[30%]',
			};
	}

	createdForm.message = {
		name: 'Комментарий',
		value: form.value.message?.value ? form.value.message.value : '',
		type: 'textarea',
		placeholder: 'Комментарий',
		validateRules: 'required, minLength_2, maxLength_3000',
	};

	form.value = createdForm;
};

// Отправка комментария
const errorsMessages = ref([]);

const sendForm = async () => {
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

const requestInProgress = ref(false);
const emit = defineEmits(['fetchComments']);

const sendRequest = async () => {
	requestInProgress.value = true;

	try {
		const body = preparedRequestBody(form.value);

		if (body.name) {
			sessionStorage.setItem('guest_name', body.name);
		}

		if (body.email) {
			sessionStorage.setItem('guest_email', body.email);
		}

		body.entity_type = props.entityType;
		body.entity_id = props.entityId;
		body.first_parent = props.firstParent;
		body.answer_to = props.answerTo;

		const response = await sendApiRequest('comment/add', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			form.value.message.value = '';
			alert('Ваш комментарий добавлен');
			emit('fetchComments');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

onMounted(() => {
	createForm();
});

watch(() => userStore.user, () => {
	if (userStore.user && Object.keys(userStore.user).length > 0) {
		createForm();
	}
});
</script>

<template>
	<AlertBox
			:errorsMessages="errorsMessages"
			class="mb-2"
	/>
	<div v-if="!(userStore.user && Object.keys(userStore.user).length > 0)">
		<RecommendMessageForRegistration
				:modalId="`modal-from-from-recommend-message-${entityType}-${entityId}`"
				message=", чтобы получать уведомления об ответах"
		/>
		<div class="users-fields">
			<FormGenerator
					v-if="form.name"
					name="name"
					:element="form.name"
					:showTitle="false"
					validateErrorPosition="bottom"
					labelClasses="mr-4"
					:fieldClasses="form.name.classes"
			/>
			<FormGenerator
					v-if="form.email"
					name="email"
					:element="form.email"
					:showTitle="false"
					validateErrorPosition="bottom"
					:fieldClasses="form.name.classes"
			/>
		</div>
	</div>
	<VerifyEmailBlock
			v-if="userStore.user && Object.keys(userStore.user).length > 0 && !userStore.user.email_verified_at"
	/>
	<div v-else>
		<FormGenerator
				v-if="form.message"
				name="message"
				:element="form.message"
				:showTitle="false"
				validateErrorPosition="bottom"
				:fieldClasses="form.message.classes"
		/>
		<ActionButton
				buttonName="Добавить"
				:actionInProgress="requestInProgress"
				@startAction="sendForm()"
		/>
	</div>
</template>

<style lang="scss" scoped>
.users-fields {
	@apply flex mb-[20px];
}
</style>
