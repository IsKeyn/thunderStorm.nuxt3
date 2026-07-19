<script setup>
// import Modal from '@/components/modals/Modal.vue';
// import ChangeAvatar from '@/components/user/avatar/ChangeAvatar.vue';
// import SetTwitchUrl from '@/components/boardGame/user/SetTwitchUrl.vue';
import UserMessagesModal from '@/components/user/message/UserMessagesModal.vue';
import UserNotificationModal from '@/components/user/notifications/UserNotificationModal.vue';
import UserSettings from '@/modules/boardGame/components/user/settings/UserSettings.vue';

const emit = defineEmits(['updateBoardGameInfo', 'showPlayer', 'showInventory', 'showGame', 'showTimer']);

import { ref, onMounted, onUnmounted } from "vue";

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { userFunctions } from '@/composables/userFunctions.js';
const {
	isAuth,
	logout,
	sendLogoutRequest,
} = userFunctions();

import { userNotification } from '@/composables/userNotification.js';
const {
	useNotifications,
	userNotificationModalRef,
	showNotificationModal,
} = userNotification();

import { userMessage } from '@/composables/userMessage.js';
const {
	userMessagesModalRef,
	showUserMessagesModal,
} = userMessage();

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const {
	addTextToPoints
} = boardGame();

const boxOpen = ref(false);
const openCloseBoxFunc = () => {
	boxOpen.value = !boxOpen.value;
};

const route = useRoute();

const showUserMenu = ref(false);
const toggleUserMenu = () => {
	showUserMenu.value = !showUserMenu.value;
}

const router = useRouter();

const userMenuFunc = (type) => {
	toggleUserMenu();

	switch (type) {
		case 'profile':
			router.push({ path: `/e/${route.params.slug}/profile/` });
			break;
		case 'messages':
			showUserMessagesModal();
			break;
		case 'notifications':
			showNotificationModal();
			break;
		case 'logout':
			logout();
			break;
	}
}

const pointsWithText = computed(() => {
	return addTextToPoints(userStore.player.full_points);
});

const showMessageCount = ref(false);
let messageInterval = null;

const startMessageToggle = () => {
	if (messageInterval) clearInterval(messageInterval);

	messageInterval = setInterval(() => {
		showMessageCount.value = !showMessageCount.value;
	}, 3000);
};

onUnmounted(() => {
	if (messageInterval) clearInterval(messageInterval);
});

onMounted(() => {
	startMessageToggle();
});
</script>

<template>
	<layout-Overlay
			v-if="showUserMenu"
			classes="z-[29999] bg-black/0"
			@click="toggleUserMenu()"
	/>
	<div class="wrapper">
		<template v-if="isAuth">
			<div class="info-block">
				<span class="nickname">{{ userStore.player.user.public_name ?? userStore.player.user.name }}</span>
				<span
						v-if="userStore.player && Object.keys(userStore.player).length > 0"
						class="points"
				>{{ pointsWithText }} (<font-awesome-icon icon="fa-solid fa-bolt" />x{{ userStore.player.streak }})</span>
			</div>
			<div class="avatar">
				<UserAvatar
						:user="userStore.user"
						:useLightBox="false"
						:canChange="false"
						classes="w-[4rem] h-[4rem] rounded-full object-cover !z-0"
						:borderType="`${ userStore.player.premium && userStore.player?.settings?.avatarBorder ? userStore.player.settings.avatarBorder : '' }`"
						@afterChangeAvatar="$emit('refresh')"
						@click="toggleUserMenu()"
				/>

				<span
						v-if="useNotifications && useNotifications.currentUserNotificationCount && useNotifications.currentUserNotificationCount > 0"
						class="notifications"
						@click="showNotificationModal"
				>
					<span>{{ useNotifications.currentUserNotificationCount > 99 ? '99+' : useNotifications.currentUserNotificationCount }}</span>
				</span>

				<span
						v-if="useNotifications && useNotifications.currentUserMessagesCount && useNotifications.currentUserMessagesCount > 0"
						class="unread-messages"
						@click="showUserMessagesModal(null)"
				>
            <Transition name="fade-switch" mode="out-in">
                <div :key="showMessageCount ? 'count' : 'icon'" class="switch-content">
                    <template v-if="showMessageCount">
                        <span class="msg-count">{{ useNotifications.currentUserMessagesCount > 99 ? '99+' : useNotifications.currentUserMessagesCount }}</span>
                    </template>
                    <template v-else>
                        <font-awesome-icon icon="fa-solid fa-envelope" class="msg-icon" />
                    </template>
                </div>
            </Transition>
        </span>
				<div
						class="user-menu"
						v-show="showUserMenu"
				>
					<div @click="userMenuFunc('profile');">
						<font-awesome-icon icon="fa-solid fa-user" class="mr-2" /> Профиль
					</div>
					<div @click="userMenuFunc('messages');">
						<font-awesome-icon icon="fa-solid fa-envelope" class="mr-2" /> Личные сообщения
						<span v-if="
							useNotifications
							&& useNotifications.currentUserMessagesCount
							&& useNotifications.currentUserMessagesCount > 0"
						>
							({{ useNotifications.currentUserMessagesCount }})
						</span>
					</div>
					<div @click="userMenuFunc('notifications');">
						<font-awesome-icon icon="fa-solid fa-bell" class="mr-2" /> Оповещения
						<span v-if="
							useNotifications
							&& useNotifications.currentUserNotificationCount
							&& useNotifications.currentUserNotificationCount > 0"
						>
							({{ useNotifications.currentUserNotificationCount }})
						</span>
					</div>
					<div @click="userMenuFunc('logout');">
						<font-awesome-icon :icon="['fas', 'right-from-bracket']" class="mr-2" /> Выйти
					</div>
				</div>
			</div>
	<!--		<div class="user-info-wrap">-->
	<!--			<div class="line">-->
	<!--				<button class="btn btn-simple-1 mr-2" @click="openCloseBoxFunc()"><font-awesome-icon :icon="['fas', 'pen']" /></button>-->
	<!--				<button class="btn btn-simple-1 mr-2" @click="showNotificationModal"><font-awesome-icon :icon="['fas', 'bell']" /></button>-->
	<!--			</div>-->
	<!--			<div class="line">-->
	<!--				<button class="btn btn-simple-1 mr-2" @click="emit('showInventory')"><font-awesome-icon :icon="['fas', 'hat-wizard']" /></button>-->
	<!--				<button class="btn btn-simple-1 mr-2" @click="emit('showTimer')"><font-awesome-icon :icon="['fas', 'stopwatch']" /></button>-->
	<!--				<button class="btn btn-simple-1 mr-2" @click="emit('showGame')"><font-awesome-icon :icon="['fas', 'gamepad']" /></button>-->
	<!--			</div>-->
	<!--		</div>-->
			<UserNotificationModal ref="userNotificationModalRef" />
			<UserMessagesModal ref="userMessagesModalRef" />
		</template>
		<template v-else>
			<user-AuthIconComponent
					class="ml-[25px]"
					parentClasses="!w-[4rem] !h-[4rem] !mt-[0px] text-[var(--main-dark-text-color)]"
			/>
		</template>

		<UserSettings />
	</div>
