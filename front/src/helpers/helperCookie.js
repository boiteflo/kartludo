class helperCookie {
    static setCookie(key, value, days = 7) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }

    static getCookie(key) {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith(key + '='))
            ?.split('=')[1];
    }

    static deleteCookie(key) {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }

    static setLocalStorage(key, value){
        localStorage.setItem(key, value);
    }

    static getLocalStorage(key, value){
        return localStorage.getItem(key);
    }

    static removeLocalStorage(key, value){
        localStorage.removeItem(key);
    }
}

module.exports = helperCookie;
