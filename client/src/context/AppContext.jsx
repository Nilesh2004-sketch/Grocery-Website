import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { dummyProducts } from '../assets/assets';
import toast from "react-hot-toast";;
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(null);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    // check seller status
    const fetchSeller = async () => {
        try {
            const sellerToken = localStorage.getItem("sellerToken");
            const config = sellerToken ? { headers: { token: sellerToken, sellertoken: sellerToken } } : {};
            const { data } = await axios.post('/api/seller/is-auth', {}, config);
            if (data.success) {
                setIsSeller(true);
            } else {
                setIsSeller(false);
            }
        } catch (error) {
            setIsSeller(false);
        }
    };

    // logout user
    const logout = async () => {
        try {
            await axios.get("/api/user/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("userToken");
            delete axios.defaults.headers.common["token"];
            setUser(null);
            setCartItems({});
            toast.success("Logged out successfully");
            navigate("/");
        }
    };

    // check user status
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (token) {
                axios.defaults.headers.common["token"] = token;
            }
            const { data } = await axios.get("/api/user/is-auth");
            if (data.success && data.user) {
                setUser(data.user);
                setCartItems(data.user.cartItems || {});
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        }
    };

    // fetch all products data
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("/api/product/list");
            if (data.success) {
                setProducts(data.products || []);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    // add product to cart
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems || {});
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("added to cart");
    };

    // update cart item quantity
    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems || {});
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart Updated");
    };

    // total cart items
    const cartCounts = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item]
        }
        return totalCount;
    };

    // total cart amounts
    const totalCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (itemInfo && cartItems[items] > 0) {
                totalAmount += cartItems[items] * itemInfo.offerPrice;
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    };

    // remove product from cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems || {});
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
            toast.success("removed from cart");
            setCartItems(cartData);
        }
    };

    useEffect(() => {
        const updateCart = async () => {
            try {
                const { data } = await axios.post("/api/cart/update", { cartItems });
                if (!data.success) {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error("Cart update error:", error);
            }
        };
        if (user && cartItems) {
            updateCart();
        }
    }, [cartItems]);

    useEffect(() => {
        fetchProducts();
        fetchSeller();
        fetchUser();
    }, [])

    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        addToCart,
        updateCartItem,
        cartCounts,
        totalCartAmount,
        removeFromCart,
        cartItems,
        searchQuery,
        setSearchQuery,
        axios,
        fetchProducts,
        setCartItems,
    };
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;