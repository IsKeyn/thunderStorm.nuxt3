<script setup>
import Modal from '@/components/modals/Modal.vue';
import ChangeAvatar from '@/components/user/avatar/ChangeAvatar.vue';
import SetTwitchUrl from '@/components/boardGame/user/SetTwitchUrl.vue';
import UserNotificationModal from '@/components/user/notifications/UserNotificationModal.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { userNotification } from '@/composables/userNotification.js';
const {
	useNotifications,
	userNotificationModalRef,
	showNotificationModal,
} = userNotification();

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

const emit = defineEmits(['updateBoardGameInfo', 'showPlayer', 'showInventory', 'showGame', 'showTimer']);

import { ref } from "vue";

const boxOpen = ref(false);
const openCloseBoxFunc = () => {
	boxOpen.value = !boxOpen.value;
};
</script>

<template>
	<div
			v-if="userStore.user && Object.keys(userStore.user).length > 0"
			class="wrapper"
	>
		<span class="user-interface-title">{{ userStore.user.name }}</span>
		<div class="avatar">
			<img
					:src="userStore.user.avatar ? getResizeImg(userStore.user.avatar) : '/images/system/no-avatar.png'"
					:alt="userStore.user.name"
					:title="userStore.user.name"
					@click="emit('showPlayer', userStore.user.id)"
			/>
			<span
					v-if="useNotifications && useNotifications.currentUserNotificationCount && useNotifications.currentUserNotificationCount > 0"
					class="notifications"
					@click="showNotificationModal"
			>
				{{ useNotifications.currentUserNotificationCount }}
			</span>
			<!--				<font-awesome-icon :icon="['fas', 'camera']" class="change-avatar" />-->
		</div>
		<div class="user-info-wrap">
			<button class="btn btn-simple-1 mr-2" @click="openCloseBoxFunc()"><font-awesome-icon :icon="['fas', 'pen']" /></button>
			<button class="btn btn-simple-1 mr-2" @click="emit('showGame')"><font-awesome-icon :icon="['fas', 'gamepad']" /></button>
			<button class="btn btn-simple-1 mr-2" @click="emit('showInventory')"><font-awesome-icon :icon="['fas', 'hat-wizard']" /></button>
			<button class="btn btn-simple-1 mr-2" @click="emit('showTimer')"><font-awesome-icon :icon="['fas', 'stopwatch']" /></button>
			<button class="btn btn-simple-1 mr-2" @click="showNotificationModal"><font-awesome-icon :icon="['fas', 'bell']" /></button>
		</div>
	</div>
	<Modal
			:showOpenModal="boxOpen"
			size="medium"
			@toggleModal="openCloseBoxFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Изменение профайла</h3>
			<div class="link-parent-box">
				<span class="user-edit-profile-title">Изменение аватара</span>
				<ChangeAvatar @afterChangeAvatar="emit('updateBoardGameInfo')" />
				<span class="user-edit-profile-title">Изменение Twitch аккаунта</span>
				<SetTwitchUrl />
			</div>
		</div>
	</Modal>
	<UserNotificationModal ref="userNotificationModalRef" />
</template>

<style lang="scss" scoped>
.wrapper {
	@apply text-center pl-[1rem] pr-[1rem];

	.user-info-wrap {
		@apply flex justify-center items-center;

		.name {
			@apply pl-[1rem] pr-[1rem] text-[1.2rem];
		}
	}

	.avatar {
		@apply
			inline-block
			w-[5rem] h-[5rem]
			rounded-full object-cover
			relative
			cursor-pointer
		;

		.notifications {
			@apply
				w-[2rem] h-[2rem]
				flex rounded-full justify-center items-center
				bg-[var(--second-block-color)]
				absolute right-0 bottom-[-0.5rem]
			;
		}

		img {
			@apply w-[5rem] h-[5rem] rounded-full object-cover;
		}

		//.change-avatar {
		//	@apply absolute text-[2rem] top-[1.5rem] left-[1.5rem] hidden cursor-pointer;
		//}
		//
		//&:hover .change-avatar {
		//	@apply block;
		//}
	}
}

.user-edit-profile-title {
	@apply pb-[1rem] mt-[2rem] mb-[1.5rem] block text-[1.1rem];

	border-bottom: 1px solid var(--second-border-color);
}
</style>
