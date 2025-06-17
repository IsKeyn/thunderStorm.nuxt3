<script setup>
import UserInterface from '@/components/boardGame/UserInterface.vue';
import Logs from '@/components/boardGame/bg-logs/Logs.vue';
import Players from '@/components/boardGame/user/Players.vue';
import Board from '@/components/boardGame/Board.vue';
import Head from '@/components/seo/Head.vue';
import Rules from '@/components/boardGame/Rules.vue';
import Items from '@/components/boardGame/Items.vue';
import Games from '@/components/boardGame/Games.vue';
import StreamersOnline from '@/components/boardGame/StreamersOnline.vue';
import ThemeSelect from '@/components/boardGame/ThemeSelect.vue';
import StatsButtonAndModal from '@/components/boardGame/stats/StatsButtonAndModal.vue';

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

const { data: requestData, pending: requestInProgress, refresh } = await useAsyncData(
		'boardGameInfoKey',
		async () => {
			let request = `${apiUrl.value}board-game/get/${route.params.slug}`;

			const query = {};
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

const logListBlock = ref(null);

const updateLogs = () => {
	logListBlock.value.updateLogs();
}

const updateBoardGameInfo = async () => {
	await refresh();
}

const playersComponent = ref(null);

const showPlayer = (id) => {
	playersComponent.value.showPlayerInfo(id);
}

const showBoard = ref(false);

const toggleBoard = () => {
	showBoard.value = !showBoard.value;
}
</script>

<template>
	<div
			v-if="requestInProgress"
			class="loading-box without-border"
	>
		<ui-BigPreloader class="h-full" />
	</div>
	<div v-if="fetchedData && fetchedData.active === 1">
		<header>
			<span class="title" v-if="fetchedData.name">{{ fetchedData.name }}</span>
			<div class="menu-block">
				<Rules
						:boardGameId="fetchedData.id"
						:boardGameInfo="fetchedData"
				/>
				<Games
						:boardGameId="fetchedData.id"
				/>
				<Items
						:boardGameId="fetchedData.id"
				/>
<!--				<StatsButtonAndModal />-->
				<ui-IconButton
						class="ml-[1rem]"
						:faIcon="['fab', 'twitch']"
						buttonText="Расширение"
						href="https://dashboard.twitch.tv/extensions/3cn0qf9xaa13w6wj7za4nmxl2qn0ju-1.0.1"
						target="_blank"
				/>
				<ui-IconButton
						class="ml-[1rem]"
						:faIcon="['fab', 'telegram']"
						buttonText="Телеграм"
						href="https://t.me/game_events_tr"
						target="_blank"
				/>
			</div>
		</header>
		<button class="btn btn-simple-1 show-board-button" @click="toggleBoard">
			{{ showBoard ? 'Cкрыть' : 'Показать' }} доску
		</button>
		<div class="main-dashboard-box">
			<div :class="['user-interface-box', showBoard ? 'show-board' : '']">
				<UserInterface
						:boardGameId="fetchedData.id"
						:boardGameInfo="fetchedData"
						@fetchLogs="fetchLogs"
						@showPlayer="showPlayer"
						@updateBoardGameInfo="updateBoardGameInfo"
						@showGame="$emit('showGame', $event)"
						@showInventory="$emit('showInventory', $event)"
				/>
			</div>
			<div :class="['board-box', showBoard ? 'show-board' : '']">
				<div class="hidden lg:block">
					<Board
							:boardGameId="fetchedData.id"
							:boardGameInfo="fetchedData"
							@updateBoardGameInfo="updateBoardGameInfo"
							@showPlayer="showPlayer"
					/>
				</div>
				<Comments
						entityType="App\Models\BoardGame"
						:entityId="fetchedData.id"
						class="mt-5"
						ref="commentsRef"
						@refresh="refresh"
				/>
			</div>
			<div :class="['info-box', showBoard ? 'show-board' : '']">
				<Players
						ref="playersComponent"
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
						@showPlayer="showPlayer"
				/>
			</div>
		</div>
		<Head
				:seo="{
					title: fetchedData.name,
			}"
		/>
		<ThemeSelect />
	</div>
	<div v-else>
		Данная игра не активна
	</div>
</template>

<style lang="scss">
header {
	.menu-block {
		.btn {
			@apply text-center;

			span.button-text {
				@apply hidden xl:block 2xl:inline;
			}
		}
	}
}
</style>

<style lang="scss" scoped>
.loading-box {
	@apply fixed z-[50000] justify-center items-center w-[100vw] h-[100vh] bg-black/50;
}

header {
	@apply
		pt-[1rem] pb-[1rem] pl-[var(--main-left-padding)] pr-[var(--main-right-padding)]
		block lg:flex lg:items-center gap-2 text-center lg:text-left
		mr-[--main-mobile-without-right-padding] lg:mr-[var(--main-without-right-padding)]
		ml-[--main-mobile-without-left-padding] lg:ml-[var(--main-without-left-padding)]
	;

	border-bottom: 1px solid var(--second-border-color);

	.title {
		@apply w-1/3;
	}

	.menu-block {
		@apply w-full lg:w-2/3 flex flex-wrap justify-center lg:justify-end;
	}
}

.show-board-button {
	@apply hidden lg:block 2xl:hidden;
}

.main-dashboard-box {
	@apply block lg:grid grid-cols-12;

	.user-interface-box {
		@apply lg:col-span-6 2xl:col-span-2 mr-0 lg:mr-[2rem];

		&.show-board {
			@apply hidden;
		}
	}

	.board-box {
		@apply
			col-span-4 lg:hidden 2xl:block 2xl:col-span-8
		;

		margin: 0 auto;

		&.show-board {
			@apply col-span-12 block;
		}
	}

	.info-box {
		@apply lg:col-span-6 2xl:col-span-2 ml-0 lg:ml-[2rem];

		&.show-board {
			@apply hidden;
		}
	}
}
</style>
