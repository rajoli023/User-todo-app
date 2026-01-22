const db = require("../db/db");


//Create a new todo
exports.createTodo = async (req, res) => {
    const {title, description, due_date} = req.body;
    const userId = req.user.id;

    if(!title) {
        return res.status(400).json({message: "Tile isrequired"});
    }

    try {
        await db.query(
            "INSERT INTO todos (user_id, title, description, due_date) VALUES (?, ?, ?, ?)",
            [userId, title, description, due_date || null, due_date || null]
        );

        res.status(201).json({message: "Todod created successfully"});


    }
    catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
};

// GET user todos
exports.getTodos = async ( req, res) => {
    const {filter} = req.query;
    let query = "SELECT * FROM todos WHERE user_id = ?";
    let params = [req.user.id];

    if (filter === "today") {
        query += " AND due_date = CURDATE()";
    } 
    if (filter === "upcoming") {
        query += " AND due_date > CRUDATE() AND completed = false";
    }
    if (filter === "completed") {
        query += " AND completed = true";
    }
    if (filter === "pending") {
        query += " AND completed = false";
    }

    query += "ORDER BY due_date ASC";

    try {
        const [todos] = await db.query(query, params);
        res.json(todos)
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

//UPDATE todo
exports.updateTodo = async ( req, res) => {
    const {title, description, due_date, status} = req.body;
    const { id } = req.params;

    try {
        await db.query(
            'UPDATE todos SET title = ?, description =?, due_date = ?, status = ? WHERE id =? AND user_id = ?',
            [title, description, due_date, status, id, req.user.id]
        );
        res.json({message : "TODO updated successfully"});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

//DELET todo
exports.deleteTodo = async ( req, res) => {
    try{
        await db.query(
            'DELETE FROM todos WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        res.json({message: "TODO deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});  
    }
};

//TOGGLE todo status

exports.toggleTodo = async (req, res) => {
    const {id} = req.params;

    try {
        await db.query(
            'UPDATE todos SET completed = NOT completed WHERE id = ? AND user_id = ?',  
            [id, req.user.id]
        );

        res.json({message: "Todo status toggled"});
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
};