import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebaseConfig";
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        // User is signed out
        setUser(undefined);
      }
      setIsLoading(false);
    });

    return unsubscribeFromAuthStateChanged;
  }, []);

  return {
    user,
    isLoading,
  };
}
