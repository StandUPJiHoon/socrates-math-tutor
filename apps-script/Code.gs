const MODEL = "gemini-2.5-flash-lite";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const LOG_HEADERS = [
  "timestamp",
  "classCode",
  "lessonId",
  "studentId",
  "turnIndex",
  "userMessage",
  "aiReply",
  "userCharCount",
  "aiCharCount",
  "userQuestionMark",
  "quickReplyUsed",
  "topic",
  "model",
  "success",
  "latencyMs",
  "error",
];

function doPost(e) {
  const startedAt = Date.now();
  let payload = {};
  let reply = "";
  let error = "";
  let success = false;

  try {
    payload = parsePayload_(e);
    validatePayload_(payload);

    const apiKey = getRequiredProperty_("GEMINI_API_KEY");
    reply = callGemini_(apiKey, payload);
    success = true;

    const latencyMs = Date.now() - startedAt;
    appendLog_(payload, reply, success, latencyMs, error);

    return json_({
      ok: true,
      reply,
      latencyMs,
    });
  } catch (err) {
    error = err && err.message ? err.message : String(err);
    const latencyMs = Date.now() - startedAt;
    appendLogSafely_(payload, reply, success, latencyMs, error);

    return json_({
      ok: false,
      error,
    });
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("POST body is required.");
  }

  return JSON.parse(e.postData.contents);
}

function validatePayload_(payload) {
  const requiredFields = ["classCode", "lessonId", "studentId", "message"];
  requiredFields.forEach((field) => {
    if (!payload[field]) {
      throw new Error(`${field} is required.`);
    }
  });
}

function callGemini_(apiKey, payload) {
  const response = UrlFetchApp.fetch(GEMINI_ENDPOINT, {
    method: "post",
    contentType: "application/json",
    headers: {
      "x-goog-api-key": apiKey,
    },
    muteHttpExceptions: true,
    payload: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildSystemInstruction_() }],
      },
      contents: buildContents_(payload),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    }),
  });

  const statusCode = response.getResponseCode();
  const bodyText = response.getContentText();
  const body = bodyText ? JSON.parse(bodyText) : {};

  if (statusCode < 200 || statusCode >= 300) {
    const message = body.error && body.error.message ? body.error.message : bodyText;
    throw new Error(`Gemini API error (${statusCode}): ${message}`);
  }

  const text = extractGeminiText_(body);
  if (!text) {
    throw new Error("Gemini API returned an empty reply.");
  }

  return text.trim();
}

function buildSystemInstruction_() {
  return [
    "당신은 초등학교 6학년 학생을 돕는 친근한 수학 AI 튜터 '수크라테스'입니다.",
    "주제는 분수의 나눗셈입니다.",
    "소크라테스식 문답법으로 학생이 스스로 원리를 생각하도록 돕습니다.",
    "정답을 바로 알려주지 말고, 한 번에 하나의 질문만 하세요.",
    "응답은 짧고 따뜻한 한국어로 작성하세요.",
    "분수는 반드시 [분수:분자/분모] 형식으로만 출력하세요. 예: [분수:1/2]",
    "답변 마지막에는 반드시 [예시:답변1|답변2|답변3] 형식을 붙이세요.",
    "개인정보를 요구하거나 저장하지 마세요.",
  ].join("\n");
}

function buildContents_(payload) {
  const history = Array.isArray(payload.history) ? payload.history : [];
  const contents = history
    .filter((item) => item && item.content)
    .map((item) => ({
      role: toGeminiRole_(item.role),
      parts: [{ text: String(item.content) }],
    }));

  contents.push({
    role: "user",
    parts: [{ text: String(payload.message) }],
  });

  return contents;
}

function toGeminiRole_(role) {
  return role === "assistant" || role === "model" || role === "socrates" ? "model" : "user";
}

function extractGeminiText_(body) {
  const candidate = body.candidates && body.candidates[0];
  const parts = candidate && candidate.content && candidate.content.parts;
  if (!parts || !parts.length) return "";

  return parts
    .map((part) => part.text || "")
    .join("")
    .trim();
}

function appendLogSafely_(payload, aiReply, success, latencyMs, error) {
  try {
    appendLog_(payload || {}, aiReply || "", success, latencyMs, error);
  } catch (logError) {
    console.error(logError);
  }
}

function appendLog_(payload, aiReply, success, latencyMs, error) {
  const sheetId = getRequiredProperty_("LOG_SHEET_ID");
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheet = getOrCreateLogsSheet_(spreadsheet);
  const userMessage = payload.message || "";

  sheet.appendRow([
    new Date().toISOString(),
    payload.classCode || "",
    payload.lessonId || "",
    payload.studentId || "",
    payload.turnIndex ?? "",
    userMessage,
    aiReply || "",
    String(userMessage).length,
    String(aiReply || "").length,
    /[?？]/.test(String(userMessage)),
    Boolean(payload.quickReplyUsed),
    payload.topic || "",
    MODEL,
    Boolean(success),
    latencyMs,
    error || "",
  ]);
}

function getOrCreateLogsSheet_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName("logs") || spreadsheet.insertSheet("logs");
  const currentHeaders = sheet.getRange(1, 1, 1, LOG_HEADERS.length).getValues()[0];
  const hasHeaders = currentHeaders.every((value, index) => value === LOG_HEADERS[index]);

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, LOG_HEADERS.length).setValues([LOG_HEADERS]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function getRequiredProperty_(key) {
  const value = PropertiesService.getScriptProperties().getProperty(key);
  if (!value) {
    throw new Error(`${key} script property is not set.`);
  }

  return value;
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
