<script setup lang="ts">
import type { NuxtError } from '#app'

definePageMeta({
	layout: 'errors',
})

const props = defineProps({
	error: Object as () => NuxtError
})

const route = useRoute();
const router = useRouter();

const redirectList = ref([
	{
		url: '/silent_hill/characters_sh',
		redirectUrl: '/game/silent-hill-1/characters',
	},
	{
		url: '/silent_hill/sh_ps_prohoshdenie_1',
		redirectUrl: '/game/silent-hill-1/walkthrough',
	},
	{
		url: '/silent_hill/end_of_game',
		redirectUrl: '/game/silent-hill-1/endings',
	},
	{
		url: '/silent_hill/silent_hill_android',
		redirectUrl: '/game/silent-hill-1/silent-hill-1-on-android',
	},
	{
		url: '/silent_hill/silent_hill-original_soundtracks',
		redirectUrl: '/game/silent-hill-1/ost',
	},
	{
		url: '/silent_hill/conceptart_silenthill',
		redirectUrl: '/game/silent-hill-1/media',
	},
	{
		url: '/silent_hill/razrabothciki_silenthill',
		redirectUrl: '/game/silent-hill-1/creators',
	},
	{
		url: '/silent_hill_3/item_in_silenthill3_ch1',
		redirectUrl: '/game/silent-hill-3/items',
	},
	{
		url: '/silent_hill_3/item_in_silenthill3_ch2',
		redirectUrl: '/game/silent-hill-3/items',
	},
	{
		url: '/silent_hill_3/text_and_letter',
		redirectUrl: '/game/silent-hill-3/text-and-letter',
	},
	{
		url: '/silent_hill_3/text_and_letter2',
		redirectUrl: '/game/silent-hill-3/text-and-letter',
	},
	{
		url: '/silent_hill_downpour/walkthrough',
		redirectUrl: '/game/silent-hill-downpour/walkthrough',
	},
	{
		url: '/silent_hill_homecoming/prohshh1',
		redirectUrl: '/game/silent-hill-homecoming/walkthrough',
	},
	{
		url: '/silent_hill_homecoming/prohshh2',
		redirectUrl: '/game/silent-hill-homecoming/walkthrough',
	},
	{
		url: '/silent_hill_homecoming/prohshh3',
		redirectUrl: '/game/silent-hill-homecoming/walkthrough',
	},
	{
		url: '/silent_hill_4_the_room/proxoshden1',
		redirectUrl: '/game/silent-hill-4-the-room/walkthrough',
	},
	{
		url: '/silent_hill_4_the_room/proh2',
		redirectUrl: '/game/silent-hill-4-the-room/walkthrough',
	},
	{
		url: '/silent_hill_4_the_room/prox3',
		redirectUrl: '/game/silent-hill-4-the-room/walkthrough',
	},
	{
		url: '/silent_hill_4_the_room/прохождение-silent-hill-4-the-room-часть-iv',
		redirectUrl: '/game/silent-hill-4-the-room/walkthrough',
	},
	{
		url: '/silent_hill_4_the_room/personashi',
		redirectUrl: '/game/silent-hill-4-the-room/characters',
	},
	{
		url: '/silent_hill_2/scan_manual',
		redirectUrl: '/game/silent-hill-2/manual-scans',
	},
	{
		url: '/silent_hill_3/secret_weapont',
		redirectUrl: '/game/silent-hill-3/secret-weapons',
	},
	{
		url: '/silent_hill_3/amyn_sh3',
		redirectUrl: '/game/silent-hill-3/ammunition',
	},
	{
		url: '/silent_hill_3/ending',
		redirectUrl: '/game/silent-hill-3/endings',
	},
	{
		url: '/silent_hill_movie/info-2',
		redirectUrl: '/movie/silent-hill-the-movie/',
	},
	{
		url: 'silent_hill/infoosilenthill',
		redirectUrl: 'game/silent-hill-1/',
	},
	{
		url: 'silent_hill_2/info',
		redirectUrl: 'game/silent-hill-2',
	},
	{
		url: 'silent_hill_3/silent-hill-3',
		redirectUrl: 'game/silent-hill-3',
	},
	{
		url: 'silent_hill_4_the_room/info-6',
		redirectUrl: 'game/silent-hill-4-the-room/',
	},
	{
		url: 'silent_hill_homecoming/infoshh',
		redirectUrl: 'game/silent-hill-homecoming',
	},
	{
		url: 'silent_hill_shattered_memories/shsm-info',
		redirectUrl: 'game/silent-hill-shattered-memories',
	},
	{
		url: 'silent_hill_origins/info-3',
		redirectUrl: 'game/silent-hill-origin',
	},
	{
		url: 'silent_hill_downpour/silent_hill_downpour',
		redirectUrl: 'game/silent-hill-downpour',
	},
	{
		url: 'other_parts_of_a_series/infosha',
		redirectUrl: 'game/silent-hill-arcade',
	},
	{
		url: 'other_parts_of_a_series/info-5',
		redirectUrl: 'game/silent-hill-orphan',
	},
	{
		url: 'silent_hill_play_novel/infopn',
		redirectUrl: 'game/silent-hill-play-novel',
	},
	{
		url: 'other_parts_of_a_series/infoshe',
		redirectUrl: 'game/silent-hill-experience',
	},
	{
		url: 'other_parts_of_a_series/infoshm',
		redirectUrl: 'game/silent-hill-mobile',
	},
	{
		url: 'other_parts_of_a_series/infoshm2',
		redirectUrl: 'game/silent-hill-mobile-2',
	},
	{
		url: 'other_parts_of_a_series/shm3-info',
		redirectUrl: 'game/silent-hill-mobile-3',
	},
	{
		url: 'silent_hill_revelation/silenthillmovie2',
		redirectUrl: 'movie/silent-hill-revelation',
	},
	{
		url: 'news/anons_return_to_silent_hill',
		redirectUrl: 'news/kristof-gan-snimaet-return-to-silent-hill-po-motivam-silent-hill-2',
	},
	{
		url: 'news/anons_silent_hill_townfall',
		redirectUrl: 'news/anonsirovan-silent-hill-townfall',
	},
	{
		url: 'news/silent-hill-2-remake',
		redirectUrl: 'news/bloober-team-delaut-remeik-silent-hill-2-na-ue-ekskluzivno-dlya-ps5',
	},
	{
		url: 'news/разработка-silent-hills-закрыта',
		redirectUrl: 'razrabotka-silent-hills-zakryta',
	},
	{
		url: 'news/concept_movie_silenthills_tgs2014',
		redirectUrl: 'news/concept-movie-p.t.-(silent-hills)-s-tgs2014',
	},
	{
		url: 'news/anons_silenthills',
		redirectUrl: 'news/anons-silent-hills-ot-hideo-kodzimy-i-gilermo-del-toro',
	},
	{
		url: 'news/shtawelcometopc',
		redirectUrl: 'news/silent-hill-the-arcade-dobro-pojalovat-na-pk',
	},
	{
		url: 'news/screenplay_contest',
		redirectUrl: 'news/konkurs-na-igrovoi-scenarii-dlya-silent-hill!',
	},
	{
		url: 'news/silenthill_bom_launch_trailer',
		redirectUrl: 'news/predreliznyi-treiler-silent-hill-—-book-of-memories',
	},
	{
		url: 'news/sh_bom_e3_2012_trailer',
		redirectUrl: 'news/silent-hill-book-of-memories-—-e3-2012-trailer',
	},
	{
		url: 'news/silent_hill_2_and_silent_hill_3from_hd_collection',
		redirectUrl: 'news/silent-hill-2-i-silent-hill-3-iz-sbornika-silent-hill-hd-collection-[video]',
	},
	{
		url: 'news/about_ost_silent_hill_downpour',
		redirectUrl: 'news/o-saundtreke-silent-hill:-downpour',
	},
	{
		url: 'news/silent_hill_hd_collection_trailer',
		redirectUrl: 'news/silent-hill-hd-collection-trailer',
	},
	{
		url: 'news/silent_hill_downpour_gameplay_2012',
		redirectUrl: 'news/silent-hill-downpour-—-15-ti-minutnyi-geimplei',
	},
	{
		url: 'news/new_year_2012',
		redirectUrl: 'news/s-novym-godom-2012',
	},
	{
		url: 'revelation_finishes_shooting',
		redirectUrl: 'news/sieemki-silent-hill:-revelation-podhodyat-k-koncu',
	},
]);


