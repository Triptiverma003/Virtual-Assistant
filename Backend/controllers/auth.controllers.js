import genToken from "../configs/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "Lax",
      secure: false, // Set to true in production with HTTPS
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup." });
  }
};


export const login = async (req , res) => {
    try {
        const {email , password} = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "Email does not exists"});
        }

        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).json({message: "Incorrect password"});

        }
        const token = await genToken(user._id)

        res.cookie("token" , token , {
            httpOnly : true,
            maxAge: 7*24*60*60*1000, // 7 days
            sameSite: "Lax",
            secure: false
        })

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message: `Error in login ${error}`});
    }
}

export const logout = async (req , res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message: "Logout successfully"});
    } catch (error) {
        return res.status(500).json({message: `Error in logout ${error}`});
    }
}

