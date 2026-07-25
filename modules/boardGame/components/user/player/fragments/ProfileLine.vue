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

const messenger = computed(() => {
	if (userStore && userStore.user && userStore.user.additional_fields) {
		const field = userStore.user.additional_fields.filter((item) => item.slug === 'messenger');

		if (field.length > 0 && field[0]) {
			return field[0];
		}
	}

	return false;
});

const sendMessage = (user) => {
	emit('showUserMessagesModal', user);
}
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
			<div v-if="!element.premium || !element.backgroundImage" class="bg"/>
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
								class="wrapper twitch-wrapper"
								@click.prevent="goToTwitch(boardGameStore.playersOnline[element.user.id])"
						>Онлайн <font-awesome-icon icon="fa-brands fa-twitch" fade /></span>
						<span v-if="isAuth && !isCurrentUser" class="wrapper default message" @click.prevent="sendMessage(element.user)"><font-awesome-icon icon="fa-solid fa-envelope" /></span>
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
						<span class="wrapper default">Очков в час: {{ element.points_per_hour ?? 0 }}</span>
						<span class="wrapper default">На поле: {{ element.position ? element.position : 'Не ходил' }}</span>
						<span class="wrapper default">Стрик: x{{ element.streak }}</span>
						<span
								v-if="type === 'detail' && element.created_at"
								class="wrapper default"
						>В ивенте с {{ getFormattedDate('d ru_mouths_name Y', element.created_at) }}</span>
						<template v-if="element.active">
							<span class="wrapper default">Участвует</span>
						</template>
						<template v-else>
							<span class="wrapper default">Не участвует</span>
							<span v-if="element.not_active_reason" class="wrapper default">{{ element.not_active_reason }}</span>
						</template>
					</div>
				</div>
				<div v-if="type === 'detail'" class="box">
					<Timer
							:userId="element.user_id"
							:showName="false"
							:showControlButtons="false"
					/>
				</div>
			</div>
		</div>
		<div :class="['second-line', type]">
			<div class="content line-content second">
				<template v-if="type === 'detail'">
					<div class="box">
						<NuxtLink
								v-if="twitch.value"
								class="btn btn-simple-1 mr-2 inline-block"
								:to="`https://www.twitch.tv/${twitch.value}`"
								target="_blank"
								:title="`Twitch канал ${element?.user?.public_name}`"
						>
							Twitch канал <font-awesome-icon icon="fa-brands fa-twitch" />
						</NuxtLink>
						<NuxtLink
								v-if="otherStreamPlatform.value"
								class="btn btn-simple-1 mr-2 inline-block"
								:to="otherStreamPlatform.value"
								target="_blank"
								title="Платформа стрима"
						>
							Платформа стрима <font-awesome-icon icon="fa-regular fa-circle-play" />
						</NuxtLink>
						<NuxtLink
								v-if="messenger.value"
								class="btn btn-simple-1 mr-2 inline-block"
								:to="messenger.value"
								target="_blank"
								title="Мессенджер"
						>
							Мессенджер <font-awesome-icon icon="fa-brands fa-telegram" />
						</NuxtLink>
					</div>
					<div class="box">
						<template v-if="isCurrentUser">
							<button
									class="btn btn-simple-1 mr-2"
									@click="$emit('showUserMessagesModal')"
							>
								<font-awesome-icon icon="fa-solid fa-envelope" class="mr-2" /> Мои сообщения
							</button>
							<button
									class="btn btn-simple-1 mr-2"
									@click="$emit('showNotificationModal')"
							>
								<font-awesome-icon icon="fa-solid fa-bell" class="mr-2" /> Мои уведомления
							</button>
							<button
									class="btn btn-simple-1 mr-2"
									@click="logout"
							>
								<font-awesome-icon :icon="['fas', 'right-from-bracket']" class="mr-2" /> Выйти
							</button>
						</template>
					</div>
				</template>
				<template v-else-if="type === 'list'">
					<div class="box">
						<GameGamblingCard
								v-if="element?.current_game?.game"
								:element="element.current_game.game"
								:itemHeight="60"
								overlayClasses="!bg-black/60"
						/>
					</div>
					<div class="box">
						<SmallCardsLine
								v-if="!hideItems"
								:element="element.inventory"
								type="items"
						/>
					</div>
					<div class="box">
						<SmallCardsLine
								v-if="!hideStatusEffect"
								:element="element.statusEffects"
						/>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import url('~/assets/scss/Fragments/profileLine.scss');
</style>
