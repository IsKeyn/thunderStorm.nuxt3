<script setup>
import AddTimerForm from '@/components/boardGame/timer/AddTimerForm.vue';
import Timer from '@/components/boardGame/timer/Timer.vue';
import StatsGameCard from '@/components/boardGame/stats/StatsGameCard.vue';

const emit = defineEmits(['loadingToggle']);

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
});

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

const route = useRoute();

const { data: requestData, pending: requestInProgress, refresh } = await useAsyncData(
		'boardGameTimerList',
		async () => {
			emit('loadingToggle', true);

			let request = `${apiUrl.value}board-game/stats/get`;

			const query = {
				board_game_id: props.boardGameId,
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

				return response;
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
	<template v-if="!requestInProgress">
		<div
			v-for="(data, key) in fetchedData"
			:key="key"
		>
			<span class="title">
				{{ data.name }}
			</span>
			<StatsGameCard
					v-for="(element, gameKey) in data.data"
					:key="gameKey"
					:element="element"
					:players="boardGameInfo.players"
					additionalDataName="Рерольнута раз:"
					@setOpenedImage="emit('setOpenedImage', $event)"
			/>
		</div>
	</template>


	<buttton @click="refresh">12345</buttton>
<!--	<div>-->
<!--		<div class="timer-body">-->
<!--			<Timer-->
<!--					v-if="!requestInProgress"-->
<!--					class="col-span-6"-->
<!--					v-for="(timer, key) in fetchedData"-->
<!--					:key="key"-->
<!--					:timer="timer"-->
<!--					:showName="true"-->
<!--					:boardGameId="boardGameId"-->
<!--					@updateTimerList="updateTimerList"-->
<!--			/>-->
<!--		</div>-->
<!--		<AddTimerForm-->
<!--				:boardGameId="props.boardGameId"-->
<!--				@updateTimerList="updateTimerList"-->
<!--		/>-->
<!--	</div>-->
</template>

<style lang="scss" scoped>
.timer-body {
	@apply lg:grid grid-cols-12 gap-x-4 mb-[2rem];
}
</style>
