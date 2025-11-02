<script setup>
import AddTimerForm from '@/modules/boardGame/components/timer/AddTimerForm.vue';
import Timer from '@/modules/boardGame/components/timer/Timer.vue';

const emit = defineEmits(['loadingToggle']);

const route = useRoute();

import { userFunctions } from '@/composables/userFunctions.js';
const {
	isAuth,
} = userFunctions();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
	sendApiRequest,
} = api();

const { data: requestData, pending: requestInProgress, refresh } = await useAsyncData(
		'boardGameTimerList',
		async () => {
			emit('loadingToggle', true);

			let request = `${apiUrl.value}board-game/timer/list`;

			const query = {
				boardGameSlug: route.params.slug,
			};

			const sessionCookie = useCookie(sessionCookieName.value);

			try {
				const response = await $fetch(
						request,
						{
							method: 'GET',
							credentials: 'include',
							query,
							headers: {
								Accept: 'application/json',
								Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
								Referer: publicUrl.value,
							}
						},
				);

				emit('loadingToggle', false);

				return response.data;
			} catch (e) {
				errorHandler(e);
			}
		},
		{
			server: true, // выполнять только на сервере
			lazy: true, // ждать выполнения запроса перед рендерингом
		}
);

const fetchedData = computed(() => requestData.value || null);

const updateTimerList = async () => {
	await refresh();
}
</script>

<template>
	<div v-if="isAuth">
		<div class="timer-body">
			<Timer
					v-if="!requestInProgress"
					class="col-span-6"
					v-for="(timer, key) in fetchedData"
					:key="key"
					:timer="timer"
					:showName="true"
					@updateTimerList="updateTimerList"
			/>
		</div>
		<AddTimerForm
				@updateTimerList="updateTimerList"
		/>
	</div>
	<div class="item-box">
		Функционал доступен только авторизованному пользователю
	</div>
</template>

<style lang="scss" scoped>
.timer-body {
	@apply lg:grid grid-cols-12 gap-x-4 mb-[2rem];
}
</style>
