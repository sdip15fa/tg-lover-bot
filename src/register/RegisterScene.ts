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

registerScene.hears(/^#自我介紹/g, registerController.createUserInfo);
registerScene.hears(/^#配對條件/g, registerController.updateFilter);
registerScene.command("clearPhotos", registerController.clearPhotos);

registerScene.on("message", async ctx => {
    const hasPhoto = Boolean((ctx as any)?.message?.photo);

    if (hasPhoto) {
        await registerController.uploadPhotos(ctx);
        return;
    }
});
