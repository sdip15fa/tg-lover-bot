import {Inject, Singleton} from "typescript-ioc";
import {UserService} from "../user/service/UserService";
import {PhotoService} from "../photo/service/PhotoService";
import {UserPhotoService} from "../user/service/UserPhotoService";

@Singleton
export class RegisterService {
    constructor(
        @Inject
        private userService: UserService,
        @Inject
        private userPhotoService: UserPhotoService,
        @Inject
        private photoService: PhotoService
    ) {}

    isRegistered = async (id: string) => {
        const user = await this.userService.get(id);
        return user?.registered ?? false;
    };

    isAgreeTerms = async (id: string) => {
        const user = await this.userService.get(id);
        return user?.agreeTerms ?? false;
    };

    isAgreeUsernamePermission = async (id: string) => {
        const user = await this.userService.get(id);
        return user?.agreeUsernamePermission ?? false;
    };

    isInfoUpdated = async (id: string) => {
        const user = await this.userService.get(id);
        return Boolean(user?.infoUpdated);
    };

    isPhotoUploaded = async (id: string) => {
        const user = await this.userService.get(id);
        return Boolean(user?.photoUploaded);
    };

    isFilterUpdated = async (id: string) => {
        const user = await this.userService.get(id);
        return Boolean(user?.filterUpdated);
    };

    agreeTerms = async (id: string) => {
        await this.userService.upsert({telegramId: id, agreeTerms: true});
    };

    disagreeTerms = async (id: string) => {
        await this.userService.upsert({telegramId: id, agreeTerms: false});
    };

    agreeUsernamePermission = async (id: string, username: string) => {
        await this.userService.upsert({telegramId: id, username, agreeUsernamePermission: true});
    };

    disagreeUsernamePermission = async (id: string) => {
        await this.userService.upsert({telegramId: id, agreeUsernamePermission: false});
    };

    markRegistered = async (id: string) => {
        await this.userService.upsert({
            telegramId: id,
            registered: true,
        });
    };

    markPhotoUploaded = async (id: string) => {
        await this.userService.upsert({telegramId: id, photoUploaded: true});
    };
}
