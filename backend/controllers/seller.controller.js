import jwt from "jsonwebtoken"



// seller login: /api/seller/login
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD){
            const token = jwt.sign({email}, process.env.JWT_SECRET, {
                expiresIn: "7d"
            });
            res.cookie("sellerToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            return res.status(200).json({
                message: "Login successful",
                success: true,
                token
            });
        } else {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false
            });
        }
    } catch (error) {
        console.error("Error in sellerLogin:", error)
        res.status(500).json({ message: "Internal server error" });
    }
};

// logout seller: /api/seller/logout
export const sellerLogout = (req, res) => {
    try {
        res.clearCookie("sellerToken",{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        res.status(200).json({
            message: "Logout successful",
            success: true
        })
    } catch (error) {
        console.error("Error in sellerLogout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// check auth seller: /api/seller/is-auth
export const isAuthSeller = (req, res) => {
    try {
        res.status(200).json({
            success: true,
        })
    } catch (error) {
        console.error("Error in isAuthSeller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
