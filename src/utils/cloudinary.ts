// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadOnCloudinary = async (localFilePath: any) => {
//     try {
//         if (!localFilePath) return null
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })
//         console.log("File has been uploaded successfully!", response);
//         fs.unlinkSync(localFilePath)
//         return response;
//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove the locally saved temp file as the upload operation got failed
//     }
// }

// export { uploadOnCloudinary }





import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (fileBuffer: any, fileName: any) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', public_id: fileName }, // Automatically determine the resource type
      (error: any, result) => {
        if (error) return reject(error);
        resolve(result?.url);
      }
    );


    // End the stream with the file buffer
    stream.end(fileBuffer);
  });
};
