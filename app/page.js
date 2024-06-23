'use client'
import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import Layout from "./components/Layout";
import Product from "./components/Product";
import { Button, Card, Skeleton } from "@nextui-org/react";
import HomeSkelenton from "./components/HomeSkeleton/Skelenton";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import provider from "./authProvider";
import HeroSection from "./components/HeroSection";
import auth, { db } from "./firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from 'react-hot-toast';
import { AiOutlineBars } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { BsGoogle, BsX } from "react-icons/bs";
import { collection, doc, getDoc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
export default function Home() {
  const [phrase, setPhrase] = useState('');
  const [farmProducts, setFarmProducts] = useState([]);
  const [user, error] = useAuthState(auth);
  const [toggle, setToggle] = useState(false)
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(productsData);
      const productsWithImage = productsData.map(product => ({
        ...product,
        image: product.images?.[0] || ''
      }));
      setFarmProducts(productsWithImage);
      setLoading(false);
    }, (error) => {
      toast.error("Failed to fetch products");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  console.log(farmProducts);


  let products = farmProducts
  useCallback(() => farmProducts, [farmProducts])
  const categoriesNames = [...new Set(farmProducts?.map(p => p.relatedTo))];
  console.log(categoriesNames);

  if (phrase) {
    products = farmProducts.filter(p => p.productName.toLowerCase().includes(phrase));
  }

  const createFarmerDocument = async (farmer) => {
    setLoading(true);
    if (!farmer) return;

    const farmerRef = doc(db, "farmers", farmer.uid);
    const farmerData = await getDoc(farmerRef);

    if (!farmerData.exists()) {
      const { displayName, email, photoURL } = farmer;
      const createdAt = new Date();

      try {
        await setDoc(farmerRef, {
          name: displayName ? displayName : name,
          email,
          photoURL: photoURL ? photoURL : "",
          createdAt,
        });
        toast.success("Account Created!");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        console.error("Error creating farmer document: ", error);
        setLoading(false);
      }
    }
  };

  const signInWithGoogleAsFarmer = async () => {
    setLoading(true);
    try {
      signOut(auth);
      const result = await signInWithPopup(auth, provider);
      const farmer = result.user;
      await createFarmerDocument(farmer);
      toast.success("farmer Authenticated Successfully!");
      navigate.push("/farmer/dashboard");
      setLoading(false);

    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      console.error("Error signing in with Google: ", error.message);
    }
  };

  return (
    <>
      {/* if nt logged in
     */}
      {!user?.email ?
        <HeroSection />
        :

        <Layout>
          <div className=" z-[100] bg-green-900/20 p-4 50 px-[1rem] md:px-[4rem] backdrop-blur-sm  fixed top-0 left-0  w-full flex gap-3 justify-between items-center ">

            <Button onClick={() => setToggle(!toggle)} className=" bg-[#0f0f45] text-white rounded-md">
              {
                !toggle ? <AiOutlineBars size={30} /> : <BsX size={30} />

              }
            </Button>
            <input value={phrase} onChange={e => setPhrase(e.target.value)} type="text" placeholder="Search for products..." className="bg-white w-[90%] py-2 px-4 rounded-xl" />
          </div>

          <div className={` bg-green-900/50 backdrop-blur-sm h-[90vh] mx-auto  rounded-lg z-20 w-full  flex flex-col gap-2 items-center fixed    right-0 py-2 justify-end   transition-all delay-100 top-[4.5rem] ${toggle ? 'left-0' : 'left-[-500rem] '}     `}>

            <ul className=' m-auto w-ful gap-6 h-full flex justify-center items-center flex-col'>
              <li className=' font-[montesearat] mb-3 text-white text-[42px]  '>Welcome to FMS</li>
              <li className=' font-[montesearat]  text-white text-[22px]'> SignIn as Farmer
              </li>
              <li><button onClick={signInWithGoogleAsFarmer} className=' text-[12px] rounded-lg gap-2 px-4 mx-auto text-center flex items-center  py-2 bg-white'> <BsGoogle /> SignIn with Google</button></li>
            </ul>
          </div>

          {!categoriesNames.length && !products.length &&
            <>

              <div className=" mt-[2.5em]">
                <Skeleton className="w-2/5 my-[.4rem] rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">
                  <div className="px-5 snap-start">
                    <HomeSkelenton />
                  </div>
                </div>
              </div>

              <div className=" mt-[2.5em]">
                <Skeleton className="w-2/5 mb-4 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">
                  <div className="px-5 snap-start">
                    <HomeSkelenton />
                  </div>
                </div>
              </div>

              <div className=" mt-[2.5em]">
                <Skeleton className="w-2/5 mb-4 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">
                  <div className="px-5 snap-start">
                    <HomeSkelenton />
                  </div>
                </div>
              </div>


            </>

          }


          <div className=" mt-[4rem]">

            {categoriesNames.map(categoryName => (
              <div className="" key={categoryName}>
                {products.find(p => p.relatedTo === categoryName) && (
                  <div>
                    <h2 className="text-2xl py-5 capitalize">{categoryName}</h2>
                    <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">

                      {products.filter(p => p.relatedTo === categoryName).map(productInfo => (
                        <div key={productInfo.id} className="px-5 snap-start">
                          {console.log(productInfo)}
                          <Product {...productInfo} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </Layout>
      }
    </>
  );
}