for (let key in redirectList.value) {
	let preparedUrl = route.fullPath;
	let redirectPreparedUrl = redirectList.value[key].url;

	if (preparedUrl[0] === '/') {
		preparedUrl = preparedUrl.slice(1);
	}

	if (preparedUrl[preparedUrl.length - 1] === '/') {
		preparedUrl = preparedUrl.slice(0, -1);
	}

	if (redirectPreparedUrl[0] === '/') {
		redirectPreparedUrl = redirectPreparedUrl.slice(1);
	}

	if (redirectPreparedUrl[preparedUrl.length - 1] === '/') {
		redirectPreparedUrl = preparedUrl.slice(0, -1);
	}

	if (redirectPreparedUrl === preparedUrl) {
		console.log( redirectList.value[key].redirectUrl);

		location.href = '/' + redirectList.value[key].redirectUrl;
		// router.push({path: redirectList.value[key].redirectUrl});
		break;
	}
}

const getLinkForOldSite = computed(() => {
	let preparedUrl = route.fullPath;

	if (preparedUrl[0] === '/') {
		preparedUrl = preparedUrl.slice(1);
	}

	if (preparedUrl[preparedUrl.length - 1] === '/') {
		preparedUrl = preparedUrl.slice(0, -1);
	}

	return `https://old.insilenthill.ru/${preparedUrl}`;
});
</script>

