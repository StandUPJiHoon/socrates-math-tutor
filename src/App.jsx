import { useState, useEffect, useRef, useMemo } from "react";
import { Search, User, MessageCircle, MoreHorizontal, ChevronLeft, UserPlus, Plus, Smile, Send, X, Play, Minus, BookOpen } from "lucide-react";

const generateAppIcon = (emoji, bgColor) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${bgColor}"/><text x="50" y="50" font-size="50" text-anchor="middle" dominant-baseline="central">${emoji}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

// 소크라테스 흉상 SVG
const SOCRATES_RAW = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="st" cx="42%" cy="35%" r="75%"><stop offset="0%" stop-color="#efe9da"/><stop offset="60%" stop-color="#d8cdb4"/><stop offset="100%" stop-color="#b3a585"/></radialGradient></defs><rect width="100" height="100" fill="#3b4a5c"/><path d="M34 88 L30 100 L70 100 L66 88 Z" fill="#9c8f6f"/><rect x="28" y="86" width="44" height="5" rx="2" fill="#8a7d5d"/><path d="M38 78 Q36 88 34 90 L66 90 Q64 88 62 78 Z" fill="url(#st)"/><path d="M26 44 Q22 20 50 16 Q78 20 74 44 Q76 60 66 72 Q58 82 50 82 Q42 82 34 72 Q24 60 26 44 Z" fill="url(#st)"/><path d="M36 30 Q50 27 64 30" stroke="#b0a384" stroke-width="1.2" fill="none" opacity="0.6"/><path d="M35 35 Q50 32 65 35" stroke="#b0a384" stroke-width="1.2" fill="none" opacity="0.6"/><path d="M34 43 Q41 39 47 43 Q41 41 34 44 Z" fill="#7a6e52"/><path d="M53 43 Q59 39 66 43 Q59 41 53 44 Z" fill="#7a6e52"/><ellipse cx="40" cy="47" rx="3.4" ry="2.4" fill="#cabd9c"/><ellipse cx="60" cy="47" rx="3.4" ry="2.4" fill="#cabd9c"/><circle cx="40.5" cy="47.5" r="1.6" fill="#5a4f3a"/><circle cx="60.5" cy="47.5" r="1.6" fill="#5a4f3a"/><path d="M50 47 Q47 56 44 60 Q47 63 50 63 Q53 63 56 60 Q53 56 50 47 Z" fill="#cdc09f"/><path d="M40 65 Q50 62 60 65 Q55 68 50 67 Q45 68 40 65 Z" fill="#8a7d5d"/><path d="M34 60 Q30 76 38 86 Q44 92 50 92 Q56 92 62 86 Q70 76 66 60 Q64 70 58 76 Q54 80 50 80 Q46 80 42 76 Q36 70 34 60 Z" fill="#c2b594"/><circle cx="40" cy="72" r="3.2" fill="#b3a585" opacity="0.7"/><circle cx="46" cy="78" r="3.4" fill="#bcae8d" opacity="0.7"/><circle cx="54" cy="78" r="3.4" fill="#b3a585" opacity="0.7"/><circle cx="60" cy="72" r="3.2" fill="#bcae8d" opacity="0.7"/><circle cx="50" cy="82" r="3.6" fill="#b3a585" opacity="0.6"/><circle cx="28" cy="50" r="3.4" fill="#bcae8d" opacity="0.7"/><circle cx="30" cy="58" r="3" fill="#b3a585" opacity="0.7"/><circle cx="72" cy="50" r="3.4" fill="#bcae8d" opacity="0.7"/><circle cx="70" cy="58" r="3" fill="#b3a585" opacity="0.7"/></svg>`;
const SOCRATES_SVG = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(SOCRATES_RAW)))}`;

const MY_PROFILE = { id:"me", name:"나", statusMessage:"열심히 수학 공부 중", avatarUrl:"https://api.dicebear.com/7.x/notionists/svg?seed=me&backgroundColor=e2e8f0" };

const INITIAL_FRIENDS = [
  { id:"socrates", type:"bot", name:"수크라테스 🦉", statusMessage:"분수의 나눗셈, 왜 그렇게 계산할까?", avatarUrl:SOCRATES_SVG },
  { id:"summary", type:"note", name:"📘 분수의 나눗셈 정리", statusMessage:"단원 핵심 원리 한눈에 보기", avatarUrl:generateAppIcon("📘","#34d399") },
  { id:"app_bar",        type:"app", name:"막대로 분수 공부하기",    statusMessage:"막대에서 몇 번 덜어낼까?",   avatarUrl:generateAppIcon("🍫","#fde047") },
  { id:"app_numberline", type:"app", name:"수직선으로 분수 공부하기", statusMessage:"수직선에서 몇 번 뛸까?",     avatarUrl:generateAppIcon("📏","#fca5a5") },
  { id:"app_watercup",   type:"app", name:"물컵으로 분수 공부하기",   statusMessage:"몇 컵에 나눠 담을까?",      avatarUrl:generateAppIcon("💧","#93c5fd") },
  { id:"app_ribbon",     type:"app", name:"리본으로 분수 공부하기",   statusMessage:"리본을 몇 조각 자를까?",    avatarUrl:generateAppIcon("🎀","#f9a8d4") },
];

const INITIAL_MESSAGES = {
  c_socrates: [{ id:"m_soc_1", senderId:"socrates",
    text:"안녕! 나는 너의 수학 사고력을 쑥쑥 키워줄 AI 튜터, 수크라테스야 🦉\n초등학교 6학년 [분수:1/2] ÷ [분수:1/3] 같은 분수의 나눗셈에 대해 같이 생각해볼까?\n어떤 부분부터 시작하면 좋을까?[예시:나누기를 곱하기로 바꾸는 법이 궁금해|통분해서 계산하는 법이 궁금해|분수 나눗셈 자체가 너무 어려워ㅠㅠ]",
    timestamp:Date.now()-1800000, unread:1 }]
};
const INITIAL_ROOMS = [
  { id:"c_socrates", type:"dm", name:"수크라테스 🦉", members:["me","socrates"], lastUpdate:Date.now()-1800000, unreadCount:1 }
];

