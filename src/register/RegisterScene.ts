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

registerScene.hears(/自我介紹/g, registerController.createUserInfo);
