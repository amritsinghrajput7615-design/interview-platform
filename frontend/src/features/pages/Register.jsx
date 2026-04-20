import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router";
const FloatingParticle = ({ style }) => (
  <div className="absolute rounded-full bg-cyan-400 opacity-70" style={style} />
);

const HexagonIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <polygon
      points="14,2 25,8 25,20 14,26 3,20 3,8"
      stroke="#06b6d4"
      strokeWidth="1.5"
      fill="rgba(6,182,212,0.1)"
    />
    <circle cx="14" cy="14" r="3" fill="#06b6d4" />
  </svg>
);

const OrbitGraphic = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 420 420" className="w-full h-full max-w-md opacity-80">
      <defs>
        <style>{`
          @keyframes rotate1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes rotate2 { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          @keyframes pulse { 0%,100% { opacity:0.6; r:4; } 50% { opacity:1; r:6; } }
          .orbit1 { transform-origin: 210px 210px; animation: rotate1 12s linear infinite; }
          .orbit2 { transform-origin: 210px 210px; animation: rotate2 18s linear infinite; }
          .orbit3 { transform-origin: 210px 210px; animation: rotate1 25s linear infinite; }
          .dot-pulse { animation: pulse 2s ease-in-out infinite; }
        `}</style>
      </defs>
      <circle cx="210" cy="210" r="170" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="6 4" opacity="0.3"/>
      <circle cx="210" cy="210" r="130" fill="none" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.25"/>
      <circle cx="210" cy="210" r="90" fill="none" stroke="#0891b2" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.2"/>
      <g className="orbit1">
        <ellipse cx="210" cy="210" rx="160" ry="55" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.3" transform="rotate(-30 210 210)"/>
        <circle cx="370" cy="210" r="5" fill="#06b6d4" className="dot-pulse" transform="rotate(-30 210 210)"/>
      </g>
      <g className="orbit2">
        <ellipse cx="210" cy="210" rx="140" ry="50" fill="none" stroke="#0284c7" strokeWidth="1" opacity="0.25" transform="rotate(40 210 210)"/>
        <circle cx="350" cy="210" r="4" fill="#38bdf8" className="dot-pulse" transform="rotate(40 210 210)"/>
      </g>
      <g className="orbit3">
        <ellipse cx="210" cy="210" rx="120" ry="40" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0.2" transform="rotate(70 210 210)"/>
      </g>
      <polygon points="210,165 248,188 248,232 210,255 172,232 172,188" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="1.5"/>
      <polygon points="210,178 236,193 236,226 210,241 184,226 184,193" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="1" opacity="0.6"/>
      <circle cx="210" cy="210" r="7" fill="#06b6d4" opacity="0.9"/>
      <circle cx="210" cy="210" r="14" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.4"/>
      <circle cx="370" cy="200" r="4" fill="#06b6d4" opacity="0.6"/>
      <circle cx="180" cy="80" r="3.5" fill="#06b6d4" opacity="0.5"/>
      <circle cx="80" cy="290" r="3" fill="#0284c7" opacity="0.45"/>
    </svg>
  </div>
);

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState("");
   const [email,setEmail] = useState()
  const [password,setPassword ] =useState()
  const [username,setUsername]=useState()
  const { handleRegister,loading } = useAuth();
  const navigate = useNavigate()
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
   await handleRegister({username, email, password});
    navigate('/')
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

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-950 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-950 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <FloatingParticle style={{ width:6, height:6, top:"22%", left:"42%", animation:"float1 6s ease-in-out infinite" }} />
      <FloatingParticle style={{ width:4, height:4, top:"60%", left:"36%", animation:"float2 8s ease-in-out infinite 1s" }} />
      <FloatingParticle style={{ width:5, height:5, top:"35%", left:"55%", animation:"float1 7s ease-in-out infinite 2s" }} />

      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-d1 { animation: fadeUp 0.6s 0.1s ease both; }
        .fade-up-d2 { animation: fadeUp 0.6s 0.2s ease both; }
        .fade-up-d3 { animation: fadeUp 0.6s 0.3s ease both; }
      `}</style>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

        {/* LEFT PANEL */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left fade-up">
          <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 mb-6 lg:mb-8">
            <OrbitGraphic />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Elevate Your <span className="text-cyan-400">Hiring</span><br />Intelligence.
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mb-8">
            Harness the power of agentic AI to conduct deep-dive technical interviews, assess soft skills, and find your next lead engineer with surgical precision.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-xs text-slate-400">
            {["Real-time Synthesis", "Adaptive Persona", "Bias-free Scoring"].map((tag) => (
              <span key={tag} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full max-w-md fade-up-d1">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl border border-slate-700 bg-slate-900 flex items-center justify-center mb-4 shadow-lg">
              <HexagonIcon />
            </div>
            <p className="text-slate-300 text-sm text-center">
              Join the next generation of intelligent interviewing.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <form onSubmit={handleSubmit}>

              {/* Username */}
              <div className="mb-5 fade-up-d1">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e)=>{setUsername(e.target.value)}}
                  onFocus={() => setFocused("username")}
                  onBlur={() => setFocused("")}
                  className={inputClass("username")}
                />
              </div>

              {/* Email */}
              <div className="mb-5 fade-up-d2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                   onChange={(e)=>{setEmail(e.target.value)}}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  className={inputClass("email")}
                />
              </div>

              {/* Password */}
              <div className="mb-2 fade-up-d3">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                     onChange={(e)=>{setPassword(e.target.value)}}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    className={`${inputClass("password")} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-xs select-none"
                    tabIndex={-1}
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-1.5">
                  Minimum 8 characters with a mix of letters and numbers.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full mt-5 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:scale-[0.98] text-slate-900 font-bold text-sm tracking-wide transition-all duration-150 shadow-lg shadow-cyan-900/30"
              >
                Create Account
              </button>

              <p className="text-center text-xs text-slate-600 mt-4">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-cyan-500 hover:underline">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-cyan-500 hover:underline">Privacy Policy</a>.
              </p>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <a href="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}