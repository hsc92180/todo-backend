const  express = require("express");
const httpStatus = require("http-status");
const {generateDueDate, generateUniqueId} = require("./utils");

const fs = require("node:fs");
const path = require("node:path");

const PORT = 4000;

const server = express();

server.use(express.json());

server.post("/todo/add", (req, res) => {
    const {  name, tags } = req.body;

    const todo_obj = {
        id : generateUniqueId(),
        name,
        tags,
        due_date : generateDueDate(),
        is_completed: false,
    };

    // add path using path module .join() method
    const DATA_PATH = path.join("data", "todo.json");

    // read file using fs.readFileSync()
    const TODO_DATA = JSON.parse(fs.readFileSync(DATA_PATH, {encoding: "utf-8"}));

    // add todo_obj in TODO_DATA
    TODO_DATA.push(todo_obj);

    // write in file using fs.writeFileSync()
    fs.writeFileSync(DATA_PATH, JSON.stringify(TODO_DATA));

    res.status(httpStatus.CREATED).json({
        message: "New Todo added successfully",
        data : TODO_DATA
    });

    // console.log(todo_obj);
});

server.get("/todos", (req, res) => {
     // add path using path module .join() method
     const DATA_PATH = path.join("data", "todo.json");

     // read file using fs.readFileSync()
     const TODO_DATA = JSON.parse(fs.readFileSync(DATA_PATH, {encoding: "utf-8"}));

     res.status(httpStatus.OK).json({
        message : `Todos fetched successfully. Total number of todos ${TODO_DATA.length}`,
        data : TODO_DATA,
     })
});

server.put("/todo/update", (req, res) => {
    const { id } = req.query;
    const { name, tags, due_date, is_completed } = req.body;

    // add path using path module .join() method
    const DATA_PATH = path.join("data", "todo.json");

    // read file using fs.readFileSync()
    const TODO_DATA = JSON.parse(fs.readFileSync(DATA_PATH, {encoding: "utf-8"}));

    // Find the index of the todo item to be updated
    const todoIndex = TODO_DATA.findIndex((todo) => todo.id === id);
    console.log(todoIndex);

    // If todo item exists, update it
    if(todoIndex !== -1) {
        // Update the todo item with the provided updated fields
        if(name !== undefined ){
            TODO_DATA[todoIndex].name = name;
        }
        if(tags !== undefined ){ 
            TODO_DATA[todoIndex].tags = tags;
        }
        if(due_date !== undefined){
            TODO_DATA[todoIndex].due_date = due_date;
        }
        if(is_completed !== undefined){
            TODO_DATA[todoIndex].is_completed = is_completed;
        }

        // Write the updated data back to the file
        fs.writeFileSync(DATA_PATH, JSON.stringify(TODO_DATA));

        // Return a success response
        res.status(httpStatus.ACCEPTED).json({
            message: "Todo updated successfully",
            data : TODO_DATA[todoIndex],
        });
    } else {
        // Return an error response if the todo item is not found
        res.status(httpStatus.NOT_FOUND).json({
            message: "Todo not found",
        });
    }
});

server.delete("/todo/delete", (req,res) => {
    const { id } = req.query;

    // add path using path module .join() method
    const DATA_PATH = path.join("data", "todo.json");

    // read file using fs.readFileSync()
    const TODO_DATA = JSON.parse(fs.readFileSync(DATA_PATH, {encoding: "utf-8"}));

    const UPDATED_DATA = TODO_DATA.filter((todo) => todo.id !== id);

    fs.writeFileSync(DATA_PATH, JSON.stringify(UPDATED_DATA));

    res.status(httpStatus.ACCEPTED).json({
        message: `Todo deleted successfully. Total number of todos ${UPDATED_DATA.length}`,
        data : UPDATED_DATA
    })

});

// for not-found routes w have to create .use()
server.use("/*", (request,response) => {
    response.status(httpStatus.NOT_FOUND).json({
        message: "Not Found",
    });
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})