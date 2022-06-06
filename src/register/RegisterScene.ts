import {Scenes} from "telegraf";
import {RegisterAction} from "./RegisterAction";
import {registerController} from "./RegisterController";

export const registerScene = new Scenes.BaseScene("register");

registerScene.enter(registerController.enterScene);

registerScene.action(RegisterAction.AGREE_TERMS, registerController.usernamePermission);
registerScene.action(RegisterAction.DISAGREE_TERMS, registerController.disagreeTerms);
registerScene.action(RegisterAction.AGREE_USERNAME_PERMISSION, registerController.createInfo);
registerScene.action(RegisterAction.DISAGREE_USERNAME_PERMISSION, registerController.disagreeUsernamePermission);
