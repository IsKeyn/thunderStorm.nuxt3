<script setup>
import FormGenerator from '@/components/forms/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';
import AlertBox from '@/components/notifications/AlertBlock.vue';
import VerifyEmailBlock from '@/components/user/VerifyEmailBlock.vue';
import RecommendMessageForRegistration from '@/components/user/registration/RecommendMessageForRegistration.vue'

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
});

// Создание формы комментария
const createForm = () => {
	if (!(userStore.user && Object.keys(userStore.user).length > 0)) {
		{
			form.value.name = {
				name: 'Ваше имя',
				value: '',
				type: 'text',
				placeholder: 'Ваше имя',
				validateRules: 'required, minLength_2, maxLength_50',
				classes: 'min-w-[30%]',
			};

			form.value.email = {
				name: 'Ваш e-mail',
				value: '',
				type: 'text',
				placeholder: 'Ваш e-mail',
				validateRules: 'required, email, minLength_2, maxLength_50',
				classes: 'min-w-[30%]',
			};
		}
	}

	form.value.message = {
		name: 'Комментарий',
		value: '',
		type: 'textarea',
		placeholder: 'Комментарий',
		validateRules: 'required, minLength_2, maxLength_3000',
	};
};

const form = ref({});
createForm();

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

		body.entity_type = props.entityType;
		body.entity_id = props.entityId;

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

const contentStatus = ref(false);

const toggleContent = (newStatus) => {
	if (newStatus === undefined || newStatus === null) {
		contentStatus.value = !contentStatus.value;
	} else {
		contentStatus.value = newStatus;
	}
}
</script>

<template>
	<div class="opening-box">
		<div
				class="header"
				@click="toggleContent(null)"
		>
			Добавить комментарий

			<div class="icon-box">
				<font-awesome-icon v-if="contentStatus" :icon="['fas', 'angle-up']" />
				<font-awesome-icon v-else :icon="['fas', 'angle-down']" />
			</div>
		</div>
		<div
				v-show="contentStatus"
				class="content"
		>
			<AlertBox
					:errorsMessages="errorsMessages"
					class="mb-2"
			/>
			<div v-if="!(userStore.user && Object.keys(userStore.user).length > 0)">
				<RecommendMessageForRegistration
						:modalName="`registration-modal-${entityType}-${entityId}`"
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
			<VerifyEmailBlock v-if="userStore.user && !userStore.user.email_verified_at" />
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
		</div>
	</div>
</template>

<style lang="scss" scoped>
.users-fields {
	@apply flex mb-[20px];
}
</style>
