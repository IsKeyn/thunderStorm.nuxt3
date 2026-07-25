<script setup>
import Modal from '@/components/modals/Modal.vue';
import AuthComponent from '@/components/user/AuthComponent.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { ref } from "vue";

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { validate } from '@/composables/validate.js';
const { validateElement } = validate();

const props = defineProps({
	message: {
		type: String,
		default: 'Интерфейс доступен для авторизованного пользователя, пожалуйста войдите или зарегистрируйтесь на сайте',
	},
});

const reCalc = ref(false);
const activeAuthModal = ref(false);

const formError = ref(null);

const buttonClickHandler = () => {
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
		openCloseBoxFunc();
	}
}

const openCloseBoxFunc = () => {
	activeAuthModal.value = !activeAuthModal.value;
};

const reCalcHeight = (value = true) => {
	reCalc.value = value;
}

const form = ref(
		{
			accept_with_rules: {
				name: 'Я ознакомился с правилами и описанием ивента',
				showTitle: false,
				html: `Я ознакомился с <a href="/e/${route.params.slug}/rules/" class="underline" target="_blank">правилами и описанием ивента</a> и согласен с ними`,
				value: false,
				type: 'checkbox',
				validateRules: 'required',
				validateErrorText: 'Ознакомление и соглашение с правилами и описанием ивента обязательно для участия в ивенте',
				classes: ['w-full', 'mt-[5px]'],
			},
		}
);
</script>

<template>
	<span class="user-interface-title">Авторизация</span>
	<div class="text-center">
		<layout-InfoBlock
				v-if="message"
				:text="message"
				classes="!mb-6"
		/>
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
		<button
				class="btn btn-simple"
				@click="buttonClickHandler"
		>
			Авторизоваться
		</button>
	</div>
	<Modal
			:showOpenModal="activeAuthModal"
			size="small"
			modal-id="auth-form"
			:re-calc-height="reCalc"
			@setReCalcValue="reCalcHeight"
			@toggleModal="toggleAuthModal"
	>
		<AuthComponent
				:registerOnEventBySlug="route.params.slug"
				@reCalcHeight="reCalcHeight"
				@closeModal="toggleAuthModal"
		/>
	</Modal>
</template>

<style lang="scss" scoped />
