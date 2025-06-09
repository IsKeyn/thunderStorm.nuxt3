<script setup>
import { ref } from 'vue';

const props = defineProps({
	menu: {
		type: Array,
		default: [],
	},
	theme: {
		type: String,
		default: 'left',
	},
});

const isExpanded = ref(false);

const toggleSidebar = () => {
	isExpanded.value = !isExpanded.value;
};




import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
	sendApiRequest,
} = api();

const route = useRoute();

// const requestInProgress = ref(false);
const fetchedData = ref();

// const { refresh } = await useAsyncData(
// 		async () => {
// 			let request = `${apiUrl.value}board-game/get/retro2025`;
//
// 			const query = {};
// 			const sessionCookie = useCookie(sessionCookieName.value);
//
// 			requestInProgress.value = true;
//
// 			try {
// 				await $fetch(
// 						request,
// 						{
// 							method: 'GET',
// 							credentials: 'include',
// 							query,
// 							headers: {
// 								Accept: 'application/json',
// 								Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
// 								Referer: publicUrl.value,
// 							},
// 							onResponse({response}) {
// 								if (response.status === 200) {
// 									fetchedData.value = response._data.data;
// 								} else {
// 									error('Request error', 5000);
// 								}
//
// 								requestInProgress.value = false;
// 							}
// 						},
// 				);
// 			} catch (e) {
// 				errorHandler(e);
// 				requestInProgress.value = false;
// 			}
// 		}
// );

const logListBlock = ref(null);

const updateLogs = () => {
	logListBlock.value.updateLogs();
}

const updateBoardGameInfo = () => {
	refresh();
}

const playersComponent = ref(null);

const showPlayer = (id) => {
	playersComponent.value.showPlayerInfo(id);
}



const { data: gameListData, pending: requestInProgress, refresh } = await useAsyncData(
		'gameListKey', // уникальный ключ для этого запроса
		async () => {

			console.log(22222222);
			let request = `${apiUrl.value}board-game/get/retro2025`;

			const query = {};
			const sessionCookie = useCookie(sessionCookieName.value);

			// requestInProgress.value = true;

			try {
				const response = await $fetch(
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
							// onResponse({response}) {
							// 	if (response.status === 200) {
							// 		fetchedData.value = response._data.data;
							// 	} else {
							// 		error('Request error', 5000);
							// 	}
							//
							// 	requestInProgress.value = false;
							// }
						},
				);

				console.log(11111111, response);
				return response.data; // возвращаем только нужные данные
			} catch (e) {
				errorHandler(e);
				// requestInProgress.value = false;
			}
		},
		{
			server: true, // выполнять только на сервере
			lazy: true, // ждать выполнения запроса перед рендерингом
			// getCachedData(key) {
			// 	// Можно использовать nuxtState или другие механизмы кэширования
			// 	return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
			// },
		}
);

// Используем возвращенные данные
const gameList = ref(gameListData.value || []);

</script>

<template>
	{{ requestInProgress }}
	<button @click="refresh">
		we2weqw
	</button>

	{{ gameList }}
	{{ fetchedData }}
	<div
			:class="['sidebar', isExpanded ? 'sidebar-expanded' : '']"
	>
		<div class="sidebar-header">
			<button class="sidebar__toggle" @click="toggleSidebar">
				<font-awesome-icon v-if="isExpanded" :icon="['fas', 'circle-left']" />
				<font-awesome-icon v-else :icon="['fas', 'circle-right']" /> <span class="sidebar__text">Скрыть</span>
			</button>
		</div>

		<nav class="sidebar__nav">
			<ul
					v-if="menu.length > 0"
					class="sidebar__list"
			>
				<li
						v-for="item in menu"
						:key="item.name"
						class="sidebar__item"
				>
					<NuxtLink :to="item.path" class="sidebar__link">
						<font-awesome-icon
								v-if="theme === 'left'"
								:icon="item.icon"
						/>
						<span class="sidebar__text">{{ item.name }}</span>
					</NuxtLink>
				</li>
			</ul>
		</nav>
	</div>
</template>

<style lang="scss" scoped>
.sidebar {
	@apply
		h-[100vh] w-[60px]
		bg-[var(--second-block-color)]
	;

	transition: width 0.3s ease;
	overflow: hidden;

	&.sidebar-expanded {
		@apply w-[250px];
	}

	.sidebar-header {

	}
}

.sidebar-header {
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar__toggle {
	background: none;
	border: none;
	color: white;
	cursor: pointer;
	padding: 10px;
}



.sidebar__nav {
	padding: 20px 0;
}

.sidebar__list {
	list-style: none;
	padding: 0;
	margin: 0;
}

.sidebar__item {
	margin-bottom: 5px;
}

.sidebar__link {
	display: flex;
	align-items: center;
	padding: 12px 20px;
	color: white;
	text-decoration: none;
	transition: background-color 0.3s;
	white-space: nowrap;
}

.sidebar__link:hover {
	background-color: rgba(255, 255, 255, 0.1);
}

.sidebar__icon {
	flex-shrink: 0;
}

.sidebar__text {
	margin-left: 15px;
	opacity: 0;
	transition: opacity 0.3s;
}

.sidebar-expanded .sidebar__text {
	opacity: 1;
}

.router-link-active {
	background-color: rgba(255, 255, 255, 0.2);
}
</style>
