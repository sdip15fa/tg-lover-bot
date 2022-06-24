import {Singleton} from "typescript-ioc";
import base64 from "base64-utf8";

@Singleton
export class WebFormConcern {
    constructor() {}

    encodeData = (data: any): string => {
        return encodeURIComponent(base64.encode(JSON.stringify(data)));
    };

    parsedUserData = (ctx: any) => {
        return JSON.parse(ctx.update.message.web_app_data.data);
    };

    webFormURL = (url: string, userData?: any) => {
        if (!userData) return url;

        return `${url}?userData=${userData}`;
    };
}
