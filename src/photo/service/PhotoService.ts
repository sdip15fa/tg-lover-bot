import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import {Singleton} from "typescript-ioc";
import https from "https";
import * as uuid from "uuid";

@Singleton
export class PhotoService {
    async getPhoto(fileId: string) {
        const response = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${fileId}`);
        const filePath = response.data?.result?.file_path;

        const fileUUID = uuid.v4();

        // response to file
        const file = fs.createWriteStream(`/tmp/${fileUUID}`);

        await new Promise(resolve => {
            https.get(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${filePath}`, function (response) {
                response.pipe(file);

                // after download completed close filestream
                file.on("finish", () => {
                    file.close();
                    resolve(null);
                });
            });
        });

        return fs.createReadStream(`/tmp/${fileUUID}`);
    }

    async uploadPhoto(file: any) {
        try {
            const formData = new FormData();
            formData.append("image", file);
            const response = await axios.post("https://api.na.cx/upload", formData, {
                headers: formData.getHeaders(),
            });
            return response.data.url;
        } catch (e) {
            console.log(e);
        }
    }
}
