const db = require("../db/db");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
    
    const { username, email, password } = req.body;

    // validate input
    if(!username || !email || !password) {
        return res.status(400).json({message: "All Fields are required"});
    }

    try {
        // check if user already exists
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (existingUser.lenght>0){
            return res.status(409).json({message: "User already exists"});
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password,10);

        //Insert new user into database
        await db.query("INSERT INTO users (username, email,password_hash) VALUES (?, ?, ?)", [username, email, hashedPassword]);
        res.status(201).json({message: "User registered successfully"});
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
};


