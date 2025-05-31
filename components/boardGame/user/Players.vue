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
import { ref } from "vue";
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
</script>

<template>
	<span class="user-interface-title">Игроки</span>
	<div class="wrapper">
		<div
				v-for="(player, key) in boardGameInfo.players.sort((a, b) => b.full_points - a.full_points)"
				:key="key"
		>
			<PlayerCard
				:element="player"
				:place="key"
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
			<h3 class="modal-title">Профиль пользователя</h3>
			<div class="link-parent-box">
				<ui-BigPreloader v-if="requestInProgress" />
				<UserProfile
						v-show="!requestInProgress"
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
