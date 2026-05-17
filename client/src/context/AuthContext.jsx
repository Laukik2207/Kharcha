import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile as updateFirebaseProfile,
  signOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { syncUser } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // MongoDB User document
  const [firebaseUser, setFirebaseUser] = useState(null); // Firebase User Identity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
      if (currentFirebaseUser) {
        try {
          const token = await currentFirebaseUser.getIdToken();
          localStorage.setItem('kharcha_token', token);
          
          const response = await syncUser();
          setUser(response.data);
          setFirebaseUser(currentFirebaseUser);
        } catch (err) {
          console.error("Failed to sync user with backend", err);
          localStorage.removeItem('kharcha_token');
          setUser(null);
          setFirebaseUser(null);
        }
      } else {
        localStorage.removeItem('kharcha_token');
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged handles the rest
    } catch (err) {
      const msg = err.code ? err.message : 'Google Login failed. Please try again.';
      setError(msg);
      throw err;
    }
  };

  const loginWithEmail = async (email, password) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      if (err.code === 'auth/user-not-found') errorMessage = 'No account found with this email';
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') errorMessage = 'Incorrect email or password';
      else if (err.code === 'auth/too-many-requests') errorMessage = 'Too many attempts. Try again later.';
      
      setError(errorMessage);
      throw err;
    }
  };

  const registerWithEmail = async (name, email, password) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateFirebaseProfile(userCredential.user, { displayName: name });
      // After updating profile, trigger token refresh to get new claims
      await userCredential.user.getIdToken(true);
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') errorMessage = 'An account with this email already exists';
      else if (err.code === 'auth/weak-password') errorMessage = 'Password must be at least 6 characters';
      
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        firebaseUser, 
        loading, 
        error, 
        loginWithGoogle, 
        loginWithEmail, 
        registerWithEmail, 
        logout, 
        clearError 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
