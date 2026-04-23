<script setup>
import FormBlankV2 from '@/components/forms/FormBlankV2.vue';

import { computed, watch } from 'vue'

import { useBlocksStore } from '@/stores/blocks';
const pageBlocks = useBlocksStore();

import { api } from '@/composables/api.js'
const { sendApiRequest, show404pageFunc } = api();

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

import { notifications } from '@/composables/notifications.js';
const { alert } = notifications();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const props = defineProps({
	/* Форма для заполнения основных данных о сущности */
	form: {
		type: Object,
		default: {},
		required: true,
	},
	/* URL для получения данных о сущности */
	fetchUrl: {
		type: String,
		default: null,
	},
	/* Должна быть значение true, если используется laravel resource */
	hasResource: {
		type: Boolean,
		default: false,
	},
	/* Использование дополнительных полей */
	additionalFieldsEnable: {
		type: Boolean,
		default: false,
	},
	/* Дефолтные значения для дополнительных полей */
	defaultValuesForAdditionalFields: {
		type: Array,
		default: [],
	},
	/* Показать\скрыть теги */
	showTags: {
		type: Boolean,
		default: false,
	},
	/* Показать\скрыть редактор SEO данных */
	showSeo: {
		type: Boolean,
		default: false,
	},
	/* Показать\скрыть редактор меню */
	showMenu: {
		type: Boolean,
		default: false,
	},
	/* Показать\скрыть блочный редактор */
	useBlockEditor: {
		type: Boolean,
		default: false,
	},
	/* Список используемых расширений */
	extensions: {
		type: Array,
		default: [],
	},
	/* Указание, использует ли форма дополнительные данные (например для селектов и требуется ли их запросить с бека) */
	useAdditionalData: {
		type: Boolean,
		default: false,
	},
	/* Показать\скрыть таб с дополнительными данными */
	showAdditionalFieldsTab: {
		type: Boolean,
		default: false,
	},
	/*  Показать\скрыть панель с боковыми кнопками */
	showAdditionControlPanel: {
		type: Boolean,
		default: true,
	},
	/* Кнопки под формой */
	buttons: {
		type: Array,
		default: [
			{
				name: 'Сохранить',
				class: 'mr-2',
				doType: 'save',
			},
			{
				name: 'Сохранить и продолжить',
				class: 'mr-2',
				doType: 'saveAndContinue',
			},
			{
				name: 'Сохранить и добавить ещё',
				class: 'mr-2',
				doType: 'saveAndAddNew',
			},
		],
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

let formMode = '';

const requestName =  `${props.fetchUrl}_${route.params.slug}_edit_request`;

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (route.params.slug) {
				if (Number.isInteger(Number(route.params.slug))) {
					formMode = 'update';

					let query = {};

					if (route.query?.version_id) {
						query.version_id = route.query.version_id;
					}

					const response = await Promise.resolve(
							sendApiRequest(`${props.fetchUrl}/${route.params.slug}/edit/`, 'GET', query, requestName, '')
					);

					return response || null;
				} else if (route.params.slug === 'create') {
					formMode = 'create';
				} else {
					show404pageFunc();
				}
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value ? (props.hasResource ? requestData.value.data : requestData.value) : null);
const fetchedDataHasData = computed(() => fetchedData.value && Object.keys(fetchedData.value).length > 0);

// Заполнение формы значениями
const fillFormFunc = () => {
	if (!fetchedDataHasData.value || Object.keys(props.form).length === 0) return false;

	for (const formKey in props.form) {
		if (
				formKey
				&& fetchedData.value.hasOwnProperty(formKey)
				&& fetchedData.value[formKey] !== null
				&& fetchedData.value[formKey] !== undefined
		) {
			if (
					typeof fetchedData.value[formKey] === 'object'
					&& props.form[formKey].keyValueFromObject
			) {
				props.form[formKey].value = fetchedData.value[formKey][props.form[formKey].keyValueFromObject];

				// Если для дальнейшей работы формы требуется полный объект, то записываем его в форму
				if (props.form[formKey].hasOwnProperty('objectValue')) {
					props.form[formKey].objectValue = fetchedData.value[formKey];
				}
			} else {
				props.form[formKey].value = fetchedData.value[formKey];
			}
		}
	}
}

const dataForAdditionalFields = computed(() => {
	if (!fetchedDataHasData.value) return [];

	if (!props.additionalFieldsEnable || !fetchedData.value?.additional_fields) {
		return [];
	}

	return fetchedData.value.additional_fields.map(item => toRaw(item));
});

const menuForProp = computed(() => {
	if (
			fetchedDataHasData.value
			&& props.showMenu
			&& fetchedData.value?.menu
	) {
		return fetchedData.value.menu;
	} else {
		return {};
	}
});

const tagsForProp = computed(() => {
	if (
			fetchedDataHasData.value
			&& props.showTags
			&& fetchedData.value?.tags
	) {
		return fetchedData.value.tags.map(item => item.name);
	} else {
		return [];
	}
});

const seoForProp = computed(() => {
	if (
			fetchedDataHasData.value
			&& props.showSeo
			&& fetchedData.value?.seo
	) {
		return fetchedData.value.seo;
	} else {
		return {};
	}
});

const dataForExt = computed(() => {
	const returnData = {};

	if (!fetchedDataHasData.value) {
		return returnData;
	}

	props.extensions.forEach((extItem) => {
		const name = extItem.keyForBackend ? extItem.keyForBackend : extItem.name;

		if (fetchedData.value[name]) {
			returnData[name] = fetchedData.value[name];
		}
	});

	return returnData;
});

watch(() => fetchedData.value, () => {
	fillFormFunc();

	if (
			props.useBlockEditor
			&& fetchedData.value?.blocks
			&& fetchedData.value.blocks.length > 0
	) {
		pageBlocks.blocks = toRaw(fetchedData.value.blocks);
	} else {
		pageBlocks.blocks = [];
	}
}, { deep: true });

const request2Name =  `${props.fetchUrl}_${route.params.slug}_get-additional-data`;

const {
	data: request2Data,
	pending: request2InProgress,
	refresh2
} = await useAsyncData(
		request2Name,
		async () => {
			if (props.useAdditionalData) {
				const response = await Promise.resolve(
						sendApiRequest(`${props.fetchUrl}/get-additional-data/`, 'GET', {}, request2Name, '')
				);

				return response || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const additionalData = computed(() => request2Data.value || null);

const afterRequest = (params) => {
	const { response, doType } = params;
	const splitedPath = route.path.split('/');

	let path = '';

	splitedPath.forEach((item, key) => {
		if (key !== 0 && key !== splitedPath.length - 1) {
			path += '/' + item;
		}
	});

	if (doType === 'save') {
		router.push({ path: path });
	}

	if (doType === 'saveAndContinue') {
		if (formMode === 'create') {
			router.push({path: `${path}/${response.id}`});
		}
	}

	if (doType === 'saveAndAddNew') {
		// TODO делать очистку форму
		router.push({ path: `${path}/create` });
	}

	alert('Успешно сохранено');
}

const buttonsForForm = [ ...props.buttons ];

if (props.previewUrl) {
	buttonsForForm.push({
		name: 'Предпросмотр',
		class: 'mr-2',
		doType: 'viewResult',
	});
}
</script>

<template>
	<div>
		<ui-BigPreloader
				v-if="requestInProgress || request2InProgress"
				class="h-full"
				theme="image"
				:themeType="9"
		/>
		<div v-else>
			<ui-itemBox
					v-if="route.query?.version_id && fetchedData"
					:message="`Загруженны данные из версии с ID: ${route.query.version_id} от ${getFormattedDate('d.m.Y H:i:s', fetchedData.created_at)}`"
					borderColor="green"
			/>
			<FormBlankV2
					:form="form"

					:entityId="fetchedData?.id"
					:entityType="fetchedData?.model"

					:showAdditionControlPanel="showAdditionControlPanel"
					:buttons="buttonsForForm"
					:previewUrl="previewUrl"

					:fetchUrl="formMode === 'create' ? `${fetchUrl}` : `${fetchUrl}/${route.params.slug}`"
					:method="formMode === 'create' ? 'POST' : 'PUT'"

					:showTags="showTags"
					:showSeo="showSeo"
					:showMenu="showSeo"
					:useBlockEditor="useBlockEditor"

					:additionalFieldsEnable="additionalFieldsEnable"
					:defaultValuesForAdditionalFields="defaultValuesForAdditionalFields"

					:tagsForProp="tagsForProp"
					:seoForProp="seoForProp"
					:menuForProp="menuForProp"
					:dataForAdditionalFields="dataForAdditionalFields"

					:showAdditionalFieldsTab="showAdditionalFieldsTab"
					:additionalData="additionalData"

					:extensions="extensions"
					:dataForExt="dataForExt"

					:useVersionList="useVersionList"

					@afterRequest="afterRequest"
			/>
		</div>
	</div>
</template>