<!--	<Modal-->
<!--			:showOpenModal="boxOpen"-->
<!--			size="medium"-->
<!--			@toggleModal="openCloseBoxFunc"-->
<!--	>-->
<!--		<div class="modal-parent">-->
<!--			<h3 class="modal-title">Изменение профайла</h3>-->
<!--			<div class="link-parent-box">-->
<!--				<span class="user-edit-profile-title">Изменение аватара</span>-->
<!--				<ChangeAvatar @afterChangeAvatar="emit('updateBoardGameInfo')" />-->
<!--				<span class="user-edit-profile-title">Изменение Twitch аккаунта</span>-->
<!--				<SetTwitchUrl />-->
<!--			</div>-->
<!--		</div>-->
<!--	</Modal>-->

</template>

<style lang="scss" scoped>
.wrapper {
	@apply flex gap-3;

	.info-block {
		@apply flex flex-col items-end justify-center;

		span {
			@apply text-[1.2rem];

			color: var(--third-text-color);
			text-decoration: none;
		}
	}

	.user-info-wrap {
		.line {
			@apply flex justify-center items-center;
		}

		.name {
			@apply pl-[1rem] pr-[1rem] text-[1.2rem];
		}
	}

	.avatar {
		@apply
			inline-block
			w-[4rem] h-[4rem]
			rounded-full object-cover
			relative
			cursor-pointer
		;

		.notifications {
			@apply
				w-[1.7rem] h-[1.7rem]
				flex rounded-full justify-center items-center
				bg-[var(--second-block-color)]
				absolute right-0 bottom-[-0.3rem]
			;
		}

		.unread-messages {
			@apply
				w-[1.7rem] h-[1.7rem]
				flex rounded-full justify-center items-center
				bg-[var(--second-block-color)] text-[var(--main-dark-text-color)]
				absolute right-0 top-[-0.3rem]
				overflow-hidden /* Важно для обрезки контента при анимации */
				;

				// Контейнер для переключаемого контента
				.switch-content {
					@apply w-full h-full flex justify-center items-center;
				}

				.msg-icon {
					@apply text-[0.8rem]; // Немного уменьшим иконку для лучшего вида
				}

				.msg-count {
					@apply text-[0.75rem] font-bold;
				}
		}

		img {
			@apply w-[4rem] h-[4rem] rounded-full object-cover;
		}

		//&:hover .user-menu {
		//	@apply block;
		//}

		.user-menu {
			@apply
				absolute right-0 z-[30000]
				bg-[var(--main-bg-color)]
				min-w-[300px]
				pl-2 pr-2
			;

			div {
				@apply p-1;

				border-bottom: 1px solid var(--four-border-color);

				&:hover {
					@apply bg-[var(--third-hover-color)];

					border-bottom: 1px solid var(--third-hover-color);
				}

				&:last-child {
					border-bottom: 1px solid var(--main-bg-color);
				}
			}
		}
	}
}

.user-edit-profile-title {
	@apply pb-[1rem] mt-[2rem] mb-[1.5rem] block text-[1.1rem];

	border-bottom: 1px solid var(--second-border-color);
}

// Стили для Vue Transition
.fade-switch-enter-active,
.fade-switch-leave-active {
	transition: all 0.4s ease;
}

.fade-switch-enter-from {
	opacity: 0;
	transform: scale(0.8) translateY(5px);
}

.fade-switch-leave-to {
	opacity: 0;
	transform: scale(0.8) translateY(-5px);
}

.fade-switch-enter-to,
.fade-switch-leave-from {
	opacity: 1;
	transform: scale(1) translateY(0);
}
</style>
