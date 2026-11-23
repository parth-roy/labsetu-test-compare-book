import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export interface NormalizedAuthError {
  message: string;
  code?: string;
  status?: number;
  isNetworkError: boolean;
  isEmailNotConfirmed: boolean;
  isUserAlreadyExists: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: string | null;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: "patient" | "lab_partner"
  ) => Promise<{ data: any; error: NormalizedAuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ data: any; error: NormalizedAuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: NormalizedAuthError | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: NormalizedAuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const normalizeAuthError = (error: unknown): NormalizedAuthError => {
  if (!error) {
    return {
      message: "An unexpected error occurred. Please try again.",
      isNetworkError: false,
      isEmailNotConfirmed: false,
      isUserAlreadyExists: false,
    };
  }

  const errObj = typeof error === "object" && error !== null ? (error as any) : {};
  const rawMessage =
    errObj.message ||
    errObj.error_description ||
    errObj.msg ||
    (error instanceof Error ? error.message : "") ||
    "Authentication failed. Please try again.";

  const code = String(errObj.code || errObj.error_code || "");
  const status = typeof errObj.status === "number" ? errObj.status : undefined;

  const isNetworkError =
    error instanceof TypeError ||
    /failed to fetch|fetch failed|networkerror|network request failed|enotfound|econnreset/i.test(
      rawMessage
    );

  const isEmailNotConfirmed =
    code === "email_not_confirmed" ||
    /email not confirmed/i.test(rawMessage);

  const isUserAlreadyExists =
    code === "user_already_exists" ||
    /user already registered|already exists/i.test(rawMessage);

  let message = rawMessage;

  if (isNetworkError) {
    message = "Unable to connect to the authentication service. Please check your internet connection and try again.";
  } else if (isEmailNotConfirmed) {
    message = "Your email has not been verified yet. Please check your inbox for the confirmation link.";
  } else if (isUserAlreadyExists) {
    message = "An account with this email already exists. Please sign in instead.";
  } else if (code === "invalid_credentials" || /invalid login credentials/i.test(rawMessage)) {
    message = "Invalid email or password. Please verify your credentials.";
  } else if (/placeholder, reserved, or mistyped domains/i.test(rawMessage)) {
    message = "Please enter a valid personal or work email address (test domains like example.com are not accepted).";
  }

  return {
    message,
    code,
    status,
    isNetworkError,
    isEmailNotConfirmed,
    isUserAlreadyExists,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  const fetchRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      if (!error && data?.role) {
        setRole(data.role);
      }
    } catch (e) {
      console.warn("Could not fetch user role:", e);
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        const metaRole = (currentSession.user.user_metadata as any)?.role;
        if (metaRole) setRole(metaRole);
        fetchRole(currentSession.user.id);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!mounted) return;
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      if (existingSession?.user) {
        const metaRole = (existingSession.user.user_metadata as any)?.role;
        if (metaRole) setRole(metaRole);
        fetchRole(existingSession.user.id);
      }
      setLoading(false);
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    selectedRole: "patient" | "lab_partner"
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { full_name: fullName.trim(), role: selectedRole },
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      return { data, error: error ? normalizeAuthError(error) : null };
    } catch (error) {
      return { data: null, error: normalizeAuthError(error) };
    }
  };

  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      return { data, error: error ? normalizeAuthError(error) : null };
    } catch (error) {
      return { data: null, error: normalizeAuthError(error) };
    }
  };

  const resetPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/reset-password`,
      });
      return { error: error ? normalizeAuthError(error) : null };
    } catch (error) {
      return { error: normalizeAuthError(error) };
    }
  };

  const resendVerificationEmail = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: cleanEmail,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      return { error: error ? normalizeAuthError(error) : null };
    } catch (error) {
      return { error: normalizeAuthError(error) };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      return { data, error: error ? normalizeAuthError(error) : null };
    } catch (error) {
      return { data: null, error: normalizeAuthError(error) };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        role,
        signUp,
        signIn,
        resetPassword,
        resendVerificationEmail,
        updatePassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
