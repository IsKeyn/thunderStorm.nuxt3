<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { ref } from "vue";

const { isRussia, isUnknown, fetchCountry } = useGeo();

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
		getRedirectUrlRequest(social);
	}
}

const requestInProgress = ref(false);

const getRedirectUrlRequest = async (social) => {
	requestInProgress.value = true;

	const body = {};

	if (props.registerOnEventBySlug) {
		sessionStorage.setItem('registerOnEventBySlug', props.registerOnEventBySlug);
	}

	try {
		const response = await sendApiRequest(`auth/${social}/redirect`, 'GET', body, `${social}SendRedirectRequest`);

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

onMounted(() => {
	fetchCountry();
});
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
					class="vkontakte"
					@click="authWithSocial('vkid')"
			>
				<font-awesome-icon
						v-if="requestInProgress"
						:icon="['fas', 'spinner']"
						spin-pulse
				/>
				<template v-else>
					<font-awesome-icon icon="fa-brands fa-vk" /> Вконтакте
				</template>
			</button>

			<div>
				<div v-if="isUnknown">
					<ui-itemBox
							classes="red"
							message="Определяем ваш регион..."
					/>
				</div>

				<!-- Показываем авторизацию через иностранные сервисы, если точно знаем, что это НЕ Россия -->
				<div v-else-if="!isRussia" class="premium-content">
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

					<button
							class="google"
							@click="authWithSocial('google')"
					>
						<font-awesome-icon
								v-if="requestInProgress"
								:icon="['fas', 'spinner']"
								spin-pulse
						/>
						<template v-else>
							Google <font-awesome-icon icon="fa-brands fa-google" />
						</template>
					</button>
				</div>

				<ui-itemBox
						v-else
						classes="red"
						message="В соответствии с законодательством РФ мы вынуждены закрыть авторизацию для посетителей из РФ с помощью иностранных сервисов.
						Если вы ранее авторизировались на сайте с помощью иностранных сервисов, воспользуйтесь восстановлением пароля, использую ту почту, которая привязана к иностранному сервису через который вы входили"
				/>
			</div>
		</div>
		<div class="grid grid-cols-6">
			<div class="col-span-3" />
			<div class="col-span-3 text-right">
				<a
						href="#"
						class="block small-text"
						@click.prevent="$emit('setActionType', { value: 'login', title: 'Авторизация' })"
				>
					Авторизоваться
				</a>
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
	.vkontakte {
		@apply w-full p-2 bg-[#0077FF] text-[#ffffff] pl-4 pr-4 mb-2;

		&:hover {
			@apply bg-[#0056CC];
		}
	}

	.yandex {
		@apply w-full p-2 bg-[#DD0000] text-[#ffffff] pl-4 pr-4 mb-2;

		&:hover {
			@apply bg-[#F8604A];
		}
	}

	.twitch {
		@apply w-full p-2 bg-[#9147ff] text-[#ffffff] pl-4 pr-4 mb-2;

		&:hover {
			@apply bg-[#772ce8];
		}
	}

	.google {
		@apply w-full p-2 bg-[#4285F4] text-[#ffffff] pl-4 pr-4 mb-2;

		&:hover {
			@apply bg-[#1a73e8];
		}
	}
}
</style>
