import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';


const Address = () => {
    const [address, setAddress] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: "",
    });
    const { axios, user, navigate } = useContext(AppContext);
    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
       try {
        e.preventDefault();
        const {data} = await axios.post("/api/address/add", {address});
        if(data.success){
            toast.success(data.message);
            navigate("/cart");
        }else{
            toast.error(data.message);
        }
       } catch (error) {
        toast.error(error.response?.data?.message || error.message);
       }
    };

    useEffect(()=> {
        if(!user){
            navigate("/cart");
        }
    },[])
    return (
        <div className="mt-12 max-w-6xl mx-auto flex flex-col md:flex-row gap-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg">

            {/* Left Side */}
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-md border border-gray-100">

                <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
                    Address Details
                </h2>

                <form
                    onSubmit={submitHandler}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={address.firstName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={address.lastName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={address.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Street
                        </label>
                        <input
                            type="text"
                            name="street"
                            value={address.street}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={address.city}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            State
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={address.state}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Zip Code
                        </label>
                        <input
                            type="number"
                            name="zipCode"
                            value={address.zipCode}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Country
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={address.country}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="number"
                            name="phone"
                            value={address.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            required
                        />
                    </div>

                    <div className="col-span-2 mt-2">
                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-[1.02]"
                        >
                            Save Address
                        </button>
                    </div>

                </form>
            </div>

            {/* Right Image */}
            <div className="flex-1 flex items-center justify-center">
                <img
                    src={assets.add_address_iamge}
                    alt="Address Illustration"
                    className="w-full max-w-sm rounded-xl shadow-lg"
                />
            </div>

        </div>
    );
};

export default Address;