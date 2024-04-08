<script setup>
import { watch } from "vue";

import FormGenerator from '@/components/forms/FormGenerator.vue';

const contentStatus = ref(false);

const toggleContent = (newStatus) => {
	if (newStatus === undefined || newStatus === null) {
		contentStatus.value = !contentStatus.value;
	} else {
		contentStatus.value = newStatus;
	}
}

const emit = defineEmits(['setNewFilters']);

const filters = ref({
	tags: [],
	sort: null,
});

watch(filters, () => {
	emit('setNewFilters', filters)
}, { deep: true });

const sort = ref([
		{
			name: '',
			value: {
				field: 'created_at',
				sort: 'desc',
			},
			type: 'select',
			// defaultOption: {
			// 	name: 'Выберите значение',
			// 	value: null,
			// },
			options: [
				{
					name: 'Сначала новые',
					value: {
						field: 'created_at',
						sort: 'desc',
					},
				},
				{
					name: 'Сначала старые',
					value: {
						field: 'created_at',
						sort: 'asc',
					},
				},
				{
					name: 'По названию',
					value: {
						field: 'name',
						sort: 'asc',
					},
				}
			],
			validateRules: 'required',
			classes: ['w-full', 'mt-[5px]'],
		}
]);

watch(sort.value, (newValue) => {
	const rawValue = toRaw(newValue)[0].value;

	filters.value.sort = {
		field: rawValue.field,
		sort: rawValue.sort,
	};
});
</script>

<template>
	<div class="opening-box">
		<div
				class="header"
				@click="toggleContent(null)"
		>
			Фильтры

			<div class="icon-box">
				<font-awesome-icon v-if="contentStatus" :icon="['fas', 'angle-up']" />
				<font-awesome-icon v-else :icon="['fas', 'angle-down']" />
			</div>
		</div>
		<div
				v-show="contentStatus"
				class="content"
		>
			<TagsList
					class="col-span-8"
					:canAddTags="false"
					type="media"
					v-model="filters.tags"
			/>

			<div class="col-span-2"></div>
			<div class="col-span-2 text-right">
				<FormGenerator
						v-for="(field, index) in sort"
						:key="index"
						:name="index"
						:element="field"
						:showValidateError=true
						validateErrorPosition="bottom"
						:labelClasses="['inline-block', 'mb-[10px]', 'mr-2']"
						:fieldClasses="field.classes"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.content {
	@apply grid grid-cols-12;
}
</style>
