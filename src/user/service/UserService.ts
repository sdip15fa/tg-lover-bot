import {Inject, Singleton} from "typescript-ioc";
import {db} from "../../common/db";
import {User} from "../interface/User";
import {UserView} from "../../common/view/user/UserView";
import {UserConverter} from "./UserConverter";
import {PhotoSize} from "typegram";
import {UserPhotoService} from "./UserPhotoService";
import {PhotoService} from "../../photo/service/PhotoService";
import {UserPhotoMessage} from "../constant/UserPhotoMessage";

@Singleton
export class UserService {
    constructor(
        @Inject
        private userPhotoService: UserPhotoService,
        @Inject
        private photoService: PhotoService
    ) {}

    async isBlocked(id: string): Promise<boolean> {
        const user = await this.get(id);
        return Boolean(user?.blocked);
    }

    async get(id: string): Promise<UserView | null> {
        const user: User = await UserService.userRepository.select().where({telegram_id: id}).first();
        if (!user) return null;
        return UserConverter.view(user);
    }

    async findByUsername(username: string): Promise<UserView | null> {
        const user: User = await UserService.userRepository.select().where({username}).first();
        if (!user) return null;
        return UserConverter.view(user);
    }

    async list(ids: string[]): Promise<UserView[]> {
        const result = await UserService.userRepository.select().whereIn("telegram_id", ids);
        return result.map(UserConverter.view);
    }

    async renewUsername(ctx: any) {
        await this.updateUserData(ctx.from.id, {username: ctx.from.username});
    }

    async updateUserData(telegramId: string, data: Partial<UserView>) {
        await this.upsert({telegramId, ...data});
    }

    async upsert(data: Partial<UserView>) {
        const user = await this.get(data.telegramId!);

        if (user) {
            await UserService.userRepository.update(UserConverter.model(data)).where({telegram_id: data.telegramId!});
        } else {
            await UserService.userRepository.insert(UserConverter.model(data));
        }
    }

    uploadPhoto = async (id: string, photo: PhotoSize): Promise<string> => {
        const photoCount = await this.userPhotoService.getPhotosCount(id);

        if (photoCount >= 5) {
            throw new Error(UserPhotoMessage.MAX_UPLOAD_PHOTO_ERROR);
        }

        return this.photoService.uploadPhoto(await this.photoService.getPhoto(photo.file_id));
    };

    addPhoto = async (id: string, photoURL: string): Promise<string[]> => {
        await this.userPhotoService.addPhoto(id, photoURL);
        return await this.userPhotoService.getPhotoURLs(id);
    };

    private static get userRepository() {
        return db.table("users");
    }
}
