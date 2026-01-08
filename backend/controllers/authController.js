const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Register User
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

// Login User
exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: "All Fields are required"});

    }
    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(401).json({message: "Invalid email or password"});
        }
        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {return res.status(401).json ({message : "Invalid email or password"});
     }

    // Geneterate JWT Token
    const token = jwt.sign(
        {id: user.id, email : user.email},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}

    );
    res.json({
        message : " Login successfull",
        token,
    });
    }catch (error) {
        res.status(500).json({message : "Server Error ", error : error.message});
    }
};
