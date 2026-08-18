<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

const emit = defineEmits(['afterChangeAvatar']);

import { computed, ref, watch } from 'vue'

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
	user: {
		type: Object,
		default: {},
	},
	classes: {
		type: String,
		default: 'w-full h-full',
	},
	/* Доступные значения:
		'purple', 'gold', 'silver', 'bronze', 'ruby', 'azure', 'emerald', 'amethyst-yellow', 'sapphire', 'obsidian', 'rose-gold'
	*/
	borderType: {
		type: String,
		default: '',
	},
	canChange: {
		type: Boolean,
		default: true,
	},
	useLightBox: {
		type: Boolean,
		default: false,
	},
	altImage: {
		type: String,
		default: null,
	},
});

const isCurrentUser = computed(() => {
	if (userStore.user && Object.keys(userStore.user).length > 0 && userStore.user.id === props.user.id) {
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

			emit('afterChangeAvatar');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

const wrapperClasses = computed(() => {
	const cls = ['avatar-box'];
	if (props.borderType) {
		cls.push(`border-${props.borderType}`);
	}
	return cls;
});
</script>

<template>
	<div :class="[wrapperClasses]">
		<template v-if="canChange && isCurrentUser">
			<label>
				<div class="change-avatar-button">
					<font-awesome-icon class="shadow-lg" icon="fa-solid fa-camera" />
				</div>

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
		<template v-if="user.avatar">
			<img
					v-if="useLightBox"
					:class="classes"
					:src="getResizeImg(user.avatar)"
					:alt="user.name"
					:title="user.name"
					:media-id="user.avatar.id"
					:not-for-lb-nav="true"
					class="media-obj asd asd"
			>
			<img
					v-else
					:class="classes"
					:src="getResizeImg(user.avatar)"
					:alt="user.name"
					:title="user.name"
			>
		</template>
		<img
				v-else-if="altImage"
				:class="classes"
				:src="altImage"
		>
		<img
				v-else
				:class="classes"
				src="/images/system/no-avatar.png"
		>
	</div>
</template>

<style lang="scss" scoped>
@import url('~/assets/scss/Fragments/avatarStyles.scss');
</style>
