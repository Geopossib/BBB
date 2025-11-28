
'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export const initiateEmailSignUp = async (
  auth: any,
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Save name in Firebase Auth
  await updateProfile(user, {
    displayName: `${firstName} ${lastName}`.trim(),
  });

  return userCredential;
};

export const updateUserProfileAndPhoto = async (
  auth: any,
  firstName: string,
  lastName: string,
  photoURL: string | null
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is currently signed in.");

  await updateProfile(user, {
    displayName: `${firstName} ${lastName}`.trim(),
    photoURL: photoURL,
  });

  // Force refresh the user token to get the latest profile info
  await user.reload();
  return auth.currentUser;
};


/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<any> {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  return signInWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate Google sign-in (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): Promise<any> {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(authInstance, provider);
}
