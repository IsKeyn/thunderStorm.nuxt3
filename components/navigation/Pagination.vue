<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue'

const emit = defineEmits(['changePage', 'setPerPage']);
import { watch } from "vue";

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

import { animate } from '@/composables/animate.js';
const { scrollToElement } = animate();

const props = defineProps({
	pagination: {
		type: Object,
		required: true,
	},
	table: {
		type: String,
		default: '',
	},
	additionalPage: { // Количество страниц, чьи номера отображаются, например если значение 2, то будут отображаться 1,2,3
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
		default: () => [10, 25, 50],
	},
	setQueryParams: {
		type: Boolean,
		default: true,
	},
	blockSelectorForScroll: {
		type: String,
		default: null,
	}
});

const perPageOptionsComp = computed(() => {
	let returnData = [];

	props.perPageOptionsProp.forEach((count) => {
		returnData.push({
			count: count,
			active: count === Number(props.pagination.per_page),
		});
	});

	return returnData;
});

const paginationObj = computed(() => {
	let pagination = {};

	switch (props.type) {
		case 'firstAndLast':
			for (let i = props.pagination.current_page - props.additionalPage; i <= props.pagination.current_page + props.additionalPage; i++) {
				if (i > 0 && i <= props.pagination.last_page) {
					pagination[i] = i;
				}
			}
			break;
		case 'allPage':
			for (let i = 1; i <= props.pagination.last_page; i++) {
				pagination[i] = i;
			}
			break;
	}

	return pagination;
});

const changePage = (page) => {
	if (props.pagination.current_page !== page) {
		if (props.table) {
			if (props.setQueryParams) {
				const getParam = `${props.table}_page`;

				const query = {
					...route.query,
				};

				query[getParam] = page;

				router.push({
					name: route.name,
					query,
				});
			}

			props.pagination.current_page = page;
			emit('changePage', page, props.table);
		} else {
			if (props.setQueryParams) {
				router.push({
					name: route.name,
					query: {
						...route.query,
						page: page,
					},
				});
			}

			props.pagination.current_page = page;
			emit('changePage', page);
		}

		if (props.blockSelectorForScroll) {
			scrollToElement(props.blockSelectorForScroll);
		}
	}
}

const changePagination = (perPage) => {
	if (props.pagination.per_page !== perPage) {
		const lastPageWithNewPerPage = Math.round(props.pagination.total /  perPage);

		if (props.pagination.current_page > lastPageWithNewPerPage) {
			changePage(lastPageWithNewPerPage);
		}

		if (props.table) {
			if (props.setQueryParams) {
				const getParam = `${props.table}_perPage`;

				const query = {
					...route.query,
				};

				query[getParam] = perPage;

				router.push({
					name: route.name,
					query,
				});
			}

			props.pagination.per_page = perPage;
			emit('setPerPage', perPage,  props.table);
		} else {
			if (props.setQueryParams) {
				router.push({
					name: route.name,
					query: {
						...route.query,
						perPage: perPage,
					},
				});
			}

			props.pagination.per_page = perPage;
			emit('setPerPage', perPage);
		}
	}
}

const setQueryPage = (page) => {
	if (props.table) {
		const getParam = `${props.table}_perPage`;

		if (route.query[getParam] && route.query[getParam] !== page) {
			const query = {
				...route.query,
			};

			query[getParam] = page;

			router.push({
				name: route.name,
				query,
			});
		}
	} else {
		if (route.query?.page && route.query.page !== page) {
			router.push({
				name: route.name,
				query: {
					...route.query,
					page: page,
				},
			});
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

/* Выбор страницы */
const showChoiceModal = ref(false);

const choicePageModalToggle = () => {
	showChoiceModal.value = !showChoiceModal.value;
}

const form = ref({});

form.value.page = {
	name: 'Номер страницы',
	value: null,
	type: 'number',
	placeholder: 'Число',
	validateRules: 'minNumber_0, maxNumber_' + props.pagination.last_page,
	classes: 'w-[6rem]',
	min: 1,
	max: props.pagination.last_page,
};

const choicePageErrors = ref([]);

const setPage = () => {
	choicePageErrors.value = [];

	if (form.value.page.value < 1) {
		choicePageErrors.value.push('Минимальный номер страницы равен 1');
		return false;
	}

	if (form.value.page.value > props.pagination.last_page) {
		choicePageErrors.value.push('Максимальный номер страницы не может быть больше ' + props.pagination.last_page);
		return false;
	}

	choicePageModalToggle();
	changePage(form.value.page.value);
}

watch(() => props.pagination, () => {
	if (props.setQueryParams) {
		setQueryPage(props.pagination.current_page);
	}
}, { deep: true });
</script>

<template>
	<div class="pagination-block">
		<div class="pagination-col" />
		<div class="pagination-col page-buttons">
			<template v-if="type === 'firstAndLast'">
				<template v-if="pagination.current_page !== 1 && additionalPage + 1 < pagination.last_page">
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
				<div
						v-if="pagination.last_page > 3"
						class="pagination-button"
						@click="choicePageModalToggle()"
				>
					<font-awesome-icon icon="fa-solid fa-marker" />
				</div>
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
				v-if="Number(pagination.total) > Number(perPageOptionsProp[0])"
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

	<modals-Modal
			:showOpenModal="showChoiceModal"
			size="small"
			modalId="choice-page-pagination-modal"
			@toggleModal="choicePageModalToggle"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Выбор страницы</h3>
			<div>
				Введите номер страницы от 1 до {{ pagination.last_page }} и нажмите кнопку "Перейти"

				<ui-messages-Errors
					:errors="choicePageErrors"
				/>

				<form @submit.prevent="setPage" class="flex">
					<FormGenerator
							name="page"
							:element="form.page"
							:showTitle="false"
							validateErrorPosition="bottom"
							labelClasses="lg:mr-4 mt-[10px] mb-[10px] block"
							:fieldClasses="form.page.classes"
					/>
					<ActionButton
							buttonName="Перейти"
							:actionInProgress="requestInProgress"
					/>
				</form>
			</div>
		</div>
	</modals-Modal>
</template>

<style lang="scss" scoped>
.pagination-block {
	@apply mb-[var(--main-padding)] mt-[var(--main-padding)] grid grid-cols-12;

	.pagination-col {
		@apply col-span-12 lg:col-span-4;

		&.page-buttons {
			@apply text-center mb-4 lg:mb-0;
		}

		&.per-page {
			@apply text-center lg:text-right;
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
			border-2
			border-[var(--main-border-color)]
		;

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
