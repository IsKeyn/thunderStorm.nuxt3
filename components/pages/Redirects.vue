<script setup>
const route = useRoute();
const router = useRouter();

const redirectList = ref([
	{
		url: 'test',
		redirectUrl: '/test2',
	},
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
]);


for (let key in redirectList.value) {
	let preparedUrl = route.fullPath;

	if (preparedUrl[0] === '/') {
		preparedUrl = preparedUrl.slice(1);
	}

	if (preparedUrl[preparedUrl.length - 1] === '/') {
		preparedUrl = preparedUrl.slice(0, -1);
	}

	if (redirectList.value[key].url === preparedUrl) {
		router.push({ path: redirectList.value[key].redirectUrl });
		break;
	}
}

// TODO Перенаправление на 404
</script>

<template>
</template>
