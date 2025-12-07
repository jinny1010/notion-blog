# 🌸 Notion Blog

노션 데이터베이스를 활용한 개인 블로그입니다.

## 🚀 배포 방법

### 1. GitHub에 업로드
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/본인아이디/notion-blog.git
git push -u origin main
```

### 2. Vercel 배포
1. [vercel.com](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭
4. 방금 만든 repository 선택
5. **Environment Variables** 설정:
   - `NOTION_TOKEN`: 노션 Integration 토큰 (secret_로 시작)
   - `NOTION_DATABASE_ID`: 데이터베이스 ID (32자리)
6. Deploy!

### 3. 노션 데이터베이스 구조
| 속성 이름 | 타입 | 설명 |
|----------|------|------|
| Name | Title | 제목 |
| Description | Text | 설명 |
| Image | Files & media | 이미지 (선택) |

## 📝 사용법
- 노션에서 데이터 수정 → 웹사이트 자동 업데이트 (최대 60초 딜레이)
- 새로운 항목 추가 → 웹사이트에 자동 표시

## 🛠️ 기술 스택
- Next.js 14 (App Router)
- Notion API (@notionhq/client)
- Vercel (호스팅)
