<script setup>
// Компоненты
import CommentCard from '@/components/comments/CommentCard.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

import { computed, watch } from "vue";
const emit = defineEmits(['fetchComments']);

// Сomposables
import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();

// Куки
const Authorization = useCookie('Authorization');

// Свойства
const props = defineProps({
	entityType: {
		type: String,
		required: true,
	},
	entityId: {
		type: Number,
		required: true,
	},
	perPage: {
		type: Number,
		default: 10,
	},
	showAnswer: {
		type: Boolean,
		default: false,
	},
});

const route = useRoute();
const router = useRouter();

const commentResult = ref([]);

const page = ref(1);
const perPageCount = ref(props.perPage);

const typeAddedData = ref('');

const fetchComments = () => {
	page.value = 1;
	typeAddedData.value = 'update';
	refresh();
}

// Передача функции родительскому компоненту, с добступом через ref
defineExpose({
	fetchComments,
});

const requestName =  'commentGetList_' + props.entityType + '_' + props.entityId;

const { data: requestData, pending: requestInProgress, refresh } = await useAsyncData(
		requestName,
		async () => {
			let request = `${apiUrl.value}comment/getList`;

			const query = {
				entityType: props.entityType,
				entityId: props.entityId,
				perPage: props.perPageCount,
				page: page.value,
			};

			const sessionCookie = useCookie(sessionCookieName.value);

			try {
				const response = await $fetch(
						request,
						{
							method: 'GET',
							credentials: 'include',
							query,
							headers: {
								Accept: 'application/json',
								Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
								Referer: publicUrl.value,
							}
						},
				);

				return response;
			} catch (e) {
				errorHandler(e);
			}
		},
		{
			server: true, // выполнять только на сервере
			lazy: true, // ждать выполнения запроса перед рендерингом
		}
);

const fetchedData = computed(() =>  requestData?.value?.data || null);
const paginationData = computed(() => requestData.value?.meta || null);

watch(() => fetchedData.value, (newData) => {
	if (typeAddedData.value === 'show_more') {
		commentResult.value = commentResult.value.concat(newData);
	} else {
		commentResult.value = newData;
	}
}, { deep: true, immediate: true });

const getNextPage = async () => {
	if (paginationData.value.current_page < paginationData.value.last_page) {
		typeAddedData.value = 'show_more';
		page.value += 1;
		await refresh();
	}
}
</script>

<template>
	<CommentCard
			v-for="comment in commentResult"
			:key="comment.id"
			:comment="comment"
			:entityType="entityType"
			:entityId="entityId"
			:firstParent="comment.id"
			:showAnswer="showAnswer"
			@fetchComments="fetchComments"
	/>

	<div
			v-if="paginationData && paginationData.current_page < paginationData.last_page"
			class="text-center"
	>
		<ActionButton
				buttonName="Показать ещё"
				:actionInProgress="requestInProgress"
				@startAction="getNextPage"
		/>
	</div>
</template>
