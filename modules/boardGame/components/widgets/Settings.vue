<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js'
const { sendApiRequest, preparedRequestBody } = api();

import { notifications } from '@/composables/notifications.js';
const { error, alert } = notifications();

import { ref } from "vue";

const form = ref(
		{
			show_name: {
				name: 'Отображать имя',
				value: userStore?.player?.settings?.widgetSettings?.show_name ?? true,
				type: 'checkbox',
				parentClasses: 'col-span-4',
				classes: 'w-full',
				showTitle: false,
			},
			show_data: {
				name: 'Отображать основную информацию',
				value: userStore?.player?.settings?.widgetSettings?.show_data ?? true,
				type: 'checkbox',
				parentClasses: 'col-span-4',
				classes: 'w-full',
				showTitle: false,
			},
			show_game: {
				name: 'Отображать игру',
				value: userStore?.player?.settings?.widgetSettings?.show_game ?? true,
				type: 'checkbox',
				parentClasses: 'col-span-4',
				classes: 'w-full',
				showTitle: false,
			},
			show_items_and_se: {
				name: 'Отображать предметы и статус эффекты',
				value: userStore?.player?.settings?.widgetSettings?.show_items_and_se ?? true,
				type: 'checkbox',
				parentClasses: 'col-span-4',
				classes: 'w-full',
				showTitle: false,
			},
			theme: {
				name: 'Тема',
				value: userStore?.player?.settings?.widgetSettings?.theme ?? 'InSilentHill',
				type: 'select',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
				options: [
					{ value: 'InSilentHill', name: 'InSilentHill', },
					{ value: 'autumn', name: 'Осень', },
					{ value: 'green', name: 'Зеленая', },
					{ value: 'ocean', name: 'Океан', },
					{ value: 'street', name: 'Улица', },
					{ value: 'street-light', name: 'Улица (светлая)', },
				],
			},
		},
);

const requestInProgress = ref(false);

const saveSettings = async () => {
	requestInProgress.value = true;

	const query = {
		name: 'widgetSettings',
		value: preparedRequestBody(form.value),
	};

	try {
		const response = await sendApiRequest(`board-game/v2/player/setPlayerSettings/${route.params.slug}`, 'POST', query, 'saveWidgetSettings', '');

		requestInProgress.value = false;

		if (!response) {
			error('Ответ от сервера пуст');
			return;
		}

		if (response.error) {
			error(response.error);
			return;
		}

		if (response.message) {
			alert(response.message);
			return;
		}
	} catch (e) {
		requestInProgress.value = false;
		error(e);
	}
}
</script>

<template>
	<div>
		<h2 class="block title title-line">Настройки</h2>

		<FormGenerator
				v-for="(field, ind) in form"
				:key="ind"
				:name="field.name"
				:showTitle="field.showTitle ?? true"
				:element="field"
				:showValidateError=true
				:form="form"
				validateErrorPosition="bottom"
				:labelClasses="['block', 'mb-[10px]', field.labelClasses]"
				:fieldClasses="field.classes"
		/>

		<ActionButton
				buttonClasses="btn btn-simple"
				buttonName="Сохранить"
				:actionInProgress="requestInProgress"
				@startAction="saveSettings()"
		/>
	</div>
</template>

<style lang="scss" scoped>
.title-line {
	@apply text-center mb-2 pb-2 break-words;

	border-bottom: 1px solid var(--second-border-color);
}
</style>
