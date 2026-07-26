<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { ref } from "vue";

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { validate } from '@/composables/validate.js';
const { validateElement } = validate();

const props = defineProps({
	registerOnEventBySlug: {
		type: String,
		default: null,
	},
});

const form = ref(
		{
			personal_data_processing_policy: {
				name: 'Я согласен с правилами использования сайта и политикой по обработке персональных данных',
				showTitle: false,
				html: 'Я согласен с <a href="/article/rule-for-use-site/" class="underline" target="_blank">правилами использования сайта</a> и <a href="/article/consent-of-personal-data/" class="underline" target="_blank">политикой по обработке персональных данных</a>',
				value: false,
				type: 'checkbox',
				validateRules: 'required',
				validateErrorText: 'Соглашение с правилами использования сайта и политикой по обработке персональных данных обязательно для регистрации',
				classes: ['w-full', 'mt-[5px]'],
			},
		}
);

const formError = ref(null);

const authWithSocial = (social) => {
	formError.value = '';

	const rawData = toRaw(form)._rawValue;

	for (var key in rawData) {
		form.value[key].validateResult = validateElement(rawData[key].value, rawData[key].validateRules, rawData, rawData[key]?.validateErrorText);

		if (typeof form.value[key].validateResult === 'string') {
			form.value[key].validateResult = form.value[key].validateResult.replaceAll('{fieldName}', form.value[key].name);
			formError.value = form.value[key].validateResult;
			break;
		}
	}

	if (!formError.value) {
		switch (social) {
			case 'twitch':
				sendTwitchRequest();
				break;

			case 'yandex':
				sendYandexRequest();
				break;
		}
	}
}

const requestInProgress = ref(false);

const sendTwitchRequest = async () => {
	requestInProgress.value = true;

	const body = {};

	if (props.registerOnEventBySlug) {
		sessionStorage.setItem('registerOnEventBySlug', props.registerOnEventBySlug);
	}

	try {
		const response = await sendApiRequest('auth/twitch/redirect', 'GET', body, 'sendTwitchRedirectRequest');

		requestInProgress.value = false;

		if (response?.url) {
			sessionStorage.setItem('pageForRedirect', route.fullPath);
			window.location.href = response.url;
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

const sendYandexRequest = async () => {
	requestInProgress.value = true;

	const body = {};

	if (props.registerOnEventBySlug) {
		sessionStorage.setItem('registerOnEventBySlug', props.registerOnEventBySlug);
	}

	try {
		const response = await sendApiRequest('auth/yandex/redirect', 'GET', body, 'sendYandexRedirectRequest');

		requestInProgress.value = false;

		if (response?.url) {
			sessionStorage.setItem('pageForRedirect', route.fullPath);
			window.location.href = response.url;
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div>
		<span class="social-auth-title">Авторизоваться через:</span>
		<FormGenerator
				v-for="(field, index) in form"
				:key="index"
				:name="index"
				:element="field"
				:showValidateError=true
				:showTitle="field.hasOwnProperty('showTitle') ? field.showTitle : true"
				validateErrorPosition="bottom"
				:labelClasses="['block', 'mb-[10px]']"
				:fieldClasses="field.classes"
		/>
		<div class="button-block">
			<button
					class="yandex"
					@click="authWithSocial('yandex')"
			>
				<font-awesome-icon
						v-if="requestInProgress"
						:icon="['fas', 'spinner']"
						spin-pulse
				/>
				<template v-else>
					<font-awesome-icon icon="fa-brands fa-yandex" /> Yandex
				</template>
			</button>
			<button
					class="twitch"
					@click="authWithSocial('twitch')"
			>
				<font-awesome-icon
						v-if="requestInProgress"
						:icon="['fas', 'spinner']"
						spin-pulse
				/>
				<template v-else>
					Twitch <font-awesome-icon icon="fa-brands fa-twitch" />
				</template>
			</button>
		</div>
		<div class="grid grid-cols-6">
			<div class="col-span-3" />
			<div class="col-span-3 text-right">
				<a
						href="#"
						class="block small-text"
						@click.prevent="$emit('setActionType', { value: 'recovery_password', title: 'Восстановление пароля' })"
				>
					Забыли пароль
				</a>
				<a
						href="#"
						class="block small-text"
						@click.prevent="$emit('setActionType', { value: 'registration', title: 'Регистрация' })"
				>
					Зарегистрироваться
				</a>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.social-auth-title {
	@apply block mb-2;
}

.button-block {
	.twitch {
		@apply w-full p-2 bg-[#9147ff] text-[#ffffff] pl-4 pr-4 mb-2;

		&:hover {
			@apply bg-[#772ce8];
		}
	}

	.yandex {
		@apply w-full p-2 bg-[#DD0000] text-[#ffffff] pl-4 pr-4 mb-2;

		&:hover {
			@apply bg-[#F8604A];
		}
	}

}
</style>
