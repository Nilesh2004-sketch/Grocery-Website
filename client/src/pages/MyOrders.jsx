import { useContext, useEffect, useState } from "react"
import { dummyOrders } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const {axios, user} = useContext(AppContext);
  const fetchOrders = async() => {
    try {
      const {data} = await axios.get('/api/order/user');
      console.log("data", data);
      if(data.success){
        setMyOrders(data.orders);
      } else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getTotalAmount = (items) => {
    return items ? items.reduce((total, item) => {
      return total + (item.product?.offerPrice || 0) * (item.quantity || 1);
    }, 0) : 0;
  };

  useEffect(()=>{
    if(user){
      fetchOrders();
    }
  },[user]);

  return (
    <div className="mt-12 pb-16">
      <div>
        <p className="text-2xl font-medium md:text-3xl">
          My Orders
        </p>
      </div>
      {
        myOrders.map((order, index) => (
          <div key={index} 
          className="my-8 border border0-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl">
            
            <p className="flex justify-between items-center gap-6">
              <span>Order ID: {order._id}</span>
              <span>Payment: {order.paymentType}</span>
              <span>TotalAmount: ₹{getTotalAmount(order.items)}</span>
            </p>
            {
              order.items.map((item, index) => (
                <div key={index} 
                className={`relative bg-white text-gray-800/70 ${order.items.length !== index + 1 && "border-b"} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 w-full max-w-4xl`}>

                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="p-4 rounded-lg">
                      <img 
                      src={`http://localhost:5000/images/${item.product?.image?.[0]}`} 
                      alt="" 
                      className="w-16 h-16" />
                    </div>

                    <div className="ml-4">
                      <h2 className="text-xl font-medium">
                        {item.product?.name}
                      </h2>
                      <p>
                        {item.product?.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm md:text-base font-medium space-y-1">
                    <p>Quantity: <span className="font-semibold text-gray-900">{item.quantity || "1"}</span></p>
                    <div className="flex items-center gap-1.5 py-0.5">
                      <span className="text-gray-500 text-xs">Status:</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : order.status === "Out for Delivery"
                          ? "bg-purple-100 text-purple-700 border border-purple-300"
                          : order.status === "Packing"
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700 border border-red-300"
                          : "bg-amber-100 text-amber-700 border border-amber-300"
                      }`}>
                        ● {order.status || "Order Placed"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-lg">
                    Amount: ₹{(item.product?.offerPrice || 0) * (item.quantity || 1)}
                  </p>
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

export default MyOrders
