<script setup>
import TdElementCard from '@/components/admin/list/TdElementCard.vue';
import Pagination from '@/components/navigation/Pagination.vue';
import LightBox from '@/components/media/LightBox.vue';

import { api } from '@/composables/api.js'
const {
	apiUrl,
	backendUrl,
	getCsrfCookie,
	sendApiRequest
} = api();

const props = defineProps({
	titles: {
		type: Object,
		default: {},
	},
	titleKey: {
		type: String,
		default: 'name',
	},
	fetchUrl: {
		type: String,
		default: '',
	},
	method: {
		type: String,
		default: 'POST',
	},
	hasResource: {
		type: Boolean,
		default: false,
	},
	hasMultiUpload: {
		type: Boolean,
		default: false,
	},
	usePagination: {
		type: Boolean,
		default: false,
	},
	perPage: {
		type: Number,
		default: 10,
	},
	additionalButtons: { // Допольнительные кнопки
		type: Array,
		default: [],
	},
});

const systemTitles = ref({
	created_at: {
		name: 'Дата создания',
	},
	updated_at: {
		name: 'Дата обновления',
	},
	deleted_at: {
		name: 'Дата удаления',
	},
	doTypes: {
		name: 'Действия',
	},
});

const fetchedData = ref(null);
const pagination = ref(null);

const router = useRouter();
const route = useRoute();

const page = ref(1);
const perPageCount = ref(props.perPage);

const getRequestUrl = () => {
	let request = `${apiUrl.value}${props.fetchUrl}`;

	const perPage = route.query.perPage ? route.query.perPage : perPageCount.value;

	let currentPage = route.query.page ? route.query.page : page.value;

	if (pagination) {
		const paginationRaw = toRaw(pagination.value);

		if (paginationRaw) {
			const maxPageCount = Math.ceil(paginationRaw.total / perPage);

			if (maxPageCount < currentPage) {
				currentPage = maxPageCount;

				router.push({
					name: route.name,
					query: {
						...route.query,
						page: currentPage,
					},
				});
			}
		}
	}

	if (props.usePagination) {
		request += `?page=${currentPage}&perPage=${perPage}`;
	}

	return request;
}

const { pending, refresh } = await useFetch(
		() => getRequestUrl(),
		{
			method: 'GET',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
			},
			onResponse({response}) {
				if (response.status === 200) {
					fetchedData.value = props.hasResource ? response._data.data : response._data;

					if (props.usePagination) {
						pagination.value = response._data.meta;
					}
				}
			},
		},
);

import { notifications } from '@/composables/notifications.js';
const { alert, choiceAlert } = notifications();

const deleteElement = (item) => {
	const message = item[props.titleKey] ? `Удалить элемент "${item[props.titleKey]}"?` : 'Вы действительно уверены, что хотите удалить этот элемент?';

	choiceAlert(
			{
				title: 'Удаление',
				message,
				buttons: [
					{
						name: 'Да',
						func: () => {
							sendRequestForDeleteElement(item.id);
						},
						additionalKeywordFunc: 'close',
					},
					{
						name: 'Нет',
						additionalKeywordFunc: 'close',
					},
				],
			}
	);
};

import ResponseErrorsComponent from '@/components/forms/fragments/ResponseErrorsComponent.vue';

const responseErrors = ref({});
const requestInProgress = ref(false);

const sendRequestForDeleteElement = async (id) => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		const csrfCookie = await getCsrfCookie();

		const response = await $fetch(
				`${apiUrl.value}${props.fetchUrl}/${id}`,
				{
					method: 'DELETE',
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'X-XSRF-TOKEN': csrfCookie.value,
					},
				}
		);

		if (response) {
			// TODO попробовать вызывать useFetch
			// updateTable();
			refresh();

			alert('Успешно удалено');
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

const updateTable = async () => {
	let request = `${apiUrl.value}${props.fetchUrl}`;

	if (props.usePagination) {
		request += `?page=${page.value}&perPage=${perPageCount.value}`;
	}

	await $fetch(
			request,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					Accept: 'application/json',
				},
				onResponse({response}) {
					if (response.status === 200) {
						fetchedData.value = props.hasResource ? response._data.data : response._data;
						// fetchedData.value = response._data.data ? response._data.data : response._data;

						if (props.usePagination) {
							pagination.value = response._data.meta;
						}
					}
				},
			},
	);
}

