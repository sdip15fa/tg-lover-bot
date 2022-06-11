import {Inject, Singleton} from "typescript-ioc";
import {UserService} from "../user/service/UserService";
import {UserView} from "../common/view/user/UserView";
import {PhotoSize} from "typegram/message";
import {PhotoService} from "../photo/service/PhotoService";
import {last} from "lodash";
import {RegisterMessage} from "./constant/RegisterMessage";
import {UserFilterView} from "../common/view/user/UserFilterView";
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

    agreeUsernamePermission = async (id: string) => {
        await this.userService.upsert({telegramId: id, agreeUsernamePermission: true});
    };

    disagreeUsernamePermission = async (id: string) => {
        await this.userService.upsert({telegramId: id, agreeUsernamePermission: false});
    };

    updateUserInfo = async (userView: UserView) => {
        await this.userService.upsert({
            ...userView,
            infoUpdated: true,
        });
    };

    updateFilter = async (id: string, userFilterView: UserFilterView) => {
        await this.userService.upsert({
            ...userFilterView,
            telegramId: id,
            filterUpdated: true,
        });
    };

    markPhotoUploaded = async (id: string) => {
        await this.userService.upsert({telegramId: id, photoUploaded: true});
    };

    uploadPhotos = async (id: string, photos: PhotoSize[]): Promise<string[] | null> => {
        const photoCount = await this.userPhotoService.getPhotosCount(id);

        if (photoCount >= 5) {
            throw new Error(RegisterMessage.MAX_UPLOAD_PHOTO_ERROR);
        }

        const photo: PhotoSize = last(photos) as PhotoSize;

        const photoURL = await this.photoService.uploadPhoto(await this.photoService.getPhoto(photo.file_id));

        await this.userPhotoService.addPhoto(id, photoURL);
        return await this.userPhotoService.getPhotoURLs(id);
    };

    clearPhotos = async (id: string) => {
        await this.userPhotoService.clearPhotos(id);
    };
}
