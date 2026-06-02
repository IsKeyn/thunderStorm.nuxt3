<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import TimerObs from '@/modules/boardGame/components/timer/TimerObs.vue';

const emit = defineEmits(["update:modelValue"]);

import { ref, watch } from "vue";

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { api } from '@/composables/api.js'
const { sendApiRequest, responseHandler } = api();

import { notifications } from '@/composables/notifications.js';
const { error } = notifications();

const props = defineProps({
	modelValue: {},
	bg_slug: {
		type: String,
		default: '',
	},
	user_id: {
		type: Number,
		default: null,
	},
	slug: {
		type: String,
		default: '',
	},
});

const form = ref({});

form.value.font = {
	name: 'Шрифт',
	value: props.modelValue?.font ?? 'Digital-7',
	type: 'select',
	options: [
		{
			name: 'Digital-7',
			value: 'Digital-7',
		},
		{
			name: 'PFCentroSansPro',
			value: 'PFCentroSansPro-Light',
		},
		{
			name: 'Verdana',
			value: 'Verdana',
		},
		{
			name: 'Verdana-Bold',
			value: 'Verdana-Bold',
		},
		{
			name: 'Verdana-Italic',
			value: 'Verdana-Italic',
		},
		{
			name: 'Verdana-BoldItalic',
			value: 'Verdana-BoldItalic',
		},
	],
	placeholder: 'Время крутки рулетки',
	showTitle: true,
	classes: 'w-full md:min-w-[10rem] mt-2',
};

form.value.animation = {
	name: 'Мигание',
	value: props.modelValue?.animation ?? true,
	type: 'checkbox',
	showTitle: false,
	classes: 'w-full md:min-w-[10rem] mt-2',
};

form.value.showTitle = {
	name: 'Отображать заголовок',
	value: props.modelValue?.showTitle ?? true,
	type: 'checkbox',
	showTitle: false,
	classes: 'w-full md:min-w-[10rem] mt-2',
};

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
	if (userStore.user && Object.keys(userStore.user).length) {
		setSettingsRequest(setting);
	}
}

const requestInProgress = ref(false);
const requestName = `setTimerSettings_${props.bg_slug}_${props.user_id}_${props.slug}`;

const setSettingsRequest = async (settings) => {
	requestInProgress.value = true;

	try {
		const body = {
			bgSlug: props.bg_slug,
			slug: props.slug,
			settings: settings,
		}

		const response = await sendApiRequest('board-game/v2/timer/set-settings', 'PUT', body, {}, requestName);
		responseHandler(response);
		requestInProgress.value = false;
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div class="relative">
		<ui-BigPreloader
				v-if="requestInProgress"
				class="absolute w-full h-full bg-black/70"
		/>
		<div>
			<FormGenerator
					key="font"
					:name="form.font.name"
					:element="form.font"
					:showTitle="form.font.showTitle"
					:showValidateError=true
					validateErrorPosition="bottom"
					:labelClasses="['block', 'mb-[10px]']"
					:fieldClasses="form.font.classes"
			/>
		</div>
		<div class="md:flex gap-5">
			<div class="w-full md:min-w-[30%]">
				<FormGenerator
						key="font"
						:name="form.animation.name"
						:element="form.animation"
						:showTitle="form.animation.showTitle"
						:showValidateError=true
						validateErrorPosition="bottom"
						:labelClasses="['block', 'mb-[10px]']"
						:fieldClasses="form.animation.classes"
				/>
			</div>
			<div class="w-full md:min-w-[30%]">
				<FormGenerator
						key="font"
						:name="form.showTitle.name"
						:element="form.showTitle"
						:showTitle="form.showTitle.showTitle"
						:showValidateError=true
						validateErrorPosition="bottom"
						:labelClasses="['block', 'mb-[10px]']"
						:fieldClasses="form.showTitle.classes"
				/>
			</div>
		</div>

		<TimerObs
				:bg_slug="bg_slug"
				:user_id="user_id"
				:slug="slug"
		/>
	</div>
</template>

<style lang="scss" scoped />
