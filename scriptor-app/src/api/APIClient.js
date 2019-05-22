import querystring from "./utils";

let BASE_URL = "http://localhost:5000";

class APIClient {
    constructor() {
        this.state = {
            authToken: localStorage.getItem("authToken")
        }
    }

    setAuthToken(authToken) {
        localStorage.setItem("authToken", authToken);
        this.state.authToken = authToken;
    }

    clearAuthToken() {
        this.state.authToken = null;
        localStorage.removeItem("authToken")
    }

    getAuthToken() {
        return this.state.authToken;
    }

    isCurrentUserLoggedIn() {
        return this.getAuthToken() != null;
    }

    _getRequestHeaders() {
        if (!this.isCurrentUserLoggedIn())
            return {};
        else
            return {"Authorization": "Bearer " + this.getAuthToken()}
    }

    /** User-based functions **/
    getCurrentUser() {
        if (!this.isCurrentUserLoggedIn())
            return null;

        return new Promise((resolve, reject) => {
            fetch(BASE_URL + "/api/user/me/", {headers: this._getRequestHeaders()}).then(response => response.json()).then((response) => {
                if (response.success)
                    resolve(response.current_user);
                else
                    reject(response.error);
            })
        });
    }

    login(email, password) {
        return new Promise((resolve, reject) => {
            fetch(BASE_URL + "/api/user/login/", {
                method: 'POST',
                headers: this._getRequestHeaders(),
                body: {"email": email, "password": password}
            }).then(response => response.json())
                .then((response) => {
                    if (response.success) {
                        this.setAuthToken(response.auth_token);
                        resolve(response.auth_token);
                    } else {
                        reject(response.error);
                    }
                })
        });
    }

    logout() {
        this.clearAuthToken();
    }

    register(email, password) {
        return new Promise((resolve, reject) => {
            fetch(BASE_URL + "/api/user/register/", {
                method: 'POST',
                headers: this._getRequestHeaders(),
                body: {"email": email, "password": password}
            }).then(response => response.json())
                .then((response) => {
                    if (response.success) {
                        this.setAuthToken(response.auth_token);
                        resolve(response.auth_token);
                    } else {
                        reject(response.error);
                    }
                })
        });
    }

    changePassword(existingPassword, newPassword) {
        return new Promise((resolve, reject) => {
            fetch(BASE_URL + "/api/user/change_password/", {
                method: 'POST',
                headers: this._getRequestHeaders(),
                body: {"existing_password": existingPassword, "new_password": newPassword}
            }).then(response => response.json())
                .then((response) => {
                    if (response.success) {
                        resolve(true);
                    } else {
                        reject(response.error);
                    }
                })
        });
    }

    addFavoritePodcastById(podcastId) {
        return new Promise((resolve, reject) => {
            fetch(BASE_URL + "/api/user/favorite_podcasts/" + podcastId + "/add/", {
                method: 'POST',
                headers: this._getRequestHeaders()
            }).then(response => response.json())
                .then((response) => {
                    if (response.success) {
                        resolve(true);
                    } else {
                        reject(response.error);
                    }
                })
        });
    }

    removeFavoritePodcastById(podcastId) {
        return new Promise((resolve, reject) => {
            fetch(BASE_URL + "/api/user/favorite_podcasts/" + podcastId + "/remove/", {
                method: 'DELETE',
                headers: this._getRequestHeaders()
            }).then(response => response.json())
                .then((response) => {
                    if (response.success) {
                        resolve(true);
                    } else {
                        reject(response.error);
                    }
                })
        });
    }

    getFavoritePodcasts() {
        return new Promise((resolve, reject) => {
            fetch(BASE_URL + "/api/user/favorite_podcasts/", {headers: this._getRequestHeaders()}).then(response => response.json())
                .then((response) => {
                    if (response.success) {
                        resolve(response.favorite_podcasts);
                    } else {
                        reject(response.error);
                    }
                })
        });
    }

    getHistory() {
        return new Promise((resolve, reject) => {
            fetch(BASE_URL + "/api/user/history/", {headers: this._getRequestHeaders()}).then(response => response.json())
                .then((response) => {
                    if (response.success) {
                        resolve(response.history);
                    } else {
                        reject(response.error);
                    }
                })
        });
    }

    clearHistory() {
        return new Promise((resolve, reject) => {
            fetch(BASE_URL + "/api/user/history/clear/", {
                method: "DELETE",
                headers: this._getRequestHeaders()
            }).then(response => response.json())
                .then((response) => {
                    if (response.success) {
                        resolve(true);
                    } else {
                        reject(response.error);
                    }
                })
        });
    }


    /** Search-based functions **/
    searchPodcasts(text_query, filters = {}) {
        var url_query = filters;
        url_query.q = text_query;
        var queryString = querystring(url_query);
        return new Promise((resolve, reject) => {
            fetch(BASE_URL + "/api/search/podcasts/" + queryString, {headers: this._getRequestHeaders()}).then(response => response.json())
                .then((response) => {
                    if (response.success) {
                        resolve(response.results);
                    } else {
                        reject(response.error);
                    }
                })
        });
    }

    /** Podcast-based functions **/
    getPodcastSnippet(blobId) {
        return new Promise((resolve, reject) => {
            fetch(BASE_URL + "/api/podcasts/blobs/" + blobId + "/", {headers: this._getRequestHeaders()}).then(response => response.json())
                .then((response) => {
                    if (response.success) {
                        resolve({podcast: response.podcast, podcast_blob: response.podcast_blob});
                    } else {
                        reject(response.error);
                    }
                })
        });
    }

    getPodcastMetadata(podcastId) {
        return new Promise((resolve, reject) => {
            fetch(BASE_URL + "/api/podcasts/" + podcastId + "/", {headers: this._getRequestHeaders()}).then(response => response.json())
                .then((response) => {
                    if (response.success) {
                        resolve(response.podcast);
                    } else {
                        reject(response.error);
                    }
                })
        });
    }

    getPodcastTranscript(podcastId) {
        return new Promise((resolve, reject) => {
            fetch(BASE_URL + "/api/podcasts/" + podcastId + "/transcript/", {headers: this._getRequestHeaders()}).then(response => response.json())
                .then((response) => {
                    if (response.success) {
                        resolve(response.full_transcript);
                    } else {
                        reject(response.error);
                    }
                })
        });
    }


}

export default new APIClient();