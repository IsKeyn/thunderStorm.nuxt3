<script setup>
import { watch } from 'vue'

import { VueFlexWaterfall } from 'vue-flex-waterfall';

import { api } from '@/composables/api.js'
const { apiUrl } = api();

const Authorization = useCookie('Authorization');

const data = ref([]);
const meta = ref();

const perPage = ref(12);

await $fetch(
		`${apiUrl.value}media/get`,
		{
			method: 'POST',
			headers: {
				Authorization: Authorization.value,
				Accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
			},
			body: {
				perPage: perPage.value,
				page: 1,
			},
			onResponse({response}) {
				if (response.status === 200) {
					data.value = data.value.concat(response._data.data);
					meta.value = response._data.meta;
				}
			},
		},
);

const getNextPage = async () => {
	await fetchData(meta.value.current_page + 1);
}

const tags = ref([]);
watch(tags, () => {
	fetchData(1, false);
});

const fetchData = async (page, showMore = true) => {
	const body = {
		perPage: perPage.value,
		page,
		filter: {},
	};

	if (toRaw(tags.value).length > 0) {
		body.filter.tags = toRaw(tags.value);
	}

	await $fetch(
			`${apiUrl.value}media/get`,
			{
				method: 'POST',
				headers: {
					Authorization: Authorization.value,
					Accept: 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
				},
				body,
				onResponse({response}) {
					if (response.status === 200) {
						if (showMore) {
							data.value = data.value.concat(response._data.data);
						} else {
							data.value = response._data.data;
						}
						meta.value = response._data.meta;
					}
				},
			},
	);
}

import { onMounted } from 'vue'
onMounted(() => {
	// headClass.value = props.headType;
	// window.addEventListener("scroll", (event) => { scroll(event); });
	//
	// window.onscroll = () => {
	// 	let bottomOfWindow =
	// 			window.pageYOffset + window.innerHeight - document.body.offsetHeight;
	//
	// 	if (bottomOfWindow > -30 && this.isLoaded) {
	// 		this.pageCount++;
	// 		this.isLoaded = false;
	// 		this.getImages(this.page);
	// 	}
	// };
})

import LightBox from '@/components/media/LightBox.vue';
import TagsList from '@/components/tags/TagsList.vue';

const currentElement = ref(null);

const setCurrentElement = (key) => {
	if (key) {
		currentElement.value = data.value[key];
	} else {
		currentElement.value = null;
	}
}
</script>

<template>
	<TagsList
			:canAddTags="false"
			type="media"
			v-model="tags"
	/>
	<div>
		<VueFlexWaterfall
				align-content="center"
				col="4"
				col-spacing="15"
				:break-at="{ 900: 3, 600: 2, 300: 1 }"
				break-by-container: true
		>
				<div
						v-for="(element, key) in data"
						class="w-[308px] mb-2"
						@click="setCurrentElement(key)"
				>
					<img
							class="img"
							:src="element.src"
							:alt="element.name"
					/>
				</div>
		</VueFlexWaterfall>
		<LightBox
			v-if="currentElement"
			:image="currentElement"
			@hideLightBox="setCurrentElement"
		/>
		<button @click="getNextPage()">Показать ещё</button>
	</div>
</template>

