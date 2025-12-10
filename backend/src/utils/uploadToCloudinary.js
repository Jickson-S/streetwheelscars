// backend/src/utils/uploadToCloudinary.js
import cloudinary from "./cloudinary.js";

export const uploadBufferToCloudinary = async (buffer, folder = "streetwheelscars") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,                 // optional folder
        resource_type: "image", // default is image
        overwrite: false,
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result); // full result object
      }
    );
    stream.end(buffer);
  });
};
//const result = await cloudinary.uploader.upload("/path/to/file.jpg", { folder: "cars" });
