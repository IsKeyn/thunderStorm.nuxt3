<script setup>
import { api } from '@/composables/api.js';
const { apiUrl, backendUrl, errorHandler, preparedRequestBody } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const Authorization = useCookie('Authorization');

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

const slots = useSlots()
const hasSlot = (name) => {
	return !!slots[name];
}

const responseErrors = ref({});
const requestInProgress = ref(false);

const setLike = async () => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		// await $fetch(
		// 		`${backendUrl.value}/sanctum/csrf-cookie`,
		// 		{
		// 			withCredentials: true,
		// 			credentials: 'include',
		// 			headers: {
		// 				Accept: 'application/json',
		// 				'X-Requested-With': 'XMLHttpRequest',
		// 			},
		// 		},
		// );
		//
		// const XsrfToken = useCookie('XSRF-TOKEN');

		const body = {
			entityType: props.entityType,
			entityId: props.entityId,
		};

		let request = '';
		let opts = {};
		let method = 'POST';

		request = `${apiUrl.value}vote/set-like`;
		opts = {
			method,
			credentials: 'include',
			headers: {
				Authorization: Authorization.value,
				Accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				// 'X-XSRF-TOKEN': XsrfToken.value,
			},
			body,
		};

		const response = await $fetch(request, opts);

		if (response) {
			requestInProgress.value = false;

			alert('Ваш лайк учтен');
		}
	} catch (e) {
		responseErrors.value = errorHandler(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div
			v-if="slots.default"
			@click="setLike"
	>
		<slot />
	</div>
	<div
			v-else
			class="likeBox"
	>
		<font-awesome-icon
				v-if="!requestInProgress"
				:icon="['fas', 'heart']"
				@click="setLike"
		/>
		<font-awesome-icon
				v-else
				:icon="['fas', 'spinner']"
				spin-pulse
		/>
	</div>
</template>

<style lang="scss" scoped>
.likeBox {
	@apply
		bg-[var(--second-bg-color)]
		w-[60px] h-[60px] rounded-full
		text-[35px] text-center leading-[60px]
		cursor-pointer
	;

	&:hover {
		color: var(--main-hover-color);
	}
}
</style>
