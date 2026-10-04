import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

const Login = () => {
  const { user, loading, error, handleLogin, clearError } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const isVerificationError = Boolean(error) && /verif/i.test(error);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    const data = await handleLogin(formData);
    if (data) setFormData({ email: "", password: "" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink font-sans text-frost">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-lumen/15 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-[30rem] w-[30rem] rounded-full bg-lumen/10 blur-[130px]"
      />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl lg:grid-cols-[1.05fr_1fr]">
        <section className="hidden flex-col justify-between px-6 py-16 lg:flex lg:pr-16">
          <Link to="/login" className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-lumen shadow-[0_0_18px_5px_rgba(242,178,76,0.5)]" />
            <span className="font-display text-2xl tracking-tight">Lumina</span>
          </Link>

          <div className="max-w-md">
            <h1 className="font-display text-5xl leading-[1.06] tracking-tight">
              Conversation, grounded in the live web.
            </h1>
            <p className="mt-6 leading-relaxed text-mist">
              Lumina searches as it answers and streams the reply back the moment it's ready — no
              stale, out-of-date guesses.
            </p>
          </div>

          <p className="text-sm text-mist/60">Project Lumina</p>
        </section>

        <section className="flex flex-col justify-center px-6 py-14 sm:px-10 lg:py-16 lg:pl-16">
          <Link to="/login" className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="h-2.5 w-2.5 rounded-full bg-lumen shadow-[0_0_18px_5px_rgba(242,178,76,0.5)]" />
            <span className="font-display text-2xl tracking-tight">Lumina</span>
          </Link>

          {user ? (
            <div className="max-w-sm">
              <span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-lumen/15 text-lumen">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2 className="font-display text-3xl tracking-tight">
                You're in, {user.username}.
              </h2>
              <p className="mt-3 leading-relaxed text-mist">
                Your session is active. The chat experience arrives in the next module.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              <h2 className="font-display text-4xl tracking-tight">Welcome back</h2>
              <p className="mt-3 text-sm text-mist">Log in to continue your conversation.</p>

              <div className="mt-10 space-y-7">
                <div>
                  <label htmlFor="email" className="text-sm text-mist">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="mt-2 w-full border-b border-line bg-transparent py-2.5 text-frost outline-none transition-colors placeholder:text-mist/50 focus:border-lumen"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="text-sm text-mist">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Your password"
                      className="mt-2 w-full border-b border-line bg-transparent py-2.5 pr-14 text-frost outline-none transition-colors placeholder:text-mist/50 focus:border-lumen"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute bottom-2.5 right-0 text-xs text-mist transition-colors hover:text-frost focus-visible:outline-none focus-visible:text-frost"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              {error && !isVerificationError && (
                <p
                  role="alert"
                  className="mt-6 rounded-lg border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose"
                >
                  {error}
                </p>
              )}

              {isVerificationError && (
                <p
                  role="status"
                  className="mt-6 rounded-lg border border-lumen/40 bg-lumen/10 px-4 py-3 text-sm text-lumen"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-lumen py-3.5 font-medium text-ink transition hover:brightness-105 hover:shadow-[0_0_28px_rgba(242,178,76,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lumen active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                )}
                {loading ? "Logging in…" : "Log in"}
              </button>

              <p className="mt-8 text-sm text-mist">
                New to Lumina?{" "}
                <Link to="/register" className="text-frost underline-offset-4 hover:underline">
                  Create an account
                </Link>
              </p>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default Login;
