<script setup>
import ItemCard from '@/components/boardGame/inventory/ItemCard.vue';
import LogCard from '@/components/boardGame/bg-logs/LogCard.vue';
import StepCard from '@/components/boardGame/user/StepCard.vue';
import CurrentGameCard from '@/components/boardGame/game/CurrentGameCard.vue';
import ProfileGameCard from '@/components/boardGame/game/ProfileGameCard.vue';

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const emit = defineEmits(['setOpenedImage', 'sendNotification']);

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

const twitch = computed(() => {
	if (props.userInfo.player_info && props.userInfo.player_info.user && props.userInfo.player_info.user.additional_fields) {
		const twitchField = props.userInfo.player_info.user.additional_fields.filter((item) => item.slug === 'twitch_channel');

		if (twitchField.length > 0 && twitchField[0]) {
			return twitchField[0];
		}
	}

	return false;
});

const currentPlayer = computed(() => {
	let curPlayer = props.boardGameInfo.players.filter((item) => item.user_id === props.userInfo.player_info.user_id);

	if (curPlayer && curPlayer[0]) {
		return curPlayer[0];
	}
});
</script>

<template>
	<div v-if="userInfo && userInfo.inventory">
		<div
				v-if="userInfo.player_info && userInfo.player_info.user"
				class="player-info"
		>
			<div class="box">
				<img
						v-if="userInfo.player_info.user.avatar"
						:src="getResizeImg(userInfo.player_info.user.avatar)"
						:alt="userInfo.player_info.user.name"
						:title="userInfo.player_info.user.name"
						@click="emit('setOpenedImage', userInfo.player_info.user.avatar)"
				>
				<img v-else src="/images/system/no-avatar.png">
			</div>
			<div class="box">
				<h2 v-if="userInfo.player_info.user" class="inv-title">{{ userInfo.player_info.user.name }}</h2>
				<div class="info">
					<div class="column1">
						<span
								v-if="twitch"
								class="field"
						>
							Канал на twitch: <a :href="`${twitch.value}`" target="_blank" :title="`Twitch канал ${userInfo.player_info.user.name}`">{{ twitch.value }}</a>
						</span>
						<span class="field">
							Участвует в игре с {{ getFormattedDate('d.m.Y H:i', userInfo.player_info.created_at) }}
						</span>
						<span class="field">
							Количество очков: {{ userInfo.player_info.points }}
						</span>
						<span class="field">
							Позиция на поле: {{ userInfo.player_info.position ? userInfo.player_info.position : 'Не делал ходов' }}
						</span>
						<span class="field">
							Итоговый результат: {{ userInfo.player_info.full_points }}
						</span>
						<button
								v-if="userInfo.player_info.user_id !== userStore.user.id"
								class="btn btn-primary"
								@click="emit('sendNotification', userInfo.player_info.user_id)"
						>
							Отправить уведомление
						</button>
					</div>
					<div class="column2">

					</div>

				</div>
			</div>
		</div>

		<div class="mb-[2rem]" v-if="currentPlayer.current_game">
			<h2 class="inv-title">Текущая игра</h2>
			<CurrentGameCard
					:currentGame="currentPlayer.current_game"
					:players="boardGameInfo.players"
					class="current-game"
			/>
		</div>

		<ui-OpeningBox
				v-if="userInfo.player_info.player_games.length > 0"
				title="История игр игрока"
		>
			<div v-for="(element, key) in userInfo.player_info.player_games" :key="key">
				<ProfileGameCard
						v-if="element.status !== 0"
						:element="element"
						:players="boardGameInfo.players"
						@setOpenedImage="emit('setOpenedImage', $event)"
				/>
			</div>
		</ui-OpeningBox>

		<div
				v-if="userInfo.inventory"
				class="inventory"
		>
			<div class="box mb-[2rem]">
				<h2 v-if="userInfo.player_info" class="inv-title">Инвентарь игрока</h2>
				<span v-if="userInfo.inventory && userInfo.inventory.filter(item => !item.has_used).length === 0">Предметов нет</span>
				<div class="wrapper">
					<ItemCard
							v-for="(element, key) in userInfo.inventory.filter(item => !item.has_used)"
							:key="key"
							:element="element.item"
							:useLightBox="true"
							@setOpenedImage="emit('setOpenedImage', $event)"
					/>
				</div>
			</div>
			<div class="box">
				<h2 v-if="userInfo.player_info" class="inv-title">Использованные предметы игрока</h2>
				<span v-if="userInfo.inventory && userInfo.inventory.filter(item => item.has_used).length === 0">Предметов нет</span>
				<div class="wrapper">
					<ItemCard
							v-for="(element, key) in userInfo.inventory.filter(item => item.has_used)"
							:key="key"
							:element="element.item"
							:useLightBox="true"
							@setOpenedImage="emit('setOpenedImage', $event)"
					/>
				</div>
			</div>
		</div>

		<div class="logs-and-steps">
			<div
					v-if="userInfo.logs"
					class="box"
			>
				<h2 class="inv-title">Логи игры</h2>
				<div v-if="userInfo.logs.length > 0" class="wrapper">
					<LogCard
							v-for="(log, key) in userInfo.logs"
							:key="key"
							:element="log"
							theme="simple"
							:boardGameInfo="boardGameInfo"
							@setOpenedImage="emit('setOpenedImage', $event)"
					/>
				</div>
			</div>
			<div
					v-if="userInfo.steps"
					class="box"
			>
				<h2 class="inv-title">Шаги игрока</h2>
				<div v-if="userInfo.steps.length > 0" class="wrapper">
					<StepCard
							v-for="(step, key) in userInfo.steps"
							:key="key"
							:stepNumber="userInfo.steps.length - key"
							:element="step"
							:prevStep="userInfo.steps[key + 1] ? userInfo.steps[key + 1] : {}"
							:boardGameInfo="boardGameInfo"
							@setOpenedImage="emit('setOpenedImage', $event)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.player-info {
	@apply flex gap-4 mb-[2rem];

	.box {
		span {
			&.field {
				@apply block mb-[0.2rem];
			}
		}

		.info {
			@apply flex;

			.column1 {
				//@apply w-1/3;
			}

			.column1 {
				//@apply w-2/3;
			}
		}
	}
}

.inventory,
.logs-and-steps,
.current-game
{
	@apply flex gap-4;

	.box {
		@apply w-1/2;

		.wrapper {
			@apply h-[440px] overflow-auto;
		}
	}
}

.logs-and-steps {
	@apply flex gap-4;

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
