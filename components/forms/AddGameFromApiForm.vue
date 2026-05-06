<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';
import ApiGameCard from '@/components/forms/fragments/ApiGameCard.vue';

import { computed, ref } from "vue";

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { helper } from '@/composables/helper.js'
const { setQueryParams, route } = helper();

const form = ref(
		{
			searchLine: {
				name: 'Поиск',
				value: route.query.search ?? '',
				type: 'text',
				placeholder: 'Введите название игры поиска',
				validateRules: null,
				classes: 'w-full',
			},
		},
);

const requestName = 'searchGameFromApi';
let offset = route.query.offset ?? 0;

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {
				apiName: 'speedrun.com',
				search: form.value.searchLine.value,
				offset: offset,
			};

			const response = await Promise.resolve(
					sendApiRequest(
							'admin/api/games/search',
							'GET',
							query,
							requestName,
					)
			);

			if (hideContent) hideContent = !hideContent;

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);
const paginationData = computed(() => requestData.value?.meta || null);

let hideContent = false;

const searchGame = (value = 0) => {
	offset = value;

	const queryParams = [];

	queryParams.push({
		key: 'offset',
		value: offset,
	});

	queryParams.push({
		key: 'search',
		value: form.value.searchLine.value,
	});

	setQueryParams(queryParams);
	hideContent = true;
	refresh();
}

const addGame = async (id) => {
	if (!id) {
		error('Не получен ID для добавления игры');
	}

	requestInProgress.value = true;

	const query = {};

	query.apiName = 'speedrun.com';
	query.id = id;

	try {
		const response = await sendApiRequest('admin/api/games/add', 'POST', query, 'addGameFromApi', '');

		if (response) {
			if (response.error) {
				requestInProgress.value = false;
				error(response.error);
			} else {
				requestInProgress.value = false;

				alert(`Игра ${response.name} успешно добавлена`);
			}
		} else {
			error('Пустой ответ');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

const checkGame  = async (id) => {
	if (!id) {
		error('Не получен ID для проверки игры');
	}

	requestInProgress.value = true;

	const query = {};

	query.apiName = 'speedrun.com';
	query.id = id;

	try {
		const response = await sendApiRequest('admin/api/games/check', 'POST', query, 'checkGameFromApi', '');

		if (response) {
			if (response.error) {
				error(response.error);
			} else {
				requestInProgress.value = false;

				error('Игра заведена в базе данных сайта', null, '#004d42');
			}
		} else {
			requestInProgress.value = false;
			error('Игра НЕ заведена в базе данных сайта');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div>
		<form
				class="flex"
				@submit.prevent="submitHandler"
		>
			<FormGenerator
					v-if="form.searchLine"
					name="searchLine"
					class="w-full"
					:element="form.searchLine"
					:showTitle="false"
					:clearButton="true"
					validateErrorPosition="bottom"
					labelClasses="mr-4 mt-[10px] mb-[10px]"
					:fieldClasses="form.searchLine.classes"
			/>
			<ActionButton
					buttonClasses="btn btn-simple"
					buttonName="Искать"
					:actionInProgress="requestInProgress"
					@startAction="searchGame()"
			/>
		</form>
		<ui-itemBox
				message="Помните, что Speedrun.com ограничевает количество запросов в минут 100 запросами"
				classes="green"
		/>
		<div class="relative">
			<ui-BigPreloader
					v-if="requestInProgress"
					class="absolute w-full h-full bg-black/70"
					theme="image"
					:themeType="9"
			/>
			<div v-if="fetchedData && Object.keys(fetchedData).length">
				<div v-if="!hideContent && fetchedData.list && fetchedData.list.length">
					<ApiGameCard
							v-for="(data, key) in fetchedData.list"
							:key="key"
							:element="data"
							@addGame="addGame($event)"
							@checkGame="checkGame($event)"
					/>
				</div>
				<template
						v-if="fetchedData?.pagination?.links"
						v-for="(value, key) in fetchedData.pagination.links"
				>
					<button
							v-if="value?.rel === 'prev'"
							class="btn btn-simple mr-2"
							@click="searchGame(fetchedData.pagination.offset - fetchedData.pagination.size)"
					>
						Предыдущая страница
					</button>
					<button
							v-if="value?.rel === 'next'"
							class="btn btn-simple"
							@click="searchGame(fetchedData.pagination.offset + fetchedData.pagination.size)"
					>
						Сдедующая страница
					</button>
				</template>
			</div>
			<ui-itemBox
					v-else-if="!requestInProgress"
					classes="red"
			/>
		</div>
	</div>
</template>
