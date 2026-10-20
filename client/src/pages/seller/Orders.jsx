import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Orders = () => {
  const { axios } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/order/seller');
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (e, orderId) => {
    const newStatus = e.target.value;
    try {
      const { data } = await axios.post('/api/order/status', {
        orderId,
        status: newStatus
      });
      if (data.success) {
        toast.success(data.message);
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="md:p-10 p-4 space-y-4 w-full">
      <div className="flex justify-between items-center max-w-5xl">
        <h2 className="text-xl font-semibold text-gray-800">Orders List</h2>
        <button
          onClick={fetchOrders}
          className="text-xs bg-indigo-50 border border-indigo-300 text-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-100 transition"
        >
          Refresh Orders
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 py-6">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-md max-w-5xl">
          <p className="text-gray-500 text-lg">No orders placed yet.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="flex flex-col lg:grid lg:grid-cols-[2fr_1.5fr_1fr_1.5fr] lg:items-center gap-5 p-5 max-w-5xl rounded-lg border border-gray-300 bg-white shadow-sm text-gray-800"
          >
            {/* Products */}
            <div className="flex gap-4 items-start">
              <img
                className="w-12 h-12 object-contain opacity-70 p-1 bg-gray-50 border rounded"
                src={assets.box_icon}
                alt="boxIcon"
              />
              <div className="space-y-1">
                {order.items?.map((item, index) => (
                  <p key={index} className="text-sm font-medium">
                    {item.product?.name || "Product"}
                    <span className="text-indigo-600 ml-2 font-semibold">
                      x {item.quantity}
                    </span>
                  </p>
                ))}
                <p className="text-xs text-gray-400 mt-1">
                  Order ID: {order._id}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="text-sm">
              <p className="font-semibold text-gray-900 mb-1">
                {order.address?.firstName} {order.address?.lastName}
              </p>
              <p className="text-gray-600 leading-snug">
                {order.address?.street}, {order.address?.city},{" "}
                {order.address?.state} - {order.address?.zipCode}
              </p>
              {order.address?.phone && (
                <p className="text-xs text-gray-500 mt-1">
                  Phone: {order.address.phone}
                </p>
              )}
            </div>

            {/* Amount & Payment */}
            <div className="flex flex-col text-sm">
              <p className="font-semibold text-base text-indigo-600">
                ₹{order.amount}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Method: <span className="font-medium">{order.paymentType}</span>
              </p>
              <p className="text-gray-500 text-xs">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Status Management */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Order Status
              </label>
              <select
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status || "Order Placed"}
                className="p-2 text-sm font-medium border border-gray-300 rounded outline-indigo-500 bg-gray-50 cursor-pointer focus:bg-white transition"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
