<script setup>
import { onMounted } from 'vue'

import LogCard from '@/components/boardGame/bg-logs/LogCard.vue';
import LightBox from '@/components/media/LightBox.vue'
import AddLogs from '@/components/boardGame/bg-logs/AddLogs.vue';

import { lightBox } from '@/composables/lightBox.js';
const {
	openedImage,
	setOpenedImage,
} = lightBox();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

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

const fetchedData = ref([]);
const requestInProgress = ref(false);

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}board-game/log/list`;

			const query = {
				boardGameId: props.boardGameId,
			};

			const sessionCookie = useCookie(sessionCookieName.value);

			requestInProgress.value = true;

			try {
				await $fetch(
						request,
						{
							method: 'GET',
							credentials: 'include',
							query,
							headers: {
								Accept: 'application/json',
								Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
								Referer: publicUrl.value,
							},
							onResponse({response}) {
								if (response.status === 200) {
									fetchedData.value = response._data.data;
								} else {
									error('request error', 5000);
								}

								requestInProgress.value = false;
							}
						},
				);
			} catch (e) {
				errorHandler(e);
				requestInProgress.value = false;
			}
		}
);

const updateLogs = () => {
	refresh();
}

onMounted(() => {
	setInterval(() => {
		updateLogs();
	}, 10000);
})

defineExpose({
	updateLogs,
});

const alreadyInGame = computed(() => {
	const player = props.boardGameInfo.players.filter((item) => {
		if (item.user.id === userStore.user.id) {
			return true;
		} else {
			return false;
		}
	});

	return player.length > 0;
});
</script>

<template>
	<span class="user-interface-title">Логи игры</span>
	<AddLogs
			v-if="alreadyInGame"
			@fetchLogs="updateLogs"
	/>
	<div v-if="fetchedData.length > 0" class="log-box">
		<LogCard
				v-for="(log, key) in fetchedData"
				:key="key"
				:element="log"
				:boardGameInfo="boardGameInfo"
				@setOpenedImage="setOpenedImage"
		/>
	</div>

	<LightBox
			v-if="openedImage"
			:image="openedImage"
			:setViewsLog="true"
			@setCurrentElement="setOpenedImage"
	/>
</template>

<style lang="scss" scoped>
.log-box {
	overflow: auto;
	max-height: 700px;
	scrollbar-width: none; /* Firefox */
	-ms-overflow-style: none; /* IE и Edge */

	&::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}

	.log-title {
		@apply block mb-2 text-[1.5rem];
	}
}
</style>
