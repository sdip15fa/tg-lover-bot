import {userService} from "../user/UserService";

class RegisterService {
    async isAgreeTerms(id: string) {
        const user = await userService.get(id);
        return user?.agreeTerms ?? false;
    }

    async isAgreeUsernamePermission(id: string) {
        const user = await userService.get(id);
        return user?.agreeUsernamePermission ?? false;
    }

    async agreeTerms(id: string) {
        await userService.update(id, {agreeTerms: true});
    }

    async disagreeTerms(id: string) {
        await userService.update(id, {agreeTerms: false});
    }

    async agreeUsernamePermission(id: string) {
        await userService.update(id, {agreeUsernamePermission: true});
    }

    async disagreeUsernamePermission(id: string) {
        await userService.update(id, {agreeUsernamePermission: false});
    }
}

export const registerService = new RegisterService();
