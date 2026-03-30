<script setup>
import { onMounted } from 'vue'
import FormBlank from '@/components/forms/FormBlank.vue';

import { useBlocksStore } from '@/stores/blocks';
const pageBlocks = useBlocksStore();

const props = defineProps({
	form: {
		type: Object,
		default: {},
	},
	fetchUrl: {
		type: String,
		default: '',
	},
	page: {
		type: String,
		default: '',
	},
	hasResource: {
		type: Boolean,
		default: false,
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
	extensions: {
		type: Array,
		default: [],
	},
	useAdditionalData: {
		type: Boolean,
		default: false,
	},
	showAdditionControlPanel: { // Боковая панель с кнопками сохранения
		type: Boolean,
		default: true,
	},
	showAdditionalData: { // Таб, включающий в себя расширения
		type: Boolean,
		default: false,
	},
});

const route = useRoute();
const formMode = ref('create');

onMounted(() => {
	if (route.params.slug) {
		if (Number.isInteger(Number(route.params.slug))) {
			formMode.value = 'update';
			sendRequest();
		} else if (route.params.slug === 'create') {
			formMode.value = 'create';
		} else {
			// TODO Пробросить 404 ошибку
		}
	}

	if (props.useAdditionalData) {
		fetchAdditionalData();
	}
})

const router = useRouter();
import { notifications } from '@/composables/notifications.js';
const { alert } = notifications();

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
		if (formMode.value === 'create') {
			router.push({path: `${path}/${response.id}`});
		}
	}

	if (doType === 'saveAndAddNew') {
		// TODO делать очистку форму
		router.push({ path: `${path}/create` });
	}

	alert('Успешно сохранено');
}

const { apiUrl, errorHandler } = api();

const requestInProgress = ref(false);
const responseErrors = ref({});

const fetchedData = ref(null);

const dataForAdditionalFields = ref([]);
const tagsForProp = ref([]);
const seoForProp = ref({});
const menuForProp = ref({});
const dataForExt = ref({});
const additionalData = ref({});

const sendRequest = async () => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		const response = await $fetch(
				`${apiUrl.value}${props.fetchUrl}/${route.params.slug}/edit/`,
				{
					method: 'GET',
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
					},
				},
		);

		if (response) {
			requestInProgress.value = false;
			fetchedData.value = props.hasResource ? response.data : response;

			for (const formKey in props.form) {
				if (
						formKey
						&& fetchedData.value.hasOwnProperty(formKey)
						&& fetchedData.value[formKey] !== null
						&& fetchedData.value[formKey] !== undefined
				) {
					if (typeof fetchedData.value[formKey] === 'object' && props.form[formKey].keyValueFromObject) {
						props.form[formKey].value = fetchedData.value[formKey][props.form[formKey].keyValueFromObject];

						if (props.form[formKey].hasOwnProperty('objectValue')) {
							props.form[formKey].objectValue = fetchedData.value[formKey];
						}
					} else {
						props.form[formKey].value = fetchedData.value[formKey];
					}
				}
			}

			if (props.showMenu && fetchedData.value.menu) {
				menuForProp.value = fetchedData.value.menu;
			}

			if (props.additionalFieldsEnable && fetchedData.value.additional_fields	) {
				fetchedData.value.additional_fields.forEach((item) => { // TODO не самое лучшее решение прогонять массив
					dataForAdditionalFields.value.push(toRaw(item));
				});
			}

			if (props.showTags && fetchedData.value.tags) {
				fetchedData.value.tags.forEach((item) => {
					tagsForProp.value.push(item.name);
				});
			}

			if (props.showSeo && fetchedData.value.seo) {
				seoForProp.value = fetchedData.value.seo;
			}

			props.extensions.forEach((extItem) => {
				const name = extItem.keyForBackend ? extItem.keyForBackend : extItem.name;

				if (fetchedData.value[name]) {
					dataForExt.value[name] = fetchedData.value[name];
				}
			});

			if (props.useBlockEditor && fetchedData.value.blocks && fetchedData.value.blocks.length > 0) {
				pageBlocks.blocks = toRaw(fetchedData.value.blocks);
			}
		}
	} catch (e) {
		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}

const fetchAdditionalData = async () => { //TODO тут реализовать ленивую загрузку
	responseErrors.value = {};

	try {
		const response = await $fetch(
				`${apiUrl.value}${props.fetchUrl}/get-additional-data/`,
				{
					method: 'GET',
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
					},
				},
		);

		if (response) {
			additionalData.value = response;
		}
	} catch (e) {
		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
	}
}

const buttons = [
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
];
</script>

<template>
	<div>
		<ui-BigPreloader
				v-if="requestInProgress"
				class="h-full"
				theme="image"
				:themeType="9"
		/>
		<FormBlank
				v-else
				:form="form"
				:buttons="buttons"

				:fetchUrl="formMode === 'create' ? `${fetchUrl}` : `${fetchUrl}/${route.params.slug}`"
				:method="formMode === 'create' ? 'POST' : 'PUT'"

				:showTags="showTags"
				:showSeo="showSeo"
				:showMenu="showSeo"
				:additionalFieldsEnable="additionalFieldsEnable"
				:useBlockEditor="useBlockEditor"

				:defaultValuesForAdditionalFields="defaultValuesForAdditionalFields"
				:tagsForProp="tagsForProp"
				:seoForProp="seoForProp"
				:menuForProp="menuForProp"
				:dataForAdditionalFields="dataForAdditionalFields"
				:showAdditionControlPanel="showAdditionControlPanel"
				:showAdditionalData="showAdditionalData"
				:additionalData="additionalData"

				:extensions="extensions"
				:dataForExt="dataForExt"
				@afterRequest="afterRequest"
		/>
	</div>
</template>

