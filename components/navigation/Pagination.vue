<script setup>
const props = defineProps({
	pagination: {
		type: Object,
		required: true,
	},
	table: {
		type: String,
		default: '',
	},
	additionalPage: {
		type: Number,
		default: 2,
	},
	type: { // Типы allPage, firstAndLast
		type: String,
		default: 'firstAndLast',
	},
	navigationButtons: {
		type: Boolean,
		default: false,
	},
	firstAndLastPage: {
		type: Boolean,
		default: false,
	},
	showSeparator: {
		type: Boolean,
		default: false,
	},
	perPageOptionsProp: {
		type: Array,
		default: () => [
			{
				count: 10,
				active: false,
			},
			{
				count: 25,
				active: false,
			},
			{
				count: 50,
				active: false,
			},
		],
	}
});

const perPageOptionsComp = computed(() => {
	let returnData = [];

	props.perPageOptionsProp.forEach((item) => {
		returnData.push({
			count: item.count,
			active: item.count === Number(props.pagination.per_page),
		});
	});

	return returnData;
});

const emit = defineEmits(['changePage', 'setPerPage']);

const paginationObj = computed(() => {
	let pagination = {};

	switch (props.type) {
		case 'firstAndLast':
			for (var i = props.pagination.current_page - props.additionalPage; i <= props.pagination.current_page + props.additionalPage; i++) {
				if (i > 0 && i <= props.pagination.last_page) {
					pagination[i] = i;
				}
			}
			break;
		case 'allPage':
			for (var i = 1; i <= props.pagination.last_page; i++) {
				pagination[i] = i;
			}
			break;
	}

	return pagination;
});

const router = useRouter();
const route = useRoute();

const changePage = (page) => {
	if (props.pagination.current_page !== page) {

		if (props.table) {
			const getParam = `${props.table}_page`;

			const query = {
				...route.query,
			};

			query[getParam] = page;

			router.push({
				name: route.name,
				query,
			});

			emit('changePage', page, props.table);
		} else {
			router.push({
				name: route.name,
				query: {
					...route.query,
					page: page,
				},
			});

			emit('changePage', page);
		}
	}
}

const changePagination = (perPage) => {
	if (props.pagination.per_page !== perPage) {
		if (props.table) {
			const getParam = `${props.table}_perPage`;

			const query = {
				...route.query,
			};

			query[getParam] = perPage;

			router.push({
				name: route.name,
				query,
			});

			emit('setPerPage', perPage,  props.table);
		} else {
			router.push({
				name: route.name,
				query: {
					...route.query,
					perPage: perPage,
				},
			});

			emit('setPerPage', perPage);
		}
	}
}

const getClass = (page) => {
	if (page === props.pagination.current_page) {
		return 'current';
	}
}

const changePageDirection = (direction) => {
	if (direction === 'next') {
		changePage(props.pagination.current_page + 1);
	} else if (direction === 'prev') {
		changePage(props.pagination.current_page - 1);
	}
}
// TODO Записывать в get параметр текущую страницу с учётом сущности пагинации и преодер и количество элеметов на странице
</script>

<template>
	<div class="pagination-block">
		<div class="pagination-col"></div>
		<div class="pagination-col page-buttons">
			<template v-if="type === 'firstAndLast'">
				<template v-if="pagination.current_page !== 1 && additionalPage + 1 < pagination.last_page
				">
					<div
							v-if="
								pagination.current_page > additionalPage + 1
								&& (navigationButtons || firstAndLastPage)
							"
							class="pagination-button"
							@click="changePage(1)"
					>
						<font-awesome-icon v-if="navigationButtons" :icon="['fas', 'angles-left']" />
						<span v-if="firstAndLastPage">1</span>
					</div>

					<font-awesome-icon
							v-if="pagination.current_page > additionalPage + 1 && showSeparator"
							:icon="['fas', 'ellipsis']"
							class="separator"
					/>

					<div v-if="navigationButtons" class="pagination-button" @click="changePageDirection('prev')">
						<font-awesome-icon :icon="['fas', 'angle-left']" />
					</div>
				</template>

				<template v-if="Object.keys(paginationObj).length > 1">
					<div
							v-for="(page, index) in paginationObj"
							:key="index"
							class="pagination-button"
							:class="getClass(page)"
							@click="changePage(page)"
					>
						{{ page }}
					</div>
				</template>

				<template v-if="
					pagination.current_page !== pagination.last_page
					&& additionalPage + 1 < pagination.last_page
					&& (navigationButtons || firstAndLastPage)
				">
					<div v-if="navigationButtons" class="pagination-button" @click="changePageDirection('next')">
						<font-awesome-icon :icon="['fas', 'angle-right']" />
					</div>

					<font-awesome-icon
							v-if="pagination.current_page + additionalPage < pagination.last_page && showSeparator"
							:icon="['fas', 'ellipsis']"
							class="separator"
					/>

					<div
							v-if="pagination.current_page + additionalPage < pagination.last_page"
							class="pagination-button"
							@click="changePage(pagination.last_page)"
					>
						<font-awesome-icon v-if="navigationButtons" :icon="['fas', 'angles-right']" />
						<span v-if="firstAndLastPage">{{ pagination.last_page }}</span>
					</div>
				</template>
			</template>

			<!--	Первая страница	-->
			<template v-if="type === 'allPage'">
				<template v-if="Object.keys(paginationObj).length > 1">
					<div
							v-for="(page, index) in paginationObj"
							:key="index"
							class="pagination-button"
							:class="getClass(page)"
							@click="changePage(page)"
					>
						{{ page }}
					</div>
				</template>
			</template>
		</div>
		<div
				v-if="Number(pagination.total) > Number(perPageOptionsProp[0].count)"
				class="pagination-col per-page"
		>
			На странице
			<div
				v-for="(perPage) in perPageOptionsComp"
				class="pagination-button"
				:class="perPage.active ? 'current' : ''"
				@click="changePagination(perPage.count)"
			>
				{{ perPage.count }}
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.pagination-block {
	@apply mb-[var(--main-padding)] mt-[var(--main-padding)] grid grid-cols-12;

	.pagination-col {
		@apply col-span-4;

		&.page-buttons {
			@apply text-center;
		}

		&.per-page {
			@apply text-right;
		}
	}

	.pagination-button {
		@apply
			inline-block
			mt-0 mr-[2px] mb-0 ml-[2px]
			text-center
			min-w-[30px] min-h-[30px]
			text-[20px] leading-[26px]
			p-[0.2rem]
		;

		border: 2px solid var(--main-border-color);

		&:not(.current) {
			@apply cursor-pointer;
		}

		&.current {
			@apply cursor-not-allowed bg-[var(--second-block-color)];
		}

		&:hover {
			@apply bg-[var(--second-block-color)];
		}
	}

	svg.separator {
		@apply mr-[5px] ml-[5px] text-[16px];
	}
}
</style>
