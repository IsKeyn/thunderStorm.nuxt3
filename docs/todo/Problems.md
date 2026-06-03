# Известные проблемы
## NUXT 3
### Проблема использования useFetch 1

Описание: При запросе типа, на стороне клиента не отрабатывает "onResponse", при этом запрос успешно посылается и получет ответ

Причина: Не известна

Решение: Использовать "Рабочий запрос 1", "Рабочий запрос 2"

Примечание: Если код не отрабатывает на стороне ssr, то ошибки не возникает

Проблемный код:
```bash
await useFetch(
    `${apiUrl.value}tag/get/all`,
	{
	    headers: {
		    Accept: 'application/json',
			'X-Requested-With': 'XMLHttpRequest',
		},
		async onResponse({response}) {
		    if (response.status === 200) {
                fetchedData.value = response._data.data;
			},
		},
));
```

Рабочий запрос 1
```bash
await useFetch(
    `${apiUrl.value}tag/get/all`,
    {
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    },
).then((response) => {
    if (response.status.value === 'success') {
        fetchedData.value = toRaw(response.data.value).data;
    }
});
```
Рабочий запрос 2
```bash
const { data } = await useFetch(
    `${apiUrl.value}tag/get/all`,
    {
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    },
);

fetchedData.value = toRaw(data.value).data
```
