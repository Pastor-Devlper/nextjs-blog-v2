import { MongoClient } from 'mongodb';

function getClient() {
  const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.ehe1nta.mongodb.net/?retryWrites=true&w=majority`;
  return new MongoClient(connectionString);
}

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { slug } = req.query;
    let client;
    try {
      client = getClient();
      await client.connect();
    } catch {
      return res.status(500).json({ message: 'DB 연결에 실패했습니다.' });
    }
    const db = client.db(process.env.mongodb_database);
    try {
      const result = await db.collection('posts').deleteOne({ slug });
      client.close();
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
      }
      try {
        await res.revalidate('/');
        await res.revalidate('/posts');
      } catch (_) {}
      return res.status(200).json({ message: '포스트가 삭제되었습니다.' });
    } catch {
      client.close();
      return res.status(500).json({ message: '포스트 삭제에 실패했습니다.' });
    }
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.query;
  const { title, date, image, excerpt, isFeatured, content } = req.body;

  if (!title || !title.trim()) {
    return res.status(422).json({ message: '제목을 입력해주세요.' });
  }

  let client;
  try {
    client = getClient();
    await client.connect();
  } catch {
    return res.status(500).json({ message: 'DB 연결에 실패했습니다.' });
  }

  const db = client.db(process.env.mongodb_database);

  try {
    const result = await db.collection('posts').updateOne(
      { slug },
      {
        $set: {
          title,
          date: date || new Date().toISOString().slice(0, 10),
          image: image || '',
          excerpt: excerpt || '',
          isFeatured: isFeatured || false,
          content: content || '',
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      client.close();
      return res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
    }

    client.close();

    try {
      await res.revalidate('/');
      await res.revalidate('/posts');
    } catch (_) {}

    res.status(200).json({ message: '포스트가 수정되었습니다.', slug });
  } catch {
    client.close();
    res.status(500).json({ message: '포스트 수정에 실패했습니다.' });
  }
}
