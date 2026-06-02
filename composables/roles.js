import { userFunctions } from '@/composables/userFunctions.js';

export function roles() {
    const { userStore } = userFunctions();
    const superAdminPermission = 'admin.super';

    const hasRole = (roleName, user) => {
        let returnData = false;

        const rawUser = toRaw(user);

        if (rawUser && rawUser.roles && Array.isArray(rawUser.roles)) {
            rawUser.roles.forEach((item) => {
                if (item.system_name === roleName) {
                    returnData = true;
                }
            });
        }

        return returnData;
    }

    const hasPermission = (permission, user) => {
        const rawUser = toRaw(user);
        const allPermissions = [];
        let has = false;

        if (rawUser && rawUser.roles && Array.isArray(rawUser.roles)) {
            rawUser.roles.forEach((item) => {
                if (item && item.permissions && Array.isArray(item.permissions)) {
                    item.permissions.forEach((i) => {
                        if (!allPermissions.includes(i.system_name)) {
                            allPermissions.push(i.system_name);
                        }
                    });
                }
            });

            if (allPermissions.includes(permission)) has = true;
        }

        return has;
    }

    const checkPermission = (permissions) => {
        const rawUser = toRaw(userStore.user);
        const userPermissions = new Set(); // Set автоматически убирает дубли и даёт поиск за O(1)

        if (rawUser?.roles && Array.isArray(rawUser.roles)) {
            rawUser.roles.forEach(role => {
                if (role?.permissions && Array.isArray(role.permissions)) {
                    role.permissions.forEach(perm => {
                        if (perm?.system_name) {
                            userPermissions.add(perm.system_name);
                        }
                    });
                }
            });
        }

        if (userPermissions.has(superAdminPermission)) return true;

        // Возвращаем true только если ВСЕ элементы массива присутствуют у пользователя
        if (Array.isArray(permissions)) {
            return permissions.every(p => userPermissions.has(p));
        } else if (typeof permissions === 'string') {
            return userPermissions.has(permissions);
        }
    }

    return {
        hasRole,
        hasPermission,
        checkPermission,
    };
}
