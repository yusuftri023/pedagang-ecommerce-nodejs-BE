import ImageKit from "imagekit";
import "dotenv/config";
import sharp from "sharp";
const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_SECRET_KEY, IMAGEKIT_URL_ENDPOINT } =
  process.env;
const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_SECRET_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

export const imagekitUpload = async (req, res, next) => {
  try {
    const resizeImage = await sharp(req.file.buffer)
      .resize(400)
      .jpeg({ mozjpeg: true })
      .toBuffer();
    const stringFile = resizeImage.toString("base64");
    const date = new Date();
    const formattedTime = Intl.DateTimeFormat("sv-SE").format(date);
    const currentTime = date.getTime();
    console.time("uploading to imagekit");
    await imagekit.createFolder({
      folderName: `${formattedTime}`,
      parentFolderPath: "/HMS-Nodejs/profile-picture",
    });

    const uploadImage = await imagekit.upload({
      fileName: `${currentTime}.jpeg`,
      file: stringFile,
      folder: `/HMS-Nodejs/profile-picture/${formattedTime}`,
    });
    console.timeEnd("uploading to imagekit");
    req.uploadImage = uploadImage;
    next();
  } catch (error) {
    res.send(error);
  }
};
