<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

const emit = defineEmits(['refresh']);

import { ref, watch } from "vue";

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { notifications } from '@/composables/notifications.js';
const { error, alert } = notifications();

import { validate } from '@/composables/validate.js';
const { validateElement, validateForm } = validate();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { system } from '@/composables/system.js'
const { funcDelay } = system();

import { errorHandler } from '@/composables/errorHandler.js';
const { show } = errorHandler();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
});

const form = ref({
	avatarBorder: {
		name: 'Рамка аватарки',
		value: props.element?.settings?.avatarBorder ? props.element.settings.avatarBorder : '',
		type: 'select-with-search',
		options: [
			{
				name: 'Не выбрано',
				value: null,
			},
			{
				name: 'Золотая',
				value: 'gold',
			},
			{
				name: 'Серебрянная',
				value: 'silver',
			},
			{
				name: 'Бронзовая',
				value: 'bronze',
			},
			{
				name: 'Фиалковая',
				value: 'purple',
			},
			{
				name: 'Рубиново-красная',
				value: 'ruby',
			},
			{
				name: 'Лазурно-синия',
				value: 'azure',
			},
			{
				name: 'Изумрудно-зеленая',
				value: 'emerald',
			},
			{
				name: 'Аметистово-желтая',
				value: 'amethyst-yellow',
			},
			{
				name: 'Сапфировый',
				value: 'sapphire',
			},
			{
				name: 'Обсидиановый',
				value: 'obsidian',
			},
			{
				name: 'Розовое золото',
				value: 'rose-gold',
			},
		],
		placeholder: 'Выберите рамку аватара',
		parentClasses: 'col-span-4',
		classes: 'w-full',
	},

	premiumMessage: {
		name: 'Премиум сообщение до 200 символов',
		value: props.element?.settings?.premiumMessage ? props.element.settings.premiumMessage : '',
		type: 'textarea',
		placeholder: 'Введите премиум сообщение',
		validateRules: 'minLength_1, maxLength_200',
		classes: 'w-full',
	},

	backgroundImage: {
		name: 'Изображение фона профайла',
		value: props.element?.backgroundImage?.src ? props.element?.backgroundImage?.src : '',
		type: 'file',
		accept: 'image/*',
		imagePreviewClasses: 'max-w-[150px] max-h-[150px]',
		validateRules: 'mime_1, size_5',
		classes: ['w-full', 'mt-[5px]'],
		showFile: true,
	},
	backgroundPosition: {
		name: 'Позиция фона',
		value: props.element?.settings?.backgroundPosition ? props.element.settings.backgroundPosition : 'center',
		type: 'select-with-search',
		options: [
			{
				name: 'Вверх изображения',
				value: 'top',
			},
			{
				name: 'Центр изображения',
				value: 'center',
			},
			{
				name: 'Низ изображения',
				value: 'bottom',
			},
		],
		placeholder: 'Позицию фона',
		labelClasses: 'col-span-12 xl:col-span-4',
		classes: 'w-full',
	},
	vein: {
		name: 'Затемнение',
		value: props.element?.settings?.vein ? props.element.settings.vein : '0.5',
		type: 'range',
		placeholder: 'Выберите затемнение',
		min: 0,
		max: 1,
		step: 0.1,
		labelClasses: 'col-span-12 xl:col-span-4',
		classes: 'w-full',
	},
	pave: {
		name: 'Замостить',
		value: props.element?.settings?.pave ? props.element.settings.pave : '',
		type: 'checkbox',
		labelClasses: 'col-span-12 xl:col-span-4',
		classes: 'w-full',
	},
});

const requestInProgress = ref(false);

// Изменение строковых настроек
const sendUpdateFormField = async (name) => {
	if (!requestInProgress.value) {
		form.value[name].validateResult = '';

		form.value[name].validateResult = validateElement(form.value[name].value, form.value[name].validateRules);

		if (form.value[name].validateResult) {
			error(form.value[name].validateResult, 10000);
		} else {
			await sendSetSettingRequest(name);
		}
	}
}

const sendSetSettingRequest = async (name) => {
	requestInProgress.value = true;

	try {
		const query = {
			name,
			value: form.value[name].value,
		};

		const response = await sendApiRequest(`board-game/v2/player/setPlayerSettings/${route.params.slug}`, 'POST', query, 'setPlayerSettings', 'small');
		requestInProgress.value = false;

		show(response);
	} catch (e) {
		requestInProgress.value = false;
		error(e);
	}
}

// Изменение бекграунда профиля
const sendUpdateAvatarForm = async () => {
	if (!requestInProgress.value) {
		form.value.backgroundImage.validateResult = '';

		form.value.backgroundImage.validateResult = validateElement(form.value.backgroundImage.value, form.value.backgroundImage.validateRules);

		if (form.value.backgroundImage.validateResult) {
			error(form.value.backgroundImage.validateResult, 10000);
		} else {
			await sendSetPlayerBgRequest();
		}
	}
}

