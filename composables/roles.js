export function roles() {
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

    return { hasRole };
}
