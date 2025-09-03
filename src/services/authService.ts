import API from "./axios";

export interface StaffLoginData {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    password: string | null;
    role: string;
    expectedGraduationDate: Date | null;
    displayName: string;
    isActive: boolean;
}

// login via google
export const handleGoogleLogin = async (token: string) => {
  console.log("handleGoogleLogin called with token:", token ? "present" : "missing");
  
  // Store token in localStorage
  localStorage.setItem('token', token);

  // Small delay to ensure localStorage is updated
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    // Fetch user profile
    const response = await API.get('/user/profile');
    
    const user = response.data.data.user;
    console.log("Extracted user:", user);

    if (user?.role) {
      localStorage.setItem('userRole', user.role);
    }

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};


export const handleMicrosoftLogin = async (token: string) => {
  console.log("handleMicrosoftLogin called with token:", token ? "present" : "missing");
  
  // Store token in localStorage
  localStorage.setItem('token', token);

  // Small delay to ensure localStorage is updated
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    // Fetch user profile
    const response = await API.get('/user/profile');
    
    const user = response.data.data.user;
    console.log("Extracted user:", user);

    if (user?.role) {
      localStorage.setItem('userRole', user.role);
    }

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const getProfile = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const response = await API.get("/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Make sure user exists in response
    const user = response.data?.data?.user;
    console.log(user)
    if (!user) {
      console.error("User not found in profile response");
      return null;
    }

    return user;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
};

// login as canteen staff
export const login = async (data: StaffLoginData): Promise<User> => {
  try {
    const response = await API.post("/auth/staff-login", data);

    const { token, user } = response.data;

    if (token) {
      localStorage.setItem("token", token);

      if (user?.role) {
        localStorage.setItem("userRole", user.role);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    }

    return user;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

