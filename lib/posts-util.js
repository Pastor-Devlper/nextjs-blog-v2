import { MongoClient } from 'mongodb';

function getClient() {
  const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.ehe1nta.mongodb.net/?retryWrites=true&w=majority`;
  return new MongoClient(connectionString);
}

async function getCollection() {
  const client = getClient();
  await client.connect();
  const db = client.db(process.env.mongodb_database);
  return { collection: db.collection('posts'), client };
}

export async function getAllPosts() {
  const { collection, client } = await getCollection();
  try {
    const posts = await collection
      .find({}, { projection: { _id: 0, content: 0 } })
      .sort({ date: -1 })
      .toArray();
    return posts;
  } finally {
    client.close();
  }
}

export async function getFeaturedPosts() {
  const { collection, client } = await getCollection();
  try {
    const posts = await collection
      .find({ isFeatured: true }, { projection: { _id: 0, content: 0 } })
      .sort({ date: -1 })
      .toArray();
    return posts;
  } finally {
    client.close();
  }
}

export async function getPostData(slug) {
  const { collection, client } = await getCollection();
  try {
    const post = await collection.findOne({ slug }, { projection: { _id: 0 } });
    return post;
  } finally {
    client.close();
  }
}

export async function getPostsSlugs() {
  const { collection, client } = await getCollection();
  try {
    const posts = await collection
      .find({}, { projection: { _id: 0, slug: 1 } })
      .toArray();
    return posts.map((p) => p.slug);
  } finally {
    client.close();
  }
}
