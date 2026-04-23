<script setup>
import ResponseErrorsComponent from '@/components/forms/fragments/ResponseErrorsComponent.vue';
import Tabs from '@/components/ui/tabs/Tabs.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import TagsList from '@/components/tags/TagsList.vue';
import AdditionalFieldsComponent from '@/components/forms/fragments/AdditionalFields.vue';
import SeoForm from '@/components/admin/forms/SeoForm.vue';
import EntityMenuEditor from '@/components/admin/forms/EntityMenuEditor.vue'
import BlocksEditor from '@/components/blockEditor/editor/BlocksEditor.vue';
import AdditionalControlPanel from '@/components/admin/panels/AdditionalControlPanel.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';
import VersionList from '@/components/admin/version/VersionList.vue';

import { ref } from "vue";

const emit = defineEmits(['afterRequest']);

import { useBlocksStore } from '@/stores/blocks';
const pageBlocks = useBlocksStore();

import { validate } from '@/composables/validate.js';
const { validateForm } = validate();

import { formExtensions } from '@/composables/formExtensions.js';
const { getFormExt } = formExtensions();

import { notifications } from '@/composables/notifications.js';
const { error } = notifications();

import { api } from '@/composables/api.js';
const { errorHandler, sendApiRequest } = api();

const props = defineProps({
	form: {
		type: Object,
		default: null,
	},
	entityId: {
		type: Number,
		default: null,
	},
	entityType: {
		type: String,
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
	showSeo: {
		type: Boolean,
		default: false,
	},
	showMenu: {
		type: Boolean,
		default: false,
	},
	useBlockEditor: {
		type: Boolean,
		default: false,
	},
	showTabs: {
		type: Boolean,
		default: true,
	},
	showAdditionControlPanel: {
		type: Boolean,
		default: true,
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
	menuForProp: {
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
	/* Дополнительные данные для построения, например списку из сущности. Пример селектор для игровых платформ (PS1, PS2, XBOX ... PC) */
	additionalData: {
		type: Object,
		default: {},
	},
	showAdditionalFieldsTab: {
		type: Boolean,
		default: true,
	},
	/* url страницы в публичной части сайта */
	previewUrl: {
		type: String,
		default: null,
	},

	/* Использовать список версий */
	useVersionList: {
		type: Boolean,
		default: false,
	},
});

const blockEditorRef = ref(null);

const tags = ref([...toRaw(props.tagsForProp)]);
const seo = ref({...toRaw(props.seoForProp)});
const extensionModels = ref({...toRaw(props.dataForExt)});
const additionalFields = ref([...toRaw(props.dataForAdditionalFields)]);

const {
	responseErrors,
	requestInProgress,
	sendForm,
} = sendData();

function sendData() {
	const responseErrors = ref({});
	const requestInProgress = ref(false);

	const sendForm = async (doType = null) => {
		if (doType === 'viewResult') {
			if (!props.previewUrl) {
				return false;
			}

			let newTabUrl = '';

			if (props.previewUrl.includes('{id}') && props.form.id.value) {
				newTabUrl = props.previewUrl.replace('{id}', props.form.id.value);
			}

			if (props.previewUrl.includes('{slug}')) {
				newTabUrl = props.previewUrl.replace('{slug}', props.form.slug.value);
			}

			if (newTabUrl) {
				window.open(newTabUrl + '?preview=true', '_blank', 'noopener,noreferrer');
			}

			return true;
		}

		if (!requestInProgress.value) {
			for (const formKey in props.form) {
				props.form[formKey].validateResult = '';
			}

			const { status, key, validateResult } = validateForm(props.form);

			if (status) {
				await sendRequest(doType);
			} else {
				props.form[key].validateResult = validateResult;
				error(validateResult);
			}
		}
	}

	const sendRequest = async (doType = null) => {
		responseErrors.value = {};
		requestInProgress.value = true;

		try {
			const query = preparedRequestBody();
			let response = null;
			let method = props.method;

			// Изменяем метод с PUT на POST если отправляем formData, тк Laravel не получает данных из formData при методе PUT (известный баг)
			if (method.toLowerCase() === 'put' && hasFormFile.value) {
				method = 'POST';
			}

			if (method.toLowerCase() === 'get') { // TODO Переделать на query
				response = await sendApiRequest(
						`${props.fetchUrl}${query}`,
						method,
						{},
						`${props.fetchUrl}_adminSendRequest`,
						'fullscreenTransparent',
						'fetch'
				);
			} else {
				response = await sendApiRequest(
						`${props.fetchUrl}`,
						method,
						query,
						`${props.fetchUrl}_adminSendRequest`,
						'fullscreenTransparent',
						'fetch'
				);
			}

			if (response) {
				emit('afterRequest', { response, doType });
			}

			requestInProgress.value = false;
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
				preparedString += `&blocks=${pageBlocks.blocks.join(',')}`;
			} else {
				if (hasFormFile.value) {
					pageBlocks.blocks.forEach((item, key) => {
						formData.append(`blocks[${key}]`, item);
					});
				} else {
					preparedObj['blocks'] = pageBlocks.blocks;
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
		if (props.showSeo) {
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

	return {
		responseErrors,
		requestInProgress,
		sendForm,
	};
}

const tabsElements = [
	{
		id: 1,
		title: 'Основная информация',
	},
];

if (props.showAdditionalFieldsTab) {
	tabsElements.push({
		id:	'additionalData',
		title: 'Дополнительные поля',
	});
}

if (props.showSeo) {
	tabsElements.push({
		id:	'seo',
		title: 'SEO',
	});
}

if (props.showMenu) {
	tabsElements.push({
		id:	'menu',
		title: 'Меню',
	});
}

if (props.useBlockEditor) {
	tabsElements.push({
		id:	'block-editor',
		title: 'Блочный редактор',
	});
}

const openBlockList = () => {
	blockEditorRef.value.addBlock();
}
</script>

<template>
	<div>
		<ResponseErrorsComponent :responseErrors="responseErrors" />
		<Tabs
				:tabs="tabsElements"
				:showTabs="showTabs"
				:useHardDisableTab="false"
		>
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
						:formHandlerType="field.formHandlerType"
						:showTitle="field.showTitle"
				/>
				<TagsList
						v-if="showTags"
						v-model="tags"
				/>
			</template>

			<template #tab-additionalData>
				<component
						v-if="extensions.length > 0"
						v-for="extension in extensions"
						:is="getFormExt(extension.name)"
						:params="extension?.params ? extension.params : null"
						:additionalData="additionalData"
						v-model="extensionModels[extension.keyForBackend ? extension.keyForBackend : extension.name]"
				/>
				<AdditionalFieldsComponent
						v-if="additionalFieldsEnable"
						:defaultValues="defaultValuesForAdditionalFields"
						v-model="additionalFields"
				/>
			</template>

			<template #tab-seo>
				<SeoForm v-if="showSeo" v-model="seo" />
			</template>

			<template #tab-menu>
				<EntityMenuEditor
					:menu="menuForProp"
				/>
			</template>

			<template v-if="useBlockEditor" #tab-block-editor>
				<BlocksEditor ref="blockEditorRef" />
			</template>
		</Tabs>

		<AdditionalControlPanel
				v-if="showAdditionControlPanel"
				:requestInProgress="requestInProgress"
				:useBlockEditor="useBlockEditor"
				:showPreview="previewUrl"
				@sendForm="sendForm"
				@openBlockList="openBlockList"
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

		<ui-BigPreloader
				v-if="requestInProgress"
				class="h-full"
				theme="image"
				:themeType="9"
		/>
		<VersionList
				v-else-if="useVersionList && entityId && entityType"
				:entityId="entityId"
				:entityType="entityType"
		/>
	</div>
</template>
