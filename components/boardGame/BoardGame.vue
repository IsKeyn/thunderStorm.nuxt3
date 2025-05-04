<script setup>
import UserInterface from '@/components/boardGame/UserInterface.vue';
import Logs from '@/components/boardGame/bg-logs/Logs.vue';
import Players from '@/components/boardGame/user/Players.vue';
import Board from '@/components/boardGame/Board.vue';
import Head from '@/components/seo/Head.vue';
import Rules from '@/components/boardGame/Rules.vue';
import StreamersOnline from '@/components/boardGame/StreamersOnline.vue';

import { ref } from "vue";

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
	sendApiRequest,
} = api();

const route = useRoute();

const requestInProgress = ref(false);
const fetchedData = ref();

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}board-game/get/${route.params.slug}`;

			const query = {};
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
									error('Request error', 5000);
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

const logListBlock = ref(null);

const updateLogs = () => {
	logListBlock.value.updateLogs();
}

const updateBoardGameInfo = () => {
	refresh();
}
</script>

<template>
	<Preloader v-if="requestInProgress" />
	<div v-if="fetchedData && fetchedData.active === 1">
		<header class="without-border">
			<span class="title" v-if="fetchedData.name">{{ fetchedData.name }}</span>
			<div class="menu-block">
				<Rules
						:boardGameId="fetchedData.id"
						:boardGameInfo="fetchedData"
				/>
				<a
						href="https://t.me/game_events_tr"
						target="_blank"
						class="btn btn-primary ml-[1rem]"
						@click="openCloseModalFunc"
				>
					Телеграм <font-awesome-icon :icon="['fab', 'telegram']" />
				</a>
			</div>
		</header>
		<div class="main-dashboard-box">
			<div class="user-interface-box">
				<UserInterface
						:boardGameId="fetchedData.id"
						:boardGameInfo="fetchedData"
						@fetchLogs="fetchLogs"
						@updateBoardGameInfo="updateBoardGameInfo"
				/>
			</div>
			<div class="board-box">
				<Board
						:boardGameId="fetchedData.id"
						:boardGameInfo="fetchedData"
						@updateBoardGameInfo="updateBoardGameInfo"
				/>
				<Comments
						entityType="App\Models\BoardGame"
						:entityId="fetchedData.id"
						class="mt-5"
						ref="commentsRef"
						@refresh="refresh"
				/>
			</div>
			<div class="info-box">
				<Players
						:boardGameId="fetchedData.id"
						:boardGameInfo="fetchedData"
				/>
				<StreamersOnline
						:boardGameId="fetchedData.id"
				/>
				<Logs
						ref="logListBlock"
						:boardGameId="fetchedData.id"
						:boardGameInfo="fetchedData"
				/>
			</div>
		</div>
		<Head
				:seo="{
					title: fetchedData.name,
			}"
		/>
	</div>
	<div v-else>
		Данная игра не активна
	</div>
</template>

<style lang="scss" scoped>
header {
	@apply
		pt-[1rem] pb-[1rem] pl-[var(--main-left-padding)] pr-[var(--main-right-padding)]
		flex items-center gap-2
	;

	border-bottom: 1px solid var(--second-border-color);

	.title {
		@apply w-1/2;
	}

	.menu-block {
		@apply w-1/2 flex justify-end;
	}
}

.main-dashboard-box {
	@apply grid grid-cols-12;

	.user-interface-box {
		@apply col-span-2 mr-[2rem];
	}

	.board-box {
		@apply col-span-8;

		margin: 0 auto;
	}

	.info-box {
		@apply col-span-2 ml-[2rem];
	}
}
</style>
