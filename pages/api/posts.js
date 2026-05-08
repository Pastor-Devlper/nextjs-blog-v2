import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'posts');

function slugify(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w가-힣＀-￯一-鿿-]/g, '')
    || Date.now().toString();
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { title, date, image, excerpt, isFeatured, content } = req.body;

  if (!title || !title.trim()) {
    return res.status(422).json({ message: '제목을 입력해주세요.' });
  }

  const slug = slugify(title);
  const filePath = path.join(postsDirectory, `${slug}.md`);

  if (fs.existsSync(filePath)) {
    return res.status(409).json({ message: '같은 제목의 포스트가 이미 존재합니다.' });
  }

  const frontmatter = [
    '---',
    `title: '${title.replace(/'/g, "\\'")}'`,
    `date: '${date || new Date().toISOString().slice(0, 10)}'`,
    `image: ${image || ''}`,
    `excerpt: ${excerpt || ''}`,
    `isFeatured: ${isFeatured ? 'true' : 'false'}`,
    '---',
    '',
  ].join('\n');

  const fileContent = frontmatter + (content || '');

  try {
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    res.status(201).json({ message: '포스트가 저장되었습니다.', slug });
  } catch (error) {
    res.status(500).json({ message: '파일 저장에 실패했습니다.' });
  }
}
