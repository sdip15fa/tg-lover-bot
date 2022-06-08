import {initializeApp} from "firebase-admin/app";
import {firebaseConfig} from "../common/config/firebaseConfig";

export const firebaseApp = initializeApp(firebaseConfig);
