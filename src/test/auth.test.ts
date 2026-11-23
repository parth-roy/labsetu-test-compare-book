import { describe, it, expect } from "vitest";
import { normalizeAuthError } from "@/hooks/useAuth";

describe("Auth Error Normalization", () => {
  it("normalizes network and fetch errors properly", () => {
    const error1 = new TypeError("Failed to fetch");
    const norm1 = normalizeAuthError(error1);
    expect(norm1.isNetworkError).toBe(true);
    expect(norm1.message).toContain("Unable to connect to the authentication service");

    const error2 = { message: "fetch failed" };
    const norm2 = normalizeAuthError(error2);
    expect(norm2.isNetworkError).toBe(true);
  });

  it("identifies unconfirmed email errors", () => {
    const error = { code: "email_not_confirmed", message: "Email not confirmed" };
    const norm = normalizeAuthError(error);
    expect(norm.isEmailNotConfirmed).toBe(true);
    expect(norm.message).toContain("check your inbox");
  });

  it("identifies existing user errors", () => {
    const error = { code: "user_already_exists", message: "User already registered" };
    const norm = normalizeAuthError(error);
    expect(norm.isUserAlreadyExists).toBe(true);
    expect(norm.message).toContain("already exists");
  });

  it("normalizes invalid credentials error message", () => {
    const error = { code: "invalid_credentials", message: "Invalid login credentials" };
    const norm = normalizeAuthError(error);
    expect(norm.message).toContain("Invalid email or password");
  });

  it("handles reserved/placeholder domains cleanly", () => {
    const error = {
      message: "This email address is not allowed. Placeholder, reserved, or mistyped domains such as example.com or gmai.com cannot receive email."
    };
    const norm = normalizeAuthError(error);
    expect(norm.message).toContain("test domains like example.com are not accepted");
  });

  it("handles empty or null error gracefully", () => {
    const norm = normalizeAuthError(null);
    expect(norm.isNetworkError).toBe(false);
    expect(norm.message).toContain("Please try again");
  });
});
