import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Place Order COD: /api/order/cod
export const placeOrderCOD = async (req, res) => {
    console.log(req.body);
    try {
        const userId = req.user;
        const { items, address } = req.body;
        if (!items || !address) {
            return res.status(400).json({
                message: "Items and address are required",
                success: false,
            });
        }
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                amount += product.offerPrice * item.quantity;
            }
        }

        // Add tax charge 2%
        amount += Math.floor((amount * 2) / 100);
        await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "COD",
            isPaid: false,
        });
        res.status(201).json({
            message: "Order placed successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// order details for individual user: /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user;
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        }).populate("items.product").populate("address").sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// get all orders for admin: /api/order/seller
export const getAllOrders = async(req, res) => {
    try {
        const orders = await Order.find({}).populate("items.product").populate("address").sort({createdAt: -1});
        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// update order status for seller: /api/order/status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.status(400).json({
                message: "Order ID and status are required",
                success: false
            });
        }
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { returnDocument: "after" }
        );
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }
        res.status(200).json({
            message: "Order status updated successfully",
            success: true,
            order
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};