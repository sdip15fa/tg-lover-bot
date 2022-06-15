import {db} from "../../common/db";
import {Singleton} from "typescript-ioc";
import {UserPhoto} from "../interface/UserPhoto";

@Singleton
export class UserPhotoService {
    private static get userPhotoRepository() {
        return db.table("user_photos");
    }

    async getPhotosCount(id: string): Promise<number> {
        const result = await UserPhotoService.userPhotoRepository.count().where({telegram_id: id});
        return Number(result?.[0].count) || 0;
    }

    async batchFetchPhotoURLs(ids: string[]): Promise<UserPhoto[]> {
        return UserPhotoService.userPhotoRepository.select<UserPhoto[]>().whereIn("telegram_id", ids).limit(5);
    }

    async getPhotoURLs(id: string): Promise<string[]> {
        return UserPhotoService.userPhotoRepository.pluck("photo_url").where({telegram_id: id}).limit(5);
    }

    async addPhoto(id: string, photoURL: string): Promise<void> {
        await UserPhotoService.userPhotoRepository.insert({
            telegram_id: id,
            photo_url: photoURL,
        });
    }

    async clearPhotos(id: string): Promise<void> {
        await UserPhotoService.userPhotoRepository.delete().where({telegram_id: id});
    }
}
