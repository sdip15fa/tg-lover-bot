import {Inject, Singleton} from "typescript-ioc";
import {UserInfoController} from "../../user/controller/UserInfoController";
import {UserFilterController} from "../../user/controller/UserFilterController";
import {UserPhotoController} from "../../user/controller/UserPhotoController";

@Singleton
export class CommonController {
    constructor(
        @Inject
        private readonly userInfoController: UserInfoController,
        @Inject
        private readonly userFilterController: UserFilterController,
        @Inject
        private readonly userPhotoController: UserPhotoController
    ) {}

    webAppData = async ctx => {
        if (ctx.update.message.web_app_data.button_text === "更新自我介紹") {
            await this.userInfoController.updateUserInfo(ctx);
            return;
        }

        if (ctx.update.message.web_app_data.button_text === "更新配對條件") {
            await this.userFilterController.updateFilter(ctx);
            return;
        }
    };

    photo = async ctx => {
        const hasPhoto = Boolean((ctx as any)?.message?.photo);

        if (hasPhoto) {
            await this.userPhotoController.uploadPhotos(ctx);
            return;
        }
    };
}
