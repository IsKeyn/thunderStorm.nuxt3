<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

const emit = defineEmits(["update:modelValue"]);

import { ref, watch } from "vue";

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { api } from '@/composables/api.js'
const { sendApiRequest, } = api();

const props = defineProps({
	modelValue: {},
	sounds: { // Список случайных звуков, которые выбирают в качестве фоновой музыки крутки рулетки
		type: Array,
		default: [],
	},
});

const form = ref({
	spinTime: {
		name: 'Время крутки рулетки',
		value: props.modelValue?.spinTime,
		type: 'select',
		options: [
			{
				name: '5 секунд',
				value: 5000,
			},
			{
				name: '10 секунд',
				value: 10000,
			},
			{
				name: '15 секунд',
				value: 15000,
			},
			{
				name: '30 секунд',
				value: 30000,
			},
			{
				name: '60 секунд',
				value: 60000,
			},
		],
		placeholder: 'Время крутки рулетки',
		showTitle: true,
		classes: 'w-full md:min-w-[10rem] mt-2',
	},
	elementToShow: {
		name: 'Количество элементов в окне рулетки',
		value: props.modelValue?.elementToShow,
		type: 'select',
		options: [
			{
				name: '1',
				value: 1,
			},
			{
				name: '3',
				value: 3,
			},
			{
				name: '5',
				value: 5,
			},
		],
		placeholder: 'Количество элементов в окне рулетки',
		showTitle: true,
		classes: 'w-full md:min-w-[10rem] mt-2',
	},
	sounds: {
		name: 'Музыка рулетки',
		value: props.modelValue?.sounds,
		type: 'select-with-search-multiselect',
		options: props.sounds,
		placeholder: 'Музыка рулетки',
		showTitle: true,
		classes: 'w-full md:min-w-[10rem] mt-2',
	},
});

let dontUpdate = false;

watch(() => form.value, () => {
	if (dontUpdate) {
		dontUpdate = false;
		return;
	}

	updateSettings();
}, { deep: true });

const updateSettings = () => {
	const dataForUpdate = {};

	for (const key in form.value) {
		dataForUpdate[key] = form.value[key].value;
	}

	if (!dontUpdate) setSettings(dataForUpdate);
	emit("update:modelValue", dataForUpdate);
}

const setSettings = (setting) => {
	sessionStorage.setItem('roulette-setting', JSON.stringify(setting));

	if (userStore.user && Object.keys(userStore.user).length) {
		setSettingsRequest(setting);
	}
}

/* Инициализация */
onMounted(() => {
	getUserSettings();
});

const getUserSettings = async () => {
	dontUpdate = true;

	if (userStore.user && Object.keys(userStore.user).length && userStore.user.settings.rouletteSetting) {
		for (let key in userStore.user.settings.rouletteSetting) {
			if (userStore.user.settings.rouletteSetting[key]) form.value[key].value = userStore.user.settings.rouletteSetting[key];
		}
	} else {
		const setting = JSON.parse(sessionStorage.getItem('roulette-setting')) || {};

		for (let key in form.value) {
			if (setting[key]) form.value[key].value = setting[key];
		}
	}

	updateSettings();

	await nextTick();
	dontUpdate = false;
}

const requestInProgress = ref(false);
const requestName = 'setUserPreferencesSettings';

const setSettingsRequest = async (setting) => {
	requestInProgress.value = true;

	try {
		const body = {
			rouletteSetting: setting,
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
</script>

<template>
	<div class="md:flex gap-5">
		<div v-for="(field, index) in form" class="w-full md:min-w-[30%]">
			<FormGenerator
					:key="index"
					:name="index"
					:element="field"
					:showTitle="field.showTitle"
					:showValidateError=true
					validateErrorPosition="bottom"
					:labelClasses="['block', 'mb-[10px]']"
					:fieldClasses="field.classes"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped />
