import { MongoClient } from 'mongodb';

function slugify(title) {
  return (
    title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w가-힣＀-￯一-鿿-]/g, '') || Date.now().toString()
  );
}

function getClient() {
  const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.ehe1nta.mongodb.net/?retryWrites=true&w=majority`;
  return new MongoClient(connectionString);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { title, date, image, excerpt, isFeatured, content } = req.body;

  if (!title || !title.trim()) {
    return res.status(422).json({ message: '제목을 입력해주세요.' });
  }

  const slug = slugify(title);

  let client;
  try {
    client = getClient();
    await client.connect();
  } catch {
    return res.status(500).json({ message: 'DB 연결에 실패했습니다.' });
  }

  const db = client.db(process.env.mongodb_database);

  try {
    const existing = await db.collection('posts').findOne({ slug });
    if (existing) {
      client.close();
      return res.status(409).json({ message: '같은 제목의 포스트가 이미 존재합니다.' });
    }

    const post = {
      slug,
      title,
      date: date || new Date().toISOString().slice(0, 10),
      image: image || '',
      excerpt: excerpt || '',
      isFeatured: isFeatured || false,
      content: content || '',
      createdAt: new Date(),
    };

    await db.collection('posts').insertOne(post);
    client.close();

    try {
      await res.revalidate('/');
      await res.revalidate('/posts');
    } catch (_) {}

    res.status(201).json({ message: '포스트가 저장되었습니다.', slug });
  } catch {
    client.close();
    res.status(500).json({ message: '포스트 저장에 실패했습니다.' });
  }
}
