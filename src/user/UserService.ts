import {db} from "../common/db";
import {UserView} from "./UserView";

class UserService {
    private readonly usersRef = db.ref("users");

    async get(id: string) {
        const userSnapshot = await this.usersRef.child(id).once("value");

        if (!userSnapshot.exists()) {
            return null;
        }

        return userSnapshot.val() as UserView;
    }

    async update(id: string, data: Partial<UserView>) {
        await this.usersRef.child(id).update(data);
    }
}

export const userService = new UserService();
