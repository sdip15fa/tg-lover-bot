import {Singleton} from "typescript-ioc";
import base64 from "js-base64";

@Singleton
export class WebFormConcern {
    constructor() {}

    encodeData = (data: any): string => {
        const base64String = base64.encode(JSON.stringify(data));

        return encodeURIComponent(base64String);
    };

    parsedUserData = (ctx: any) => {
        return JSON.parse(ctx.update.message.web_app_data.data);
    };

    webFormURL = (url: string, userData?: any) => {
        if (!userData) return url;

        return `${url}?userData=${userData}`;
    };
}