const entities = ref({});

const getEntities = async () => {
	for (const key in props.titles) {
		if (props.titles[key].type === 'EntityList' && props.titles[key].apiUrl) {
			const body = props.titles[key].body ?? {};

			const requestName = 'getItemList_' + props.apiUrl;
			const response = await sendApiRequest(props.titles[key].apiUrl, 'GET', body, requestName, '');

			// entities.value[props.titles[key].apiUrl] = props.titles[key].hasResource === false ? response : response.data;
			entities.value[props.titles[key].apiUrl] = response.data ? response.data : response;
		}
	}
}

getEntities();

// TODO а нам нужны наблидатели за этими элементами?
// import { watch } from "vue";
//
// watch(page, (newValue, oldValue) => {
// 	if (newValue !== oldValue) {
// 		refresh();
// 		// updateTable();
// 	}
// });
//
// watch(perPageCount, (newValue, oldValue) => {
// 	if (newValue !== oldValue) {
// 		refresh();
// 		// updateTable();
// 	}
// });

const changePage = async (p) => {
	page.value = p;
	// refresh();
}

const pageUrl = computed(() => {
	return route.matched[0].path;
});

const openedImage = ref(null);

const setOpenedImage = (item = null) => {
	openedImage.value = item;
}

// Установка количества элементов на странице
const setPerPage = (count) => {
	perPageCount.value = count;
	// refresh();
}
</script>

<template>
	<div>
		<ResponseErrorsComponent :responseErrors="responseErrors" />
		<table v-if="!requestInProgress && !pending">
			<thead>
				<tr>
					<th
							v-for="(title, key) in titles"
					>
						{{ title.name }}
					</th>
					<th
							v-for="(title, key) in systemTitles"
					>
						{{ title.name }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
						v-for="item in fetchedData"
				>
					<td v-for="(titleEl, key) in titles">
						<TdElementCard
							:item="item"
							:titleEl="titleEl"
							:keyName="key"
							:pageUrl="pageUrl"
							:entities="entities"
							@deleteElement="deleteElement"
							@openImage="setOpenedImage"
						/>
					</td>
					<td v-for="(titleEl, key) in systemTitles">
						<TdElementCard
								:item="item"
								:titleEl="titleEl"
								:keyName="key"
								:pageUrl="pageUrl"
								@deleteElement="deleteElement"
								@openImage="setOpenedImage"
						/>
					</td>
				</tr>
			</tbody>
		</table>
		<div v-else class="text-center text-[32px]">
			<font-awesome-icon
					:icon="['fas', 'spinner']"
					spin-pulse
			/>
		</div>
		<Pagination
			v-if="usePagination && pagination"
			:pagination="pagination"
			:navigationButtons="true"
			@changePage="changePage"
			@setPerPage="setPerPage"
		/>
		<router-link :to="`${pageUrl}/create`"><button class="btn btn-primary">Добавить один элемент</button></router-link>
		<router-link
				v-if="hasMultiUpload"
				:to="`${pageUrl}/multi-upload`"
		>
			<button class="btn btn-primary">Добавить несколько элементов</button>
		</router-link>
		<nuxt-link
			v-for="(button, key) in additionalButtons"
			:to="button.url"
			:title="button.name"
			:key="key"
		>
			<button class="btn btn-primary">{{ button.name }}</button>
		</nuxt-link>
	</div>
	<LightBox
			v-if="openedImage"
			:image="openedImage"
			@setCurrentElement="setOpenedImage"
	/>
</template>

<style lang="scss" scoped>
table {
	@apply w-full;

	thead {
		@apply bg-gradient-to-r from-[var(--main-href-color)] to-[var(--second-href-color)];

		tr {
			th {
				@apply text-left p-[5px];
			}
		}
	}

	tbody {
		tr {
			td {
				@apply p-[5px];

				.svg-inline--fa {
					@apply mr-[5px] text-[18px];
				}
			}

			&:hover {
				@apply bg-[var(--second-bg-color)];
			}
		}
	}
}
</style>
