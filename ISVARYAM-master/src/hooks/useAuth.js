import { useState, createContext, useContext } from 'react';
import * as userService from '../services/userService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userService.getUser());

  const login = async (email, password) => {
    try {
      const user = await userService.login(email, password);
      setUser(user);
      toast.success('Login Successful');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const register = async (data) => {
    try {
      const user = await userService.register(data);
      setUser(user);
      toast.success('Register Successful');
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    toast.success('Logout Successful');
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await userService.updateProfile(userData);
      if (updatedUser) setUser(updatedUser);
      toast.success('Profile Update Was Successful');
      return updatedUser; // So calling code can also access it
    } catch (err) {
      toast.error(err.response?.data || 'Profile update failed');
      throw err;
    }
  };

  const changePassword = async (passwords) => {
    await userService.changePassword(passwords);
    logout();
    toast.success('Password Changed Successfully, Please Login Again!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // ✅ Added so components like ProfilePage can access this
        login,
        logout,
        register,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
