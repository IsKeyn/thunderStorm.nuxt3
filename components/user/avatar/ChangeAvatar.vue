<script setup>
import FormBlank from '@/components/forms/FormBlank.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { api } from '@/composables/api.js'
const {
	sendApiRequest,
} = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const emit = defineEmits(['afterChangeAvatar']);

import { ref } from "vue";

const form = ref({
	avatar: {
		name: 'Файл',
		value: '',
		type: 'file',
		accept: 'image/*',
		imagePreviewClasses: 'max-w-[150px] max-h-[150px]',
		validateRules: 'required mime_1, size_5',
		classes: ['w-full', 'mt-[5px]'],
		showFile: true,
	}
});

const buttons = [
	{
		name: 'Отправить',
		class: 'mr-2',
		doType: 'save',
	},
];

const requestInProgress = ref(false);

const getUserData = async () => {
	requestInProgress.value = true;

	try {
		const body = {}

		const response = await sendApiRequest('auth/user', 'GET', body);

		if (response) {
				userStore.user = response.data;
				requestInProgress.value = false;

				alert('Аватарка успешно изменена');

				emit('afterChangeAvatar');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<FormBlank
			:form="form"
			:buttons="buttons"
			fetchUrl="auth/setAvatar"
			method="POST"
			:showTabs="false"
			:showAdditionControlPanel="false"
			@afterRequest="getUserData"
	/>
</template>
