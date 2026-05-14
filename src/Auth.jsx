import { useState } from "react";
import { supabase } from "./supabase";

const validatePassword=(pw)=>{
  const e=[];
  if(pw.length<8)e.push("At least 8 characters");
  if(!/[A-Z]/.test(pw))e.push("One uppercase letter");
  if(!/[0-9]/.test(pw))e.push("One number");
  if(!/[^A-Za-z0-9]/.test(pw))e.push("One special character");
  return e;
};

const sanitize=(s)=>s.replace(/[^a-zA-Z0-9_@.]/g,"").slice(0,50);

const getAvailableUsername=async(base)=>{
  const clean=base.toLowerCase().replace(/[^a-z0-9_]/g,"").slice(0,20);
  const{data}=await supabase.from("users").select("username").eq("username",clean).single();
  if(!data)return clean;
  for(let i=2;i<=99;i++){
    const c=`${clean}${i}`;
    const{data:t}=await supabase.from("users").select("username").eq("username",c).single();
    if(!t)return c;
  }
  return`${clean}_${Date.now()}`;
};

const SECTORS={
  federal:{
    critical:[{id:"fc_def",name:"National Defence",pct:7.5,desc:"Military, cybersecurity, and border protection"},{id:"fc_cyber",name:"Cybersecurity",pct:5,desc:"Digital infrastructure and cyber defence"},{id:"fc_border",name:"Border Systems",pct:7.5,desc:"Border security and customs"},{id:"fc_civic",name:"Civic Infrastructure",pct:10,desc:"This platform and electoral infrastructure"}],
    flexible:[{id:"ff_health",name:"Healthcare Transfers",color:"#e05252",desc:"Federal transfers to provinces for healthcare"},{id:"ff_edu",name:"Education Transfers",color:"#4a9eff",desc:"Post-secondary and federal education programs"},{id:"ff_infra",name:"Infrastructure",color:"#e67e22",desc:"National roads, bridges, and public works"},{id:"ff_climate",name:"Climate & Environment",color:"#4cae7f",desc:"Climate programs and environmental protection"},{id:"ff_indg",name:"Indigenous Affairs",color:"#9b59b6",desc:"Indigenous community services and reconciliation"},{id:"ff_digital",name:"Digital Innovation",color:"#16a085",desc:"Technology research and digital services"},{id:"ff_foreign",name:"Foreign Affairs",color:"#c0392b",desc:"Diplomacy and international relations"}],
  },
  provincial:{
    critical:[{id:"pc_hosp",name:"Hospitals & Emergency",pct:10,desc:"Hospitals, ambulance, and emergency care"},{id:"pc_grid",name:"Power Grid & Utilities",pct:10,desc:"Electrical grid and utility infrastructure"},{id:"pc_just",name:"Justice & Courts",pct:10,desc:"Courts, police, and corrections"}],
    flexible:[{id:"pf_k12",name:"K-12 Education",color:"#f39c12",desc:"Public schools from kindergarten to grade 12"},{id:"pf_post",name:"Post-Secondary",color:"#8e44ad",desc:"Universities, colleges, and trade schools"},{id:"pf_roads",name:"Roads & Transit",color:"#2ecc71",desc:"Provincial highways and transit funding"},{id:"pf_soc",name:"Social Services",color:"#e74c3c",desc:"Income support, disability, and social programs"},{id:"pf_hous",name:"Housing",color:"#1abc9c",desc:"Affordable housing and shelter programs"},{id:"pf_env",name:"Environment",color:"#27ae60",desc:"Parks, conservation, and environmental monitoring"}],
  },
  municipal:{
    critical:[{id:"mc_water",name:"Water & Waste",pct:10,desc:"Drinking water, sewage, and waste management"},{id:"mc_fire",name:"Fire & Emergency",pct:10,desc:"Fire services and local emergency response"},{id:"mc_trans",name:"Public Transit",pct:10,desc:"Buses, LRT, and local transit infrastructure"}],
    flexible:[{id:"mf_roads",name:"Local Roads",color:"#95a5a6",desc:"Street maintenance, signals, and sidewalks"},{id:"mf_parks",name:"Parks & Recreation",color:"#2ecc71",desc:"Parks, arenas, pools, and recreation centres"},{id:"mf_libs",name:"Libraries & Education",color:"#3498db",desc:"Public libraries and community education"},{id:"mf_comm",name:"Community Programs",color:"#e67e22",desc:"Social programs and community services"},{id:"mf_plan",name:"Planning & Zoning",color:"#9b59b6",desc:"Land use, development permits, and urban planning"},{id:"mf_bylaw",name:"Bylaw & Safety",color:"#e74c3c",desc:"Bylaw enforcement and community safety"}],
  },
};

