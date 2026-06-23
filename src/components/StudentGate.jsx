import { BookOpen, ChevronRight, ShieldCheck } from "lucide-react";
import { createStudentProfile, saveStudentProfile } from "../utils/studentProfile";

const PRIVACY_NOTICE =
  "이 앱에는 이름, 전화번호, 주소, 학교명, 친구 이름 등 개인정보를 입력하지 마세요. 수학 문제와 풀이 생각만 입력하세요.";

export default function StudentGate({ onStart }) {
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const profile = createStudentProfile({
      classCode: formData.get("classCode"),
      studentNumber: formData.get("studentNumber"),
      lessonId: formData.get("lessonId"),
    });

    if (!profile.classCode || !profile.studentNumber || !profile.lessonId) return;

    saveStudentProfile(profile);
    onStart(profile);
  }

  return (
    <div style={{width:"100%",minHeight:"100vh",background:"#B2C7D9",display:"flex",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:430,minHeight:"100vh",background:"#B2C7D9",display:"flex",flexDirection:"column",padding:"32px 20px",boxSizing:"border-box"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
          <div style={{width:52,height:52,borderRadius:16,background:"#FEE500",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 20px rgba(0,0,0,0.12)"}}>
            <BookOpen size={28} color="#111" />
          </div>
          <div>
            <h1 style={{fontSize:23,lineHeight:1.2,margin:0,fontWeight:800,color:"#111827"}}>수크라테스</h1>
            <p style={{fontSize:13,margin:"4px 0 0",color:"#374151",fontWeight:600}}>분수의 나눗셈 학습방</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{background:"#fff",borderRadius:18,padding:"22px 18px",boxShadow:"0 10px 26px rgba(0,0,0,0.13)",display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
            <ShieldCheck size={20} color="#10b981" />
            <span style={{fontSize:15,fontWeight:800,color:"#111827"}}>익명으로 시작하기</span>
          </div>

          <label style={{display:"flex",flexDirection:"column",gap:6}}>
            <span style={{fontSize:12,fontWeight:700,color:"#6b7280"}}>학급 코드</span>
            <input name="classCode" required autoComplete="off" placeholder="예: A반" style={inputStyle} />
          </label>

          <label style={{display:"flex",flexDirection:"column",gap:6}}>
            <span style={{fontSize:12,fontWeight:700,color:"#6b7280"}}>학생 번호</span>
            <input name="studentNumber" required inputMode="numeric" autoComplete="off" placeholder="예: 12" style={inputStyle} />
          </label>

          <label style={{display:"flex",flexDirection:"column",gap:6}}>
            <span style={{fontSize:12,fontWeight:700,color:"#6b7280"}}>차시</span>
            <input name="lessonId" required autoComplete="off" placeholder="예: 1차시" style={inputStyle} />
          </label>

          <div style={{background:"#f8fafc",border:"1px solid #e5e7eb",borderRadius:14,padding:"12px 13px",fontSize:13,lineHeight:1.55,color:"#374151"}}>
            {PRIVACY_NOTICE}
          </div>

          <button type="submit" style={{height:48,border:"none",borderRadius:14,background:"#FEE500",color:"#111",fontSize:16,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:2}}>
            시작하기
            <ChevronRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  height: 44,
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "0 13px",
  outline: "none",
  fontSize: 15,
  background: "#fff",
  boxSizing: "border-box",
};
