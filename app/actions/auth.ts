"use server";

type User = {
  _id: {
    $oid: string;
  };
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  isVerified: boolean;
  role: "admin" | "user"; // Assuming there are only these two roles
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  __v: number;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
};

type AuthResponse = {
  success: boolean;
  message?: string;
  data?: User;
  accessToken?: string;
  refreshToken?: string;
};

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Login failed",
      }
    }

    return {
      success: true,
      data: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function registerUser(userData: RegisterData): Promise<AuthResponse> {
  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Registration failed",
      }
    }

    return {
      success: true,
      message: "Registration successful",
      data: data.user,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function forgotPassword(email: string): Promise<AuthResponse> {
  try {
    const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to send reset email",
      }
    }

    return {
      success: true,
      message: "Password reset email sent",
    }
  } catch (error) {
    console.error("Forgot password error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function verifyOTP(email: string, verificationCode: string): Promise<AuthResponse> {
  try {
    const response = await fetch("http://localhost:5000/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, verificationCode }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Invalid OTP",
      }
    }

    return {
      success: true,
      message: "OTP verified successfully",
      data: data,
    }
  } catch (error) {
    console.error("OTP verification error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function resetPassword(email: string, password: string, token: string): Promise<AuthResponse> {
  try {
    const response = await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, token }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to reset password",
      }
    }

    return {
      success: true,
      message: "Password reset successful",
    }
  } catch (error) {
    console.error("Reset password error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  token: string,
): Promise<AuthResponse> {
  try {
    const response = await fetch("http://localhost:5000/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to change password",
      }
    }

    return {
      success: true,
      message: "Password changed successfully",
    }
  } catch (error) {
    console.error("Change password error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function resendVerificationOTP(token: string): Promise<AuthResponse> {
  try {
    const response = await fetch("http://localhost:5000/api/auth/verify", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to resend OTP",
      }
    }

    return {
      success: true,
      message: "OTP resent successfully",
    }
  } catch (error) {
    console.error("Resend OTP error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}
