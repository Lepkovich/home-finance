
// ------ done the same as in quiz ------

import {Auth} from "./auth";
export class CustomHttp {
    public static async request(url:string, method:string = "GET", body: any =  null): Promise<any> {
        const params: any = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        };
        let token: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (token) {
            params.headers['x-auth-token'] = token;
        }

        if(body){
            params.body = JSON.stringify(body);
        }

        const response: Response = await fetch(url, params);


        if (response.status < 200 || response.status >= 300) {
            if(response.status === 401) {
                const result: boolean = await Auth.processUnauthorizedResponse();
                if(result){ // если пришло true из processUnauthorizedResponse()
                    return await this.request(url, method, body); //повторяем запрос на логин
                } else {
                    return response.json();
                }
            }
            console.log(response.statusText);
            // throw new Error(response.message);
        }
        return await response.json();

    }
}