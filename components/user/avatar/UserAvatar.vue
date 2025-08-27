<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { inject, ref, watch } from 'vue'
const layoutMethods = inject('layoutMethods')

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { api } from '@/composables/api.js'
const {
	sendApiRequest,
} = api();

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { notifications } from '@/composables/notifications.js';
const { error, alert } = notifications();

import { validate } from '@/composables/validate.js';
const {
	validateElement,
	validateForm
} = validate();

const props = defineProps({
	userInfo: {
		type: Object,
		default: {},
	},
});

const isCurrentUser = computed(() => {
	if (userStore.user && Object.keys(userStore.user).length > 0 && userStore.user.id === props.userInfo.id) {
		return true;
	}

	return false;
});

const avatar = ref({
	name: 'Файл',
	value: '',
	type: 'file',
	accept: 'image/*',
	imagePreviewClasses: 'max-w-[150px] max-h-[150px]',
	validateRules: 'required mime_1, size_5',
	classes: ['w-full', 'mt-[5px]'],
	showFile: true,
});

watch(() => avatar.value.value, () => {
	if (avatar.value.value) {
		sendForm();
	}
}, { deep: true });

const requestInProgress = ref(false);

const sendForm = async () => {
	if (!requestInProgress.value) {
		avatar.value.validateResult = '';

		avatar.value.validateResult = validateElement(avatar.value.value, avatar.value.validateRules);

		if (avatar.value.validateResult) {
			error(avatar.value.validateResult, 10000);
		} else {
			await sendRequest();
		}
	}
}

const sendRequest = async () => {
	requestInProgress.value = true;

	try {
		const formData = new FormData();
		formData.append('avatar', avatar.value.value[0]);

		const response = await sendApiRequest('auth/setAvatar', 'POST', formData);
		avatar.value.value = null;

		if (response) {
			requestInProgress.value = false;
			await refreshNuxtData('userProfileRequest');
			getUserData();
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

const getUserData = async () => {
	requestInProgress.value = true;

	try {
		const body = {}

		const response = await sendApiRequest('auth/user', 'GET', body);

		if (response) {
			userStore.user = response.data;
			requestInProgress.value = false;

			alert('Аватарка успешно изменена');
			//
			// emit('afterChangeAvatar');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div class="avatar">
		<template v-if="isCurrentUser">
			<label>
				<font-awesome-icon class="change-avatar-button" icon="fa-solid fa-camera" />

				<FormGenerator
						class="hidden"
						name="avatar"
						:element="avatar"
						:showValidateError=true
						validateErrorPosition="bottom"
						:labelClasses="['block', 'mb-[10px]']"
						:fieldClasses="avatar.classes"
						:formHandlerType="avatar.formHandlerType"
						:showTitle="avatar.showTitle"
				/>
			</label>
		</template>
		<img
				v-if="userInfo.avatar"
				:src="getResizeImg(userInfo.avatar)"
				:alt="userInfo.name"
				:title="userInfo.name"
				@click="layoutMethods.setOpenedImage(userInfo.avatar)"
		>
		<img v-else src="/images/system/no-avatar.png">
	</div>
</template>

<style lang="scss" scoped>
.avatar {
	@apply relative;

	img {
		@apply w-[150px] h-[150px] object-cover cursor-pointer mx-auto rounded-full;
	}

	.change-avatar-button {
		@apply absolute text-[3rem] text-[var(--main-dark-text-color)] cursor-pointer hidden;

		top: calc(50% - 1.5rem);
		left: calc(50% - 1.5rem);

	}

	&:hover {
		.change-avatar-button {
			@apply block;
		}
	}
}
</style>
