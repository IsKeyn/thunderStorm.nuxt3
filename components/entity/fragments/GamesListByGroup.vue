<script setup>
import ListCard from '@/components/entity/card/ListCard.vue';
import {computed} from "vue";

const props = defineProps({
	entity: {
		type: String,
		required: true,
	},
	data: {
		type: Array,
		required: true,
	},
});

const dataByGroups = computed(() => {
	let returnData = [];
	let preparedData = {};

	if (props.data) {
		props.data.forEach((item) => {
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
	<div v-if="dataByGroups">
		<div class="group" v-for="(group) in dataByGroups">
			<span class="title">{{ group.name }}</span>
			<div class="game-list">
				<ListCard
						v-for="(data, index) in group.items"
						:key="index"
						:data="data"
						entity="game"
				/>
			</div>
		</div>
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
