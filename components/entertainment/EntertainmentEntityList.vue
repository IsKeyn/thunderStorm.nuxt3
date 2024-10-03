<script setup>
import PageHeader from '@/components/layout/PageHeader.vue';

import { api } from '@/composables/api.js'
import { ref } from "vue";
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();

import { date } from '@/composables/date.js';
const {
	getFormattedDate
} = date();

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
							<div
									class="game-card"
									v-for="(game, index) in group.items"
							>
								<div class="image">
									<img v-if="game?.covers[0]?.src" :src="game?.covers[0]?.src">
									<div class="info-box">
										<router-link
												v-if="game.slug"
												class="full-block"
												:to="`/${entity}/${game.slug}`"
										/>
										<div>
											<span class="name">{{ game.name }}</span>
											<span class="description">{{ game.description }}</span>
										</div>
									</div>
								</div>
								<div class="description-block">
									<span class="title">{{ game.name }}</span>
									<span class="description">{{ game?.release_dates[0]?.date ? getFormattedDate('Y', game.release_dates[0].date) : '' }} {{ game?.genres[0]?.name ? game.genres[0].name : '' }}</span>
								</div>
							</div>
						</div>
					</div>
			</div>
		</template>
		<template v-else>
			<div class="game-list">
				<div
						class="game-card"
						v-for="(game, index) in fetchedData"
				>
					<div class="image">
						<img v-if="game?.covers[0]?.src" :src="game?.covers[0]?.src">
						<div class="info-box">
							<router-link
									v-if="game.slug"
									class="full-block"
									:to="`/${entity}/${game.slug}`"
							/>
							<div>
								<span class="name">{{ game.name }}</span>
								<span class="description">{{ game.description }}</span>
							</div>
						</div>
					</div>
					<div class="description-block">
						<span class="title">{{ game.name }}</span>
						<span class="description">{{ game?.release_dates[0]?.date ? getFormattedDate('Y', game.release_dates[0].date) : '' }} {{ game?.genres[0]?.name ? game.genres[0].name : '' }}</span>
					</div>
				</div>
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

	.game-card {
		@apply col-span-6 md:col-span-2 relative;

		.description-block {
			.title {
				@apply text-[0.8rem];

				line-height: 18px;
				color: var(--main-color);
				font-weight: 400;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
			}

			.description {
				@apply text-[0.8rem];

				color: var(--main-dark-text-color);
			}
		}

		&:hover {
			.info-box {
				@apply flex;
			}
		}

		.image {
			@apply h-[20rem] flex items-center relative;

			margin-bottom: 1rem;
			transition-duration: .4s;

			&:hover {
				transform: scale(1.04) translateY(0);
			}
		}

		.info-box {
			@apply
				absolute bottom-[0] left-[0]
				w-full h-full
				hidden
				p-[1rem] cursor-pointer
				items-center
			;

			background: rgba(0, 0, 0, 0.7);

			a.full-block {
				@apply absolute w-full h-full;
			}

			span {
				@apply block;

				&.name {
					@apply text-center;

					font-size: 1.1rem;
				}

				&.description {
					@apply
						pt-[0.5rem]
						overflow-hidden
						text-center
					;

					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;

					line-height: 1.3em;
					height: calc(3.9em + 0.5rem);
				}
			}
		}
	}
}
</style>
