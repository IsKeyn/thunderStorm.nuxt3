<script setup>
import ArticleCard from '@/components/articles/ArticleCard.vue';

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
	getCsrfCookie,
} = api();

const props = defineProps({
	blockStructure: {
		type: Object,
		default: null,
	},
	/* index блока в массиве, который находится в store */
	blockIndex: {
		type: Number,
		default: null,
	},
	/* режим редактирования */
	previewMode: {
		type: Boolean,
		default: false,
	},
});

const responseErrors = ref({});
const requestInProgress = ref(false);

const articles = ref({});

const { refresh } = await useAsyncData(
		async () => {
			responseErrors.value = {};
			requestInProgress.value = true;

			const sessionCookie = useCookie(sessionCookieName.value);

			if (props.blockStructure.fields.entity_type) {
				try {
					const csrfCookie = await getCsrfCookie();

					const body = {
						perPage: props.blockStructure.fields.perPage,
						filter: {
							entity_type: props.blockStructure.fields.entity_type,
							entity_id: props.blockStructure.fields.entity_id,
							type: props.blockStructure.fields.type,
						},
					};

					let request = '';
					let opts = {};
					let method = 'POST';

					request = `${apiUrl.value}article/get`;
					opts = {
						method,
						credentials: 'include',
						headers: {
							Accept: 'application/json',
							'X-XSRF-TOKEN': csrfCookie.value,
						},
						body,
					};

					const response = await $fetch(request, opts);

					if (response) {
						requestInProgress.value = false;

						articles.value = response.data;
					}
				} catch (e) {
					const errorsPromise = errorHandler(e);

					errorsPromise.then((element) => {
						responseErrors.value = element;
					});
					requestInProgress.value = false;
				}
			}
		}
);

// TODO добавить кнопку показать ещё
</script>

<template>
	<div :class="[
			'elements-list',
			blockStructure.settings.classes.value
	]">
		<input
				v-if="!previewMode"
				v-model="blockStructure.fields.entity_type"
				class="block"
				@input="refresh"
				placeholder="Сущность"
		>
		<input
				v-if="!previewMode"
				v-model="blockStructure.fields.entity_id"
				class="block"
				@input="refresh"
				placeholder="id сущности"
		>
		<input
				v-if="!previewMode"
				v-model="blockStructure.fields.type"
				class="block"
				@input="refresh"
				placeholder="Тип"
		>
		<input
				v-if="!previewMode"
				v-model="blockStructure.fields.perPage"
				class="block"
				@input="refresh"
				placeholder="Количество элементов"
		>

		<ArticleCard
				v-for="cardData in articles"
				:cardData="cardData"
				:showTags="false"
				:showFooter="false"
				:simpleImage="true"
		/>
	</div>
</template>
