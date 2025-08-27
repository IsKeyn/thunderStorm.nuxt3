<script setup>
import Timer from '@/modules/boardGame/components/timer/Timer.vue';

import ItemCard from '@/components/boardGame/inventory/ItemCard.vue';
import LogCard from '@/components/boardGame/bg-logs/LogCard.vue';
import StepCard from '@/components/boardGame/user/StepCard.vue';
import CurrentGameCard from '@/components/boardGame/game/CurrentGameCard.vue';
import ProfileGameCard from '@/components/boardGame/game/ProfileGameCard.vue';

import DoughnutChart from '@/components/ui/charts/DoughnutChart.vue';

import { inject } from 'vue'
const boardGameInfo = inject('boardGameInfo')
const layoutMethods = inject('layoutMethods')

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const props = defineProps({
	userInfo: {
		type: Object,
		default: {},
	},
	boardGameId: {
		type: Number,
		default: 1,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
});

const currentPlayer = computed(() => {
	let curPlayer = null;

	if (props.boardGameInfo && props.boardGameInfo.players) {
		let curPlayer = props.boardGameInfo.players.filter((item) => item.user_id === props.userInfo.user_id);
	}

	if (curPlayer && curPlayer[0]) {
		return curPlayer[0];
	}
});

const usedItems = computed(() => {
	const grouped = {};

	if (props.userInfo.inventory) {
		props.userInfo.inventory.filter(item => item.has_used).forEach((item) => {
			if (item.item) {
				if (grouped[item.item.id]) {
					grouped[item.item.id].item.quantity++;
				} else {
					grouped[item.item.id] = { ...item };
					grouped[item.item.id].item.quantity = 1;
				}
			}
		});
	}

	return Object.values(grouped).sort(function(a, b) {
		return b.item.quantity - a.item.quantity;
	});
});

/* НАЧАЛО: Поля профайла */

const twitch = computed(() => {
	if (props.userInfo && props.userInfo.user && props.userInfo.user.additional_fields) {
		const twitchField = props.userInfo.user.additional_fields.filter((item) => item.slug === 'twitch_channel');

		if (twitchField.length > 0 && twitchField[0]) {
			return twitchField[0];
		}
	}

	return false;
});

const finishedGamesCount = computed(() => {
	return props.userInfo.player_games.filter((item) => item.status === 2).length;
});

const rerolledGamesCount = computed(() => {
	return props.userInfo.player_games.filter((item) => item.status === 1).length;
});

const givenAwayGamesCount = computed(() => {
	return props.userInfo.player_games.filter((item) => item.status === 3).length;
});

/* КОНЕЦ: Поля профайла */

const chartData = {
	labels: ['Пройденные', 'Рерольнутые', 'Отданные'],
	datasets: [
		{
			label: 'Игры',
			data: [
				finishedGamesCount,
				rerolledGamesCount,
				givenAwayGamesCount
			],
			backgroundColor: [
				'rgb(28,172,7)',
				'rgb(183,0,0)',
				'rgb(10,33,157)'
			],
			borderColor: 'rgba(0, 0, 0, 0)', // Цвет обводки
			borderWidth: 2, // Толщина обводки
			hoverOffset: 4
		}
	]
};

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: 'right',
			labels: {
				color: '#C0C0C0' // Черный цвет для текста легенды
			}
		},
		// title: {
		// 	display: true,
		// 	text: 'Игры',
		// 	color: '#000000' // Черный цвет для заголовка
		// },
		tooltip: {
			titleColor: '#C0C0C0', // Черный цвет заголовка подсказки
			bodyColor: '#C0C0C0'  // Черный цвет текста подсказки
		}
	}
}
</script>

<template>
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
						<Timer
								class="w-2/3"
								:boardGameId="boardGameInfo.id"
								:userId="userInfo.user_id"
								:showName="false"
								:showControlButtons="false"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="mb-[2rem]" v-if="userInfo.current_game">
			<h2 class="inv-title">Текущая игра</h2>
<!--			<CurrentGameCard-->
<!--					:currentGame="userInfo.current_game"-->
<!--					:players="boardGameInfo.players"-->
<!--					:showTitle="false"-->
<!--					class="current-game"-->
<!--			/>-->
		</div>

