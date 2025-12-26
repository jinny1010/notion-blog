export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Notion 파일 URL인지 확인
    const decodedUrl = decodeURIComponent(url);
    
    if (!decodedUrl.includes('notion') && !decodedUrl.includes('s3')) {
      return res.status(403).json({ error: 'Invalid file URL' });
    }

    const response = await fetch(decodedUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }

    const text = await response.text();
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(text);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch file content',
      message: error.message 
    });
  }
}
