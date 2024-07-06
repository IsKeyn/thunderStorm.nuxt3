<script setup>
import { watch } from "vue";

import OpeningBox from '@/components/ui/OpeningBox.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

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
				// {
				// 	name: 'Наиболее понравившиеся',
				// 	value: {
				// 		field: 'likes',
				// 		sort: 'desc',
				// 	},
				// },
				// {
				// 	name: 'Наименее понравившиеся',
				// 	value: {
				// 		field: 'likes',
				// 		sort: 'asc',
				// 	},
				// },
				// {
				// 	name: 'Наиболее просматриваемые',
				// 	value: {
				// 		field: 'views',
				// 		sort: 'desc',
				// 	},
				// },
				// {
				// 	name: 'Наименее просматриваемые',
				// 	value: {
				// 		field: 'views',
				// 		sort: 'asc',
				// 	},
				// },
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
	<OpeningBox title="Фильтры">
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
	</OpeningBox>
</template>

<style lang="scss" scoped>
.content {
	@apply grid grid-cols-12;
}
</style>
