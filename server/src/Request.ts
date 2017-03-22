import * as axios from "axios";
import AxiosXHRConfigBase = Axios.AxiosXHRConfigBase;
import IPromise = Axios.IPromise;
import {paths} from "../paths";
import AxiosXHR = Axios.AxiosXHR;
import _ = require("lodash");
import AxiosInstance = Axios.AxiosInstance;
const querystring = require("querystring");

export class Request {
    private axiosInstance: AxiosInstance;
    private static instance: Request;

    private constructor(cookie: string, token: string) {
        const headers = {
            'X-Application': 'nzIFcwyWhrlwYMrh',
            "Accept": "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            "Origin": "https://www.betfair.com",
            "Referer": "https://www.betfair.com/exchange/plus/",
            "Connection": "keep-alive",
            "Accept-Encoding": "gzip",
            "X-Authentication": token,
            'Cookie': cookie
        };

        this.axiosInstance = axios.create({
            // baseURL: 'https://www.betfair.com/exchange/',
            timeout: 15000,
            headers: headers
        });
        // this.axiosInstance.interceptors.request.use(request => {
        //     console.log('Starting Request', JSON.stringify(request.data));
        //     return request;
        // });
        // this.axiosInstance.interceptors.response.use(response => {
        //     console.log('Response:', JSON.stringify(response.data));
        //     // console.log('Response:', response);
        //     return response;
        // });
    }

    public static getInstance(): Request {
        return this.instance;
    }

    public static login(userName: string, password: string): IPromise<never> {
        let data = {
            username: userName,
            password: password,
            redirectMethod: "POST",
            product: "exchange",
            url: "https://www.betfair.com/exchange/login/success?rurl=https://www.betfair.com/exchange",
            ioBlackBox: ""
        };

        let axiosConfig = {
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Content-Type": "application/x-www-form-urlencoded",
                'X-Application': 'nzIFcwyWhrlwYMrh',
                "Origin": "https://www.betfair.com",
                "Referer": "https://www.betfair.com/exchange/plus/",
                "Accept-Encoding": "gzip",
                "Access-Control-Allow-Origin": "*",
                "Cookie": "wsid=cb7ec5a1-ec84-11e6-884d-90e2ba0fa6a0; language=en; exp=ex; vid=bc6f5ff3-74b0-4a1e-b6fd-319ee8682dbc;"
            }
        };

        // axios.interceptors.request.use(response => {
        //     // console.log('Response:', JSON.stringify(response.data));
        //     console.log('Request:', response);
        //     return response;
        // });
        // axios.interceptors.response.use(response => {
        //     // console.log('Response:', JSON.stringify(response.data));
        //     console.log('Response:', response);
        //     return response;
        // });
        return axios.post(paths.urlLogin, querystring.stringify(data), axiosConfig)
            .then((data: AxiosXHR<any>) => {
                let cookie = _.find(data.headers["set-cookie"], (header: string) => {
                    return header.indexOf("ssoid") !== -1
                });

                let html:string = data.data;
                let start = html.indexOf("name=\"productToken\"") + 27;
                let token = html.substr(start, 44);

                if (cookie) {
                    console.info("Login successful.");
                    this.instance = new Request(cookie, token);
                    return;
                }
                throw "Login error, cookie or token not found";
            }).catch((error: string) => {
                throw error;
            });
    }

    public keepAlive(): void {
        this.axiosInstance.get(paths.urlKeepAlive);
    }

    public getTimeLine(eventId: number): IPromise<any> {
        return this.get(paths.getTimeLine(eventId)).then(data => data.data);
    }

    public get(url: string): IPromise<any> {
        return this.axiosInstance.get(url);
    }

    public post(url: string, data: any): IPromise<any> {
        return this.axiosInstance.post(url, data);
    }

    public getWallet(): IPromise<any> {
        return this.get(paths.urlWallet).then(data => data.data[0]);
    }
}
