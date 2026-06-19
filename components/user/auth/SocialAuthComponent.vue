<script setup>
import { ref } from "vue";

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const props = defineProps({
	registerOnEventBySlug: {
		type: String,
		default: null,
	},
});

const authWithSocial = (social) => {
	switch (social) {
		case 'twitch':
			sendTwitchRequest();
			break;
	}
}

const requestName = 'sendTwitchRedirectRequest';
const requestInProgress = ref(false);

const sendTwitchRequest = async () => {
	requestInProgress.value = true;

	const body = {};

	if (props.registerOnEventBySlug) {
		sessionStorage.setItem('registerOnEventBySlug', props.registerOnEventBySlug);
	}

	try {
		const response = await sendApiRequest('auth/twitch/redirect', 'GET', body, requestName);

		if (response?.url) {
			sessionStorage.setItem('pageForRedirect', route.fullPath);
			window.location.href = response.url;
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div>
<!--		<span class="social-auth-title">Авторизоваться через:</span>-->
<!--		<div class="button-block">-->
<!--			<button-->
<!--					class="twitch"-->
<!--					@click="authWithSocial('twitch')"-->
<!--			>-->
<!--				<font-awesome-icon-->
<!--						v-if="requestInProgress"-->
<!--						:icon="['fas', 'spinner']"-->
<!--						spin-pulse-->
<!--				/>-->
<!--				<template v-else>-->
<!--					Twitch <font-awesome-icon icon="fa-brands fa-twitch" />-->
<!--				</template>-->
<!--			</button>-->
<!--		</div>-->
	</div>
</template>

<style lang="scss" scoped>
.social-auth-title {
	@apply block mb-2;
}

.button-block {
	.twitch {
		@apply w-full p-2 bg-[#9147ff] text-[#ffffff] pl-4 pr-4;

		&:hover {
			@apply bg-[#772ce8];
		}
	}
}
</style>
