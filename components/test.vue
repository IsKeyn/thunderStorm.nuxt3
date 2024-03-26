<script setup>
const props = defineProps({
	canAddTags: {
		type: Boolean,
		default: true,
	},
	modelValue: {
		type: Array,
		default: [],
	},
	type: {
		type: String,
		default: 'all',
	},
});

const tagsList = ref([]);

// Получаем с бека теги
import { api } from '@/composables/api.js'
const { apiUrl } = api();

const Authorization = useCookie('Authorization');

const fetchedData = ref('');

await useAsyncData(
		'mountains',
		async () => {
			let request = `${apiUrl.value}tag/get`;

			if (props.type) {
				request += `/${props.type}`;
			}

			await $fetch(
					request,
					{
						method: 'GET',
						headers: {
							Authorization: Authorization.value,
							Accept: 'application/json',
							'X-Requested-With': 'XMLHttpRequest',
						},
						onResponse({response}) {
							console.log(111);

							if (response.status === 200) {
								fetchedData.value = response._data.data;

								fetchedData.value.forEach((item) => {
									// Данный select не отрабатывает (в большинстве случаев), так как данные props.modelValue ещё не получены от бека на данном этапе
									const selected = toRaw(props.modelValue).includes(item.name);

									tagsList.value.push({
										name: item.name,
										selected,
									});
								});
							}
						}
					},
			)
		}
)
</script>

<template>
	<div>
				<span
						v-for="(tag, key) in tagsList"
				>
			{{ tag.name }}
		</span>
	</div>
</template>
