import config from "../../config/config.js";

export class Auth{
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userId = 'userId';


    static async processUnauthorizedResponse() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if(refreshToken){
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if(response && response.status === 200){
                const result = await response.json();
                if(result && !result.error){
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken, result.user.id);
                    return true;
                } else {
                    throw new Error(result.message);
                }
            }
        }
    }

    static setTokens(accessToken, refreshToken, userId, userFullName) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        localStorage.setItem(this.userId, userId);
        localStorage.setItem('userFullName', userFullName);
    }
}