const INIT_ALLOC={
  federal:{ff_health:0,ff_edu:0,ff_climate:0,ff_infra:0,ff_indg:0,ff_digital:0,ff_foreign:0},
  provincial:{pf_k12:0,pf_post:0,pf_roads:0,pf_soc:0,pf_hous:0,pf_env:0},
  municipal:{mf_roads:0,mf_parks:0,mf_libs:0,mf_comm:0,mf_plan:0,mf_bylaw:0},
};

const S={
  wrap:{minHeight:"100vh",background:"#070f1c",display:"flex",alignItems:"center",justifyContent:"center",padding:24},
  wrapTop:{minHeight:"100vh",background:"#070f1c",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:24,overflowY:"auto"},
  box:{background:"#0d1b2e",border:"1px solid #1a3355",borderRadius:4,padding:36,width:"100%",maxWidth:540},
  boxWide:{background:"#0d1b2e",border:"1px solid #1a3355",borderRadius:4,padding:36,width:"100%",maxWidth:640,margin:"32px auto"},
  logo:{fontFamily:"'Playfair Display',Georgia,serif",fontSize:22,fontWeight:700,color:"#c8a84b",marginBottom:6},
  sub:{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#8e9ab0",marginBottom:28,letterSpacing:".06em"},
  label:{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#c8a84b",letterSpacing:".06em",display:"block",marginBottom:6},
  input:{width:"100%",background:"#070f1c",border:"1px solid #1a3355",color:"#e8dfc8",padding:"10px 14px",fontFamily:"Georgia,serif",fontSize:14,borderRadius:2,outline:"none",marginBottom:14,boxSizing:"border-box"},
  btn:{width:"100%",padding:12,background:"#c8a84b",color:"#070f1c",border:"none",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:500,borderRadius:2,letterSpacing:".05em",marginTop:8},
  btnSmall:{background:"transparent",color:"#8e9ab0",border:"1px solid #1a3355",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:11,borderRadius:2,padding:"8px 20px"},
  toggle:{marginTop:18,textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#8e9ab0"},
  link:{color:"#c8a84b",cursor:"pointer",marginLeft:6},
  error:{background:"rgba(224,82,82,.1)",border:"1px solid rgba(224,82,82,.3)",color:"#e05252",padding:"10px 14px",borderRadius:2,fontFamily:"'JetBrains Mono',monospace",fontSize:11,marginBottom:14},
  success:{background:"rgba(76,174,127,.1)",border:"1px solid rgba(76,174,127,.3)",color:"#4cae7f",padding:"10px 14px",borderRadius:2,fontFamily:"'JetBrains Mono',monospace",fontSize:11,marginBottom:14},
  infoBox:{background:"rgba(200,168,75,.06)",border:"1px solid rgba(200,168,75,.2)",borderRadius:3,padding:"12px 16px",fontSize:13,color:"#a89e8a",lineHeight:1.75,marginBottom:20},
};

export default function Auth({onLogin}){
  const[mode,setMode]=useState("login");
  const[step,setStep]=useState(1);
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[username,setUsername]=useState("");
  const[error,setError]=useState(null);
  const[loading,setLoading]=useState(false);
  const[message,setMessage]=useState(null);
  const[pwErrors,setPwErrors]=useState([]);
  const[govLevel,setGovLevel]=useState("federal");
  const[alloc,setAlloc]=useState(INIT_ALLOC);

  const flexTotal=(lvl)=>Object.values(alloc[lvl]).reduce((a,b)=>a+b,0);

  const updateAlloc=(lvl,id,val)=>{
    const others={...alloc[lvl]};delete others[id];
    const otherSum=Object.values(others).reduce((a,b)=>a+b,0);
    setAlloc(prev=>({...prev,[lvl]:{...prev[lvl],[id]:Math.min(Math.max(0,val),70-otherSum)}}));
  };

  const handleLogin=async()=>{
    setLoading(true);setError(null);
    const{data,error}=await supabase.auth.signInWithPassword({email:sanitize(email),password});
    if(error){setError(error.message);setLoading(false);return;}
    onLogin(data.session);
    setLoading(false);
  };

  const goToAllocation=()=>{
    const pwErrs=validatePassword(password);
    if(pwErrs.length>0){setPwErrors(pwErrs);return;}
    if(!username.trim()){setError("Username is required");return;}
    setError(null);setPwErrors([]);setStep(2);
  };

  const submitSignup=async()=>{
    setLoading(true);setError(null);
    const availableUsername=await getAvailableUsername(username);
    const{data,error}=await supabase.auth.signUp({email:sanitize(email),password});
    if(error){setError(error.message);setLoading(false);return;}
    if(data.user){
      await supabase.from("users").insert({id:data.user.id,username:availableUsername,full_name:availableUsername,province:"Alberta",municipality:"Edmonton",tax_paid:12400});
      const rows=[];
      ["federal","provincial","municipal"].forEach(lvl=>{
        SECTORS[lvl].flexible.forEach(s=>{
          rows.push({user_id:data.user.id,level:lvl,sector_id:s.id,percentage:alloc[lvl][s.id]||0,tax_year:2026});
        });
      });
      if(rows.length>0)await supabase.from("allocations").insert(rows);
      onLogin(data.session);
    }
    setLoading(false);
  };

  const levelLabel={federal:"Federal",provincial:"Provincial (Alberta)",municipal:"Municipal (Edmonton)"};

  if(mode==="login")return(
    <div style={S.wrap}><div style={S.box}>
      <div style={S.logo}>The Civic Network</div>
      <div style={S.sub}>DDTAP · PILOT v0.1 · CITIZEN LOGIN</div>
      {error&&<div style={S.error}>{error}</div>}
      <label style={S.label}>EMAIL</label>
      <input style={S.input} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
      <label style={S.label}>PASSWORD</label>
      <input style={S.input} type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
      <button style={{...S.btn,opacity:loading?.6:1}} onClick={handleLogin} disabled={loading}>{loading?"Please wait...":"Log In"}</button>
      <div style={S.toggle}>No account?<span style={S.link} onClick={()=>{setMode("signup");setStep(1);setError(null);}}>Sign up</span></div>
    </div></div>
  );

  if(step===1)return(
    <div style={S.wrap}><div style={S.box}>
      <div style={S.logo}>The Civic Network</div>
      <div style={S.sub}>DDTAP · PILOT v0.1 · CREATE ACCOUNT · STEP 1 OF 2</div>
      {error&&<div style={S.error}>{error}</div>}
      {message&&<div style={S.success}>{message}</div>}
      <div style={S.infoBox}>
        <strong style={{color:"#e8dfc8"}}>Welcome to The Civic Network.</strong> Your identity is public. Your username, voting history, and proposals are visible to all citizens. Your legal name is only accessible to the legal department.
      </div>
      <label style={S.label}>USERNAME</label>
      <input style={S.input} placeholder="your_username" value={username} onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))}/>
      <label style={S.label}>EMAIL</label>
      <input style={S.input} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
      <label style={S.label}>PASSWORD</label>
      <input style={S.input} type="password" placeholder="••••••••" value={password} onChange={e=>{setPassword(e.target.value);setPwErrors([]);}}/>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,marginBottom:16,lineHeight:1.9,color:"#8e9ab0"}}>
        {["At least 8 characters","One uppercase letter","One number","One special character"].map(r=>{
          const fail=pwErrors.includes(r);
          return<div key={r} style={{color:fail?"#e05252":password.length>0?"#4cae7f":"#8e9ab0"}}>{fail?"✗":password.length>0?"✓":"·"} {r}</div>;
        })}
      </div>
      <button style={{...S.btn,opacity:(!username||!email||!password)?.5:1}} onClick={goToAllocation} disabled={!username||!email||!password}>
        Next: Allocate Your Taxes →
      </button>
      <div style={S.toggle}>Already have an account?<span style={S.link} onClick={()=>{setMode("login");setError(null);}}>Log in</span></div>
    </div></div>
  );

  const secs=SECTORS[govLevel];
  const fu=flexTotal(govLevel),r=70-fu;

  return(
    <div style={S.wrapTop}><div style={S.boxWide}>
      <div style={S.logo}>The Civic Network</div>
      <div style={S.sub}>DDTAP · PILOT v0.1 · TAX ALLOCATION · STEP 2 OF 2</div>
      <div style={S.infoBox}>
        <strong style={{color:"#e8dfc8"}}>How your taxes shape your vote.</strong> 30% goes automatically to Critical Infrastructure. You control the remaining 70% — every percentage point you put into a sector gives you one participation point there. Those points are your vote weight on proposals. You cannot change this year's allocation after signing up, but you can plan next year's any time before the tax deadline.
      </div>

      <div style={{display:"flex",gap:0,marginBottom:20,border:"1px solid #1a3355",borderRadius:3,overflow:"hidden"}}>
        {["federal","provincial","municipal"].map((l,i)=>{
          const used=flexTotal(l)>0,active=govLevel===l;
          return<button key={l} style={{flex:1,padding:"9px",textAlign:"center",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:11,letterSpacing:".05em",color:active?"#c8a84b":used?"#4cae7f":"#8e9ab0",background:active?"rgba(200,168,75,.1)":"#0d1b2e",border:"none",borderRight:i<2?"1px solid #1a3355":"none",transition:"all .15s"}}
            onClick={()=>setGovLevel(l)}>
            {l.toUpperCase()}{used&&!active?" ✓":""}
          </button>;
        })}
      </div>

      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#8e9ab0",marginBottom:10}}>{levelLabel[govLevel].toUpperCase()}</div>

      <div style={{padding:"12px 16px",background:"rgba(200,168,75,.05)",border:"1px solid rgba(200,168,75,.2)",borderRadius:3,marginBottom:16}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#c8a84b",marginBottom:10,letterSpacing:".07em"}}>🔒 CRITICAL INFRASTRUCTURE — 30% AUTO-ALLOCATED</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6}}>
          {secs.critical.map(s=><div key={s.id} style={{background:"rgba(0,0,0,.3)",borderRadius:2,padding:"6px 10px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
              <span style={{fontSize:12,color:"#a89e8a"}}>{s.name}</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#c8a84b"}}>{s.pct}%</span>
            </div>
            <div style={{fontSize:11,color:"#8e9ab0"}}>{s.desc}</div>
          </div>)}
        </div>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"#0d1b2e",border:"1px solid #1a3355",borderRadius:3,marginBottom:16,fontFamily:"'JetBrains Mono',monospace",fontSize:11,flexWrap:"wrap"}}>
        <span style={{color:"#8e9ab0"}}>FLEXIBLE REMAINING:</span>
        <span style={{color:"#c8a84b",fontSize:15,fontWeight:500}}>{r}%</span>
        <div style={{flex:1,minWidth:80,height:5,background:"#1a3355",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",background:"#c8a84b",width:`${(fu/70)*100}%`,transition:"width .2s",borderRadius:3}}/>
        </div>
        <span style={{color:"#8e9ab0"}}>{fu}/70 used</span>
      </div>

      {secs.flexible.map(s=>{
        const val=alloc[govLevel][s.id]||0;
        const bg=`linear-gradient(to right,${s.color} 0%,${s.color} ${(val/70)*100}%,#1a3355 ${(val/70)*100}%,#1a3355 100%)`;
        return<div key={s.id} style={{marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:"#e8dfc8"}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:s.color,display:"inline-block",flexShrink:0}}/>
                {s.name}
              </div>
              <div style={{fontSize:11,color:"#8e9ab0",marginTop:2,marginLeft:15}}>{s.desc}</div>
            </div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#c8a84b",flexShrink:0,marginLeft:12}}>{val}%</span>
          </div>
          <input type="range" min={0} max={70} step={1} value={val}
            style={{width:"100%",WebkitAppearance:"none",height:5,borderRadius:3,background:bg,outline:"none",cursor:"pointer"}}
            onChange={e=>updateAlloc(govLevel,s.id,parseInt(e.target.value))}/>
        </div>;
      })}

      {r>0&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#c8a84b",marginBottom:16}}>⚠ {r}% unallocated in {levelLabel[govLevel]} — auto-distributes to Critical Infrastructure at tax deadline</div>}

      {error&&<div style={S.error}>{error}</div>}
      {message&&<div style={S.success}>{message}</div>}

      <div style={{display:"flex",gap:10,marginTop:8}}>
        <button style={{...S.btnSmall}} onClick={()=>setStep(1)}>← Back</button>
        <button style={{...S.btn,marginTop:0,flex:1,opacity:loading?.5:1}} onClick={submitSignup} disabled={loading}>
          {loading?"Creating account...":"Create Account & Enter The Civic Network"}
        </button>
      </div>
      <div style={{...S.toggle,marginTop:14}}>You can plan your 2027 allocation any time before next year's tax deadline.</div>
    </div></div>
  );
}
