<script setup>
// Компоненты
import CommentCard from '@/components/comments/CommentCard.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

// Сomposables
import { api } from '@/composables/api.js'
const { apiUrl } = api();

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

const { pending, refresh } = await useFetch(
		`${apiUrl.value}comment/getList`,
		{
			query: {
				entityType: props.entityType,
				entityId: props.entityId,
				perPage: props.perPageCount,
				page,
			},
			headers: {
				Authorization: Authorization.value,
				Accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
			},
			onResponse({response}) {
				if (response.status === 200) {
					fetchedData.value = typeAddedData.value === 'show_more' ? fetchedData.value.concat(response._data.data) : response._data.data;
					pagination.value = response._data.meta;
				}
			},
		}
);

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
