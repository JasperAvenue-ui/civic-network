import { useState } from "react";
import { supabase } from "./supabase";

const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
  if (!/[0-9]/.test(password)) errors.push("At least one number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("At least one special character");
  return errors;
};

const sanitize = (str) => str.replace(/[^a-zA-Z0-9_@.]/g, "").slice(0, 50);

const getAvailableUsername = async (base) => {
  const clean = base.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
  const { data } = await supabase.from("users").select("username").eq("username", clean).single();
  if (!data) return clean;
  for (let i = 2; i <= 99; i++) {
    const candidate = `${clean}${i}`;
    const { data: taken } = await supabase.from("users").select("username").eq("username", candidate).single();
    if (!taken) return candidate;
  }
  return `${clean}_${Date.now()}`;
};

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [pwErrors, setPwErrors] = useState([]);

  const handleLogin = async () => {
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: sanitize(email),
      password,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignup = async () => {
    setError(null);
    const pwErrs = validatePassword(password);
    if (pwErrs.length > 0) { setPwErrors(pwErrs); return; }
    if (!username.trim()) { setError("Username is required"); return; }
    setLoading(true);
    const availableUsername = await getAvailableUsername(username);
    const { data, error } = await supabase.auth.signUp({
      email: sanitize(email),
      password,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) {
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        username: availableUsername,
        full_name: availableUsername,
        province: "Alberta",
        municipality: "Edmonton",
        tax_paid: 12400,
      });
      if (profileError) setError(profileError.message);
      else setMessage(`Account created! Your username is @${availableUsername}`);
    }
    setLoading(false);
  };

  const S = {
    wrap: { minHeight:"100vh", background:"#070f1c", display:"flex", alignItems:"center", justifyContent:"center", padding:24 },
    box: { background:"#0d1b2e", border:"1px solid #1a3355", borderRadius:4, padding:40, width:"100%", maxWidth:420 },
    logo: { fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, fontWeight:700, color:"#c8a84b", marginBottom:6 },
    sub: { fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"#8e9ab0", marginBottom:32, letterSpacing:".06em" },
    label: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#c8a84b", letterSpacing:".06em", display:"block", marginBottom:6 },
    input: { width:"100%", background:"#070f1c", border:"1px solid #1a3355", color:"#e8dfc8", padding:"10px 14px", fontFamily:"Georgia,serif", fontSize:14, borderRadius:2, outline:"none", marginBottom:16 },
    btn: { width:"100%", padding:12, background:"#c8a84b", color:"#070f1c", border:"none", cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:500, borderRadius:2, letterSpacing:".05em", marginTop:8, opacity: loading ? .6 : 1 },
    toggle: { marginTop:20, textAlign:"center", fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"#8e9ab0" },
    toggleLink: { color:"#c8a84b", cursor:"pointer", marginLeft:6 },
    error: { background:"rgba(224,82,82,.1)", border:"1px solid rgba(224,82,82,.3)", color:"#e05252", padding:"10px 14px", borderRadius:2, fontFamily:"'JetBrains Mono',monospace", fontSize:11, marginBottom:16 },
    success: { background:"rgba(76,174,127,.1)", border:"1px solid rgba(76,174,127,.3)", color:"#4cae7f", padding:"10px 14px", borderRadius:2, fontFamily:"'JetBrains Mono',monospace", fontSize:11, marginBottom:16 },
    pwHint: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#e05252", marginTop:-10, marginBottom:14, lineHeight:1.7 },
    requirement: { fontFamily:"'JetBrains Mono',monospace", fontSize:10, marginBottom:16, lineHeight:1.9, color:"#8e9ab0" },
  };

  return (
    <div style={S.wrap}>
      <div style={S.box}>
        <div style={S.logo}>The Civic Network</div>
        <div style={S.sub}>DDTAP · PILOT v0.1 · {mode === "login" ? "CITIZEN LOGIN" : "CREATE ACCOUNT"}</div>
        {error && <div style={S.error}>{error}</div>}
        {message && <div style={S.success}>{message}</div>}
        {mode === "signup" && (
          <>
            <label style={S.label}>USERNAME</label>
            <input style={S.input} placeholder="your_username" value={username}
              onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} />
          </>
        )}
        <label style={S.label}>EMAIL</label>
        <input style={S.input} type="email" placeholder="you@example.com" value={email}
          onChange={e => setEmail(e.target.value)} />
        <label style={S.label}>PASSWORD</label>
        <input style={S.input} type="password" placeholder="••••••••" value={password}
          onChange={e => { setPassword(e.target.value); setPwErrors([]); }} />
        {mode === "signup" && (
          <div style={S.requirement}>
            {["At least 8 characters","One uppercase letter","One number","One special character"].map(r => {
              const failing = pwErrors.includes(r);
              return <div key={r} style={{color: failing ? "#e05252" : password.length > 0 ? "#4cae7f" : "#8e9ab0"}}>
                {failing ? "✗" : password.length > 0 ? "✓" : "·"} {r}
              </div>;
            })}
          </div>
        )}
        <button style={S.btn} onClick={mode === "login" ? handleLogin : handleSignup} disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
        </button>
        <div style={S.toggle}>
          {mode === "login" ? "No account?" : "Already have an account?"}
          <span style={S.toggleLink} onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setMessage(null); setPwErrors([]); }}>
            {mode === "login" ? "Sign up" : "Log in"}
          </span>
        </div>
      </div>
    </div>
  );
}