import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);

  // 파일 목록 불러오기
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to fetch files');
      
      setFiles(data.files || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 파일 선택 시 내용 로드
  const handleFileSelect = async (e) => {
    const fileId = e.target.value;
    setSelectedFile(fileId);
    
    if (!fileId) {
      setMessages([]);
      return;
    }

    const file = files.find(f => f.id === fileId);
    if (!file) return;

    setContentLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/proxy?url=${encodeURIComponent(file.url)}`);
      const text = await res.text();
      
      let parsedMessages;
      if (file.name.endsWith('.jsonl')) {
        parsedMessages = text.trim().split('\n').map(line => JSON.parse(line));
      } else {
        const json = JSON.parse(text);
        parsedMessages = Array.isArray(json) ? json : [json];
      }
      
      setMessages(parsedMessages);
    } catch (err) {
      setError('파일을 불러오는데 실패했습니다: ' + err.message);
      setMessages([]);
    } finally {
      setContentLoading(false);
    }
  };

  // 메시지 포맷팅
  const formatMessage = (content) => {
    if (!content) return '';
    
    // OOC 처리
    content = content.replace(/\(??[Oo][Oo][Cc]\s*:[\s\S]*$/gm, (match) => {
      return `<details><summary>OOC Hidden</summary>${escapeHtml(match)}</details>`;
    });

    // thinking 태그 제거
    content = content.replace(/(?:```?\w*[\r\n]?)?<(thought|cot|thinking|CoT|think|starter)[\s\S]*?<\/(thought|cot|thinking|CoT|think|starter)>(?:[\r\n]?```?)?/g, '');

    // imageinfo 제거
    content = content.replace(/<[Ii][Mm][Aa][Gg][Ee][Ii][Nn][Ff][Oo]>[\s\S]*?<\/[Ii][Mm][Aa][Gg][Ee][Ii][Nn][Ff][Oo]>/g, '');

    // 코드 블록 보존
    const codeBlocks = [];
    content = content.replace(/```([\s\S]*?)```/g, (match, code) => {
      codeBlocks.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
      return `___CODEBLOCK${codeBlocks.length - 1}___`;
    });

    // 인라인 코드
    content = content.replace(/`([^`]+)`/g, (match, code) => {
      return `<code>${escapeHtml(code)}</code>`;
    });

    // 마크다운 변환
    content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    content = content.replace(/\*(.+?)\*/g, '<em>$1</em>');
    content = content.replace(/_(.+?)_/g, '<em>$1</em>');

    // 인용문 ("..." → <q>)
    content = content.replace(/"([^"]+)"/g, '<q>"$1"</q>');

    // 코드 블록 복원
    codeBlocks.forEach((block, i) => {
      content = content.replace(`___CODEBLOCK${i}___`, block);
    });

    // 줄바꿈 처리
    content = content.replace(/\n\n+/g, '</p><p>');
    content = content.replace(/\n/g, '<br>');
    content = `<p>${content}</p>`;

    return content;
  };

  const escapeHtml = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  };

  return (
    <>
      <Head>
        <title>Notion JSON Viewer</title>
        <meta name="description" content="노션 DB의 JSON 파일을 채팅 형식으로 보여줍니다" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="header">
        <h1>📄 Notion JSON Viewer</h1>
        <div className="header-controls">
          <select 
            className="file-select"
            value={selectedFile}
            onChange={handleFileSelect}
            disabled={loading}
          >
            <option value="">
              {loading ? '로딩 중...' : '파일을 선택하세요'}
            </option>
            {files.map(file => (
              <option key={file.id} value={file.id}>
                {file.title || file.name}
              </option>
            ))}
          </select>
          <button 
            className="btn btn-refresh"
            onClick={fetchFiles}
            disabled={loading}
          >
            🔄 새로고침
          </button>
        </div>
      </header>

      <main className="chat-container">
        {error && (
          <div className="error">
            <p>⚠️ {error}</p>
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>파일 목록을 불러오는 중...</p>
          </div>
        )}

        {!loading && !error && !selectedFile && (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <p>노션 DB에서 JSON 파일을 선택하세요</p>
            <p style={{ marginTop: '8px', fontSize: '14px', opacity: 0.7 }}>
              {files.length > 0 ? `${files.length}개의 파일이 있습니다` : '파일이 없습니다'}
            </p>
          </div>
        )}

        {contentLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>파일을 불러오는 중...</p>
          </div>
        )}

        {!contentLoading && messages.length > 0 && (
          <div className="chat-messages">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user' || msg.is_user === true || msg.sender === 'user';
              const content = msg.content || msg.message || msg.text || msg.mes || '';
              const name = msg.name || msg.sender || (isUser ? 'User' : 'AI');

              if (!content) return null;

              return (
                <div key={index} className={`chat-message ${isUser ? 'user' : ''}`}>
                  <div className="avatar">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div 
                    className="message-content"
                    dangerouslySetInnerHTML={{ __html: formatMessage(content) }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
