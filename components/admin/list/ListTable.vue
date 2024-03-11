<script setup>
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

import { api } from '@/composables/api.js'
const { apiUrl, backendUrl } = api();

const fetchedData = ref(null);

const Authorization = useCookie('Authorization');

const route = useRoute();

await useFetch(
		`${apiUrl.value}${props.fetchUrl}`,
		{
			method: 'GET',
			headers: {
				Authorization: Authorization.value,
				Accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
			},
			onResponse({response}) {
				if (response.status === 200) {
					fetchedData.value = props.hasResource ? response._data.data : response._data;
				}
			},
		},
);

import { notifications } from '@/composables/notifications.js';
const { alert, choiceAlert } = notifications();

const deleteElement = (item) => {
	choiceAlert(
			{
				title: 'Удаление',
				message: `Удалить элемент "${item[props.titleKey]}"?`,
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
		await $fetch(
				`${backendUrl.value}/sanctum/csrf-cookie`,
				{
					withCredentials: true,
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
					},
				},
		);

		const XsrfToken = useCookie('XSRF-TOKEN');

		const response = await $fetch(
				`${apiUrl.value}${props.fetchUrl}/${id}`,
				{
					method: 'DELETE',
					credentials: 'include',
					headers: {
						Authorization: Authorization.value,
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
						'X-XSRF-TOKEN': XsrfToken.value,
					},
				}
		);

		if (response) {
			// TODO попробовать вызывать useFetch
			await $fetch(
					`${apiUrl.value}${props.fetchUrl}`,
					{
						method: 'GET',
						headers: {
							Authorization: Authorization.value,
							Accept: 'application/json',
							'X-Requested-With': 'XMLHttpRequest',
						},
						onResponse({response}) {
							if (response.status === 200) {
								fetchedData.value = props.hasResource ? response._data.data : response._data;
							}
						},
					},
			);

			alert('Успешно удалено');
		}

		requestInProgress.value = false;
	} catch (e) {
		responseErrors.value = errorHandler(e);
		requestInProgress.value = false;
	}
}

const pageUrl = computed(() => {
	return route.matched[0].path;
});

import TdElementCard from '@/components/admin/list/TdElementCard.vue';
</script>

<template>
	<div>
		<ResponseErrorsComponent :responseErrors="responseErrors" />
		<table v-if="!requestInProgress">
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
							@deleteElement="deleteElement"
						/>
					</td>
					<td v-for="(titleEl, key) in systemTitles">
						<TdElementCard
								:item="item"
								:titleEl="titleEl"
								:keyName="key"
								:pageUrl="pageUrl"
								@deleteElement="deleteElement"
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
		<router-link :to="`${pageUrl}/create`"><button>Добавить</button></router-link>
	</div>
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
		}
	}
}
</style>
