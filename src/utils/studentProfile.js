const STUDENT_PROFILE_KEY = "socratesMathTutor.studentProfile";

function normalize(value) {
  return String(value || "").trim();
}

export function createStudentProfile({ classCode, studentNumber, lessonId }) {
  const cleanClassCode = normalize(classCode);
  const cleanStudentNumber = normalize(studentNumber);
  const cleanLessonId = normalize(lessonId);

  return {
    classCode: cleanClassCode,
    studentNumber: cleanStudentNumber,
    lessonId: cleanLessonId,
    studentId: `${cleanClassCode}-${cleanStudentNumber}`,
  };
}

export function loadStudentProfile() {
  try {
    const raw = window.localStorage.getItem(STUDENT_PROFILE_KEY);
    if (!raw) return null;

    const profile = JSON.parse(raw);
    if (!profile.classCode || !profile.studentNumber || !profile.lessonId || !profile.studentId) {
      return null;
    }

    return profile;
  } catch {
    return null;
  }
}

export function saveStudentProfile(profile) {
  window.localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(profile));
}
