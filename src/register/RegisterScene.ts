import {Scenes} from "telegraf";
import {Container} from "typescript-ioc";
import {RegisterAction} from "./constant/RegisterAction";
import {RegisterController} from "./RegisterController";

export const registerScene = new Scenes.BaseScene("register");

const registerController = Container.get(RegisterController);

registerScene.enter(registerController.enterScene);

registerScene.action(RegisterAction.AGREE_TERMS, registerController.agreeTerms);
registerScene.action(RegisterAction.DISAGREE_TERMS, registerController.disagreeTerms);
registerScene.action(RegisterAction.AGREE_USERNAME_PERMISSION, registerController.agreeUsernamePermission);
registerScene.action(RegisterAction.DISAGREE_USERNAME_PERMISSION, registerController.disagreeUsernamePermission);
registerScene.action(RegisterAction.UPDATE_FILTER, registerController.askForFilter);

registerScene.command("clear_photos", registerController.clearPhotos);

registerScene.on("web_app_data", async ctx => {
    if (ctx.update.message.web_app_data.button_text === "填寫自我介紹") {
        await registerController.updateUserInfo(ctx);
        return;
    }
    if (ctx.update.message.web_app_data.button_text === "填寫配對條件") {
        await registerController.updateFilter(ctx);
        return;
    }
});

registerScene.on("message", async ctx => {
    const hasPhoto = Boolean((ctx as any)?.message?.photo);

    if (hasPhoto) {
        await registerController.uploadPhotos(ctx);
        return;
    }
});
