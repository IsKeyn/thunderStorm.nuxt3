<script setup>
import AuthComponent from '@/components/user/AuthComponent.vue';
import Modal from '@/components/modals/Modal.vue';

const props = defineProps({
	parentClasses: {
		type: String,
		default: '',
	},
});

const activeAuthModal = ref(false);
const reCalc = ref(false);

const toggleAuthModal = () => {
	activeAuthModal.value = !activeAuthModal.value;
}

const reCalcHeight = (value = true) => {
	reCalc.value = value;
}

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

// Logout
// TODO попробовать убрать notifications и api в плагин
import { notifications } from '@/composables/notifications.js';
const { alert, choiceAlert } = notifications();

const logout = () => {
	choiceAlert(
			{
				title: 'Выход',
				message: 'Вы уверены, что хотите разлогиниться?',
				buttons: [
					{
						name: 'Да',
						func: () => {
							sendLogoutRequest();
						},
						additionalKeywordFunc: 'close',
					},
					{
						name: 'Нет',
						additionalKeywordFunc: 'close',
					},
				],
			}
	);
}

import { api } from '@/composables/api.js';
const { apiUrl, errorHandler } = api();
// const Authorization = useCookie('Authorization');

const requestInProgress = ref(false);
const responseErrors = ref({});

const sendLogoutRequest = async () => {
	requestInProgress.value = true;

	try {
		const response = await $fetch(
				`${apiUrl.value}auth/logout`,
				{
					method: 'GET',
					headers: {
						Authorization: Authorization.value,
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
					},
				},
		);

		if (response) {
			// Authorization.value = '';
			// Authorization.expires = 0;
			// Authorization.path = '/';

			userStore.user = {};

			requestInProgress.value = false;
		}
	} catch (e) {
		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}

const showUserMenu = ref(false);
const toggleUserMenu = () => {
	showUserMenu.value = !showUserMenu.value;
}
</script>

<template>
	<div>
		<div>
			<template v-if="requestInProgress">
				<font-awesome-icon
					:icon="['fas', 'spinner']"
					spin-pulse
					class="menu-element icon"
				/>
			</template>
			<template v-else-if="userStore.user && Object.keys(userStore.user).length > 0">
				<div
						class="user-profile-actions"
						@click="toggleUserMenu"
				>
					<img
							v-if="userStore.user.avatar"
							:src="userStore.user.avatar"
					/>
					<span v-else>
						<font-awesome-icon
								:icon="['far', 'user']"
						/>
					</span>
				</div>
			</template>
			<template v-else>
				<div
						:class="['user-profile-actions', parentClasses]"
						@click="toggleAuthModal()"
				>
					<span>
						<font-awesome-icon
								:icon="['fas', 'right-to-bracket']"
						/>
					</span>
				</div>

				<Modal
						:showOpenModal="activeAuthModal"
						size="small"
						modal-id="login-modal"
						:re-calc-height="reCalc"
						@setReCalcValue="reCalcHeight"
						@toggleModal="toggleAuthModal"
				>
					<AuthComponent
							@reCalcHeight="reCalcHeight"
							@closeModal="toggleAuthModal"
					/>
				</Modal>
			</template>
		</div>
		<div
				class="user-menu"
				v-if="userStore.user && Object.keys(userStore.user).length > 0"
				v-show="showUserMenu"
		>
			<ul>
				<li>
					<router-link
							to="/profile/"
							@click="$emit('showHideMenu', false)"
					>
						<font-awesome-icon
								:icon="['far', 'user']"
								class=""
						/> Профиль
					</router-link>
				</li>
				<li>
					<a href="#" @click.prevent="logout()">
						<font-awesome-icon
								:icon="['fas', 'right-from-bracket']"
								class=""
						/> Выход
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.user-profile-actions {
	@apply
		h-[50px] w-[50px] mt-[-10px]
		cursor-pointer
	;

	span {
		@apply
			flex justify-center items-center
			bg-[var(--button-color-1)]
			w-full h-full rounded-full
		;

		svg {
			@apply text-[28px];
		}
	}

	img {
		@apply w-full h-full rounded-full;
	}
}

.user-menu {
	@apply
		absolute top-[90px] right-0 z-[601]
		min-w-[200px]
		bg-[var(--main-bg-color)]
	;

	ul {
		li {
			a {
				@apply
					block
					pt-[5px] pr-[10px] pb-[5px] pl-[10px]
					text-[var(--main-text-color)]
				;

				&:hover {
					@apply no-underline;
					//text-decoration: none;
				}

				svg {
					@apply min-w-[20px];
				}
			}

			&:hover {
				@apply bg-[var(--second-hover-color)];
			}
		}
	}
}
</style>
