const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "test",
});

const getAll = async () => {
    const connection = await pool.getConnection();
    try {
        const [tasks] = await connection.execute("SELECT * FROM tasks");
        return tasks;
    } finally {
        connection.release();
    }
};

const createTask = async (task) => {
    const { title } = task;
    const dateUTC = new Date(Date.now()).toUTCString();
    const query =
        "INSERT INTO tasks(title, status, created_at) VALUES (?, ?, ?)";

    const connection = await pool.getConnection();
    try {
        const [createdTask] = await connection.execute(query, [
            title,
            "pendente",
            dateUTC,
        ]);
        return { insertID: createdTask.insertId };
    } finally {
        connection.release();
    }
};

const deleteTask = async (id) => {
    const query = "DELETE FROM tasks WHERE id = ?";

    const [remevedTask] = await connection.execute(query, [id]);
    return remevedTask;
};

const updateTask = async (id, task) => {
    const { title, status } = task;
    const query = "UPDATE tasks SET title = ?, status = ? WHERE id = ?";

    const [updatedTask] = await connection.execute(query, [title, status, id]);
    return updatedTask;
};

module.exports = {
    getAll,
    createTask,
    deleteTask,
    updateTask,
};
