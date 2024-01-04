import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface State {
    cart: CartProduct[];

    getTotalItems: () => number;
    getSumaryInformation: () => {
        itemsInCart: number;
        subTotal: number;
        tax: number;
        total: number;
    };

    addProductToCart: ( product: CartProduct ) => void;
    updateProductQuantity: ( product: CartProduct, quantity: number ) => void;
    removeProduct: ( product: CartProduct ) => void;
}

export const useCartStore = create<State>()( 
    persist(
        (set, get) => ({
            cart: [],
    
            // Methods

            getTotalItems: () => {
                const  { cart } = get();
                
                return cart.reduce( ( total, item ) => total + item.quantity, 0 );
            },

            getSumaryInformation: () => {
                const { cart } = get();

                const itemsInCart = cart.reduce( ( total, item ) => total + item.quantity, 0 );

                const subTotal = cart.reduce( ( subTotal, product ) => (product.quantity * product.price) + subTotal, 0 );
                const tax = subTotal * 0.15;
                const total = subTotal + tax;

                return {
                    itemsInCart,
                    subTotal,
                    tax,
                    total
                }
            },
    
            addProductToCart: ( product: CartProduct ) => {
                const  { cart } = get();
    
                // 1. revisar si el producto existe en el carrito con la talla seleccionada
                const productInCart = cart.some(
                    (item) => item.id === product.id && item.size === product.size
                );
    
                if( !productInCart ) {
                    set({ cart: [...cart, product] })
                }
    
                // 2. el producto existe por talla, incrementar la cantidad
                const updatedCartProducts = cart.map( item => {
    
                    if(item.id === product.id && item.size === product.size){
                        return { ...item, quantity: item.quantity + product.quantity };
                    }
    
                    return item;
                })
    
                set({ cart: updatedCartProducts })
            },

            updateProductQuantity:( product: CartProduct, quantity: number ) => {
                const  { cart } = get();

                const updatedCartProducts =cart.map( item => {
    
                    if(item.id === product.id && item.size === product.size){
                        return { ...item, quantity: quantity };
                    }
    
                    return item;
                });

                set({ cart: updatedCartProducts })
            },

            removeProduct: ( product: CartProduct ) => {
                const { cart } = get();

                const updatedCartProducts =cart.filter( item => item.id !== product.id || item.size !== product.size );

                set({ cart: updatedCartProducts });
            }
        }), 
        {
            name: 'shopping-cart',
        }
    )    
)