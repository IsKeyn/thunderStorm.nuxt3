<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import AdditionalFieldsComponent from '@/components/forms/fragments/AdditionalFields.vue';
import ResponseErrorsComponent from '@/components/forms/fragments/ResponseErrorsComponent.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';
import TagsList from '@/components/tags/TagsList.vue';
import Tabs from '@/components/ui/tabs/Tabs.vue';
import SeoForm from '@/components/admin/forms/SeoForm.vue';
import BlocksEditor from  '@/components/blocks/BlocksEditor.vue';

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
	additionalFieldsEnable: {
		type: Boolean,
		default: false,
	},
	defaultValuesForAdditionalFields: {
		type: Array,
		default: [],
	},
	showTags: {
		type: Boolean,
		default: false,
	},
	useBlockEditor: {
		type: Boolean,
		default: false,
	},
	blocksForProp: {
		type: Array,
		default: [],
	},
	dataForAdditionalFields: {
		type: Array,
		default: [],
	},
	tagsForProp: {
		type: Array,
		default: [],
	},
	seoForProp: {
		type: Object,
		default: {},
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

	// Добавляем блоки, если они включены
	if (props.useBlockEditor) {
		if (props.method.toLowerCase() === 'get') {
			preparedString += `&blocks=${blocks.value.join(',')}`;
		} else {
			if (hasFormFile.value) {
				blocks.value.forEach((item, key) => {
					formData.append(`blocks[${key}]`, item);
				});
			} else {
				preparedObj['blocks'] = blocks.value;
			}
		}
	}

	// Добавляем "AdditionalFields если они включены
	if (props.additionalFieldsEnable) {
		if (props.method.toLowerCase() === 'get') {
			preparedString += `&additional_fields=${additionalFields.value.join(',')}`;
		} else {
			if (hasFormFile.value) {
				additionalFields.value.forEach((item, key) => {
					formData.append(`additional_fields[${key}]`, item);
				});
			} else {
				preparedObj['additional_fields'] = additionalFields.value;
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

	// Добавляем seo, если они включены
	if (props.method.toLowerCase() === 'get') {
		preparedString += `&seo=${seo.value.join(',')}`;
	} else {
		if (hasFormFile.value) {
			seo.value.forEach((item, key) => {
				formData.append(`seo[${key}]`, item);
			});
		} else {
			preparedObj['seo'] = seo.value;
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

const seo = ref({});
watch(() => props.seoForProp, (newValue) => {
	seo.value = toRaw(newValue);
}, { deep: true });

const extensionModels = ref({});
extensionModels.value = toRaw(props.dataForExt);

const additionalFields = ref([]);
additionalFields.value = toRaw(props.dataForAdditionalFields);

const blocks = ref([]);
blocks.value = toRaw(props.blocksForProp);

const tabsElements = [
	{
		id: 1,
		title: 'Основная информация',
	},
	{
		id: 2,
		title: 'Дополнительные поля',
	},
	{
		id: 3,
		title: 'SEO',
	},
	{
		id: 4,
		title: 'Меню',
	},
];

if (props.useBlockEditor) {
	tabsElements.push({
		id:	'block-editor',
		title: 'Блочный редактор',
	});
}
</script>

<template>
	<div>
		<ResponseErrorsComponent :responseErrors="responseErrors" />

		<Tabs :tabs="tabsElements">
			<template #tab-1>
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
				<TagsList
						v-if="showTags"
						v-model="tags"
				/>
			</template>

			<template #tab-2>
				<AdditionalFieldsComponent
						v-if="additionalFieldsEnable"
						:defaultValues="defaultValuesForAdditionalFields"
						v-model="additionalFields"
				/>
				<component
						v-if="extensions.length > 0"
						v-for="extension in extensions"
						:is="getFormExt(extension.name)"
						:params="extension?.params ? extension.params : null"
						:additionalData="additionalData"
						v-model="extensionModels[extension.keyForBackend ? extension.keyForBackend : extension.name]"
				/>
			</template>

			<template #tab-3>
				<SeoForm v-model="seo" />
			</template>

			<template #tab-4>
				Редактор меню
			</template>

			<template v-if="useBlockEditor" #tab-block-editor>
				<BlocksEditor
					v-model="blocks"
				/>
			</template>
		</Tabs>

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
