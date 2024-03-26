<script setup>
import { onMounted } from 'vue'
import FormBlank from '@/components/forms/FormBlank.vue';

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
	showTags: {
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
})

const router = useRouter();
import { notifications } from '@/composables/notifications.js';
const { alert } = notifications();

const afterRequest = (params) => {
	const { response, doType } = params;
	const splitedPath = route.path.split('/');

	if (doType === 'save') {
		router.push({ path: `/${splitedPath[1]}/${splitedPath[2]}` });
	}

	if (doType === 'saveAndContinue') {
		if (formMode.value === 'create') {
			router.push({path: `/${splitedPath[1]}/${splitedPath[2]}/${response.id}`});
		}
	}

	alert('Успешно сохранено');
}

const { apiUrl, errorHandler } = api();

const Authorization = useCookie('Authorization');
const requestInProgress = ref(false);
const responseErrors = ref({});

const fetchedData = ref(null);
const tagsForProp = ref([]);

const sendRequest = async () => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		const response = await $fetch(
				`${apiUrl.value}${props.fetchUrl}/${route.params.slug}/edit/`,
				{
					method: 'GET',
					headers: {
						Authorization: Authorization.value,
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
					},
				},
		);

		if (response) {
			requestInProgress.value = false;
			fetchedData.value = props.hasResource ? response.data : response;

			for (const formKey in props.form) {
				if (fetchedData.value[formKey]) {
					props.form[formKey].value = fetchedData.value[formKey];
				}
			}

			if (props.showTags && fetchedData.value.tags) {
				fetchedData.value.tags.forEach((item) => {
					tagsForProp.value.push(item.name);
				});
			}
		}
	} catch (e) {
		responseErrors.value = errorHandler(e);
		requestInProgress.value = false;
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
];
</script>

<template>
	<div>
		<FormBlank
				:form="form"
				:buttons="buttons"
				:fetchUrl="formMode === 'create' ? `${fetchUrl}` : `${fetchUrl}/${route.params.slug}`"
				:method="formMode === 'create' ? 'POST' : 'PUT'"
				:showTags="showTags"
				:tagsForProp="tagsForProp"
				@afterRequest="afterRequest"
		/>
	</div>
</template>

