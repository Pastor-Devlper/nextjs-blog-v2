import { v2 as cloudinary } from 'cloudinary';
import { getSession } from 'next-auth/react';

function configureCloudinary() {
  if (process.env.CLOUDINARY_URL) {
    const { hostname: cloud_name, username: api_key, password: api_secret } = new URL(
      process.env.CLOUDINARY_URL
    );
    cloudinary.config({ cloud_name, api_key, api_secret });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  configureCloudinary();

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'simslogv2/',
      max_results: 100,
      resource_type: 'image',
    });

    const images = result.resources
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((r) => ({
        url: r.secure_url,
        publicId: r.public_id,
        width: r.width,
        height: r.height,
      }));

    res.json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '이미지 목록을 불러오지 못했습니다.' });
  }
}
