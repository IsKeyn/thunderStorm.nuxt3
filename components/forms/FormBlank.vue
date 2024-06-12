<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ResponseErrorsComponent from '@/components/forms/fragments/ResponseErrorsComponent.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';
import TagsList from '@/components/tags/TagsList.vue';

const emit = defineEmits(['afterRequest']);

import { validate } from '@/composables/validate.js';
const {
	validateElement,
	validateForm
} = validate();

import { formExtensions } from '@/composables/formExtensions.js';
const {
	getFormExt
} = formExtensions();

import { notifications } from '@/composables/notifications.js';
const {
	alert,
	error
} = notifications();

import { api } from '@/composables/api.js';
import {watch} from "vue";
const {
	apiUrl,
	backendUrl,
	errorHandler,
	getCsrfCookie
} = api();

const props = defineProps({
	form: {
		type: Object,
		default: null,
	},
	buttonName: {
		type: String,
		default: 'Отправить',
	},
	buttons: {
		type: Array,
		default: [
			{
				name: 'Отправить',
			}
		],
	},
	fetchUrl: {
		type: String,
		default: 'auth/reset-password',
	},
	method: {
		type: String,
		default: 'POST',
	},
	showTags: {
		type: Boolean,
		default: false,
	},
	tagsForProp: {
		type: Array,
		default: [],
	},
	extensions: {
		type: Array,
		default: [],
	},
	dataForExt: {
		type: Object,
		default: {},
	},
	// Дополнительные данные для построения, например списку из сущности. Пример селектор для игровых платформ (PS1, PS2, XBOX ... PC)
	additionalData: {
		type: Object,
		default: {},
	},
});

const sendForm = async (doType = null) => {
	for (const formKey in props.form) {
		props.form[formKey].validateResult = '';
	}

	const { status, key, validateResult } = validateForm(props.form);

	if (status) {
		await sendRequest(doType);
	} else {
		props.form[key].validateResult = validateResult;
	}
}

const responseErrors = ref({});
const requestInProgress = ref(false);

const sendRequest = async (doType = null) => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		const body = preparedRequestBody();

		let request = '';
		let opts = {};
		let method = props.method;

		// Изменяем метод с PUT на POST если отправляем formData, тк Laravel не получает данных из форм даты при методе PUT (баг)
		if (props.method.toLowerCase() === 'put' && hasFormFile.value) {
			method = 'POST';
		}

		if (props.method.toLowerCase() === 'get') { // TODO переделать на query
			request = `${apiUrl.value}${props.fetchUrl}${body}`;
			opts = {
				method: props.method,
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
				},
			};
		} else {
			const csrfCookie = await getCsrfCookie();

			request = `${apiUrl.value}${props.fetchUrl}`;
			opts = {
				method,
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'X-XSRF-TOKEN': csrfCookie.value,
				},
				body,
			};
		}

		const response = await $fetch(request, opts);

		if (response) {
			requestInProgress.value = false;

			emit('afterRequest', { response, doType });
		}
	} catch (e) {
		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}

const preparedRequestBody = () => {
	// TODO переделать, формирование массива отправляемых данных

	const preparedObj = {};
	let preparedString = '?';
	const formData = new FormData();

	for (const formKey in props.form) {
		// Формируем строку для GET запроса
		if (props.method.toLowerCase() === 'get') {
			if (preparedString !== '?') {
				preparedString += '&';
			}

			preparedString += `${formKey}=${props.form[formKey].value}`;
		} else {
			// Формируем formData
			if (hasFormFile.value) {
				if (props.form[formKey].type === 'file') {
					formData.append(formKey, props.form[formKey].value[0]);
				} else {
					formData.append(formKey, props.form[formKey].value);
				}
			} else {
				// Формируем массив
				preparedObj[formKey] = props.form[formKey].value;
			}
		}
	}

	// Добавляем теги, если они включены
	if (props.method.toLowerCase() === 'get') {
		preparedString += `&tags=${tags.value.join(',')}`;
	} else {
		if (hasFormFile.value) {
			tags.value.forEach((item, key) => {
				formData.append(`tags[${key}]`, item);
			});
		} else {
			preparedObj['tags'] = tags.value;
		}
	}

	// Добавляем данные из расширений extension
	if (props.extensions.length > 0) {
		props.extensions.forEach((extItem) => {
			const name = extItem.keyForBackend ? extItem.keyForBackend : extItem.name;

			if (extensionModels.value[name]) {
				// TODO данные с репитора не будут корректно передаваться где *, скорректировать (нужно что-то примудмать)
				if (props.method.toLowerCase() === 'get') { // *
					preparedString += `&${name}=${extensionModels.value[name].join(',')}`;
				} else {
					if (hasFormFile.value) { // *
						extensionModels.value[name].forEach((item, key) => {
							formData.append(`${name}[${key}]`, item);
						});
					} else { // *
						preparedObj[name] = extensionModels.value[name];
					}
				}
			}
		});
	}

	// Возвращаем данные
	if (props.method.toLowerCase() === 'get') {
		return preparedString;
	} else {
		if (hasFormFile.value) {
			if (props.method.toLowerCase() === 'put' || props.method.toLowerCase() === 'patch') {
				formData.append('_method', props.method);
			}

			return formData;
		} else {
			return preparedObj;
		}
	}
}

const hasFormFile = computed(() => {
	let returnData = false;

	for (const formKey in props.form) {
		if (props.form[formKey].type === 'file') {
			returnData = true;
			break;
		}
	}

	return returnData;
});

const tags = ref([]);
tags.value = toRaw(props.tagsForProp);

const extensionModels = ref({});
extensionModels.value = toRaw(props.dataForExt);
</script>

<template>
	<div>
		<ResponseErrorsComponent :responseErrors="responseErrors" />
		<FormGenerator
				v-for="(field, index) in form"
				:key="index"
				:name="index"
				:element="field"
				:form="form"
				:showValidateError=true
				validateErrorPosition="bottom"
				:labelClasses="['block', 'mb-[10px]']"
				:fieldClasses="field.classes"
		/>
		<component
				v-if="extensions.length > 0"
				v-for="extension in extensions"
				:is="getFormExt(extension.name)"
				:additionalData="additionalData"
				v-model="extensionModels[extension.keyForBackend ? extension.keyForBackend : extension.name]"
		/>

		<TagsList
				v-if="showTags"
				v-model="tags"
		/>
		<div class="grid grid-cols-6">
			<div
					v-if="!requestInProgress"
					class="col-span-3"
			>
				<ActionButton
						v-for="button in buttons"
						:class="button.class ? button.class : ''"
						:buttonName="button.name"
						@startAction="sendForm(button.doType ? button.doType : null)"
				/>
			</div>
			<font-awesome-icon
					v-else
					class="text-[32px]"
					:icon="['fas', 'spinner']"
					spin-pulse
			/>
			<div class="col-span-3 text-right"></div>
		</div>
	</div>
</template>
