"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store";
import { currensyFormat } from "@/utils";

export const OrderSummary = () => {

    const [loaded, setLoaded] = useState(false);
    const {itemsInCart, subTotal, tax, total} = useCartStore((state) => state.getSumaryInformation());

    useEffect(() => {
        setLoaded(false)
    }, [])
      

    if (!loaded) {
        return <p>Loading...</p>;
      }
  

  return (
    <div className="grid grid-cols-2">
      <span>No. Productos</span>
      <span className="text-right">
        { itemsInCart === 1 ? '1 artículo' : `${itemsInCart} artículos` }
      </span>

      <span>Subtotal</span>
      <span className="text-right">{ currensyFormat(subTotal) }</span>

      <span>Impuestos (15%)</span>
      <span className="text-right">{ currensyFormat(tax) }</span>

      <span className="mt-5 text-2xl">Total:</span>
      <span className="mt-5 text-2xl text-right">
        { currensyFormat(total) }
      </span>
    </div>
  );
};
