<script setup>
// Компоненты
import CommentCard from '@/components/comments/CommentCard.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

const emit = defineEmits(['fetchComments']);

// Сomposables
import { api } from '@/composables/api.js'
import { watch } from "vue";
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

const fetchedData = ref([]);
const pagination = ref(null);

const page = ref(1);
const perPageCount = ref(props.perPage);

const typeAddedData = ref('show_more');

const fetchComments = () => {
	page.value = 1;
	typeAddedData.value = 'update';
	refresh();
}

// Передача функции родительскому компоненту, с добступом через ref
defineExpose({
	fetchComments,
});

const { data: requestData, pending: requestInProgress, refresh } = await useAsyncData(
		'commentGetList',
		async () => {
			let request = `${apiUrl.value}comment/getList`;

			const query = {
				entityType: props.entityType,
				entityId: props.entityId,
				perPage: props.perPageCount,
				page,
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

const setFetchedData = () => {
	if (requestData && requestData.value) {
		fetchedData.value = typeAddedData.value === 'show_more' ? fetchedData.value.concat(requestData.value.data) : requestData.value.data;
		pagination.value = requestData.value.meta;
	}
}

setFetchedData();

watch(() => requestData.value, () => {
	setFetchedData();
}, { deep: true });

const getNextPage = async () => {
	if (pagination.value.current_page < pagination.value.last_page) {
		typeAddedData.value = 'show_more';
		page.value += 1;
		await refresh();
	}
}
</script>

<template>
	<CommentCard
			v-for="comment in fetchedData"
			:key="comment.id"
			:comment="comment"
			:entityType="entityType"
			:entityId="entityId"
			:firstParent="comment.id"
			:showAnswer="showAnswer"
			@fetchComments="fetchComments"
	/>

	<div
			v-if="pagination && pagination.current_page < pagination.last_page"
			class="text-center"
	>
		<ActionButton
				buttonName="Показать ещё"
				:actionInProgress="pending"
				@startAction="getNextPage"
		/>
	</div>
</template>
