<script setup>
import ThemeSettings from '@/modules/boardGame/components/user/settings/ThemeSettings.vue';
import SoundSettings from '@/modules/boardGame/components/user/settings/SoundSettings.vue';

import { onMounted, ref, watch } from "vue";

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { api } from '@/composables/api.js'
const { sendApiRequest, } = api();

import { system } from '@/composables/system.js'
const { funcDelay } = system();

import { notifications } from '@/composables/notifications.js';
const { error } = notifications();

import { useLoadStateStore } from '@/stores/loadState';
const loadState = useLoadStateStore();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth } = userFunctions();

const showSettingsBlock = ref(false);

const toggleSettingsBlock = () => {
	showSettingsBlock.value = !showSettingsBlock.value;
}

const soundVolume = ref(50);
const theme = ref('street-light');

const dontSendSettingRequest = ref(false);
const delayTime = 500;

watch(() => soundVolume, () => {
	if (!dontSendSettingRequest.value) { setSettings(); }
}, { deep: true });

watch(() => theme, () => {
	if (!dontSendSettingRequest.value) { setSettings(); }
}, { deep: true });

const setSettings = () => {
	if (userStore.user && Object.keys(userStore.user).length > 0) {
		funcDelay(setSettingsRequest, delayTime);
	} else {
		saveSettingsInLocalStorage();
	}
}

const requestInProgress = ref(false);

const requestName = 'setUserPreferencesSettings';

const setSettingsRequest = async () => {
	requestInProgress.value = true;

	try {
		const body = {
			soundVolume: Number(soundVolume.value),
			theme: theme.value,
		}

		const response = await sendApiRequest('auth/set-settings', 'PUT', body, {}, requestName);

		if (response.data) {
			userStore.user = response.data;
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

const saveSettingsInLocalStorage = () => {
	const body = {
		soundVolume: Number(soundVolume.value),
		theme: theme.value,
	}

	localStorage.setItem('settings', JSON.stringify(body));
};

/* Установка настроек, при загрузке компонента */
const settings = ref({});

if (userStore.user && Object.keys(userStore.user).length > 0) {
	settings.value = userStore.user.settings;
} else {
	if (process.client) {
		settings.value = JSON.parse(localStorage.getItem('settings'));
	}
}

onMounted(() => {
	dontSendSettingRequest.value = true;

	if (settings.value?.soundVolume != null) {
		soundVolume.value = settings.value.soundVolume;

	}

	if (settings.value?.theme) {
		theme.value = settings.value.theme;
	}

	setTimeout(() => {
		dontSendSettingRequest.value = false;
	}, delayTime + 50);
});
</script>

<template>
	<layout-Overlay
			v-if="showSettingsBlock"
			classes="z-[29999] bg-black/0"
			@click="toggleSettingsBlock"
	/>
	<div class="parent-settings-block">
		<div class="icon-block" @click="toggleSettingsBlock">
			<font-awesome-icon icon="fa-solid fa-gears" />
		</div>
		<div v-show="showSettingsBlock" class="settings-block">
			<ThemeSettings
					defaultTheme="street-light"
					class="mb-[1rem]"
					v-model="theme"
			/>
			<SoundSettings
					v-model="soundVolume"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.parent-settings-block {
	@apply relative;

	.icon-block {
		@apply
			inline-block
			w-[4rem] h-[4rem]
			rounded-full
			relative
			cursor-pointer
			bg-[var(--button-color-1)]
			text-center
			text-[2.5rem]
			text-[var(--main-dark-text-color)]
		;
	}

	.settings-block {
		@apply
			absolute right-0 z-[30000]
			bg-[var(--main-bg-color)]
			min-w-[300px]
			p-[1rem]
		;

		border-right: 1px solid var(--main-border-color);
		border-bottom: 1px solid var(--main-border-color);
	}
}
</style>
