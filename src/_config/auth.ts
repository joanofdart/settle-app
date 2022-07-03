import { FirebaseError, uuidv4 } from "@firebase/util";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "./env";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<AppNotification> => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const { docs } = await getDocs(q);
    if (!docs.length) {
      await addDoc(collection(db, "users"), {
        ...new User(user.uid, user.displayName!, "google", user.email!),
      });
    }
    return new AppNotification("User Logged In!", "Success", 200);
  } catch (err) {
    await registerError(err as FirebaseError);
    return new AppNotification(
      randomErrorMessage(),
      "Login with Provider Failure",
      500
    );
  }
};

export const logInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<AppNotification> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return new AppNotification("User Logged In!", "Success", 200);
  } catch (err) {
    await registerError(err as FirebaseError);
    return new AppNotification(randomErrorMessage(), "Login Failure", 500);
  }
};

export const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
): Promise<AppNotification> => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await addUserToDb(user.uid, name, "local", email);
    return new AppNotification("User Registered!", "Success", 200);
  } catch (err) {
    await registerError(err as FirebaseError);
    return new AppNotification(
      randomErrorMessage(),
      "User Registration Failure",
      500
    );
  }
};

export const sendPasswordReset = async (
  email: string
): Promise<AppNotification> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return new AppNotification("Password reset link sent!", "Success", 200);
  } catch (err) {
    await registerError(err as FirebaseError);
    return new AppNotification(
      randomErrorMessage(),
      "Password Reset Error",
      500
    );
  }
};

export const logout = (): void => {
  signOut(auth);
};

async function addUserToDb(
  id: string,
  name: string,
  provider: "google" | "local",
  email: string
): Promise<void> {
  await addDoc(collection(db, "users"), {
    ...new User(id, name, provider, email),
  });
}

export async function registerError(error: FirebaseError): Promise<void> {
  await addDoc(collection(db, "app-errors"), {
    id: uuidv4(),
    message: error.message,
    code: error.code,
    date: Timestamp.now(),
  });
}

function randomErrorMessage(): string {
  const length = errorMessages.length - 1;
  const rand = Math.floor(Math.random() * length);
  return errorMessages[rand];
}

class AppNotification {
  message: string;
  title: string;
  code: number;

  constructor(message: string, title: string, code: number) {
    this.message = message;
    this.title = title;
    this.code = code;
  }
}

export class User {
  id: string;
  name: string;
  authProvider: string;
  email: string;

  constructor(id: string, name: string, authProvider: string, email: string) {
    this.email = email;
    this.authProvider = authProvider;
    this.name = name;
    this.id = id;
  }

  static fromMap(data: DocumentData): User {
    return {
      id: data.id,
      name: data.name,
      authProvider: data.authProvider,
      email: data.email,
    } as User;
  }

  static toJson(user: User): DocumentData {
    return {
      id: user.id,
      name: user.name,
      authProvider: user.authProvider,
      email: user.email,
    };
  }
}

const errorMessages = [
  "Our loyal oompa loompas are notified and working on it!",
  "Server was unreachable but with some nice fireworks, it will come to life!",
  "What was that? A squirrel has taken us hostage, we will find a solution asap.",
  "It's our devops team time to shine, this will no longer happen *fingers crossed*",
  "An error occurred and we have been notified of its existence, it will be squashed.",
  "We fight these, they are becoming scarce and soon we will have no errors, sorry for the inconvenience!",
  "Our servers sometimes are having a bad day, we apologise for this.",
  "Our servers are on strike, we are working hard to make an agreement, 'less bits, more bytes'",
];
