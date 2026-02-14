<script setup>
import ListDataItems from '@/components/ui/listData/ListDataItems.vue';
import Slider from '@/components/sliders/vueSlider/Slider.vue';

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<div class="main-info">
		<div class="left-box">
			<span class="field" v-if="item.name"><span class="strong">Название:</span> {{ item.name }}</span>
			<ListDataItems
					v-if="props?.item?.genres"
					:items="props.item.genres"
					:names="{ single: 'Жанр: ', many: 'Жанры: ' }"
					:showMoreNames="{ showMore: 'Все жанры ', showLess: 'Скрыть ' }"
					cardType="Simple"
					class="field"
			/>
			<ListDataItems
					v-if="props?.item?.platforms"
					:items="props.item.platforms"
					:names="{ single: 'Платформа: ', many: 'Платформы: ' }"
					:showMoreNames="{ showMore: 'Все платформы ', showLess: 'Скрыть ' }"
					cardType="Simple"
					class="field"
			/>
			<ListDataItems
					v-if="props?.item?.companies"
					:items="props.item.companies"
					:names="{ single: 'Компания: ', many: 'Компании: ' }"
					:showMoreNames="{ showMore: 'Все компании ', showLess: 'Скрыть ' }"
					cardType="Company"
					class="field"
			/>
			<ListDataItems
					v-if="props?.item?.anons_dates"
					:items="props.item.anons_dates"
					:names="{ single: 'Дата анонса: ', many: 'Даты анонса: ' }"
					:showMoreNames="{ showMore: 'Все даты ', showLess: 'Скрыть ' }"
					cardType="Date"
					class="field"
			/>
			<ListDataItems
					v-if="props?.item?.release_dates"
					:items="props.item.release_dates"
					:names="{ single: 'Дата релиза: ', many: 'Даты релиза: ' }"
					:showMoreNames="{ showMore: 'Все даты ', showLess: 'Скрыть ' }"
					cardType="Date"
					class="field"
			/>
			<template
					v-for="(field, key) in props.item.additional_fields"
					:key="key"
			>
				<span v-if="field.value" class="field">
					<span class="strong">{{ field.name }}:</span> {{ field.value }}
				</span>
			</template>
			<ListDataItems
					v-if="props?.item?.links"
					:items="props.item.links"
					:names="{ single: 'Ссылка: ', many: 'Ссылки: ' }"
					:showMoreNames="{ showMore: 'Все ссылки ', showLess: 'Скрыть ' }"
					cardType="Link"
					class="field"
			/>
		</div>
		<div class="right-box">
			<Slider
					v-if="item?.covers"
					:items="item.covers"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.main-info {
	@apply md:grid grid-cols-5;

	.left-box {
		@apply col-span-4;

		.field {
			@apply block pb-[0.8rem];
		}
	}
}
</style>
