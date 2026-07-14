export const useYandexMetrika = () => {
    const init = () => {
        // Если Метрика уже загружена, не делаем ничего
        if (typeof window !== 'undefined' && window.ym) {
            return;
        }

        const config = useRuntimeConfig();
        const counterId = config.public.ymCounterId;

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = `
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    
          ym(${counterId}, "init", {
               clickmap: true,
               trackLinks: true,
               accurateTrackBounce: true,
               webvisor: true
          });
        `;

        document.head.appendChild(script);
        console.log('[Yandex Metrika] Инициализирована после согласия пользователя');
    };

    return { init };
};

// Добавляем типизацию для TypeScript, чтобы не было ошибок
declare global {
    interface Window {
        ym: any;
    }
}
