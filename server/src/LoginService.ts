import {CronJob} from "cron";
import {Request} from "./Request";
import IPromise = Axios.IPromise;

export class LoginService {
    private cron: CronJob;
    private cronExpression: string = "0 0 */1 * * *";

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