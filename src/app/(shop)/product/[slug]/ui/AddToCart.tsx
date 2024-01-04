'use client'

import { useState } from 'react'
import { QuantitySelector, SizeSelector } from '@/components'
import type { CartProduct, Product, Size } from '@/interfaces'
import { useCartStore } from '@/store'

interface Props {
    product: Product,
}

export const AddToCart = ({ product }: Props) => {

    const addProductToCart = useCartStore( state => state.addProductToCart )

    const [size, setSize] = useState<Size | undefined>();
    const [quantity, setQuantity] = useState<number>(1);
    const [posted, setPosted] = useState(false);

    const addTocart = () => {
        setPosted(true)
        if(!size) return;

        //TODO: add to cart
        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            titule: product.title,
            price: product.price,
            quantity: quantity,
            size: size,
            image: product.images[0]
        }

        addProductToCart( cartProduct );

        setPosted(false);
        setQuantity(1);
        setSize(undefined);
    }
 
  return (
    <>
        {
            posted && !size && (
                <span className='mt-2 text-red-500 face-in'>
                    Debe se seleccionar una talla *
                </span>
            )
        }

        {/* Selector de talla */}
        <SizeSelector 
            selectedSize={ size } 
            availableSize={product.sizes} 
            onSizeSelected={size => setSize(size )}
        />

        {/* Selector de cantidad */}
        <QuantitySelector 
            quantity={ quantity } 
            onQuantityChange={ setQuantity }
        />

        {/* Botton */}
        <button 
            onClick={addTocart}
            className="btn-primary my-5"
        >
            Agregar al carrito
        </button>
    </>
  )
}
