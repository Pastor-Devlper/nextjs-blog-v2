import type { NextApiRequest, NextApiResponse } from 'next';
// import { promises as fs } from 'fs';
// import path from 'path';
import formidable, { File } from 'formidable';
import { v2 as cloudinary } from 'cloudinary';

/* Don't miss that! */
export const config = {
  api: {
    bodyParser: false,
  },
};

type ProcessedFiles = Array<[string, File]>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let status = 200,
    resultBody = {
      status: 'ok',
      message: 'Files were uploaded successfully',
      filePaths: [],
    };

  /* Get files using formidable */
  const files = await new Promise<ProcessedFiles | undefined>(
    (resolve, reject) => {
      const form = new formidable.IncomingForm();
      const files: ProcessedFiles = [];
      form.on('file', function (field, file) {
        files.push([field, file]);
      });
      form.on('end', () => resolve(files));
      form.on('error', (err) => reject(err));
      form.parse(req, () => {
        //
      });
    }
  ).catch((e) => {
    console.log(e);
    status = 500;
    resultBody = {
      status: 'fail',
      message: 'Upload error',
      filePaths: [],
    };
  });

  if (process.env.CLOUDINARY_URL) {
    const {
      hostname: cloud_name,
      username: api_key,
      password: api_secret,
    } = new URL(process.env.CLOUDINARY_URL);

    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
    });
  }

  if (files) {
    for (const file of files) {
      const filePath = file[1]?.filepath;
      const result = await cloudinary.uploader.upload(filePath, {
        // width: 512,
        // height: 512,
        // crop: 'fill',
        folder: 'dreamch/posts',
      });
      // console.log(result);
      resultBody.filePaths.push(result.secure_url);
    }
  }

  res.status(status).json(resultBody);
};

export default handler;
