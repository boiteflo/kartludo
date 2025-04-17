class helperCookie {
    static setCookie(key, value, days = 7) {
        this.setCookieString(key, JSON.stringify(value), days);
    }
    static setCookieString(key, value, days = 7) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }

    static getCookie(key) {
        return JSON.parse(this.getCookieString(key));
    }

    static getCookieString(key) {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith(key + '='))
            ?.split('=')[1];
    }

    static deleteCookie(key) {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }

    static setLocalStorage(key, value) {
        this.setLocalStorageString(key, JSON.stringify(value));
    }

    static setLocalStorageString(key, value) {
        localStorage.setItem(key, value);
    }

    static getLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    static removeLocalStorage(key) {
        localStorage.removeItem(key);
    }
}

module.exports = helperCookie;