function fmt(ts){ const d=new Date(ts),h=d.getHours(),m=d.getMinutes(); return `${h>=12?"오후":"오전"} ${h%12||12}:${m<10?"0"+m:m}`; }
function fmtDate(ts){ const d=new Date(ts),days=["일","월","화","수","목","금","토"]; return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`; }
function sameDay(a,b){const da=new Date(a),db=new Date(b);return da.getFullYear()===db.getFullYear()&&da.getMonth()===db.getMonth()&&da.getDate()===db.getDate();}
function sameMin(a,b){const da=new Date(a),db=new Date(b);return sameDay(a,b)&&da.getHours()===db.getHours()&&da.getMinutes()===db.getMinutes();}

function Frac({ n, d, color="inherit", size="md" }) {
  const fs = size==="lg"?{num:22,bar:36,den:22}:size==="sm"?{num:13,bar:22,den:13}:{num:15,bar:28,den:15};
  return (
    <span style={{display:"inline-flex",flexDirection:"column",alignItems:"center",verticalAlign:"middle",lineHeight:1,margin:"0 3px",transform:"translateY(-1px)"}}>
      <span style={{fontSize:fs.num,fontWeight:700,color,lineHeight:1.1,textAlign:"center"}}>{n}</span>
      <span style={{width:fs.bar,height:2,background:color==="inherit"?"currentColor":color,display:"block",margin:"2px 0"}}/>
      <span style={{fontSize:fs.den,fontWeight:700,color,lineHeight:1.1,textAlign:"center"}}>{d}</span>
    </span>
  );
}

function FracBox({n,d,color="#4f46e5",bg="#eef2ff",border="#c7d2fe"}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:bg,minWidth:64,height:74,borderRadius:14,border:`2px solid ${border}`,padding:"0 10px"}}>
      <span style={{fontSize:23,fontWeight:700,color,lineHeight:1.1}}>{n}</span>
      <div style={{width:36,height:3,background:color,borderRadius:99,margin:"3px 0"}}/>
      <span style={{fontSize:23,fontWeight:700,color,lineHeight:1.1}}>{d}</span>
    </div>
  );
}

function Avatar({ url, size="md" }) {
  const sz={sm:"28px",md:"44px",lg:"56px",xl:"96px"}[size];
  return <img src={url} alt="" onError={e=>{e.target.onerror=null;e.target.src=generateAppIcon("X","#e2e8f0");}} style={{width:sz,height:sz,borderRadius:14,objectFit:"cover",border:"1px solid #e5e7eb",flexShrink:0}} draggable={false}/>;
}

function renderContent(text) {
  const main = text.replace(/\[예시:(.*?)\]/g,"");
  const parts = main.split(/(\[분수:\s*\d+\s*\/\s*\d+\s*\])/g);
  return parts.map((p,i)=>{
    const m=p.match(/\[분수:\s*(\d+)\s*\/\s*(\d+)\s*\]/);
    if(m) return <Frac key={i} n={m[1]} d={m[2]} />;
    return <span key={i}>{p.replace(/\*\*|\$|\\\(|\\\)/g,"")}</span>;
  });
}

function Ctrl({label,val,dec,inc,dDis,iDis}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <span style={{width:42,textAlign:"center",fontSize:11,fontWeight:700,color:"#4f46e5"}}>{label}</span>
      <button onClick={dec} disabled={dDis} style={{width:34,height:34,borderRadius:"50%",background:"#f3f4f6",border:"none",cursor:dDis?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:dDis?0.3:1,flexShrink:0}}><Minus size={15}/></button>
      <span style={{width:28,textAlign:"center",fontSize:20,fontWeight:700}}>{val}</span>
      <button onClick={inc} disabled={iDis} style={{width:34,height:34,borderRadius:"50%",background:"#f3f4f6",border:"none",cursor:iDis?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:iDis?0.3:1,flexShrink:0}}><Plus size={15}/></button>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("friends");
  const [view, setView] = useState(null);
  const [friends] = useState(INITIAL_FRIENDS);
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [profileUser, setProfileUser] = useState(null);
  const unread = rooms.reduce((s,r)=>s+r.unreadCount,0);

  function openChat(uid){
    const ex = rooms.find(r=>r.type==="dm"&&r.members.includes("me")&&r.members.includes(uid));
    let rid = ex ? ex.id : null;
    if(!ex){ rid=`dm_${Date.now()}`; const f=friends.find(f=>f.id===uid); setRooms(p=>[{id:rid,type:"dm",name:f?f.name:uid,members:["me",uid],lastUpdate:Date.now(),unreadCount:0},...p]); }
    setProfileUser(null); setView({type:"chat",id:rid});
  }

  if(view&&view.type==="chat") return <ChatRoom roomId={view.id} rooms={rooms} setRooms={setRooms} friends={friends} msgs={messages[view.id]||[]} setMessages={setMessages} onBack={()=>setView(null)} onProfile={setProfileUser}/>;
  if(view&&view.type==="summary") return <SummaryScreen onBack={()=>setView(null)}/>;
  if(view&&view.type==="app"){ const info=friends.find(f=>f.id===view.id); return <FractionApp appId={view.id} info={info} onBack={()=>setView(null)}/>; }

  return (
    <div style={{width:"100%",height:"100vh",maxWidth:430,margin:"0 auto",background:"#fff",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      <div style={{flex:1,overflowY:"auto",paddingBottom:64}}>
        {tab==="friends" ? <FriendsTab friends={friends} onProfile={setProfileUser} onSummary={()=>setView({type:"summary"})}/> : null}
        {tab==="chats" ? <ChatListTab rooms={rooms} friends={friends} messages={messages} onOpen={rid=>{setView({type:"chat",id:rid});setRooms(p=>p.map(r=>r.id===rid?{...r,unreadCount:0}:r));}}/> : null}
      </div>
      <div style={{position:"absolute",bottom:0,width:"100%",height:60,background:"#f9f9f9",borderTop:"1px solid #e5e7eb",display:"flex",alignItems:"center",justifyContent:"space-around",zIndex:20}}>
        <button onClick={()=>setTab("friends")} style={{padding:8,background:"none",border:"none",cursor:"pointer"}}><User size={28} color={tab==="friends"?"#111":"#9ca3af"} fill={tab==="friends"?"#111":"none"}/></button>
        <button onClick={()=>setTab("chats")} style={{padding:8,background:"none",border:"none",cursor:"pointer",position:"relative"}}>
          <MessageCircle size={28} color={tab==="chats"?"#111":"#9ca3af"} fill={tab==="chats"?"#111":"none"}/>
          {unread>0?<span style={{position:"absolute",top:4,right:2,background:"#ef4444",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 5px",borderRadius:99,minWidth:18,textAlign:"center",border:"2px solid #fff"}}>{unread}</span>:null}
        </button>
        <button style={{padding:8,background:"none",border:"none",opacity:0.4}}><MoreHorizontal size={28} color="#9ca3af"/></button>
      </div>
      {profileUser ? <ProfileModal user={profileUser} onClose={()=>setProfileUser(null)} onChat={openChat} onApp={id=>{setProfileUser(null);setView({type:"app",id});}} onSummary={()=>{setProfileUser(null);setView({type:"summary"});}}/> : null}
    </div>
  );
}

function FriendsTab({friends,onProfile,onSummary}) {
  const [q,setQ]=useState("");
  const bots=friends.filter(f=>f.type==="bot"&&f.name.includes(q));
  const notes=friends.filter(f=>f.type==="note"&&f.name.includes(q));
  const apps=friends.filter(f=>f.type==="app"&&f.name.includes(q));
  return (
    <div>
      <div style={{padding:"32px 20px 12px",background:"#fff",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h1 style={{fontSize:22,fontWeight:700,margin:0}}>친구</h1>
          <div style={{display:"flex",gap:16}}><Search size={24}/><UserPlus size={24}/></div>
        </div>
        <div style={{position:"relative"}}>
          <Search size={14} style={{position:"absolute",left:12,top:10,color:"#9ca3af"}}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="이름 검색" style={{width:"100%",background:"#f3f4f6",borderRadius:99,padding:"8px 16px 8px 34px",border:"none",outline:"none",fontSize:14,boxSizing:"border-box"}}/>
        </div>
      </div>
      <div style={{padding:"0 20px 24px"}}>
        {q==="" ? (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",cursor:"pointer"}} onClick={()=>onProfile(MY_PROFILE)}>
              <Avatar url={MY_PROFILE.avatarUrl} size="lg"/>
              <div><div style={{fontWeight:600,fontSize:16}}>{MY_PROFILE.name}</div><div style={{fontSize:13,color:"#6b7280",marginTop:2}}>{MY_PROFILE.statusMessage}</div></div>
            </div>
            <hr style={{border:"none",borderTop:"1px solid #f3f4f6",margin:"8px 0"}}/>
          </div>
        ) : null}
        {bots.length>0 ? <div><div style={{fontSize:12,color:"#9ca3af",fontWeight:500,marginBottom:12,marginTop:8}}>AI 튜터</div>{bots.map(f=><FriendItem key={f.id} f={f} onClick={()=>onProfile(f)}/>)}</div> : null}
        {notes.length>0 ? <div><div style={{fontSize:12,color:"#9ca3af",fontWeight:500,margin:"20px 0 12px"}}>학습 정리</div>{notes.map(f=><FriendItem key={f.id} f={f} onClick={onSummary}/>)}</div> : null}
        {apps.length>0 ? <div><div style={{fontSize:12,color:"#9ca3af",fontWeight:500,margin:"20px 0 12px"}}>분수 조작 활동 앱</div>{apps.map(f=><FriendItem key={f.id} f={f} onClick={()=>onProfile(f)}/>)}</div> : null}
      </div>
    </div>
  );
}

function FriendItem({f,onClick}) {
  return (
    <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:12,padding:"6px 0",cursor:"pointer"}}>
      <Avatar url={f.avatarUrl} size="md"/>
      <div style={{flex:1,overflow:"hidden"}}>
        <div style={{fontWeight:500,fontSize:15,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{f.name}</div>
        {f.statusMessage ? <div style={{fontSize:13,color:"#6b7280",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{f.statusMessage}</div> : null}
      </div>
    </div>
  );
}

function ChatListTab({rooms,friends,messages,onOpen}) {
  const [q,setQ]=useState("");
  const sorted=[...rooms].sort((a,b)=>b.lastUpdate-a.lastUpdate).filter(r=>r.name.includes(q));
  function preview(t){ return !t ? "새로운 채팅방입니다." : t.replace(/\[예시:(.*?)\]/g,"").replace(/\[분수:(\d+)\/(\d+)\]/g,"$1/$2").replace(/\*\*|\$|\\\(|\\\)/g,""); }
  return (
    <div>
      <div style={{padding:"32px 20px 12px",background:"#fff",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h1 style={{fontSize:22,fontWeight:700,margin:0}}>채팅</h1><Search size={24}/>
        </div>
        <div style={{position:"relative"}}>
          <Search size={14} style={{position:"absolute",left:12,top:10,color:"#9ca3af"}}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="채팅방 이름 검색" style={{width:"100%",background:"#f3f4f6",borderRadius:99,padding:"8px 16px 8px 34px",border:"none",outline:"none",fontSize:14,boxSizing:"border-box"}}/>
        </div>
      </div>
      <div style={{padding:"0 20px 24px"}}>
        {sorted.map(r=>{
          const rm=messages[r.id]||[],last=rm[rm.length-1];
          const fid=r.members.find(id=>id!=="me");
          const ff=friends.find(f=>f.id===fid);
          return (
            <div key={r.id} onClick={()=>onOpen(r.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",cursor:"pointer"}}>
              <Avatar url={ff?ff.avatarUrl:""} size="md"/>
              <div style={{flex:1,overflow:"hidden"}}>
                <div style={{fontWeight:500,fontSize:16}}>{r.name}</div>
                <div style={{fontSize:13,color:"#6b7280",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{preview(last?last.text:null)}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                <span style={{fontSize:11,color:"#9ca3af"}}>{fmt(last?last.timestamp:r.lastUpdate)}</span>
                {r.unreadCount>0 ? <span style={{background:"#FEE500",color:"#111",fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:99,minWidth:20,textAlign:"center"}}>{r.unreadCount}</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfileModal({user,onClose,onChat,onApp,onSummary}) {
  const [show,setShow]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setShow(true),10);return ()=>clearTimeout(t);},[]);
  function close(){setShow(false);setTimeout(onClose,300);}
  const isApp=user&&user.type==="app";
  const isNote=user&&user.type==="note";
  return (
    <div>
      <div onClick={close} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",zIndex:40,opacity:show?1:0,transition:"opacity .3s"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"85vh",background:"#fff",borderRadius:"24px 24px 0 0",zIndex:50,transform:show?"translateY(0)":"translateY(100%)",transition:"transform .3s ease-out",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{flex:1,position:"relative",background:"#334155",display:"flex",alignItems:"flex-end"}}>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#818cf8,#a78bfa)",opacity:0.8}}/>
          <button onClick={close} style={{position:"absolute",top:16,left:16,background:"none",border:"none",cursor:"pointer",color:"#fff",zIndex:10}}><X size={24}/></button>
          <div style={{position:"relative",width:"100%",display:"flex",flexDirection:"column",alignItems:"center",paddingBottom:32,paddingTop:64,background:"linear-gradient(to top,rgba(0,0,0,0.7),transparent)",color:"#fff"}}>
            <Avatar url={user?user.avatarUrl:""} size="xl"/>
            <div style={{fontSize:20,fontWeight:700,marginTop:12}}>{user?user.name:""}</div>
            {user&&user.statusMessage ? <div style={{fontSize:14,opacity:0.8,marginTop:6}}>{user.statusMessage}</div> : null}
          </div>
        </div>
        <div style={{height:100,background:"#1c1c1e",display:"flex",justifyContent:"center",alignItems:"center",flexShrink:0}}>
          {isApp ? <ActionBtn icon={<Play size={20} fill="#fff" color="#fff" style={{marginLeft:3}}/>} label="앱 실행하기" onClick={()=>onApp(user.id)}/>
            : isNote ? <ActionBtn icon={<BookOpen size={20} color="#fff"/>} label="정리 보기" onClick={onSummary}/>
            : <ActionBtn icon={<MessageCircle size={20} fill="#fff" color="#fff"/>} label="1:1 채팅" onClick={()=>{ if(user&&user.id!=="me") onChat(user.id); }}/>
          }
        </div>
      </div>
    </div>
  );
}

function ActionBtn({icon,label,onClick}) {
  return (
    <div onClick={onClick} style={{display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer",color:"#fff",gap:8}}>
      <div style={{width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>{icon}</div>
      <span style={{fontSize:12}}>{label}</span>
    </div>
  );
}

function ChatRoom({roomId,rooms,setRooms,friends,msgs,setMessages,onBack,onProfile}) {
  const room=rooms.find(r=>r.id===roomId);
  const [input,setInput]=useState("");
  const [typing,setTyping]=useState(false);
  const endRef=useRef(null);
  const taRef=useRef(null);
  const lastBot=[...msgs].reverse().find(m=>m.senderId==="socrates");
  const qr=useMemo(()=>{
    if(!lastBot||!lastBot.text) return [];
    const m=lastBot.text.match(/\[예시:(.*?)\]/);
    return m?m[1].split("|").map(s=>s.trim()):[];
  },[lastBot]);
  useEffect(()=>{if(endRef.current)endRef.current.scrollIntoView({behavior:"smooth"});},[msgs,typing]);

  async function send(txt){
    const t=(txt===undefined?input:txt).trim(); if(!t) return;
    const nm={id:`m_${Date.now()}`,senderId:"me",text:t,timestamp:Date.now(),unread:0};
    const newMsgs=[...msgs,nm];
    setMessages(p=>({...p,[roomId]:newMsgs}));
    setRooms(p=>p.map(r=>r.id===roomId?{...r,lastUpdate:Date.now()}:r));
    if(txt===undefined){setInput("");if(taRef.current)taRef.current.style.height="auto";}
    if(room&&room.members.includes("socrates")){
      setTyping(true);
      try {
        const history=newMsgs.map(m=>({role:m.senderId==="me"?"user":"assistant",content:m.text.replace(/\[예시:(.*?)\]/g,"")}));
        const res=await fetch("https://api.anthropic.com/v1/messages",{
          method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            model:"claude-haiku-4-5",max_tokens:1000,
            system:"당신은 초등학교 6학년을 위한 친근한 수학 AI 튜터 '수크라테스'입니다. 소크라테스식 문답법으로 학생이 스스로 '분수의 나눗셈' 원리를 깨우치도록 돕습니다. 정답을 바로 알려주지 말고, 질문을 하나씩 던지세요.\n\n[반드시 지킬 규칙]\n1. 분수를 표현할 때는 절대로 수식을 쓰지 말고, 반드시 '[분수:분자/분모]' 형태로만 작성하세요. (예: 1/2 -> [분수:1/2])\n2. 말 마지막에는 항상 학생이 선택할 수 있는 예시 답변 2~3개를 '[예시:답변1|답변2|답변3]' 형태로 덧붙이세요.\n3. 이모지를 적절히 섞어 친구처럼 따뜻하게 대화하세요.\n4. 한 번에 질문은 하나만 하고, 짧고 명확하게 말하세요.\n5. 분모가 같은 분수의 나눗셈은 '몇 번 덜어낼 수 있는가(포함제)'로 설명하면 좋습니다.",
            messages:history
          })
        });
        const data=await res.json();
        const reply=data&&data.content&&data.content[0]?data.content[0].text:null;
        if(reply){
          setMessages(p=>({...p,[roomId]:[...(p[roomId]||[]),{id:`m_${Date.now()}`,senderId:"socrates",text:reply,timestamp:Date.now(),unread:0}]}));
          setRooms(p=>p.map(r=>r.id===roomId?{...r,lastUpdate:Date.now()}:r));
        }
      } catch(err) {
        setMessages(p=>({...p,[roomId]:[...(p[roomId]||[]),{id:`m_err_${Date.now()}`,senderId:"socrates",text:"앗, 잠깐 생각 중이야. 다시 말해줄래? 😅 [예시:알았어|다시 물어볼게]",timestamp:Date.now(),unread:0}]}));
      } finally{setTyping(false);}
    }
  }

  function getSender(id){ return id==="me"?MY_PROFILE:(friends.find(f=>f.id===id)||MY_PROFILE); }

  let lastDate=null; const rendered=[];
  msgs.forEach((msg,i)=>{
    const dt=fmtDate(msg.timestamp);
    if(dt!==lastDate){rendered.push(<div key={`d${i}`} style={{display:"flex",justifyContent:"center",margin:"16px 0"}}><span style={{background:"rgba(0,0,0,0.12)",color:"#fff",padding:"6px 16px",borderRadius:99,fontSize:12}}>{dt}</span></div>);lastDate=dt;}
    const prev=msgs[i-1],next=msgs[i+1],mine=msg.senderId==="me";
    const conTop=prev&&prev.senderId===msg.senderId&&sameMin(prev.timestamp,msg.timestamp);
    const conBot=next&&next.senderId===msg.senderId&&sameMin(msg.timestamp,next.timestamp);
    const sender=getSender(msg.senderId);
    rendered.push(
      <div key={msg.id} style={{display:"flex",width:"100%",justifyContent:mine?"flex-end":"flex-start",marginTop:conTop?4:12,padding:"0 16px",boxSizing:"border-box"}}>
        {!mine ? <div style={{width:36,marginRight:8,flexShrink:0}}>
          {!conTop ? <img src={sender.avatarUrl} alt="" onClick={()=>onProfile(sender)} style={{width:36,height:36,borderRadius:14,objectFit:"cover",cursor:"pointer"}}/> : <div style={{width:36}}/>}
        </div> : null}
        <div style={{display:"flex",flexDirection:"column",alignItems:mine?"flex-end":"flex-start",maxWidth:"75%"}}>
          {!conTop&&!mine ? <span style={{fontSize:12,color:"#6b7280",marginBottom:4,marginLeft:4}}>{sender.name}</span> : null}
          <div style={{display:"flex",alignItems:"flex-end",flexDirection:mine?"row-reverse":"row",gap:6}}>
            <div style={{padding:"9px 14px",fontSize:15,lineHeight:1.6,whiteSpace:"pre-wrap",wordBreak:"break-word",background:mine?"#FEE500":"#fff",border:mine?"none":"1px solid #e5e7eb",borderRadius:mine?"18px 4px 18px 18px":"4px 18px 18px 18px",boxShadow:"0 1px 2px rgba(0,0,0,0.06)"}}>
              {renderContent(msg.text)}
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:mine?"flex-end":"flex-start",flexShrink:0,minWidth:35,paddingBottom:2}}>
              {!conBot ? <span style={{fontSize:11,color:"#9ca3af"}}>{fmt(msg.timestamp)}</span> : null}
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#B2C7D9",maxWidth:430,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",background:"rgba(178,199,217,0.95)",padding:"12px 8px",flexShrink:0,borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",padding:8,display:"flex",alignItems:"center"}}><ChevronLeft size={32} color="#111"/></button>
        <span style={{fontWeight:700,fontSize:18,marginLeft:4}}>{room?room.name:""}</span>
      </div>
      <div style={{flex:1,overflowY:"auto",paddingTop:8,paddingBottom:16}}>
        {rendered}
        {typing ? <div style={{display:"flex",margin:"12px 16px"}}>
          <img src={SOCRATES_SVG} alt="" style={{width:36,height:36,borderRadius:14,objectFit:"cover",marginRight:8,flexShrink:0}}/>
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:"4px 18px 18px 18px",padding:"10px 16px",display:"flex",gap:6,alignItems:"center",boxShadow:"0 1px 2px rgba(0,0,0,0.06)"}}>
            {[0,150,300].map(d=><div key={d} style={{width:8,height:8,background:"#9ca3af",borderRadius:"50%",animation:`bn 1s ${d}ms infinite`}}/>)}
          </div>
        </div> : null}
        <div ref={endRef}/>
      </div>
      <div style={{background:"#fff",flexShrink:0}}>
        {qr.length>0&&!typing ? <div style={{padding:"10px 12px",display:"flex",gap:8,overflowX:"auto",borderTop:"1px solid #e5e7eb",background:"#f9f9f9"}}>
          {qr.map((o,i)=><button key={i} onClick={()=>send(o)} style={{whiteSpace:"nowrap",fontSize:14,background:"#fff",color:"#4f46e5",fontWeight:500,border:"1px solid #e5e7eb",padding:"8px 16px",borderRadius:99,cursor:"pointer",flexShrink:0,boxShadow:"0 1px 2px rgba(0,0,0,0.06)"}}>{o}</button>)}
        </div> : null}
        <div style={{display:"flex",alignItems:"flex-end",padding:"8px",minHeight:52,gap:4}}>
          <button style={{padding:10,background:"none",border:"none",cursor:"pointer",color:"#9ca3af",flexShrink:0}}><Plus size={24}/></button>
          <div style={{flex:1,background:"#f3f4f6",borderRadius:20,display:"flex",alignItems:"flex-end",padding:"2px 4px 2px 12px"}}>
            <textarea ref={taRef} value={input} onChange={e=>{setInput(e.target.value);e.target.style.height="auto";e.target.style.height=`${Math.min(e.target.scrollHeight,120)}px`;}}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
              placeholder="메시지 입력" rows={1}
              style={{flex:1,background:"transparent",border:"none",outline:"none",resize:"none",fontSize:15,lineHeight:1.5,padding:"8px 0",minHeight:36,maxHeight:120,fontFamily:"inherit"}}/>
            <button style={{padding:8,background:"none",border:"none",cursor:"pointer",color:"#9ca3af",flexShrink:0}}><Smile size={22}/></button>
          </div>
          <button onClick={()=>send()} disabled={!input.trim()} style={{width:40,height:40,borderRadius:"50%",background:input.trim()?"#FEE500":"transparent",border:"none",cursor:input.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginBottom:2}}>
            <Send size={18} color={input.trim()?"#111":"#9ca3af"} style={{marginLeft:2}}/>
          </button>
        </div>
      </div>
      <style>{"@keyframes bn{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}"}</style>
    </div>
  );
}

function SummaryCard({color,title,children}) {
  return (
    <div style={{background:"#fff",borderRadius:16,padding:16,marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,0.08)",borderLeft:`5px solid ${color}`}}>
      <div style={{fontWeight:700,fontSize:15,color,marginBottom:10}}>{title}</div>
      <div style={{fontSize:14,color:"#374151",lineHeight:1.7}}>{children}</div>
    </div>
  );
}
function SummaryEq({children}) {
  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",gap:4,background:"#f8fafc",borderRadius:10,padding:"12px 8px",margin:"8px 0",fontSize:15}}>{children}</div>;
}

function SummaryScreen({onBack}) {
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#ecfdf5",maxWidth:430,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",background:"#10b981",padding:"12px 8px",flexShrink:0}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",padding:8}}><ChevronLeft size={30} color="#fff"/></button>
        <span style={{fontWeight:700,fontSize:17,marginLeft:2,color:"#fff"}}>📘 분수의 나눗셈 정리</span>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:16}}>
        <SummaryCard color="#059669" title="① 분모가 같은 (분수)÷(분수)">
          분모가 같으면 분자끼리 나눠 계산해요. 분모는 신경 쓰지 않아도 돼요!
          <SummaryEq><Frac n={6} d={7} size="sm"/> ÷ <Frac n={3} d={7} size="sm"/> = 6 ÷ 3 = <b style={{color:"#059669",fontSize:18}}>2</b></SummaryEq>
        </SummaryCard>
        <SummaryCard color="#0284c7" title="② 분모가 다른 (분수)÷(분수)">
          먼저 통분해서 분모를 같게 만든 뒤, 분자끼리 나눠요.
          <SummaryEq><Frac n={3} d={4} size="sm"/> ÷ <Frac n={2} d={3} size="sm"/> = <Frac n={9} d={12} size="sm"/> ÷ <Frac n={8} d={12} size="sm"/> = 9 ÷ 8</SummaryEq>
        </SummaryCard>
        <SummaryCard color="#7c3aed" title="③ (자연수)÷(분수)">
          자연수도 분수처럼 생각해요. 4 ÷ 2 = 2 인 것처럼!
          <SummaryEq>6 ÷ <Frac n={3} d={4} size="sm"/> = ( 6 ÷ 3 ) × 4 = 2 × 4 = <b style={{color:"#7c3aed",fontSize:18}}>8</b></SummaryEq>
        </SummaryCard>
        <SummaryCard color="#dc2626" title="④ 곱셈으로 바꾸기 (가장 중요!)">
          나눗셈을 곱셈으로 바꾸고, 뒤의 분수의 분자와 분모를 서로 바꿔요 (역수).
          <SummaryEq><Frac n={7} d={10} size="sm"/> ÷ <Frac n={2} d={3} size="sm"/> = <Frac n={7} d={10} size="sm"/> × <Frac n={3} d={2} size="sm"/></SummaryEq>
          <div style={{background:"#fef2f2",borderRadius:10,padding:"10px 12px",marginTop:8,fontSize:13,color:"#991b1b"}}>
            나누기를 곱하기로 바꾸면, 뒤의 분수는 위아래를 뒤집어요!
          </div>
        </SummaryCard>
        <SummaryCard color="#d97706" title="⑤ 대분수가 있을 때">
          대분수는 먼저 가분수로 바꾼 다음 계산해요.
          <SummaryEq>2<Frac n={2} d={5} size="sm"/> ÷ <Frac n={2} d={3} size="sm"/> = <Frac n={12} d={5} size="sm"/> ÷ <Frac n={2} d={3} size="sm"/> = <Frac n={12} d={5} size="sm"/> × <Frac n={3} d={2} size="sm"/></SummaryEq>
        </SummaryCard>
      </div>
    </div>
  );
}

const DIV_EXAMPLES = [
  { den:5, bN:1, total:3 },
  { den:7, bN:3, total:2 },
  { den:9, bN:2, total:4 },
];

function FractionApp({appId,info,onBack}) {
  const [mode,setMode]=useState("fraction");
  const [num,setNum]=useState(1);
  const [den,setDen]=useState(4);
  useEffect(()=>{ setNum(n=>n>den?den:n); },[den]);

  const [exIdx,setExIdx]=useState(0);
  const ex=DIV_EXAMPLES[exIdx];
  const aN=ex.bN*ex.total;
  const [removed,setRemoved]=useState(0);
  const done=removed>=ex.total;
  const remaining=aN-removed*ex.bN;

  function pickExample(i){ setExIdx(i); setRemoved(0); }
  function removeOne(){ if(removed<ex.total) setRemoved(r=>r+1); }
  function reset(){ setRemoved(0); }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#f8fafc",maxWidth:430,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",background:"#fff",padding:"10px 8px",flexShrink:0,borderBottom:"1px solid #e5e7eb"}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",padding:6}}><ChevronLeft size={30} color="#111"/></button>
        <Avatar url={info?info.avatarUrl:""} size="sm"/>
        <span style={{fontWeight:700,fontSize:15,marginLeft:8,flex:1,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{info?info.name:""}</span>
      </div>
      <div style={{display:"flex",background:"#fff",borderBottom:"1px solid #e5e7eb",flexShrink:0}}>
        {["fraction","division"].map(m=>(
          <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"10px 0",background:"none",border:"none",borderBottom:`3px solid ${mode===m?"#4f46e5":"transparent"}`,cursor:"pointer",fontWeight:mode===m?700:500,color:mode===m?"#4f46e5":"#9ca3af",fontSize:13}}>
            {m==="fraction"?"📊 분수 보기":"➗ 분수 나눗셈"}
          </button>
        ))}
      </div>

      {mode==="fraction" ? (
        <div style={{display:"flex",flexDirection:"column",flex:1,minHeight:0}}>
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"12px 16px",overflow:"hidden"}}>
            {appId==="app_bar" ? <BarVisual num={num} den={den}/> : null}
            {appId==="app_numberline" ? <NumberLineVisual num={num} den={den}/> : null}
            {appId==="app_watercup" ? <WaterCupVisual num={num} den={den}/> : null}
            {appId==="app_ribbon" ? <RibbonVisual num={num} den={den}/> : null}
          </div>
          <div style={{background:"#fff",borderRadius:"20px 20px 0 0",boxShadow:"0 -4px 16px rgba(0,0,0,0.06)",padding:"16px 24px 32px",flexShrink:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:300,margin:"0 auto"}}>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <Ctrl label="분자" val={num} dec={()=>setNum(n=>Math.max(0,n-1))} inc={()=>setNum(n=>Math.min(den,n+1))} dDis={num<=0} iDis={num>=den}/>
                <Ctrl label="분모" val={den} dec={()=>setDen(d=>Math.max(1,d-1))} inc={()=>setDen(d=>Math.min(10,d+1))} dDis={den<=1} iDis={den>=10}/>
              </div>
              <FracBox n={num} d={den}/>
            </div>
          </div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",flex:1,minHeight:0}}>
          <div style={{display:"flex",gap:8,padding:"12px 16px 4px",justifyContent:"center"}}>
            {DIV_EXAMPLES.map((e,i)=>(
              <button key={i} onClick={()=>pickExample(i)} style={{display:"flex",alignItems:"center",gap:2,padding:"6px 12px",borderRadius:99,border:exIdx===i?"2px solid #4f46e5":"1.5px solid #e5e7eb",background:exIdx===i?"#eef2ff":"#fff",cursor:"pointer",fontWeight:600}}>
                <Frac n={e.bN*e.total} d={e.den} size="sm" color={exIdx===i?"#4f46e5":"#6b7280"}/>
                <span style={{color:exIdx===i?"#4f46e5":"#6b7280"}}>÷</span>
                <Frac n={e.bN} d={e.den} size="sm" color={exIdx===i?"#4f46e5":"#6b7280"}/>
              </button>
            ))}
          </div>
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"4px 12px",overflow:"hidden"}}>
            {appId==="app_bar" ? <BarInclusion aN={aN} bN={ex.bN} den={ex.den} removed={removed} total={ex.total}/> : null}
            {appId==="app_numberline" ? <NumberLineInclusion aN={aN} bN={ex.bN} den={ex.den} removed={removed} total={ex.total}/> : null}
            {appId==="app_watercup" ? <WaterCupInclusion aN={aN} bN={ex.bN} den={ex.den} removed={removed} total={ex.total}/> : null}
            {appId==="app_ribbon" ? <RibbonInclusion aN={aN} bN={ex.bN} den={ex.den} removed={removed} total={ex.total}/> : null}
          </div>
          <div style={{background:"#fff",borderRadius:"20px 20px 0 0",boxShadow:"0 -4px 16px rgba(0,0,0,0.06)",padding:"16px 20px 28px",flexShrink:0}}>
            <div style={{textAlign:"center",fontSize:14,color:"#374151",marginBottom:12,minHeight:24,display:"flex",alignItems:"center",justifyContent:"center",gap:4,flexWrap:"wrap"}}>
              {!done ? (
                <span style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap",justifyContent:"center"}}>
                  <Frac n={remaining} d={ex.den} size="sm" color="#2563eb"/> 에서 <Frac n={ex.bN} d={ex.den} size="sm" color="#dc2626"/> 를 덜어낼 수 있어요!
                </span>
              ) : (
                <span style={{color:"#16a34a",fontWeight:700}}>🎉 모두 덜어냈어요! 총 {ex.total}번 덜어냈죠?</span>
              )}
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:14}}>
              <Frac n={aN} d={ex.den} size="md" color="#2563eb"/>
              <span style={{fontSize:22,fontWeight:700,color:"#374151"}}>÷</span>
              <Frac n={ex.bN} d={ex.den} size="md" color="#dc2626"/>
              <span style={{fontSize:22,fontWeight:700,color:"#374151"}}>=</span>
              <div style={{minWidth:48,height:54,display:"flex",alignItems:"center",justifyContent:"center",background:done?"#f0fdf4":"#f3f4f6",borderRadius:12,border:done?"2px solid #bbf7d0":"2px dashed #d1d5db"}}>
                <span style={{fontSize:28,fontWeight:700,color:done?"#16a34a":"#9ca3af"}}>{done?ex.total:"?"}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={reset} style={{padding:"12px 18px",borderRadius:14,border:"1.5px solid #e5e7eb",background:"#fff",cursor:"pointer",fontWeight:600,color:"#6b7280",fontSize:14}}>↺ 처음부터</button>
              <button onClick={removeOne} disabled={done} style={{flex:1,maxWidth:220,padding:"12px 0",borderRadius:14,border:"none",background:done?"#d1d5db":"#16a34a",cursor:done?"default":"pointer",fontWeight:700,color:"#fff",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                {done ? "다 덜어냈어요 ✓" : <span style={{display:"flex",alignItems:"center",gap:4}}>✂️ <Frac n={ex.bN} d={ex.den} size="sm" color="#fff"/> 덜어내기</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BarVisual({num,den}) {
  return (
    <div style={{width:"100%",maxWidth:340}}>
      <div style={{display:"flex",background:"#f9fafb",border:"3px solid #1f2937",borderRadius:12,overflow:"hidden",height:72}}>
        {Array.from({length:den}).map((_,i)=><div key={i} style={{flex:1,borderRight:i<den-1?"2px solid #374151":"none",background:i<num?"#fbbf24":"#f9fafb",transition:"background .4s"}}/>)}
      </div>
      <div style={{textAlign:"center",marginTop:10,fontSize:14,color:"#6b7280"}}>전체 <b>{den}칸</b> 중 <span style={{color:"#d97706",fontWeight:700}}>{num}칸</span>을 색칠했어요</div>
    </div>
  );
}
function NumberLineVisual({num,den}) {
  const pct=den>0?(num/den)*100:0;
  return (
    <div style={{width:"100%",maxWidth:340}}>
      <svg width="100%" viewBox="0 0 320 110" style={{overflow:"visible"}}>
        {num>0 ? <path d={`M 16 80 Q ${16+(pct/100)*288/2} 28 ${16+(pct/100)*288} 80`} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/> : null}
        <line x1="16" y1="80" x2="304" y2="80" stroke="#6b7280" strokeWidth="3" strokeLinecap="round"/>
        {Array.from({length:den+1}).map((_,i)=>{const x=16+(i/den)*288;return <g key={i}><line x1={x} y1="74" x2={x} y2="86" stroke={i===0||i===den?"#1f2937":"#6b7280"} strokeWidth={i===0||i===den?2.5:1.5}/>{(i===0||i===den||i===num) ? <text x={x} y="100" textAnchor="middle" fontSize="12" fill={i===num&&i!==0&&i!==den?"#ef4444":"#374151"} fontWeight={i===0||i===den?"700":"500"}>{i===0?"0":i===den?"1":`${i}/${den}`}</text> : null}</g>;})}
        <line x1="16" y1="80" x2={16+(pct/100)*288} y2="80" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"/>
        {num>0 ? <circle cx={16+(pct/100)*288} cy={80} r={6} fill="#ef4444"/> : null}
        <circle cx="16" cy="80" r={5} fill="#1f2937"/>
      </svg>
      <div style={{textAlign:"center",fontSize:14,color:"#6b7280"}}>0에서 <span style={{color:"#ef4444",fontWeight:700}}>{num}/{den}</span>까지 이동했어요</div>
    </div>
  );
}
function WaterCupVisual({num,den}) {
  const pct=den>0?(num/den)*100:0;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <svg width="130" height="190" viewBox="0 0 130 190">
        <defs><clipPath id="cv2"><path d="M 16 14 L 24 168 L 106 168 L 114 14 Z"/></clipPath></defs>
        <rect x="16" y={14+(154*(1-pct/100))} width="98" height={154*(pct/100)} fill="#60a5fa" clipPath="url(#cv2)" style={{transition:"all .6s ease-out"}}/>
        {Array.from({length:den-1}).map((_,i)=>{const y=168-((i+1)/den)*154;return <line key={i} x1="88" y1={y} x2="114" y2={y} stroke="#bfdbfe" strokeWidth="1.5"/>;})}
        <path d="M 16 14 L 24 168 L 106 168 L 114 14" fill="none" stroke="#93c5fd" strokeWidth="3.5" strokeLinejoin="round"/>
        <line x1="17" y1="14" x2="113" y2="14" stroke="#93c5fd" strokeWidth="2.5"/>
      </svg>
      <div style={{fontSize:14,color:"#6b7280",marginTop:4,display:"flex",alignItems:"center",gap:3}}>컵의 <Frac n={num} d={den} color="#2563eb" size="sm"/> 만큼 물이 찼어요</div>
    </div>
  );
}
function RibbonVisual({num,den}) {
  return (
    <div style={{width:"100%",maxWidth:340}}>
      <div style={{display:"flex",width:"100%",height:56,alignItems:"center"}}>
        <div style={{width:20,height:56,background:num>0?"#ec4899":"#fce7f3",clipPath:"polygon(100% 0,100% 100%,0 100%,50% 50%,0 0)",flexShrink:0,transition:"background .3s"}}/>
        <div style={{flex:1,display:"flex",height:"100%",background:"#fce7f3"}}>
          {Array.from({length:den}).map((_,i)=><div key={i} style={{flex:1,borderRight:i<den-1?"2px dashed #f9a8d4":"none",background:i<num?"#ec4899":"transparent",transition:"background .4s"}}/>)}
        </div>
        <div style={{width:20,height:56,background:num===den?"#ec4899":"#fce7f3",clipPath:"polygon(0 0,0 100%,100% 100%,50% 50%,100% 0)",flexShrink:0,transition:"background .3s"}}/>
      </div>
      <div style={{fontSize:14,color:"#6b7280",marginTop:10,textAlign:"center"}}>리본을 <span style={{color:"#be185d",fontWeight:700}}>{den}칸</span>으로 나눠 <span style={{color:"#be185d",fontWeight:700}}>{num}칸</span>을 색칠했어요</div>
    </div>
  );
}

const GRP_COLORS=["#34d399","#60a5fa","#f472b6","#fbbf24","#a78bfa","#fb923c","#22d3ee","#f87171"];

function BarInclusion({aN,bN,den,removed,total}) {
  return (
    <div style={{width:"100%",maxWidth:340,display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",background:"#f9fafb",border:"3px solid #1f2937",borderRadius:12,overflow:"hidden",height:64}}>
        {Array.from({length:den}).map((_,i)=>{
          const inA=i<aN, grp=Math.floor(i/bN), isRemoved=grp<removed;
          return <div key={i} style={{flex:1,borderRight:i<den-1?"2px solid #374151":"none",background:!inA?"#f3f4f6":isRemoved?"#e5e7eb":GRP_COLORS[grp%GRP_COLORS.length],opacity:isRemoved?0.5:1,transition:"all .35s"}}/>;
        })}
      </div>
      <div style={{display:"flex",gap:5,justifyContent:"center",flexWrap:"wrap",minHeight:28}}>
        {Array.from({length:removed}).map((_,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:3,background:GRP_COLORS[i%GRP_COLORS.length],color:"#fff",borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700}}>✂️{i+1}</div>)}
      </div>
    </div>
  );
}
function NumberLineInclusion({aN,bN,den,removed,total}) {
  return (
    <div style={{width:"100%",maxWidth:340}}>
      <svg width="100%" viewBox="0 0 320 120" style={{overflow:"visible"}}>
        {Array.from({length:removed}).map((_,i)=>{
          const x1=16+(i*bN/den)*288, x2=16+((i+1)*bN/den)*288, mx=(x1+x2)/2;
          return <g key={i}><path d={`M ${x1} 88 Q ${mx} 34 ${x2} 88`} fill="none" stroke={GRP_COLORS[i%GRP_COLORS.length]} strokeWidth="3" strokeLinecap="round"/><text x={mx} y="30" textAnchor="middle" fontSize="12" fontWeight="700" fill={GRP_COLORS[i%GRP_COLORS.length]}>{i+1}</text></g>;
        })}
        <line x1="16" y1="88" x2="304" y2="88" stroke="#6b7280" strokeWidth="3" strokeLinecap="round"/>
        {Array.from({length:den+1}).map((_,i)=>{const x=16+(i/den)*288;return <g key={i}><line x1={x} y1="82" x2={x} y2="94" stroke="#6b7280" strokeWidth={i===0||i===den?2.5:1.5}/>{(i===0||i===den||i===aN) ? <text x={x} y="108" textAnchor="middle" fontSize="11" fill={i===aN&&i!==0&&i!==den?"#2563eb":"#374151"} fontWeight="600">{i===0?"0":i===den?"1":`${i}/${den}`}</text> : null}</g>;})}
        <circle cx="16" cy="88" r={4} fill="#1f2937"/>
        <circle cx={16+((removed*bN)/den)*288} cy={88} r={6} fill="#16a34a" stroke="#fff" strokeWidth="2"/>
        <circle cx={16+(aN/den)*288} cy={88} r={5} fill="#2563eb" opacity="0.5"/>
      </svg>
    </div>
  );
}
function WaterCupInclusion({aN,bN,den,removed,total}) {
  const aPct=(aN/den)*100;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,width:"100%",maxWidth:340}}>
      <div style={{display:"flex",gap:10,alignItems:"flex-end",justifyContent:"center"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
          <svg width="72" height="120" viewBox="0 0 72 120">
            <defs><clipPath id="bcI"><path d="M 8 8 L 14 104 L 58 104 L 64 8 Z"/></clipPath></defs>
            <rect x="8" y={8+(96*(1-aPct/100))} width="56" height={96*(aPct/100)} fill="#dbeafe" clipPath="url(#bcI)"/>
            <rect x="8" y={8+(96*(1-((aN-removed*bN)/den)))} width="56" height={96*(((aN-removed*bN)/den))} fill="#60a5fa" clipPath="url(#bcI)" style={{transition:"all .5s"}}/>
            {Array.from({length:total}).map((_,i)=>{const y=104-((i+1)*bN/den)*96;return i<total-1 ? <line key={i} x1="8" y1={y} x2="64" y2={y} stroke="#fff" strokeWidth="1.5" clipPath="url(#bcI)"/> : null;})}
            <path d="M 8 8 L 14 104 L 58 104 L 64 8" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round"/>
          </svg>
          <span style={{fontSize:11,color:"#6b7280"}}>남은 물</span>
        </div>
        <span style={{fontSize:22,fontWeight:700,color:"#374151",marginBottom:20}}>→</span>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",maxWidth:170,justifyContent:"center"}}>
          {Array.from({length:total}).map((_,i)=>{
            const filled=i<removed;
            return <svg key={i} width="34" height="54" viewBox="0 0 34 54">
              {filled ? <rect x="4" y="6" width="26" height="44" rx="2" fill={GRP_COLORS[i%GRP_COLORS.length]} opacity="0.85" style={{transition:"all .4s"}}/> : null}
              <rect x="4" y="6" width="26" height="44" rx="2" fill="none" stroke={filled?"#9ca3af":"#d1d5db"} strokeWidth="1.5" strokeDasharray={filled?"0":"3 2"}/>
              {filled ? <text x="17" y="34" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">{i+1}</text> : null}
            </svg>;
          })}
        </div>
      </div>
    </div>
  );
}
function RibbonInclusion({aN,bN,den,removed,total}) {
  return (
    <div style={{width:"100%",maxWidth:340,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",width:"100%",height:48,alignItems:"center"}}>
        <div style={{width:18,height:48,background:"#ec4899",clipPath:"polygon(100% 0,100% 100%,0 100%,50% 50%,0 0)",flexShrink:0}}/>
        <div style={{flex:1,display:"flex",height:"100%",overflow:"hidden"}}>
          {Array.from({length:den}).map((_,i)=>{
            const inA=i<aN, grp=Math.floor(i/bN), isRemoved=grp<removed;
            const isCut=(i+1)%bN===0&&i<aN-1;
            return <div key={i} style={{flex:1,background:!inA?"#f3f4f6":isRemoved?"#e5e7eb":GRP_COLORS[grp%GRP_COLORS.length],opacity:isRemoved?0.45:1,borderRight:isCut?"3px solid #fff":i<den-1?"1px solid rgba(255,255,255,0.2)":"none",transition:"all .35s"}}/>;
          })}
        </div>
        <div style={{width:18,height:48,background:aN===den?"#ec4899":"#fce7f3",clipPath:"polygon(0 0,0 100%,100% 100%,50% 50%,100% 0)",flexShrink:0}}/>
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center",minHeight:28}}>
        {Array.from({length:removed}).map((_,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:3,height:26,borderRadius:6,background:GRP_COLORS[i%GRP_COLORS.length],color:"#fff",padding:"0 10px",fontSize:12,fontWeight:700}}>✂️{i+1}</div>)}
      </div>
    </div>
  );
}