<script setup>
// useHead({
// 	link: [
// 		{
// 			rel: 'stylesheet',
// 			href: '/assets/scss/vars.scss'
// 		},
// 		{
// 			rel: 'stylesheet',
// 			href: '/assets/scss/style.scss'
// 		},
// 		{
// 			rel: 'stylesheet',
// 			href: '/assets/scss/InSilentHill/vars.scss'
// 		},
// 		{
// 			rel: 'stylesheet',
// 			href: '/assets/scss/InSilentHill/style.scss'
// 		},
// 		{
// 			rel: 'stylesheet',
// 			href: '/assets/scss/InSilentHill/fonts.scss'
// 		},
// 		{
// 			rel: 'stylesheet',
// 			href: '/assets/scss/InSilentHill/imports.scss'
// 		},
// 	]
// })

import SystemComponents from '@/components/system/SystemComponents.vue';
import Notifications from '@/components/notifications/Notifications.vue';
import MediaById from '@/components/media/MediaById.vue';

// import('~/assets/scss/vars.scss');
// import('~/assets/scss/style.scss');

const runtimeConfig = useRuntimeConfig();

/* TODO данный код отрабатывает не корректно и подключает также файлы остальных тем, разобраться (https://i.imgur.com/R13XKdl.png)
в данных момент решено через import в ~/assets/scss/style.scss , но это не корректное решение, так как тянутся все стили всех тем
import(`~/assets/scss/${runtimeConfig.public.theme}/vars.scss`);
import(`~/assets/scss/${runtimeConfig.public.theme}/style.scss`);
import(`~/assets/scss/${runtimeConfig.public.theme}/imports.scss`);
*/

// import('~/assets/scss/InSilentHill/vars.scss');
// import('~/assets/scss/InSilentHill/style.scss');
// import('~/assets/scss/InSilentHill/fonts.scss');
// import('~/assets/scss/InSilentHill/imports.scss');

const theme = computed(() => {
	return `${runtimeConfig.public.theme}_theme`;
});

// Для проверки на роль
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { roles } from '@/composables/roles.js';
const { hasRole } = roles();

// Окно авторизации
import VerifyEmailBlock from "@/components/user/VerifyEmailBlock.vue";

import Modal from '@/components/modals/Modal.vue';
import AuthComponent from '@/components/user/AuthComponent.vue';

import { onMounted } from "vue";

const activeAuthModal = ref(false);

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
// import Menu from '@/components/admin/Menu.vue';
import SideMenuByCode from '@/components/menu/SideMenuByCode.vue';
</script>

<template>
	<div :class="theme">
		<div class="main admin">
			<SystemComponents />
			<div id="modals"></div>
			<article>
				<NuxtLoadingIndicator />
				<template v-if="userStore.user && Object.keys(userStore.user).length > 0">
					<template v-if="hasRole('admin', userStore.user) === true">
						<template v-if="userStore.user.email_verified_at">
							<Header />
							<div class="wrap">
<!--								<Menu class="menu" />-->
								<SideMenuByCode code="admin" />
								<div class="content">
									<slot />
								</div>
							</div>
						</template>
						<template v-else>
							<VerifyEmailBlock />
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
			<MediaById />
		</div>
	</div>
</template>

<style lang="scss">
@import url('~/assets/scss/style.scss');
@import url('~/assets/scss/InSilentHill/vars.scss');
@import url('~/assets/scss/InSilentHill/style.scss');
@import url('~/assets/scss/InSilentHill/fonts.scss');
@import url('~/assets/scss/InSilentHill/imports.scss');
</style>

<style lang="scss" scoped>
.wrap {
	@apply
		flex
		mr-[var(--main-without-right-padding)] ml-[var(--main-without-left-padding)]
	;

	.menu {}

	.content {
		@apply w-full pt-[10px] pr-[25px] pb-[10px] pl-[25px];
	}
}
</style>
