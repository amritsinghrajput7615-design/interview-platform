import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router"
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from "axios";
const NeuralNetSVG = () => (
  <svg viewBox="0 0 420 420" className="w-full h-full max-w-md opacity-85">
    <defs>
      <style>{`
        @keyframes pulse-node { 0%,100%{opacity:0.5;r:5} 50%{opacity:1;r:7} }
        @keyframes dash-flow { from{stroke-dashoffset:200} to{stroke-dashoffset:0} }
        @keyframes scan { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(180px)} }
        @keyframes glow-ring { 0%,100%{opacity:0.15} 50%{opacity:0.4} }
        .n1{animation:pulse-node 3s ease-in-out infinite}
        .n2{animation:pulse-node 3s ease-in-out infinite 0.4s}
        .n3{animation:pulse-node 3s ease-in-out infinite 0.8s}
        .n4{animation:pulse-node 3s ease-in-out infinite 1.2s}
        .n5{animation:pulse-node 3s ease-in-out infinite 1.6s}
        .flow1{animation:dash-flow 4s linear infinite}
        .flow2{animation:dash-flow 4s linear infinite 1s}
        .flow3{animation:dash-flow 4s linear infinite 2s}
        .scanline{transform-origin:210px 130px;animation:scan 6s ease-in-out infinite}
        .gring{animation:glow-ring 4s ease-in-out infinite}
      `}</style>
    </defs>

    <circle cx="210" cy="210" r="185" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="3 8" className="gring"/>
    <circle cx="210" cy="210" r="155" fill="none" stroke="#0891b2" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.2"/>

    <g className="scanline">
      <line x1="90" y1="130" x2="330" y2="130" stroke="#06b6d4" strokeWidth="0.8" opacity="0.35" strokeDasharray="4 3"/>
    </g>

    {[[120,130,210,90],[120,130,210,160],[120,130,210,230],
      [120,200,210,90],[120,200,210,160],[120,200,210,230],[120,200,210,300],
      [120,270,210,160],[120,270,210,230],[120,270,210,300]].map(([x1,y1,x2,y2],i)=>(
      <line key={`a${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#164e63" strokeWidth="0.8" opacity="0.5"/>
    ))}

    {[[210,90,305,130],[210,90,305,200],[210,90,305,270],
      [210,160,305,130],[210,160,305,200],[210,160,305,270],
      [210,230,305,130],[210,230,305,200],[210,230,305,270],
      [210,300,305,200],[210,300,305,270]].map(([x1,y1,x2,y2],i)=>(
      <line key={`b${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#164e63" strokeWidth="0.8" opacity="0.5"/>
    ))}

    <line x1="120" y1="200" x2="305" y2="200"
      stroke="#06b6d4" strokeWidth="1.2" opacity="0.4"
      strokeDasharray="10 8" className="flow1"/>
    <line x1="120" y1="130" x2="210" y2="160"
      stroke="#22d3ee" strokeWidth="1" opacity="0.35"
      strokeDasharray="8 6" className="flow2"/>
    <line x1="210" y1="300" x2="305" y2="270"
      stroke="#06b6d4" strokeWidth="1" opacity="0.3"
      strokeDasharray="8 6" className="flow3"/>

    {[130,200,270].map((y,i)=>(
      <g key={`l1-${i}`}>
        <circle cx="120" cy={y} r="12" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="1" opacity="0.5"/>
        <circle cx="120" cy={y} r={5} fill="#06b6d4" className={`n${i+1}`}/>
      </g>
    ))}

    {[90,160,230,300].map((y,i)=>(
      <g key={`l2-${i}`}>
        <circle cx="210" cy={y} r="14" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="1.2" opacity="0.6"/>
        <circle cx="210" cy={y} r={6} fill="#22d3ee" className={`n${i+1}`}/>
      </g>
    ))}

    {[130,200,270].map((y,i)=>(
      <g key={`l3-${i}`}>
        <circle cx="305" cy={y} r="12" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="1" opacity="0.5"/>
        <circle cx="305" cy={y} r={5} fill="#06b6d4" className={`n${i+2}`}/>
      </g>
    ))}

    <circle cx="80" cy="80" r="3" fill="#06b6d4" opacity="0.4"/>
    <circle cx="340" cy="340" r="3" fill="#06b6d4" opacity="0.4"/>
    <circle cx="340" cy="80" r="2.5" fill="#0891b2" opacity="0.35"/>
    <circle cx="80" cy="340" r="2.5" fill="#0891b2" opacity="0.3"/>

    <polygon points="210,170 228,180 228,200 210,210 192,200 192,180"
      fill="rgba(6,182,212,0.05)" stroke="#06b6d4" strokeWidth="0.8" opacity="0.4"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <path d="M13 2L4 6v7c0 5 4 9 9 11 5-2 9-6 9-11V6L13 2z"
      stroke="#06b6d4" strokeWidth="1.4" fill="rgba(6,182,212,0.1)" strokeLinejoin="round"/>
    <path d="M9 13l3 3 5-5" stroke="#06b6d4" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Login() {
 
  const [focused, setFocused] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email,setEmail] = useState("")
  const [password,setPassword ] =useState("")
  const {handleLogin ,loading}= useAuth()
  const navigate = useNavigate()
  // ✅ NEW: handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents page reload
   await handleLogin({email,password})
    navigate('/')
    
    // 👉 add your API call or routing logic here
  };
  if (loading) {
    return (<main><h1>loading...</h1></main>)
  }

  const inputClass = (name) =>
    `w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 border ${
      focused === name
        ? "bg-slate-800 border-cyan-500 shadow-[0_0_0_3px_rgba(6,182,212,0.15)]"
        : "bg-slate-800/70 border-slate-700 hover:border-slate-600"
    }`;

    const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const token = credentialResponse.credential;

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/google`,
      { token },
      { withCredentials: true }
    );

   

    // ✅ Save token (VERY IMPORTANT)
    // localStorage.setItem('token', res.data.token); // removed since using cookies

    navigate('/');

  } catch (error) {
    console.error(error);
    alert('Google Login Failed');
  }
};

  return (
    <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-950 rounded-full blur-3xl opacity-35 translate-x-1/3 -translate-y-1/3 pointer-events-none"/>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-950 rounded-full blur-3xl opacity-25 -translate-x-1/3 translate-y-1/3 pointer-events-none"/>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-950 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"/>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .fu  { animation: fadeUp 0.55s ease both; }
        .fu1 { animation: fadeUp 0.55s 0.08s ease both; }
        .fu2 { animation: fadeUp 0.55s 0.16s ease both; }
        .fu3 { animation: fadeUp 0.55s 0.24s ease both; }
        .float-dot { animation: floatY 5s ease-in-out infinite; }
        .float-dot2{ animation: floatY 7s ease-in-out infinite 1.5s; }
      `}</style>

      <div className="absolute w-2 h-2 rounded-full bg-cyan-400 opacity-60 top-1/4 left-1/3 float-dot pointer-events-none"/>
      <div className="absolute w-1.5 h-1.5 rounded-full bg-sky-400 opacity-50 bottom-1/3 right-1/4 float-dot2 pointer-events-none"/>
      <div className="absolute w-1 h-1 rounded-full bg-cyan-300 opacity-40 top-2/3 left-1/4 float-dot pointer-events-none" style={{animationDelay:"2.5s"}}/>

      <div className="w-full min-h-screen flex flex-col lg:flex-row-reverse items-center justify-between px-8 lg:px-24">

        {/* RIGHT: Graphic + text */}
        <div className="flex-1 flex flex-col items-center lg:items-end text-center lg:text-right fu">
          <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 mb-6 lg:mb-8">
            <NeuralNetSVG />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Welcome<br />
            <span className="text-cyan-400">Back.</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-sm mb-8">
            Your AI-powered hiring co-pilot is ready. Sign in to resume your
            intelligent interview sessions and candidate insights.
          </p>
          <div className="flex gap-6 justify-center lg:justify-end">
            {[
              { value: "98%", label: "Accuracy" },
              { value: "3×", label: "Faster Hiring" },
              { value: "10k+", label: "Interviews" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center lg:text-right">
                <p className="text-cyan-400 font-bold text-lg sm:text-xl">{value}</p>
                <p className="text-slate-500 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LEFT: Login form */}
        <div className="w-full max-w-md fu1">

          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl border border-slate-700 bg-slate-900 flex items-center justify-center mb-4 shadow-lg">
              <ShieldIcon />
            </div>
            <h2 className="text-white font-semibold text-lg mb-1">Sign in to your account</h2>
            <p className="text-slate-500 text-xs">Secure access to your hiring intelligence platform</p>
          </div>

          {/* ✅ FORM TAG WRAPS ALL INPUT FIELDS */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">

              {/* Social login buttons — type="button" so they don't trigger form submit */}
              <div className="grid grid-cols-2 gap-3 mb-6 fu2">
                <div className="flex justify-center">
                  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => console.log('Login Failed')}
                    />
                  </GoogleOAuthProvider>
                </div>
                {[
                  {
                    label: "GitHub",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#e2e8f0" className="shrink-0">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                    ),
                  },
                ].map(({ label, icon }) => (
                  <button
                    key={label}
                    type="button" // ✅ prevents accidental form submit
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-700/60 hover:border-slate-600 transition-all duration-150 text-slate-300 text-xs font-medium active:scale-[0.98]"
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5 fu2">
                <div className="flex-1 h-px bg-slate-800"/>
                <span className="text-slate-600 text-xs">or continue with email</span>
                <div className="flex-1 h-px bg-slate-800"/>
              </div>

              {/* ✅ Email input */}
              <div className="mb-4 fu2">
                <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e)=>{setEmail(e.target.value)}}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  required
                  autoComplete="email"
                  className={inputClass("email")}
                />
              </div>

              {/* ✅ Password input */}
              <div className="mb-4 fu3">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-xs font-medium text-slate-300">Password</label>
                  <a href="#" className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value )}}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    required
                    autoComplete="current-password"
                    className={`${inputClass("password")} pr-11`}
                  />
                  <button
                    type="button" // ✅ prevents accidental form submit
                    onClick={() => setShowPass((s) => !s)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-xs select-none"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* ✅ Remember me */}
              <div className="flex items-center gap-2.5 mb-5 fu3">
                <button
                  type="button" // ✅ prevents accidental form submit
                  onClick={() => setRemember((r) => !r)}
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 shrink-0 ${
                    remember
                      ? "bg-cyan-400 border-cyan-400"
                      : "bg-transparent border-slate-600 hover:border-slate-400"
                  }`}
                >
                  {remember && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                <span
                  className="text-xs text-slate-400 select-none cursor-pointer"
                  onClick={() => setRemember(r => !r)}
                >
                  Keep me signed in for 30 days
                </span>
              </div>

              {/* ✅ Submit button — type="submit" triggers form onSubmit */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:scale-[0.98] text-slate-900 font-bold text-sm tracking-wide transition-all duration-150 shadow-lg shadow-cyan-900/30"
              >
                Sign In
              </button>

              <p className="text-center text-xs text-slate-600 mt-4">
                Protected by enterprise-grade{" "}
                <span className="text-slate-500">256-bit encryption</span>
              </p>
            </div>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{" "}
            <a href="/register" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
              Create one free
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}