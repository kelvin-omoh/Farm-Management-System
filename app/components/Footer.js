'use client'
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation'
import { useContext, useEffect } from "react";
import { ProductsContext } from "./ProductsContext";
import { AiOutlineLogin, AiOutlineUser } from 'react-icons/ai'

import provider from "../authProvider";
import auth from "../../app/firebase.config";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import Image from "next/image";

export default function Footer() {

  const router = useRouter()
  const [user, loading, error] = useAuthState(auth);


  const path = usePathname()

  console.log(user);

  // const path = router.pathname;
  const { selectedProducts } = useContext(ProductsContext);

  const logout = () => {
    signOut(auth);
  };

  const signInWithGoogleAuth = () => {
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log(user);
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData?.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
      // signInWithRedirec(auth, provider);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <footer className="sticky bottom-0  bg-white p-5 w-full flex border-t border-gray-200 justify-center space-x-12 text-gray-400">
      <Link href='/' className={(path === '/' ? 'text-emerald-500' : '') + " flex justify-center items-center flex-col"}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <span>Home</span>
      </Link>
      <Link href='/checkout' className={(path === '/checkout' ? 'text-emerald-500' : '') + " flex justify-center items-center flex-col"}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        <span>Cart {selectedProducts ? selectedProducts?.length : 0}</span>
      </Link>
      <div className={" flex  text-blue-800  justify-center items-center flex-col"}>

        <span>{loading ? "loading" : error ? "error" : user ? <div className=" flex gap-4 items-center ">

          {user.photoURL ? <Image src={user && user.photoURL} width={1000} height={1000} className={" w-[3rem] h-[3rem] rounded-full"} alt="" />
            :
            <AiOutlineUser size={30} />}

          <button onClick={logout}>Log out</button>
        </div> : <div className=" flex gap-4 items-center ">
          <AiOutlineLogin />
          <button onClick={signInWithGoogleAuth}>Login</button>
        </div>}</span>
      </div>
    </footer>
  );
}