<script setup>
import FormBlank from '@/components/forms/FormBlank.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const emit = defineEmits(['afterSendForm']);

import { ref } from "vue";

const props = defineProps({
	userId: {
		type: Number,
		default: null,
	},
});

const form = ref({
	user_id: {
		name: 'UserId',
		type: 'hidden',
		value: props.userId,
		placeholder: '',
		classes: ['w-full', 'mt-[5px]'],
	},
	message: {
		name: 'Сообщение',
		type: 'textarea',
		value: '',
		placeholder: '',
		classes: ['w-full', 'mt-[1rem]'],
	},
});

const buttons = [
	{
		name: 'Отправить',
		class: 'mr-2',
		doType: 'save',
	},
];

const clearForm = async () => {
	form.value.message.value = '';
	alert('Ваше уведомление успешно отправлено');
	emit('afterSendForm');
}
</script>

<template>
	<FormBlank
			:form="form"
			:buttons="buttons"
			fetchUrl="auth/notification/set"
			method="POST"
			:showTabs="false"
			:showAdditionControlPanel="false"
			@afterRequest="clearForm"
	/>
</template>
