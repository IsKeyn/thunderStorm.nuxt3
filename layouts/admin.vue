<script setup>
import SystemComponents from '@/components/system/SystemComponents.vue';
import Notifications from '@/components/notifications/Notifications.vue';

import('~/assets/scss/vars.scss');
import('~/assets/scss/style.scss');

const runtimeConfig = useRuntimeConfig();

/* TODO данный код отрабатывает не корректно и подключает также файлы остальных тем, разобраться (https://i.imgur.com/R13XKdl.png)
в данных момент решено через import в ~/assets/scss/style.scss , но это не корректное решение, так как тянутся все стили всех тем
import(`~/assets/scss/${runtimeConfig.public.theme}/vars.scss`);
import(`~/assets/scss/${runtimeConfig.public.theme}/style.scss`);
import(`~/assets/scss/${runtimeConfig.public.theme}/imports.scss`);
*/

import('~/assets/scss/InSilentHill/vars.scss');
import('~/assets/scss/InSilentHill/style.scss');
import('~/assets/scss/InSilentHill/fonts.scss');
import('~/assets/scss/InSilentHill/imports.scss');

const theme = computed(() => {
	return `${runtimeConfig.public.theme}_theme`;
});

// Для проверки на роль
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const Authorization = useCookie('Authorization');

import { roles } from '@/composables/roles.js';
const { hasRole } = roles();

// Окно авторизации
import Modal from '@/components/modals/Modal.vue';
import AuthComponent from '@/components/user/AuthComponent.vue';

const activeAuthModal = ref(false);
const reCalc = ref(false);

const toggleAuthModal = () => {
	activeAuthModal.value = !activeAuthModal.value;
}

const reCalcHeight = (value = true) => {
	reCalc.value = value;
}

//
import { onMounted } from "vue";

// Открытие модального окна
onMounted(() => {
	if (userStore.user) {
		if (Object.keys(userStore.user).length === 0) {
			activeAuthModal.value = true;
		}
	} else {
		activeAuthModal.value = true;
	}
});

// Компоненте админки
// Окно авторизации
import Header from '@/components/admin/Header.vue';
import Menu from '@/components/admin/Menu.vue';
</script>

<template>
	<div :class="theme">
		<div class="main admin">
			<SystemComponents />
			<div id="modals"></div>
			<article>
				<NuxtLoadingIndicator />
				<template v-if="userStore.user && Object.keys(userStore.user).length > 0 && Authorization">
					<template v-if="hasRole('admin', userStore.user) === true">
						<template v-if="userStore.user.email_verified_at">
							<Header />
							<div class="wrap">
								<Menu class="menu" />
								<div class="content">
									<slot />
								</div>
							</div>
						</template>
						<template v-else>
							Для доступа в раздел необходимо веринтифицировать Ваш email
							<button class="btn block" @click="toggleAuthModal()">
								<font-awesome-icon :icon="['far', 'user']" /> Отправить email повторно
							</button>

							<Modal
									:showOpenModal="activeAuthModal"
									size="small"
									modal-id="auth-modal"
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
					</template>
					<template v-else>
						// Вы должны быть администратором, чтобы получить доступ в этот раздел
					</template>
				</template>
				<template v-else>
					Для доступа в раздел необходимо авторизоваться
					<Modal
							:showOpenModal="activeAuthModal"
							size="small"
							modal-id="auth-form"
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
			</article>
			<Notifications />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.wrap {
	@apply
		grid grid-cols-5
		mr-[var(--main-without-right-padding)] ml-[var(--main-without-left-padding)]
	;

	.menu {
		@apply col-span-1;
	}

	.content {
		@apply col-span-4 pt-[10px] pr-[25px] pb-[10px] pl-[25px];
	}
}
</style>
