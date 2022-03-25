import { defineStore } from "pinia";
import app from "../firebase";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { async } from "@firebase/util";
const auth = getAuth();
const db = getFirestore();

// wait until auth is ready
const unsub = await onAuthStateChanged(auth, async (user) => {
  if (user) {
    const q = query(
      collection(db, "doctors"),
      where("email", "==", user.email)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
    } else {
      querySnapshot.forEach((doc) => {
        const auth = useAuthStore();
        auth.userId = doc.id;
        auth.isLogin = true;
        auth.name = doc.data().name;
        auth.email = doc.data().email;
        auth.photo = doc.data().photo;
        auth.projectId = doc.data().projectId;
        auth.departement = doc.data().departement;
        auth.type = "doctor";
      });
    }
  }
  unsub();
});

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    isLogin: false,
    userId: "",
    name: "",
    email: "",
    photo: "",
    projectId: "",
    departement: "",
    type: "",
  }),
  actions: {
    doctorLogin(email: string, password: string) {
      signInWithEmailAndPassword(auth, email, password)
        .then(async () => {
          const q = query(
            collection(db, "doctors"),
            where("email", "==", email)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            this.isLogin = true;
            this.userId = doc.data().userId;
            this.name = doc.data().name;
            this.email = doc.data().email;
            this.photo = doc.data().photo;
            this.projectId = doc.data().projectId;
            this.departement = doc.data().departement;
            this.type = "doctor";
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
        });
    },
    adminLogin(email: string, password: string) {
      signInWithEmailAndPassword(auth, email, password)
        .then(async () => {
          const q = query(
            collection(db, "admin"),
            where("email", "==", email)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            this.isLogin = true;
            this.userId = doc.data().userId;
            this.name = doc.data().name;
            this.email = doc.data().email;
            this.photo = doc.data().photo;
            this.type = "admin";
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
        });
    },
  },
});
