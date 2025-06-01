import { cloudfolder, presettype } from "../utils/cloudpreset";
import { IFileProps, IUploadImageResponse } from "./upload"

const CloudName = "drdvp4vbk"
export const uploadImage = (payload: IFileProps, onProgress?: (value: number) => void): Promise<IUploadImageResponse> => {
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CloudName}/image/upload`;

    return new Promise(function (resolve, reject) {
        const formData = new FormData();
        formData.append('file', {
            uri: payload.uri,
            type: payload.type,
            name: payload.name,
        });
        formData.append('upload_preset', payload.preset);
        formData.append('folder', cloudfolder[payload.preset as presettype]); // Specify the folder name here

        try {
            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = (event.loaded / event.total) * 100;
                    if(onProgress) (
                        onProgress(progress)
                    )
                }
            };

            xhr.open('POST', CLOUDINARY_URL, true);

            // Set up response handling
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText);
                    resolve(result)
                } else {
                    const error = JSON.parse(xhr.responseText);
                    return reject(error)
                }
            };

            xhr.onerror = (error) => {
                return reject(error)
            };

            // Send form data
            xhr.send(formData);
        } catch (error) {
            return reject(error)
        }
    });
}