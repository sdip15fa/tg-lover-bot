import {initializeApp} from "firebase-admin/app";
import {firebaseConfig} from "../configs/firebaseConfig";

export const firebaseApp = initializeApp(firebaseConfig);
