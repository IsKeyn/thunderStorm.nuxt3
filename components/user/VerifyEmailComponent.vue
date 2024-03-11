<script setup>
import { onMounted } from 'vue'

import AuthComponent from '@/components/user/AuthComponent.vue';

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { useUserStore } from '@/stores/user';
import { api } from '@/composables/api.js';

const userStore = useUserStore();
const { apiUrl, errorHandler } = api();

const route = useRoute();
const router = useRouter();

const message = ref('');
const requestInProgress = ref(false);
const responseErrors = ref({});

const Authorization = useCookie('Authorization');

onMounted(() => {
	initVerify();
})

const initVerify = () => {
	if (Object.keys(userStore.user).length > 0) {
		if (userStore.user.email_verified_at) {
			alert(
					'Ваш email уже подтверждён',
					3000,
					'#004d42',
					() => {
						router.push({ path: '/' })
					}
			);
		} else {
			verifyEmail();
		}
	}
}

const verifyEmail = () => {
	if (route.params && route.params.slug) {
		let userId, userHash;

		if (route.params.slug[0]) {
			userId = route.params.slug[0];
		}

		if (route.params.slug[1]) {
			userHash = route.params.slug[1];
		}

		if (userId && userHash) {
			sendVerifyEmailRequest({ userId, userHash });
		}
	}
}

const sendVerifyEmailRequest = async (params) => {
	const { userId, userHash } = params;

	requestInProgress.value = true;

	try {
		const response = await $fetch(
				`${apiUrl.value}${route.fullPath.slice(1)}`,
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
			userStore.user = response.data;
			alert(
					'Ваш email подтверждён',
					3000,
					'#004d42',
					() => {
						router.push({ path: '/' })
					}
			);
		}
	} catch (e) {
		responseErrors.value = errorHandler(e);
		requestInProgress.value = false;
	}
}

const reloadPage = () => {
	location.reload();
}
</script>

<template>
	<div>
		<ClientOnly>
			<template v-if="Object.keys(userStore.user).length === 0">
				<AuthComponent
					class="mt-5"
					title="Авторизуйтесь для подтверждения email адреса"
					@сlosureFunc="reloadPage"
				/>
			</template>
		</ClientOnly>
	</div>
</template>
