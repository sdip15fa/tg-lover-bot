import {Inject, Singleton} from "typescript-ioc";
import {UserService} from "../user/service/UserService";

@Singleton
export class RegisterService {
    constructor(
        @Inject
        private userService: UserService
    ) {}

    isAgreeTerms = async (id: string) => {
        const user = await this.userService.get(id);
        return user?.agreeTerms ?? false;
    };

    isAgreeUsernamePermission = async (id: string) => {
        const user = await this.userService.get(id);
        return user?.agreeUsernamePermission ?? false;
    };

    agreeTerms = async (id: string) => {
        await this.userService.update(id, {agreeTerms: true});
    };

    disagreeTerms = async (id: string) => {
        await this.userService.update(id, {agreeTerms: false});
    };

    agreeUsernamePermission = async (id: string) => {
        await this.userService.update(id, {agreeUsernamePermission: true});
    };

    disagreeUsernamePermission = async (id: string) => {
        await this.userService.update(id, {agreeUsernamePermission: false});
    };

    createInfo = async (ctx: any) => {};
}
