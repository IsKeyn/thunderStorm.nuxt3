<script setup>
import Timer from '@/modules/boardGame/components/timer/Timer.vue';
import SmallCardsLine from '@/modules/boardGame/components/user/player/playerCards/fragments/SmallCardsLine.vue';
import GameGamblingCard from '@/modules/boardGame/components/game/GameGamblingCard.vue';

import { computed } from "vue";
const emit = defineEmits(['refresh', 'showNotificationModal', 'showUserMessagesModal']);

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { userFunctions } from '@/composables/userFunctions.js';
const {
	isAuth,
	logout,
	sendLogoutRequest,
} = userFunctions();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

import { media } from '@/composables/media.js'
const { getResizeImg } = media();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { getSettingValue } = boardGame();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	/* list, detail */
	type: {
		type: String,
		default: 'detail',
	},
	hideItems: {
		type: Boolean,
		default: false,
	},
	hideStatusEffect: {
		type: Boolean,
		default: false,
	},
});

const getPlaceColor = (place) => {
	switch (place) {
		case 1: return 'gold';
		case 2: return 'silver';
		case 3: return 'bronze';
	}
}

const goToTwitch = (twitchChanel) => {
	window.open(`https://www.twitch.tv/${twitchChanel}`, '_blank');
}

const isCurrentUser = computed(() => { return isAuth && props.element && userStore.user.id === props.element.user_id; });

const twitch = computed(() => {
	if (props.element?.user?.additional_fields) {
		const twitchField = props.element.user.additional_fields.filter((item) => item.slug === 'twitch_channel');

		if (twitchField.length > 0 && twitchField[0]) return twitchField[0];
	}

	return false;
});

const otherStreamPlatform = computed(() => {
	if (props.element?.user?.additional_fields) {
		const otherStreamPlatform = props.element.user.additional_fields.filter((item) => item.slug === 'other_stream_platform');

		if (otherStreamPlatform.length > 0 && otherStreamPlatform[0]) return otherStreamPlatform[0];
	}

	return false;
});

const eventType = computed(() => {
	return getSettingValue('event_type');
});
</script>

<template>
	<div
			v-if="element && element.user"
			:class="['player-box', type]"
	>
		<div
				class="first-line"
				:style="[
					`${element.premium && element.backgroundImage
					? 'background-image: url(' + getResizeImg(element.backgroundImage, 1500) + ');'
					: ''}`,
					`background-size: ${element?.settings?.pave ? 'contain' : 'cover'}`,
					`background-position: ${element?.settings?.backgroundPosition ? element.settings.backgroundPosition : ''}`,
					`background-repeat: ${element?.settings?.pave ? 'repeat' : 'no-repeat'}`,
				]"
		>
			<div v-if="!element.premium" class="bg"/>
			<div v-else class="vein" :style="`background: rgba(0, 0, 0, ${element?.settings?.vein ? element.settings.vein : '0.5'})`" />
			<div class="avatar-box-main">
				<UserAvatar
						:user="element.user"
						:useLightBox="type === 'detail'"
						:canChange="type === 'detail'"
						classes="w-[90%] aspect-square object-cover"
						:borderType="`${ element.premium && element?.settings?.avatarBorder ? element.settings.avatarBorder : '' }`"
						@afterChangeAvatar="$emit('refresh')"
				/>
				<div
						v-if="element.place !== null"
						class="absolute-place-box"
				>
					<span
							v-if="element.place"
							:class="['place', getPlaceColor(element.place)]"
							title="Место в ивенте"
					>
						{{ element.place }}
					</span>
				</div>
			</div>
			<div class="content line-content">
				<div class="wild-box">
					<div class="field">
						<span class="wrapper default">{{ element.user.public_name ?? element.user.name }}</span>
						<span
								v-if="boardGameStore.playersOnline && boardGameStore.playersOnline[element.user.id]"
								class="wrapper twitch"
								@click.prevent="goToTwitch(boardGameStore.playersOnline[element.user.id])"
						>Онлайн <font-awesome-icon icon="fa-brands fa-twitch" fade /></span>
					</div>
					<div
							v-if="element.premium && element?.settings?.premiumMessage"
							class="field"
					>
					<span class="wrapper default shimmer">
						<font-awesome-icon icon="fa-solid fa-bullhorn" class="inline mr-2" /> {{ element?.settings?.premiumMessage ? element.settings.premiumMessage : '' }}
					</span>
					</div>

					<div class="field">
					<span v-if="element?.full_points" class="wrapper default">
						Результат: {{ element.full_points }}
					</span>
						<span v-if="eventType !== 'board-last-cell'" class="wrapper default">Очков в час: {{ element.points_per_hour ?? 0 }}</span>
						<span class="wrapper default">На поле: {{ element.position ? element.position : 'Не ходил' }}</span>
						<span class="wrapper default">Стрик: x{{ element.streak }}</span>
						<span
								v-if="type === 'detail' && element.created_at"
								class="wrapper default"
						>В ивенте с {{ getFormattedDate('d ru_mouths_name Y', element.created_at) }}</span>
						<span
								v-if="type === 'detail'"
								class="wrapper default"
						>
						<template v-if="element.active">
							Участвует
						</template>
						<template v-else>
							Не участвует
						</template>
					</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import url('~/assets/scss/Fragments/profileLine.scss');
</style>
