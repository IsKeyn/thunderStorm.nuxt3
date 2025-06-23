<script setup>
import PlayerCard from '@/components/boardGame/user/PlayerCard.vue';
import LightBox from '@/components/media/LightBox.vue'
import Modal from '@/components/modals/Modal.vue';
import UserProfile from '@/components/boardGame/user/UserProfile.vue';
import SendNotificationForm from '@/components/user/notifications/SendNotificationForm.vue';

import { api } from '@/composables/api.js'
const {
	sendApiRequest,
} = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

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

import { lightBox } from '@/composables/lightBox.js';
import {computed, ref} from "vue";
const {
	openedImage,
	setOpenedImage
} = lightBox();

const modalOpen = ref(false);

const openCloseModalFunc = () => {
	modalOpen.value = !modalOpen.value;
};

const userIdForInfo = ref(null);

const showPlayerInfo = (id) => {
	getPlayerInfo(id);
	openCloseModalFunc();
}

defineExpose({
	showPlayerInfo,
});

const requestInProgress = ref(false);
const fetchData = ref({});

const getPlayerInfo = async (id) => {
	requestInProgress.value = true;

	try {
		const response = await sendApiRequest(`board-game/player/get/${id}?board_game_id=${props.boardGameId}`, 'GET', {});

		if (response) {
			requestInProgress.value = false;

			fetchData.value = response;
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
};

const notificationModalOpen = ref(false);

const openCloseNotificationModal = () => {
	notificationModalOpen.value = !notificationModalOpen.value;
};

const notificationForUserWithId = ref(null);

const sendNotification = (id) => {
	notificationForUserWithId.value = id;
	openCloseNotificationModal();
}

const afterSendNotification = () => {
	notificationForUserWithId.value = null;
	openCloseNotificationModal();
}

const sortType = ref('byFullPoints');
const sortDirection = ref('desc');

const sortedPlayerList = computed(() => {
	return props.boardGameInfo.players.sort((a, b) => {
		if (sortType.value === 'byFullPoints') {
			return sortDirection.value === 'desc' ? b.full_points - a.full_points : a.full_points - b.full_points;
		}

		if (sortType.value === 'pointsPerSeconds') {
			// Если у обоих seconds = 0, сохраняем их исходный порядок
			if (a.seconds === 0 && b.seconds === 0) return 0;
			// Если у a seconds = 0, помещаем его ниже
			if (a.seconds === 0) return sortDirection.value === 'desc' ? 1 : -1;
			// Если у b seconds = 0, помещаем его ниже
			if (b.seconds === 0) return sortDirection.value === 'desc' ? -1 : 1;

			const ppSecondA = a.full_points ? (a.full_points / a.seconds) : 0;
			const ppSecondB = b.full_points ? (b.full_points / b.seconds) : 0;

			console.log();

			return sortDirection.value === 'desc' ? ppSecondB - ppSecondA : ppSecondA - ppSecondB;
		}
	});
});
</script>

<template>
	<span class="user-interface-title">Игроки</span>
	<div class="flex justify-end mb-4">
		<select v-model="sortType" class="w-full mr-4">
			<option value="byFullPoints">По количеству очков</option>
			<option value="pointsPerSeconds">По соотношению очки/время</option>
		</select>
		<button>
			<font-awesome-icon
					v-if="sortDirection === 'desc'"
					:icon="['fas', 'arrow-down-wide-short']"
					@click="sortDirection = 'asc'"
			/>
			<font-awesome-icon
					v-if="sortDirection === 'asc'"
					:icon="['fas', 'arrow-up-short-wide']"
					@click="sortDirection = 'desc'"
			/>
		</button>
	</div>
	<div class="wrapper">
		<div
				v-for="(player, key) in sortedPlayerList"
				:key="key"
		>
			<PlayerCard
				:element="player"
				:place="sortDirection === 'desc' ? key : sortedPlayerList.length - key - 1"
				theme="short"
				@setOpenedImage="setOpenedImage"
				@showPlayerInfo="showPlayerInfo"
			/>
		</div>
	</div>

	<LightBox
			v-if="openedImage"
			:image="openedImage"
			:setViewsLog="true"
			@setCurrentElement="setOpenedImage"
	/>

	<Modal
			:showOpenModal="modalOpen"
			size="full-width"
			:fullCloseModal="true"
			@toggleModal="openCloseModalFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Профиль игрока</h3>
			<div class="link-parent-box">
				<ui-BigPreloader v-if="requestInProgress" />
				<UserProfile
						v-if="!requestInProgress"
						:userInfo="fetchData"
						:boardGameInfo="boardGameInfo"
						@setOpenedImage="setOpenedImage"
						@sendNotification="sendNotification"
				/>
			</div>
		</div>
	</Modal>

	<Modal
			:showOpenModal="notificationModalOpen"
			size="medium"
			:fullCloseModal="true"
			overlayClasses="z-[1000]"
			@toggleModal="openCloseNotificationModal"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Отправить уведомление</h3>
			<div class="link-parent-box">
				<SendNotificationForm
					:userId="notificationForUserWithId"
					@afterSendForm="afterSendNotification"
				/>
			</div>
		</div>
	</Modal>
</template>

<style lang="scss" scoped>
.wrapper {
	@apply max-h-[300px];

	overflow: auto;
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
