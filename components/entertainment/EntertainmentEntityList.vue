<script setup>
import PageHeader from '@/components/layout/PageHeader.vue';
import GameListCard from '@/components/entertainment/card/GameListCard.vue';

import { api } from '@/composables/api.js'
import { ref } from "vue";
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();

const props = defineProps({
	entity: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		default: 'Игры',
	},
	title: {
		type: String,
		default: 'Игры серии',
	},
	useGroups: {
		type: Boolean,
		default: false,
	},
});

const requestInProgress = ref(false);
const fetchedData = ref();

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}${props.entity}/list`;

			const query = {};
			const sessionCookie = useCookie(sessionCookieName.value);

			requestInProgress.value = true;

			try {
				await $fetch(
						request,
						{
							method: 'GET',
							credentials: 'include',
							query,
							headers: {
								Accept: 'application/json',
								Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
								Referer: publicUrl.value,
							},
							onResponse({response}) {
								if (response.status === 200) {
									fetchedData.value = response._data.data;

									if (process.client && !sessionStorage.getItem(`view_${fetchedData.value.entity_type}_${fetchedData.value.id}`)) {
										sessionStorage.setItem(`view_${fetchedData.value.entity_type}_${fetchedData.value.id}`, true);
									}
								} else {
									// Возарщаем 404
								}

								requestInProgress.value = false;
							}
						},
				);
			} catch (e) {
				errorHandler(e);
				requestInProgress.value = false;
			}
		}
);

const route = useRoute();

const getBreadCrumbs = () => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: props.name,
			href: `/${splitedPath[1]}/`,
		},
	];
}

const dataByGroups = computed(() => {
	let returnData = [];
	let preparedData = {};

	if (fetchedData.value) {
		fetchedData.value.forEach((item) => {
			if (!item.groups || item.groups.length === 0) {
				if (!preparedData.hasOwnProperty('emptyGroup')) {
					preparedData.emptyGroup = {
						name: 'Без группы',
						sort: 9999,
						items: [],
					};
				}

				preparedData.emptyGroup.items.push(item);
			} else {
				item.groups.forEach((it) => {
					if (!preparedData.hasOwnProperty(it.slug)) {
						preparedData[it.slug] = {
							name: it.name,
							sort: it.sort,
							items: [],
						};
					}

					preparedData[it.slug].items.push(item);
				});
			}
		});
	}

	for (let key in preparedData) {
		returnData.push(preparedData[key]);
	}

	returnData.sort(function(a, b) {
		return a.sort - b.sort;
	});

	return returnData;
});
</script>

<template>
	<div v-if="fetchedData">
		<PageHeader
				:title="title"
				:breadCrumbs="getBreadCrumbs()"
		/>
		<template v-if="useGroups">
			<div v-if="dataByGroups">
					<div class="group" v-for="(group, key) in dataByGroups">
						<span class="title">{{ group.name }}</span>
						<div class="game-list">
							<GameListCard
									v-for="(game, index) in group.items"
									:key="key"
									:game="game"
									:entity="entity"
							/>
						</div>
					</div>
			</div>
		</template>
		<template v-else>
			<div class="game-list">
				<GameListCard
						v-for="(game, index) in fetchedData"
						:key="key"
						:game="game"
						:entity="entity"
				/>
			</div>
		</template>
	</div>
</template>

<style scoped lang="scss">
.group {
	@apply mb-10;
}

.game-list {
	@apply grid grid-cols-12 gap-x-[1rem] gap-y-[1rem];
}
</style>
