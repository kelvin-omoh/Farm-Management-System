import { useContext } from "react";
import { ProductsContext } from "./ProductsContext";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Product({ id, productName, price, description, image }) {
  const { setSelectedProducts, selectedProducts } = useContext(ProductsContext);
  function addProduct() {
    setSelectedProducts(prev => [...prev, id]);
    console.log(selectedProducts);
    toast.success('succesfully added to your cart')
  }
  return (
    <div className="  w-56 ">
      <div className="bg-blue-100 p-5 h-[15rem] w-[15em] rounded-xl">
        <Image height={1000} width={1000} className=" object-cover  w-full h-full" src={image} alt="" />
      </div>
      <div className="mt-2">
        <h3 className="font-bold text-lg">{productName}</h3>
      </div>
      <p className="text-sm mt-1 leading-4 text-gray-500">{description?.length > 10 ? `${description.slice(0, 10)}...` : description}</p>
      <div className="flex mt-1">
        <div className="text-2xl font-bold grow">₦{price}</div>
        <button onClick={addProduct} className="bg-emerald-400 text-white py-1 px-3 rounded-xl">+</button>
      </div>
    </div>
  );
}
