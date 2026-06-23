export const QUESTION_LIMIT_PER_LESSON = 100;

export function getUsageKey(studentId, lessonId) {
  return `usage_${studentId}_${lessonId}`;
}

export function loadUsageCount(studentId, lessonId) {
  if (!studentId || !lessonId) return 0;

  const stored = window.localStorage.getItem(getUsageKey(studentId, lessonId));
  const count = Number.parseInt(stored || "0", 10);

  return Number.isFinite(count) && count > 0 ? count : 0;
}

export function saveUsageCount(studentId, lessonId, count) {
  window.localStorage.setItem(getUsageKey(studentId, lessonId), String(count));
}

export function getRemainingQuestions(count) {
  return Math.max(QUESTION_LIMIT_PER_LESSON - count, 0);
}

export function incrementUsageCount(studentId, lessonId) {
  const nextCount = loadUsageCount(studentId, lessonId) + 1;
  saveUsageCount(studentId, lessonId, nextCount);

  return nextCount;
}