<template>
	<NuxtLayout>
		<div class="mt-7 mx-auto text-center card">
			<p class="mt-7 text-7xl font-bold">{{error.statusCode}}</p>
			<div class="mt-7" v-if="error.statusCode === 404">
				<p class="text-[1.5rem]">
					Извините, но такой страницы нет.<br />
					Возможно, её поглотил иной мир Алессы,<br />
					а может она была покарана Пирамидоголовым<br />
					или стала жертвой Уолтера Салливана.<br />
					<br />
					Она могла быть уничтожена печаться Метратона,<br />
					или затеряться в глубине свого сознания.<br />
					<br />
					А её возможно никогда не было,<br />
					она являлась плодом вашей фантазии!<br />
					<br />
					Но в реальном мире данного сайта<br />
					вы можете найти её альтернативу.<br />
					<br />
					Или она осталась на старой версии сайта,<br/>
					попробуйсте перейти на старый сайт с помощью кнопки ниже.
				</p>
			</div>
			<p class="mt-7 text-6xl" v-else>Произошла ошибка...</p>
			<div class="button-block">
				<!--			<p class="mt-7">{{error.message}}</p>-->
				<a class="btn btn-primary mt-7 block" href="/">Вернуться на главную страницу</a>
				<a class="btn btn-primary mt-7 block" target="_blank" :href="getLinkForOldSite">Посмотреть страницу на старом сайте</a>
			</div>
		</div>
	</NuxtLayout>
</template>

<style lang="scss" scoped>
.button-block {
	@apply md:grid grid-cols-12 mt-7;

	.btn {
		@apply md:col-span-6 w-full mr-[1rem] ml-[1rem] block;
	}
}
</style>
