<script setup>
import { watch } from "vue";
const emit = defineEmits(['updateLikes']);

import { api } from '@/composables/api.js';
const {
	apiUrl,
	backendUrl,
	getCsrfCookie,
	errorHandler,
	preparedRequestBody,
} = api();

import { notifications } from '@/composables/notifications.js';

const {
	alert,
	error
} = notifications();

const props = defineProps({
	entityType: {
		type: String,
		required: true,
	},
	entityId: {
		type: Number,
		required: true,
	},
	voted: {
		type: Boolean,
		default: false,
	},
	showMessage: {
		type: Boolean,
		default: false,
	},
	theme: {
		type: String,
		default: 'default',
	},
	useInsideClickHandler: {
		type: Boolean,
		default: true,
	},
});

const hasVoted = ref(props.voted);

if (process.client && Number(sessionStorage.getItem(`vote_${props.entityType}_${props.entityId}`))) {
	hasVoted.value = true;
}

// const slots = useSlots()
// const hasSlot = (name) => {
// 	return !!slots[name];
// }

const responseErrors = ref({});
const requestInProgress = ref(false);

const likeHandler = () => {
	if (hasVoted.value) {
		unsetLike();
	} else {
		setLike();
	}
}

const setLike = async () => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		const csrfCookie = await getCsrfCookie();

		const body = {
			entityType: props.entityType,
			entityId: props.entityId,
		};

		let request = '';
		let opts = {};
		let method = 'POST';

		request = `${apiUrl.value}vote/set`;
		opts = {
			method,
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'X-XSRF-TOKEN': csrfCookie.value,
			},
			body,
		};

		const response = await $fetch(request, opts);

		if (response) {
			requestInProgress.value = false;

			if (props.showMessage) {
				if (response.message) {
					alert(response.message);
				} else {
					alert('Ваш лайк учтен');
				}
			}

			hasVoted.value = true;
			updateLikeCounter(response.value);
			sessionStorage.setItem(`vote_${props.entityType}_${props.entityId}`, 1);
		}
	} catch (e) {
				const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}

const unsetLike = async () => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		const csrfCookie = await getCsrfCookie();

		const body = {
			entityType: props.entityType,
			entityId: props.entityId,
		};

		let request = '';
		let opts = {};
		let method = 'POST';

		request = `${apiUrl.value}vote/unset`;
		opts = {
			method,
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'X-XSRF-TOKEN': csrfCookie.value,
			},
			body,
		};

		const response = await $fetch(request, opts);

		if (response) {
			requestInProgress.value = false;

			if (props.showMessage) {
				if (response.message) {
					alert(response.message);
				} else {
					alert('Вы отозвали свой лайк');
				}
			}

			hasVoted.value = false;
			updateLikeCounter(response.value);
			sessionStorage.setItem(`vote_${props.entityType}_${props.entityId}`, 0);
		}
	} catch (e) {
				const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}

const updateLikeCounter = (count) => {
	emit('updateLikes', { entityType: props.entityType, entityId: props.entityId, count });
}

defineExpose({
	likeHandler,
});
</script>

<template>
<!--	<div-->
<!--			v-if="slots.default"-->
<!--			@click="likeHandler"-->
<!--	>-->
<!--		<slot />-->
<!--	</div>-->

	<div
			v-if="theme === 'default'"
			class="likeBox"
			@click="useInsideClickHandler ? likeHandler() : null"
	>
		<font-awesome-icon
				v-if="!requestInProgress"
				:icon="['fas', 'heart']"
				:class="hasVoted ? 'voted' : ''"
		/>
		<font-awesome-icon
				v-else
				:icon="['fas', 'spinner']"
				spin-pulse
				class="loading"
		/>
	</div>

	<div
			v-if="theme === 'onlyHeart'"
			class="only-heart"
			@click="useInsideClickHandler ? likeHandler() : null"
	>
		<font-awesome-icon
				v-if="!requestInProgress"
				:icon="['fas', 'heart']"
				:class="hasVoted ? 'voted' : ''"
		/>
		<font-awesome-icon
				v-else
				:icon="['fas', 'spinner']"
				spin-pulse
				class="loading"
		/>
	</div>

	<div
			v-if="theme === 'forLightBox'"
			@click="useInsideClickHandler ? likeHandler() : null"
	>
		<span
				class="btn-icon btn-like"
				:class="hasVoted ? 'voted' : ''"
		>
			<font-awesome-icon
					v-if="!requestInProgress"
					:icon="['fas', 'heart']"
			/>
					<font-awesome-icon
							v-else
							:icon="['fas', 'spinner']"
							spin-pulse
							class="loading"
					/>
		</span>
	</div>
</template>

<style lang="scss" scoped>
// Общие для всех тем стили
.loading {
	color: var(--main-text-color);
}

// default theme
.likeBox {
	@apply
		bg-[var(--second-bg-color)]
		w-[60px] h-[60px] rounded-full
		text-[35px] text-center leading-[60px]
		cursor-pointer
	;

	&:hover {
		@apply bg-[var(--second-hover-color)];
	}

	.voted {
		color: var(--main-hover-color);
	}
}

// forLightBox theme
.btn-icon {
	@apply
	absolute z-[700]
	text-[40px] text-center
	cursor-pointer
	bg-black
	w-[60px] h-[60px]
	rounded-full
	;

	&:hover {
		@apply bg-[var(--second-hover-color)];
	}
}

.btn-like {
	@apply
	absolute z-[701]
	right-[10px] top-[90px]
	text-[35px] leading-[60px]
	;

	&.voted {
		color: var(--main-hover-color);
	}
}

.only-heart {
	@apply inline;

	.voted {
		color: var(--main-hover-color);
	}
}
</style>
