'use client'
import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import Layout from "./components/Layout";
import Product from "./components/Product";
import { Button, Card, Skeleton } from "@nextui-org/react";
import HomeSkelenton from "./components/HomeSkeleton/Skelenton";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import provider from "./authProvider";
import HeroSection from "./components/HeroSection";
import auth from "./firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
export default function Home() {
  const [phrase, setPhrase] = useState('');
  const [farmProducts, setFarmProducts] = useState([]);
  const [user, loading, error] = useAuthState(auth);




  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get("/api/products")
      console.log(res.data);
      setFarmProducts(res.data)

    }
    fetchProduct()

    return () => { }
  }, [])


  console.log(farmProducts);


  let products = farmProducts
  useCallback(() => farmProducts, [farmProducts])
  const categoriesNames = [...new Set(farmProducts?.map(p => p.category))];
  console.log(categoriesNames);

  if (phrase) {
    products = farmProducts.filter(p => p.name.toLowerCase().includes(phrase));
  }

  return (
    <>
      {!user?.email ?
        <HeroSection />
        :

        <Layout>
          <input value={phrase} onChange={e => setPhrase(e.target.value)} type="text" placeholder="Search for products..." className="bg-gray-200 w-full py-2 px-4 rounded-xl" />

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


          <div className="">

            {categoriesNames.map(categoryName => (
              <div className="" key={categoryName}>
                {products.find(p => p.category === categoryName) && (
                  <div>
                    <h2 className="text-2xl py-5 capitalize">{categoryName}</h2>
                    <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">

                      {products.filter(p => p.category === categoryName).map(productInfo => (
                        <div key={productInfo._id} className="px-5 snap-start">
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
