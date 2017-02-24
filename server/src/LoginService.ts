import {CronJob} from "cron";
import {Request} from "./Request";
import AxiosXHR = Axios.AxiosXHR;
import IPromise = Axios.IPromise;

export class LoginService {
    private cron: CronJob;
    private cronExpression: string = "0 0 */1 * * *";

    // constructor() {
    //     console.log("LoginService started!");
    // }

    public startAuthentication(): IPromise<any> {
        console.log("LoginService started!");

        if (this.cron) {
            this.cron.stop();
        }

        return this.init();
    }

    private init() {
        const userName = process.env.USERNAME;
        const password = process.env.PASSWORD;

        console.log(process.env.USERNAME);
        console.log(process.env.PASSWORD);

        return Request.login(userName, password)
            .then(() => {
                console.info("KeepAlive Cron Start");
                this.cron = new CronJob(this.cronExpression, this.keepAlive, null, true);
            }).catch((error: any) => {
                throw error;
            });
    }

    private keepAlive(): void {
        console.log("keepAlive()");
        Request.getInstance().keepAlive();
    }

}