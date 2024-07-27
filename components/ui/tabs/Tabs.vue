<script setup>
import { onMounted } from "vue";

const props = defineProps({
	tabs: {
		type: Array,
		default: [
			{
				id: 1,
				title: 'Таб 1',
			},
			{
				id: 2,
				title: 'Таб 2',
			},
			{
				id: 3,
				title: 'Таб 3',
			},
		],
	},
});

const currentTab = ref(1);

const router = useRouter();
const route = useRoute();

if (route.query?.tab) {
	for (let key in props.tabs) {
		if (String(props.tabs[key].id) === route.query.tab) {
			currentTab.value = props.tabs[key].id;
			break;
		}
	}
}

const setTab = (tabID) => {
	currentTab.value = tabID;
	router.push({
		name: route.name,
		query: {
			...route.query,
			tab: tabID,
		},
	});
}
</script>

<template>
	<div>
		<ul>
			<li
					v-for="tab in tabs"
					:key="tab.id"
					@click="setTab(tab.id)"
			>
				<div
						style="display: inline-flex"
						:class="{ 'active' : currentTab === tab.id }"
				>
					{{ tab.title }}
				</div>
			</li>
		</ul>

		<div
				v-for="(tab, index) in tabs"
				:key="index"
				v-show="tab.id === currentTab"
		>
			<slot :name="`tab-${tab.id}`" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
ul {
	@apply relative flex flex-nowrap mb-4;

	li {
		@apply mr-6 last:mr-0;

		div {
			@apply pb-2 whitespace-nowrap cursor-pointer;

			&:hover {
				color: var(--main-hover-color);
			}

			&.active {
				@apply border-b-2 border-[var(--main-hover-color)];

				color: var(--main-hover-color);
			}
		}
	}
}
</style>
