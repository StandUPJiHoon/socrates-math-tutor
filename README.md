# 수크라테스 분수 튜터

초등학교 6학년 분수의 나눗셈 학습을 위한 React/Vite 앱입니다.

## 실행 방법

1. Node.js를 설치합니다.
2. 의존성을 설치합니다.

```bash
npm install
```

3. 개발 서버를 실행합니다.

```bash
npm run dev
```

4. 배포용 파일을 만듭니다.

```bash
npm run build
```

## 현재 상태

이번 작업은 기존에 붙여넣은 React 코드를 Vite 프로젝트에서 실행 가능하게 구성하는 단계입니다.
Firebase, Apps Script, Gemini 연결은 아직 추가하지 않았습니다.

## Google Apps Script 설정 방법

`apps-script/Code.gs`는 React 앱과 Gemini API 사이에서 동작하는 중간 서버 코드입니다.

1. Google Drive에서 새 Google Sheets 파일을 만듭니다.
2. 시트 이름은 그대로 두어도 됩니다. Apps Script가 `logs` 시트를 자동으로 만들거나 헤더를 채웁니다.
3. 스프레드시트 URL에서 Sheet ID를 복사합니다.
   - 예: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`
4. Google Apps Script에서 새 프로젝트를 만듭니다.
5. `apps-script/Code.gs` 내용을 Apps Script 편집기의 `Code.gs`에 붙여넣습니다.
6. Apps Script 왼쪽의 `프로젝트 설정`에서 `스크립트 속성`을 추가합니다.
   - `GEMINI_API_KEY`: Google AI Studio에서 만든 Gemini API key
   - `LOG_SHEET_ID`: 3번에서 복사한 Google Sheet ID
7. `배포` -> `새 배포`를 누릅니다.
8. 유형은 `웹 앱`을 선택합니다.
9. 실행 사용자는 `나`, 액세스 권한은 수업에서 사용할 방식에 맞게 설정합니다.
10. 배포 후 생성된 Web App URL을 복사합니다.

Apps Script는 `POST` 요청을 받아 Gemini 2.5 Flash-Lite를 호출하고, `logs` 시트에 다음 열로 학습 로그를 저장합니다.

```text
timestamp, classCode, lessonId, studentId, turnIndex, userMessage, aiReply, userCharCount, aiCharCount, userQuestionMark, quickReplyUsed, topic, model, success, latencyMs, error
```
