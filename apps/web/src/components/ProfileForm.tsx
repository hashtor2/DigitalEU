import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileFormProps {
  onSubmit?: (data: { name: string; email: string; password: string; agreeTerms: boolean; subscribeNews: boolean }) => void;
  isLoading?: boolean;
}

export function ProfileForm({ onSubmit, isLoading }: ProfileFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [subscribeNews, setSubscribeNews] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null);

  const checkPasswordStrength = (pwd: string) => {
    if (pwd.length < 12) return "weak";
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSymbol = /[!@#$%^&*]/.test(pwd);
    if (hasUpper && hasNumber && hasSymbol) return "strong";
    if (hasUpper || hasNumber) return "medium";
    return "weak";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(pwd ? checkPasswordStrength(pwd) : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !agreeTerms) {
      return;
    }
    onSubmit?.({
      name,
      email,
      password,
      agreeTerms,
      subscribeNews,
    });
  };

  const isValid = name && email && password && agreeTerms && passwordStrength === "strong";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      {/* Name + Email (two columns on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            required
          />
          <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">Required</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
          <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">Required</p>
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <Input
          type="password"
          placeholder="Min 12 chars, uppercase + number + symbol"
          value={password}
          onChange={handlePasswordChange}
          className="w-full"
          required
        />
        {passwordStrength && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-border dark:bg-dark-border rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  passwordStrength === "weak"
                    ? "w-1/3 bg-error"
                    : passwordStrength === "medium"
                    ? "w-2/3 bg-warning"
                    : "w-full bg-success"
                }`}
              />
            </div>
            <span className="text-xs font-medium capitalize text-text-secondary dark:text-dark-text-secondary">
              {passwordStrength}
            </span>
          </div>
        )}
      </div>

      {/* Consent Checkboxes */}
      <div className="space-y-3 border-t border-border dark:border-dark-border pt-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1 h-5 w-5 accent-accent"
            required
          />
          <span className="text-sm">
            I agree to the{" "}
            <a href="#terms" className="font-medium text-accent hover:underline">
              Terms & Privacy Policy
            </a>
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={subscribeNews}
            onChange={(e) => setSubscribeNews(e.target.checked)}
            className="mt-1 h-5 w-5 accent-accent"
          />
          <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
            Send me EU tech news & migration tips (optional)
          </span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="h-12 rounded-sm bg-accent px-8 font-mono font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary">
          Already have an account?{" "}
          <a href="#signin" className="font-medium text-accent hover:underline">
            Sign in →
          </a>
        </p>
      </div>
    </form>
  );
}

export default ProfileForm;