<!--		<ui-OpeningBox-->
<!--				v-if="userInfo.player_games.length > 0"-->
<!--				title="История игр игрока"-->
<!--		>-->
<!--			<div class="item-box game-count-line">-->
<!--				<DoughnutChart :chart-data="chartData" :chart-options="chartOptions" />-->
<!--				&lt;!&ndash;				<span>&ndash;&gt;-->
<!--				&lt;!&ndash;					Пройдено игр: {{ finishedGamesCount }}&ndash;&gt;-->
<!--				&lt;!&ndash;				</span>&ndash;&gt;-->
<!--				&lt;!&ndash;				<span>&ndash;&gt;-->
<!--				&lt;!&ndash;					Рерольнуто игр: {{ rerolledGamesCount }}&ndash;&gt;-->
<!--				&lt;!&ndash;				</span>&ndash;&gt;-->
<!--				&lt;!&ndash;				<span>&ndash;&gt;-->
<!--				&lt;!&ndash;					Отдано игр: {{ givenAwayGamesCount }}&ndash;&gt;-->
<!--				&lt;!&ndash;				</span>&ndash;&gt;-->
<!--			</div>-->
<!--			<div v-for="(element, key) in userInfo.player_games" :key="key">-->
<!--&lt;!&ndash;				<ProfileGameCard&ndash;&gt;-->
<!--&lt;!&ndash;						v-if="element.status !== 0"&ndash;&gt;-->
<!--&lt;!&ndash;						:element="element"&ndash;&gt;-->
<!--&lt;!&ndash;						:players="boardGameInfo.players"&ndash;&gt;-->
<!--&lt;!&ndash;						@setOpenedImage="emit('setOpenedImage', $event)"&ndash;&gt;-->
<!--&lt;!&ndash;				/>&ndash;&gt;-->
<!--			</div>-->
<!--		</ui-OpeningBox>-->

<!--&lt;!&ndash;		<div&ndash;&gt;-->
<!--&lt;!&ndash;				v-if="userInfo.inventory"&ndash;&gt;-->
<!--&lt;!&ndash;				class="inventory"&ndash;&gt;-->
<!--&lt;!&ndash;		>&ndash;&gt;-->
<!--&lt;!&ndash;			<div class="box mb-[2rem]">&ndash;&gt;-->
<!--&lt;!&ndash;				<h2 v-if="userInfo" class="inv-title">Инвентарь игрока</h2>&ndash;&gt;-->
<!--&lt;!&ndash;				<span v-if="userInfo.inventory && userInfo.inventory.filter(item => !item.has_used).length === 0">Предметов нет</span>&ndash;&gt;-->
<!--&lt;!&ndash;				<div class="wrapper">&ndash;&gt;-->
<!--&lt;!&ndash;					<ItemCard&ndash;&gt;-->
<!--&lt;!&ndash;							v-for="(element, key) in userInfo.inventory.filter(item => !item.has_used)"&ndash;&gt;-->
<!--&lt;!&ndash;							:key="key"&ndash;&gt;-->
<!--&lt;!&ndash;							:element="element.item"&ndash;&gt;-->
<!--&lt;!&ndash;							:useLightBox="true"&ndash;&gt;-->
<!--&lt;!&ndash;							@setOpenedImage="emit('setOpenedImage', $event)"&ndash;&gt;-->
<!--&lt;!&ndash;					/>&ndash;&gt;-->
<!--&lt;!&ndash;				</div>&ndash;&gt;-->
<!--&lt;!&ndash;			</div>&ndash;&gt;-->
<!--&lt;!&ndash;			<div class="box">&ndash;&gt;-->
<!--&lt;!&ndash;				<h2 v-if="userInfo" class="inv-title">Использованные предметы игрока</h2>&ndash;&gt;-->
<!--&lt;!&ndash;				<span v-if="usedItems.length === 0">Предметов нет</span>&ndash;&gt;-->
<!--&lt;!&ndash;				<div class="wrapper">&ndash;&gt;-->
<!--&lt;!&ndash;					<ItemCard&ndash;&gt;-->
<!--&lt;!&ndash;							v-for="(element, key) in usedItems"&ndash;&gt;-->
<!--&lt;!&ndash;							:key="key"&ndash;&gt;-->
<!--&lt;!&ndash;							:element="element.item"&ndash;&gt;-->
<!--&lt;!&ndash;							:useLightBox="true"&ndash;&gt;-->
<!--&lt;!&ndash;							@setOpenedImage="emit('setOpenedImage', $event)"&ndash;&gt;-->
<!--&lt;!&ndash;					/>&ndash;&gt;-->
<!--&lt;!&ndash;				</div>&ndash;&gt;-->
<!--&lt;!&ndash;			</div>&ndash;&gt;-->
<!--&lt;!&ndash;		</div>&ndash;&gt;-->

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
	</div>
</template>

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

.game-count-line {
	@apply block lg:flex justify-center;

	span {
		@apply block lg:inline mr-[1.5rem];
	}
}
</style>
