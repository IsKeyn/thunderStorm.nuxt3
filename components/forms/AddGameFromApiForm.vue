<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';
import BigPreloader from '@/components/ui/BigPreloader.vue';

import { ref } from "vue";

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js'
const { sendApiRequest, publicUrl } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const form = ref(
		{
			searchLine: {
				name: 'Поиск',
				value: '',
				type: 'text',
				placeholder: 'Введите название игры поиска',
				validateRules: null,
				classes: 'w-full',
			},
		},
);

const requestInProgress = ref(false);
const fetchedData = ref({});

const searchGame = async (offset = 0) => {
	if (!form.value.searchLine.value) {
		alert('Для поиска необходимо ввести название игры');
	}

	requestInProgress.value = true;

	const query = {};

	query.apiName = 'speedrun.com';
	query.search = form.value.searchLine.value;
	query.offset = offset;

	try {
		const response = await sendApiRequest('admin/api/games/search', 'GET', query, 'searchGameFromApi', '');

		if (response) {
			if (response.error) {
				error(response.error);
			} else {
				requestInProgress.value = false;
				fetchedData.value = response;
			}
		} else {
			error('Пустой ответ');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
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
				error(response.error);
			} else {
				requestInProgress.value = false;

				console.log('response', response);
			}
		} else {
			error('Пустой ответ');
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
<!--		<BigPreloader v-if="requestInProgress" />-->
		<div v-if="Object.keys(fetchedData).length > 0">
			<div v-if="fetchedData.list && fetchedData.list.length > 0">
				<div
						class="search-item"
						v-for="(data, key) in fetchedData.list"
				>
					<span class="w-full">{{ data.name }} ({{ data.date }})</span>
					<button
							class="btn btn-simple flex-end"
							@click="addGame(data.id)"
					>
						Добавить
					</button>
				</div>
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
		<span v-else>
			Ничего не найдено
		</span>
	</div>
</template>

<style lang="scss" scoped>
.search-item {
	@apply flex justify-center items-center w-full;

	&:hover {
		@apply bg-[var(--second-bg-color)];
	}
}
</style>
