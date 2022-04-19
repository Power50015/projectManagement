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
const auth = getAuth();
const db = getFirestore();

// wait until auth is ready
const unsub = await onAuthStateChanged(auth, async (user) => {
  const auth = useAuthStore();
  if (user) {
    const q = query(
      collection(db, "doctors"),
      where("email", "==", user.email)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const q = query(
        collection(db, "admins"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const q = query(
          collection(db, "students"),
          where("email", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          auth.userId = doc.id;
          auth.isLogin = true;
          auth.name = doc.data().name;
          auth.email = doc.data().email;
          auth.photo = doc.data().photo;
          auth.projectId = doc.data().projectId;
          auth.departement = doc.data().departement;
          auth.type = "students";
        });
      } else {
        querySnapshot.forEach((doc) => {
          auth.userId = doc.id;
          auth.isLogin = true;
          auth.name = doc.data().name;
          auth.email = doc.data().email;
          auth.photo = doc.data().photo;
          auth.projectId = doc.data().projectId;
          auth.departement = doc.data().departement;
          auth.password = doc.data().password;
          auth.type = "admins";
        });
      }
    } else {
      querySnapshot.forEach((doc) => {
        auth.userId = doc.id;
        auth.isLogin = true;
        auth.name = doc.data().name;
        auth.email = doc.data().email;
        auth.photo = doc.data().photo;
        auth.projectId = doc.data().projectId;
        auth.departement = doc.data().departement;
        auth.type = "doctors";
      });
    }
  }
  auth.load = true;
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
    password: "",
    load: false,
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
            this.type = "doctors";
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
      this.load = false;
      signInWithEmailAndPassword(auth, email, password)
        .then(async () => {
          const q = query(
            collection(db, "admins"),
            where("email", "==", email)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            this.isLogin = true;
            this.userId = doc.data().userId;
            this.name = doc.data().name;
            this.email = doc.data().email;
            this.photo = doc.data().photo;
            this.password = doc.data().password;
            this.type = "admins";
            this.load = true;
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          this.load = true;
        });
    },
    logout() {
      signOut(auth).then(() => {
        this.isLogin = false;
        this.userId = "";
        this.name = "";
        this.email = "";
        this.photo = "";
        this.projectId = "";
        this.departement = "";
        this.type = "";
      });
    },
    addUser(
      name: string,
      email: string,
      photo: string,
      projectId: string,
      departement: string,
      password: string,
      type: string
    ) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          // Add a new document in collection "doctors"
          if (type == "doctors") {
            addDoc(collection(db, type), {
              name: name,
              email: email,
              photo: photo,
              departement: departement,
            });
          } else if (type == "students") {
            addDoc(collection(db, type), {
              name: name,
              email: email,
              photo: photo,
              projectId: projectId,
              departement: departement,
            });
          } else {
            addDoc(collection(db, type), {
              name: name,
              email: email,
              photo: photo,
              password:password
            });
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
        });
      setTimeout(() => {
        signOut(auth).then(() => {
          signInWithEmailAndPassword(auth, this.email, this.password);
        });
      }, 1500);
    },
    addProject(
      title: string,
      number: any,
      year: any,
      department: string,
      des: string,
      link: string,
      image: string,
      projectDoctor:string
    ) {
      addDoc(collection(db, "projects"), {
        id: department + "-" + year + "-" + number,
        title: title,
        number: number,
        year: year,
        department: department,
        des: des,
        link: link,
        image: image,
        doctor:projectDoctor
      });
    },
  },
});
