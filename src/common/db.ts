import {getDatabase} from "firebase-admin/database";
import {firebaseApp} from "../utils/firebaseApp";

export const db = getDatabase(firebaseApp);
