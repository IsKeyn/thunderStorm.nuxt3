<script setup>
import Tabs from '@/components/ui/tabs/Tabs.vue';
import TwitchCard from '@/components/twitch/TwitchCard.vue';
import Timer from '@/modules/boardGame/components/timer/Timer.vue';
import CurrentGame from '@/modules/boardGame/components/user/player/profileElement/CurrentGame.vue';
import GameHistory from '@/modules/boardGame/components/user/player/profileElement/GameHistory.vue';
import InventoryHistory from '@/modules/boardGame/components/user/player/profileElement/InventoryHistory.vue';



import LogCard from '@/components/boardGame/bg-logs/LogCard.vue';
import StepCard from '@/components/boardGame/user/StepCard.vue';


import { computed, inject, onMounted, ref } from 'vue';
const boardGameInfo = inject('boardGameInfo');
const layoutMethods = inject('layoutMethods');

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { api } from '@/composables/api.js'
const { sendApiRequest, responseErrors } = api();

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();


const props = defineProps({
	userName: {
		type: String,
		default: '',
	},
	// userInfo: {
	// 	type: Object,
	// 	default: {},
	// },
	boardGameId: {
		type: Number,
		default: 1,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
});






const route = useRoute();
const requestName = 'getBoardGamePlayerInfo';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (props.userName) {
				const response = await Promise.resolve(
						sendApiRequest(`board-game/v2/player/get/${route.params.slug}/${props.userName}`, 'GET', {}, requestName, 'fullscreenTransparent')
				);

				return response?.data || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const userInfo = computed(() => requestData.value || null);










const currentPlayer = computed(() => {
	let curPlayer = null;

	if (props.boardGameInfo && props.boardGameInfo.players) {
		let curPlayer = props.boardGameInfo.players.filter((item) => item.user_id === userInfo.value.user_id);
	}

	if (curPlayer && curPlayer[0]) {
		return curPlayer[0];
	}
});

/* НАЧАЛО: Поля профайла */

const twitch = computed(() => {
	if (userInfo.value && userInfo.value.user && userInfo.value.user.additional_fields) {
		const twitchField = userInfo.value.user.additional_fields.filter((item) => item.slug === 'twitch_channel');

		if (twitchField.length > 0 && twitchField[0]) {
			return twitchField[0];
		}
	}

	return false;
});

/* КОНЕЦ: Поля профайла */

/* Табы профайла */
const tabsElements = ref([]);

watch(() => boardGameStore.playersOnline, () => {
	if (userInfo.value && userInfo.value?.user?.id && boardGameStore.playersOnline[userInfo.value.user.id]) {
		setUnsetTwitchTab();
	}
}, { deep: true });

const hasStream = ref(false);

const setUnsetTwitchTab = () => {
	if (!hasStream.value && userInfo.value && userInfo.value?.user?.id && boardGameStore.playersOnline[userInfo.value.user.id]) {
		tabsElements.value.unshift({
			id: 'stream',
			title: 'Стрим',
		});

		hasStream.value = true;
	} else {
		tabsElements.value = tabsElements.value.filter(item => item.id !== 'stream')

		hasStream.value = false;
	}
}

setUnsetTwitchTab();

tabsElements.value.push(
		{
			id: 'currentElement',
			title: 'Текущая игра',
		}
);


tabsElements.value.push(
		{
			id: 'gameHistory',
			title: 'История игр',
		}
);

tabsElements.value.push(
		{
			id: 'itemsHistory',
			title: 'История предметов',
		}
);

tabsElements.value.push(
		{
			id: 'logsHistory',
			title: 'Логи',
		}
);

const scriptTwitchIsOnline = ref(false);

onMounted(() => {
	if (process.client) {
		const script = document.createElement('script');
		script.src = 'https://player.twitch.tv/js/embed/v1.js';
		document.body.appendChild(script);
		script.onload = () => {
			scriptTwitchIsOnline.value = true;
		};
	}
});
</script>

<template>
	<button @click="refresh">Обновить</button>
	<div v-if="userInfo">
		<div
				v-if="userInfo && userInfo.user"
				class="player-info"
		>
			<div class="box">
				<img
						v-if="userInfo.user.avatar"
						:src="getResizeImg(userInfo.user.avatar)"
						:alt="userInfo.user.name"
						:title="userInfo.user.name"
						@click="layoutMethods.setOpenedImage(userInfo.user.avatar)"
				>
				<img v-else src="/images/system/no-avatar.png">
			</div>
			<div class="box w-full">
				<h2 class="inv-title">{{ userInfo.user.name }}</h2>
				<div class="info">
					<div class="column1">
						<span
								v-if="twitch"
								class="field"
						>
							Канал на twitch: <a :href="`${twitch.value}`" target="_blank" :title="`Twitch канал ${userInfo.user.name}`">{{ twitch.value }}</a>
						</span>
						<span class="field">
							Участвует в игре с {{ getFormattedDate('d.m.Y H:i', userInfo.created_at) }}
						</span>
						<span class="field">
							Пройдено игр: {{ finishedGamesCount }}
						</span>
						<span class="field">
							Количество очков: {{ userInfo.points }}
						</span>
						<span class="field">
							Позиция на поле: {{ userInfo.position ? userInfo.position : 'Не делал ходов' }}
						</span>
						<span class="field">
							Итоговый результат: {{ userInfo.full_points }}
						</span>
						<span
								v-if="userInfo.full_points && userInfo.seconds"
								class="field"
						>
							Очков в час: {{ Math.round((userInfo.full_points / userInfo.seconds) * 3600) }}
						</span>
						<span class="field">
							Статус: <template v-if="userInfo.active">Участвует</template><template v-else>Не участвует</template>
						</span>

<!--						Заменить на отправку ЛС-->
<!--						<button-->
<!--								v-if="(userStore.user && Object.keys(userStore.user).length > 0) && (userInfo.user_id !== userStore.user.id)"-->
<!--								class="btn btn-primary"-->
<!--								@click="emit('sendNotification', userInfo.user_id)"-->
<!--						>-->
<!--							Отправить уведомление-->
<!--						</button>-->

					</div>
					<div class="column2">
<!--						<Timer-->
<!--								class="w-2/3"-->
<!--								:boardGameId="boardGameInfo.id"-->
<!--								:userId="userInfo.user_id"-->
<!--								:showName="false"-->
<!--								:showControlButtons="false"-->
<!--						/>-->
					</div>
				</div>
			</div>
		</div>



<!--		<ui-OpeningBox-->
<!--				v-if="userInfo.player_games.length > 0"-->
<!--				title="История игр игрока"-->
<!--		>-->

<!--		</ui-OpeningBox>-->



<!--		<div class="logs-and-steps">-->
<!--			<div-->
<!--					v-if="userInfo.logs"-->
<!--					class="box"-->
<!--			>-->
<!--				<h2 class="inv-title">Логи игры</h2>-->
<!--				<div v-if="userInfo.logs.length > 0" class="wrapper">-->
<!--					<LogCard-->
<!--							v-for="(log, key) in userInfo.logs"-->
<!--							:key="key"-->
<!--							:element="log"-->
<!--							theme="simple"-->
<!--							:boardGameInfo="boardGameInfo"-->
<!--							@setOpenedImage="emit('setOpenedImage', $event)"-->
<!--					/>-->
<!--				</div>-->
<!--			</div>-->
<!--			<div-->
<!--					v-if="userInfo.steps"-->
<!--					class="box"-->
<!--			>-->
<!--				<h2 class="inv-title">Шаги игрока</h2>-->
<!--				<div v-if="userInfo.steps.length > 0" class="wrapper">-->
<!--					<StepCard-->
<!--							v-for="(step, key) in userInfo.steps"-->
<!--							:key="key"-->
<!--							:stepNumber="userInfo.steps.length - key"-->
<!--							:element="step"-->
<!--							:prevStep="userInfo.steps[key + 1] ? userInfo.steps[key + 1] : {}"-->
<!--							:boardGameInfo="boardGameInfo"-->
<!--							@setOpenedImage="emit('setOpenedImage', $event)"-->
<!--					/>-->
<!--				</div>-->
<!--			</div>-->
<!--		</div>-->

		<Tabs
				:tabs="tabsElements"
				:defaultCurrentTab="hasStream ? 'stream' : 'currentElement'"
				type="if"
		>
			<template #tab-stream>
				<div class="twitch">
					<TwitchCard
							v-if="hasStream && scriptTwitchIsOnline"
							:channel="twitch.value"
					/>
				</div>
			</template>
			<template #tab-currentElement>
				<CurrentGame :userName="userName" />
			</template>
			<template #tab-gameHistory>
				<GameHistory :userName="userName" />
			</template>
			<template #tab-itemsHistory>
				<InventoryHistory :userName="userName" />
			</template>
			<template #tab-logsHistory>
				2
			</template>
		</Tabs>
	</div>
</template>

<style lang="scss">
.twitch {
	iframe {
		@apply w-[50%] h-[40rem];
	}
}
</style>

<style lang="scss" scoped>
.player-info {
	@apply block lg:flex gap-4 mb-[2rem];

	.box {
		@apply mb-[1rem] lg:mb-0;

		span {
			&.field {
				@apply block mb-[0.2rem];
			}
		}

		.info {
			@apply block lg:flex;

			.column1 {
				@apply w-full lg:w-1/2;
			}

			.column2 {
				@apply flex justify-center lg:justify-end w-full lg:w-1/2;
				//@apply w-2/3;
			}
		}

		img {
			@apply mx-auto rounded-full;
		}
	}
}

.inventory,
.logs-and-steps,
.current-game
{
	@apply block lg:flex gap-4 mb-4;

	.box {
		@apply mb-[1rem] lg:mb-0 w-full lg:w-1/2;

		.wrapper {
			@apply h-[440px] overflow-auto;
		}
	}
}

.logs-and-steps {
	@apply block lg:flex gap-4;

	.logs {

	}
}

.inv-title {
	@apply font-bold mb-4 uppercase;
}

img {
	@apply w-[150px] h-[150px] object-cover cursor-pointer;
}
</style>
