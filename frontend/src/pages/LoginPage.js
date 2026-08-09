import { useState } from "react";
import { loginUser } from "../services/leaveService";
import ThemeToggle from "../components/ThemeToggle";
import logo from "../assets/logo.svg";

function LoginPage({ onLogin, theme, onToggleTheme }) {
  const [email, setEmail] = useState("rahul@gmail.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Sends the demo credentials to the backend login endpoint.
   * @param {Event} event - Form submit event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // The service keeps API details out of the page component.
      const user = await loginUser({ email, password });
      onLogin(user);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-3 text-xl font-extrabold">
          <img className="h-10 w-10" src={logo} alt="LeaveFlow logo" />
          LeaveFlow
        </div>

        <div className="relative max-w-xl">
          <p className="mb-4 text-xs font-extrabold tracking-[0.2em] text-blue-100">
            SIMPLE • FAST • ORGANIZED
          </p>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight xl:text-6xl">
            Manage your leave without the paperwork.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-blue-100">
            Apply for leave, track requests, and keep everything organized from
            one simple dashboard.
          </p>
        </div>

        <div className="relative flex flex-wrap gap-3 text-xs font-semibold">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
            ✓ Leave balance
          </span>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
            ✓ Request tracking
          </span>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
            ✓ Admin approval
          </span>
        </div>
      </section>

      <section className="login-panel relative flex min-h-screen items-center justify-center p-5 sm:p-8">
        <div className="absolute right-5 top-5 sm:right-8 sm:top-8">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        <form
          className="soft-card w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-7 shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-9"
          onSubmit={handleSubmit}
        >
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <img className="h-9 w-9" src={logo} alt="LeaveFlow logo" />
            <strong className="text-lg">LeaveFlow</strong>
          </div>

          <p className="text-xs font-extrabold tracking-[0.18em] text-blue-600 dark:text-blue-400">
            WELCOME BACK
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Use one of the demo accounts below.
          </p>

          <label
            className="mt-7 block text-sm font-semibold text-slate-700 dark:text-slate-300"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@gmail.com"
            required
          />

          <label
            className="mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
            <strong className="text-slate-800 dark:text-slate-100">Demo access</strong>
            <p className="mt-2"><b>Employee:</b> rahul@gmail.com / password123</p>
            <p className="mt-1"><b>Admin:</b> admin@gmail.com / admin123</p>
          </div>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
