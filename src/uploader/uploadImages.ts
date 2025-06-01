export interface IFileProps {
    uri: string;
    type: string;
    name?: string;
    preset?: string;
}

export interface IUploadImageResponse {
    asset_folder: string;
    asset_id: string;
    bytes: number;
    created_at: string;
    display_name: string;
    etag: string;
    format: string;
    height: number;
    original_filename: string;
    placeholder: boolean;
    public_id: string;
    resource_type: string;
    secure_url: string;
    signature: string;
    tags: any[];
    type: string;
    url: string;
    version: number;
    version_id: string;
    width: number;
}

const CloudName = "drdvp4vbk";
export const uploadImages = (payload: { files: IFileProps[]; preset?: string }): Promise<IUploadImageResponse[]> => {
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CloudName}/image/upload`;

    return new Promise(async (resolve, reject) => {
        try {
            // Create an array of promises for uploading each file
            const uploadPromises = payload.files.map((value, index) => {
                return new Promise<IUploadImageResponse>((resolve, reject) => {
                    const formData = new FormData();
                    formData.append('file', {
                        uri: value.uri,
                        type: value.type,
                        name: value.name || `image_${index}.jpg`,
                    });
                    formData.append('upload_preset', payload.preset || "default_preset");

                    const xhr = new XMLHttpRequest();

                    // Track upload progress for each file
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const progress = (event.loaded / event.total) * 100;
                            console.log(`Upload Progress for File ${index + 1}: ${progress.toFixed(2)}%`);
                        }
                    };

                    xhr.open('POST', CLOUDINARY_URL, true);

                    // Handle success and errors
                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            const result: IUploadImageResponse = JSON.parse(xhr.responseText);
                            resolve(result); // Resolve the promise with the response
                        } else {
                            const error = JSON.parse(xhr.responseText);
                            console.error(`Error uploading File ${index + 1}:`, error);
                            reject(error);
                        }
                    };

                    xhr.onerror = () => {
                        console.error(`Error during upload for File ${index + 1}`);
                        reject(new Error(`Failed to upload File ${index + 1}`));
                    };

                    xhr.send(formData); // Send the form data
                });
            });

            // Wait for all uploads to complete
            const results = await Promise.all(uploadPromises);
            return resolve(results); // Resolve with all upload responses
        } catch (error) {
            console.error('Error uploading images:', error);
            reject(error); // Reject the entire promise if something goes wrong
        }
    });
};
