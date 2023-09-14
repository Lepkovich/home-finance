import config from "../../config/config";
import {RefreshResponseType} from "../types/backend-response.type";

export class Auth{
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userId: string = 'userId';


    public static async processUnauthorizedResponse(): Promise<boolean> {
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
                const result: RefreshResponseType | null = await response.json();
                if(result && !result.error && result.tokens.accessToken && result.tokens.refreshToken){
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    return true;
                }
            }
        }
        this.removeTokens();
        location.href = '#/login'
        return false;
    }

    static setTokens(accessToken: string, refreshToken: string) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
    static setUserData(userId: string, userFullName: string) {
        localStorage.setItem(this.userId, userId);
        localStorage.setItem('userFullName', userFullName);
    }


    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userId);
        localStorage.removeItem('userFullName');
    }

    static async logOut(): Promise<boolean>{
        const refreshToken: string | null =  localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({refreshToken: refreshToken})
            })
            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    Auth.removeTokens();
                    return true;
                }
            }
        }
        return false;
    }
}