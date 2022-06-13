import {Singleton} from "typescript-ioc";
import {db} from "../../common/db";
import {User} from "../interface/User";
import {UserView} from "../../common/view/user/UserView";
import {UserConverter} from "./UserConverter";

@Singleton
export class UserService {
    async get(id: string): Promise<UserView | null> {
        const user: User = (await UserService.userRepository.select().where({telegram_id: id}))?.[0];

        if (!user) {
            return null;
        }

        return UserConverter.view(user);
    }

    async upsert(data: Partial<UserView>) {
        const user = await this.get(data.telegramId!);

        if (user) {
            await UserService.userRepository.update(UserConverter.model(data)).where({telegram_id: data.telegramId!});
        } else {
            await UserService.userRepository.insert(UserConverter.model(data));
        }
    }

    private static get userRepository() {
        return db.table("users");
    }
}
