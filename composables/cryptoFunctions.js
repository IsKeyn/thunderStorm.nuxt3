export function cryptoFunctions() {
    // Вспомогательные функции для конвертации Uint8Array <-> Base64
    const toBase64 = (bytes) => btoa(String.fromCharCode(...bytes));
    const fromBase64 = (base64) => {
        const bin = atob(base64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return bytes;
    };

    const encrypt = async (string, password) => {
        const enc = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12)); // 12 байт стандарт для AES-GCM

        // 1. Импортируем пароль как материал ключа
        const passwordKey = await crypto.subtle.importKey(
            'raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']
        );

        // 2. Выводим AES-256 ключ
        const aesKey = await crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
            passwordKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );

        // 3. Шифруем
        const ciphertext = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            aesKey,
            enc.encode(string)
        );

        // 4. Возвращаем всё в Base64 для удобного хранения
        return {
            ciphertext: toBase64(new Uint8Array(ciphertext)),
            iv: toBase64(iv),
            salt: toBase64(salt)
        };
    };

    const decrypt = async (encryptedData, password) => {
        const { ciphertext, iv, salt } = encryptedData;
        const dec = new TextDecoder();

        const passwordKey = await crypto.subtle.importKey(
            'raw', new TextEncoder().encode(password), { name: 'PBKDF2' }, false, ['deriveKey']
        );

        const aesKey = await crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: fromBase64(salt), iterations: 100_000, hash: 'SHA-256' },
            passwordKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
        );

        // Расшифровка
        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: fromBase64(iv) },
            aesKey,
            fromBase64(ciphertext)
        );

        return dec.decode(decryptedBuffer);
    };

    return { encrypt, decrypt };
}
