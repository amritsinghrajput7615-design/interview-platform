import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from "axios";

const OrbitGraphic = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 420 420" className="w-full h-full max-w-sm opacity-70">
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
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="210" cy="210" r="80" fill="url(#centerGlow)" />
      <circle cx="210" cy="210" r="170" fill="none" stroke="#ec4899" strokeWidth="1" strokeDasharray="6 4" opacity="0.2"/>
      <circle cx="210" cy="210" r="130" fill="none" stroke="#ec4899" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.15"/>
      <circle cx="210" cy="210" r="90" fill="none" stroke="#db2777" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.15"/>
      <g className="orbit1">
        <ellipse cx="210" cy="210" rx="160" ry="55" fill="none" stroke="#ec4899" strokeWidth="1" opacity="0.2" transform="rotate(-30 210 210)"/>
        <circle cx="370" cy="210" r="5" fill="#ec4899" className="dot-pulse" transform="rotate(-30 210 210)"/>
      </g>
      <g className="orbit2">
        <ellipse cx="210" cy="210" rx="140" ry="50" fill="none" stroke="#f472b6" strokeWidth="1" opacity="0.18" transform="rotate(40 210 210)"/>
        <circle cx="350" cy="210" r="4" fill="#f9a8d4" className="dot-pulse" transform="rotate(40 210 210)"/>
      </g>
      <g className="orbit3">
        <ellipse cx="210" cy="210" rx="120" ry="40" fill="none" stroke="#ec4899" strokeWidth="0.8" opacity="0.15" transform="rotate(70 210 210)"/>
      </g>
      <polygon points="210,178 236,193 236,226 210,241 184,226 184,193" fill="rgba(236,72,153,0.08)" stroke="#ec4899" strokeWidth="1.5"/>
      <circle cx="210" cy="210" r="8" fill="#ec4899" opacity="0.9"/>
      <circle cx="210" cy="210" r="16" fill="none" stroke="#ec4899" strokeWidth="1" opacity="0.3"/>
      <circle cx="370" cy="200" r="4" fill="#ec4899" opacity="0.5"/>
      <circle cx="180" cy="80" r="3.5" fill="#ec4899" opacity="0.4"/>
      <circle cx="80" cy="290" r="3" fill="#db2777" opacity="0.35"/>
    </svg>
  </div>
);

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Setting up your account...</p>
        </div>
      </main>
    );
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await axios.post(
        import.meta.env.VITE_API_URL + '/auth/google',
        { token },
        { withCredentials: true }
      );
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Google Login Failed');
    }
  };

  const inputBase = (name) =>
    `w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 border bg-[#12121f] ${
      focused === name
        ? "border-pink-500/60 shadow-[0_0_0_3px_rgba(236,72,153,0.12)]"
        : "border-white/8 hover:border-white/15"
    }`;

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600" />

      {/* Background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-pink-900" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 translate-x-1/3 translate-y-1/3 pointer-events-none bg-purple-900" />

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up   { animation: fadeUp 0.5s ease both; }
        .fade-up-1 { animation: fadeUp 0.5s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.5s 0.2s ease both; }
        .fade-up-3 { animation: fadeUp 0.5s 0.3s ease both; }
        .fade-up-4 { animation: fadeUp 0.5s 0.4s ease both; }
      `}</style>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* ── Left Panel ── */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left fade-up">
          <div className="w-60 h-60 sm:w-72 sm:h-72 mb-6">
            <OrbitGraphic />
          </div>

          <div className="mb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            <span className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">Luminous Insight</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-white leading-tight mb-4">
            Elevate Your<br />
            <span className="text-pink-400">Hiring</span> Intelligence.
          </h1>

          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8">
            Harness agentic AI to conduct deep-dive technical interviews, assess soft skills, and find your next lead engineer with surgical precision.
          </p>

          <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
            {["Real-time Synthesis", "Adaptive Persona", "Bias-free Scoring"].map((tag) => (
              <span key={tag} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500/70 inline-block" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="w-full max-w-md fade-up-1">

          {/* Card header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-xl border border-pink-500/20 bg-pink-500/8 flex items-center justify-center mb-3 shadow-lg shadow-pink-500/10">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" stroke="#ec4899" strokeWidth="1.5" fill="rgba(236,72,153,0.1)"/>
                <circle cx="14" cy="14" r="3" fill="#ec4899"/>
              </svg>
            </div>
            <p className="text-gray-500 text-xs text-center">Join the next generation of intelligent interviewing.</p>
          </div>

          {/* Form card */}
          <div className="bg-[#10101d] border border-white/6 rounded-2xl p-7 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username */}
              <div className="fade-up-1">
                <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">Username</label>
                <input
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused("username")}
                  onBlur={() => setFocused("")}
                  className={inputBase("username")}
                />
              </div>

              {/* Email */}
              <div className="fade-up-2">
                <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  className={inputBase("email")}
                />
              </div>

              {/* Password */}
              <div className="fade-up-3">
                <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    className={`${inputBase("password")} pr-14`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-600 hover:text-pink-400 transition-colors font-medium"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-[11px] text-gray-700 mt-1.5">Minimum 8 characters with letters and numbers.</p>
              </div>

              {/* Submit */}
              <div className="fade-up-4 pt-1">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-pink-600 hover:bg-pink-500 active:scale-[0.98] text-white font-bold text-sm tracking-wide transition-all duration-150 shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Create Account
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/6" />
                <span className="text-[11px] text-gray-700 font-medium">or continue with</span>
                <div className="flex-1 h-px bg-white/6" />
              </div>

              {/* Google Login */}
              <div className="flex justify-center">
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log('Login Failed')}
                  />
                </GoogleOAuthProvider>
              </div>

            </form>
          </div>

          {/* Terms */}
          <p className="text-center text-[11px] text-gray-700 mt-4">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-pink-500 hover:text-pink-400 transition-colors">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-pink-500 hover:text-pink-400 transition-colors">Privacy Policy</a>.
          </p>

          {/* Sign in link */}
          <p className="text-center text-sm text-gray-600 mt-3">
            Already have an account?{" "}
            <a href="/login" className="text-pink-400 font-semibold hover:text-pink-300 transition-colors">
              Sign in here
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