const sendSetPlayerBgRequest = async () => {
	requestInProgress.value = true;

	try {
		const formData = new FormData();
		formData.append('bgImage', form.value.backgroundImage.value[0]);

		const response = await sendApiRequest(`board-game/v2/player/setPlayerBackground/${route.params.slug}`, 'POST', formData, 'setPlayerBgImage', 'small');
		requestInProgress.value = false;

		return show(response);
	} catch (e) {
		requestInProgress.value = false;
		error(e);
	}
}

// Наблюдатели
watch(() => form.value.avatarBorder.value, () => sendUpdateFormField('avatarBorder'), { deep: true });
watch(() => form.value.premiumMessage.value, () => funcDelay(() => sendUpdateFormField('premiumMessage'), 500),  { deep: true });
watch(() => form.value.backgroundImage.value, () => {
	if (form.value.backgroundImage.value) {
		sendUpdateAvatarForm();
	}
}, { deep: true });
watch(() => form.value.backgroundPosition.value, () => sendUpdateFormField('backgroundPosition'), { deep: true });
watch(() => form.value.vein.value, () => funcDelay(() => sendUpdateFormField('vein'), 500), { deep: true });
watch(() => form.value.pave.value, () => sendUpdateFormField('pave'), { deep: true });
</script>

<template>
	<div class="setting-box">
		<h2 class="title">Рамка аватара</h2>
		<div class="item-box">
			Вы можете выбрать цвет анимированной рамки аватара
		</div>
		<FormGenerator
				:name="form.avatarBorder.name"
				:showTitle="form.avatarBorder.showTitle ?? true"
				:element="form.avatarBorder"
				:showValidateError=true
				:form="form"
				validateErrorPosition="bottom"
				:labelClasses="['block', 'mb-[10px]', form.avatarBorder.labelClasses]"
				:fieldClasses="form.avatarBorder.classes"
		/>
	</div>

	<div class="setting-box">
		<h2 class="title">Статус сообщение</h2>
		<div class="item-box">
			Вы можете установить статус сообщение профиля. Выше сообщение будет видно другим участникам ивента в вашем профиле.
			Сообщение е должно нарушать&nbsp;<nuxt-link target="_blank" to="/article/rule-for-use-site/">правила сайта</nuxt-link>
		</div>
		<FormGenerator
				:name="form.premiumMessage.name"
				:showTitle="form.premiumMessage.showTitle ?? true"
				:element="form.premiumMessage"
				:showValidateError=true
				:form="form"
				validateErrorPosition="bottom"
				:labelClasses="['block', 'mb-[10px]', form.premiumMessage.labelClasses]"
				:fieldClasses="form.premiumMessage.classes"
				:showMaxLength="true"
		/>
	</div>

	<div class="setting-box">
		<h2 class="title">Фоновое изображение профайла</h2>
		<div class="item-box">
			Вы можете установить своё фоновое изображение профайла. Ваше изображение не должно иметь вес более 5 мегабайт,
			а также не должна нарушать&nbsp;<nuxt-link target="_blank" to="/article/rule-for-use-site/">правила сайта</nuxt-link>
		</div>
		<FormGenerator
				name="backgroundImage"
				:element="form.backgroundImage"
				:showValidateError=true
				validateErrorPosition="bottom"
				:labelClasses="['block', 'mb-[10px]']"
				:fieldClasses="form.backgroundImage.classes"
				:formHandlerType="form.backgroundImage.formHandlerType"
				:showTitle="form.backgroundImage.showTitle"
		/>
		<div class="grid grid-cols-12 gap-4">
			<FormGenerator
					:name="form.backgroundPosition.name"
					:showTitle="form.backgroundPosition.showTitle ?? true"
					:element="form.backgroundPosition"
					:showValidateError=true
					:form="form"
					validateErrorPosition="bottom"
					:labelClasses="['block', 'mb-[10px]', form.backgroundPosition.labelClasses]"
					:fieldClasses="form.backgroundPosition.classes"
			/>
			<FormGenerator
					:name="form.vein.name"
					:showTitle="form.vein.showTitle ?? true"
					:element="form.vein"
					:showValidateError=true
					:form="form"
					validateErrorPosition="bottom"
					:labelClasses="['block', 'mb-[10px]', form.vein.labelClasses]"
					:fieldClasses="form.vein.classes"
			/>
			<FormGenerator
					:name="form.pave.name"
					:showTitle="form.pave.showTitle ?? true"
					:element="form.pave"
					:showValidateError=true
					:form="form"
					validateErrorPosition="bottom"
					:labelClasses="['block', 'mb-[10px]', form.pave.labelClasses]"
					:fieldClasses="form.pave.classes"
			/>
		</div>
	</div>

	<button
			class="btn btn-simple"
			@click="$emit('refresh')"
	>
		Посмотреть изменения
	</button>
</template>

<style lang="scss" scoped>
.setting-box {
	@apply mb-6;

	.title {
		@apply mb-2;
	}
}

.item-box {
	@apply rounded-none;
}
</style>
