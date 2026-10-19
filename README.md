# English Play (영어로 놀자) 🎮

초등학생부터 누구나 쉽고 재미있게 영어를 공부할 수 있는 맞춤형 영어 학습 웹 애플리케이션입니다.

## 🚀 주요 기능

- **학년별 단어장**: 1학년부터 6학년까지 학년별 필수 영단어를 단계별로 학습할 수 있습니다.
- **직접 입력하기**: 내가 공부하고 싶은 단어를 직접 입력하여 맞춤형 단어장을 만듭니다.
- **주제별 학습**: 동물, 우주, 음식 등 흥미로운 주제별로 단어를 재미있게 익힙니다.
- **오늘의 뽑기**: 어떤 단어가 나올지 기대되는 랜덤 뽑기 방식으로 학습합니다.
- **사용자 학습**: 직접 작성한 단어장 파일을 업로드하여 자유롭게 학습할 수 있습니다.
- **학습 기록 관리**: 나의 학습 기록을 확인하고 복습할 수 있는 기능을 제공합니다.

## 🛠 기술 스택

- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 🏃 실행 방법

### 1. 프로젝트 복제 및 이동
```bash
git clone [repository-url]
cd english-study
```

### 2. 의존성 설치
이 프로젝트는 `npm`을 사용하여 패키지를 관리합니다.
```bash
npm install
```

### 3. 개발 서버 실행
로컬 환경에서 프로젝트를 실행하려면 다음 명령어를 사용하세요.
```bash
npm run dev
```
기본적으로 `http://localhost:5173` 주소에서 확인할 수 있습니다.

### 4. 빌드 및 배포
프로덕션용 빌드 파일을 생성하려면 다음 명령어를 사용하세요.
```bash
npm run build
```
결과물은 `dist` 폴더에 생성됩니다.

## 📁 디렉토리 구조

- `src/components`: UI 컴포넌트 및 학습 기능별 컴포넌트
- `src/data`: 학년별/주제별 기본 데이터셋 및 발음/예문 딕셔너리(`dictionary.js`)
- `src/context`: 애플리케이션 상태 관리
- `src/assets`: 이미지 및 스타일 파일
- `public/data`: 정적 단어장 텍스트 파일들 (배포 시 웹에서 fetch로 직접 로드)

---

## 📖 개발 후 테스트 및 Git 정적 페이지 배포 가이드

단어장 추가나 기능 개선 등 개발 작업을 마친 후, 정상 동작 여부를 테스트하고 GitHub Pages 정적 사이트에 변경 사항을 업데이트(배포)하는 단계별 가이드입니다.

### 1단계: 로컬 테스트 및 검증

#### 1) 로컬 개발 서버 실행
터미널에서 아래 명령어로 개발 서버를 시작합니다.
```bash
npm run dev
# Windows PowerShell 스크립트 실행 제한 시:
# npm.cmd run dev 또는 cmd /c npm run dev
```

#### 2) 브라우저 기능 확인
1. 브라우저에서 `http://localhost:5173/english-study/` (또는 콘솔에 표시된 주소)로 접속합니다.
2. 메인 화면에서 **"사용자 학습"** 메뉴를 클릭합니다.
3. **"추천 단어장 목록"** 탭에서 새로 추가된 단어장(예: `2026년 10월 20일 단어장`)이 정상적으로 표시되는지 확인합니다.
4. **"학습 시작하기"** 버튼을 눌러 학습 화면으로 진입합니다.
5. 단어 카드에서 아래 항목들이 올바르게 나오는지 검증합니다:
   - 단어 스펠링 및 발음 기호
   - 시험자료에 맞춘 단어 뜻 (예: `clean` -> `화창한, 햇볕이 잘드는, 명랑한`)
   - 예문 및 예문 해석
   - 발음 듣기(TTS) 및 음성 인식/철자 퀴즈 등 인터랙션 동작

#### 3) 자동화 E2E 테스트 실행 (선택 사항)
Playwright 기반 업로드 및 학습 흐름 검증 스크립트를 실행합니다:
```bash
node test_upload.mjs
```

---

### 2단계: 프로덕션 빌드 검증

배포 전 빌드 에러가 없는지 반드시 로컬에서 빌드를 테스트합니다.
```bash
npm run build
# Windows 환경: npm.cmd run build 또는 cmd /c npm run build
```
- 빌드 결과물은 `dist/` 폴더에 생성됩니다.
- `dist/data/` 디렉토리에 신규 단어장 파일(`20261020.txt` 등)이 올바르게 포함되었는지 확인합니다.

---

### 3단계: Git 정적 페이지(GitHub Pages) 업데이트 및 배포

GitHub Actions 워크플로우([deploy.yml](.github/workflows/deploy.yml))가 구성되어 있어, `main` 브랜치에 변경 사항을 `git push`하기만 하면 정적 페이지가 자동으로 빌드 및 배포됩니다.

#### 1) 변경 사항 확인
```bash
git status
```
수정된 파일(`src/data/dictionary.js`, `src/components/MethodUserUpload.jsx` 등)과 새로 추가된 파일(`public/data/20261020.txt` 등)이 확인됩니다.

#### 2) 스테이징 및 커밋
```bash
git add src/ public/ 20261020.txt README.md
git commit -m "feat: 20261020 신규 단어장 반영 및 사전 데이터 업데이트"
```

#### 3) 원격 저장소로 Push
```bash
git push origin main
```

#### 4) GitHub Actions 배포 진행 확인
1. GitHub 저장소 웹 페이지의 **Actions** 탭으로 이동합니다.
2. `Deploy static content to Pages` 워크플로우가 자동으로 실행되는 것을 확인합니다.
3. 빌드 및 배포(`build` -> `deploy`) 단계가 초록색 체크(✔)로 완료될 때까지 기다립니다 (보통 1~2분 소요).

#### 5) 실제 배포된 정적 사이트 확인
배포가 완료되면 아래 URL에 접속하여 변경 사항이 실시간으로 적용되었는지 최종 확인합니다:
👉 **[English Play 서비스 URL](https://devSCKwon.github.io/english-study/)**

---
© 2026 English Play. All rights reserved.

