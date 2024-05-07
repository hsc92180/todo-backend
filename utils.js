function generateDueDate() {
    const currDate = new Date();
    const dueDate = new Date(currDate.getTime() + (2*24 * 60 * 60 * 1000));
    return  dueDate;
}

function generateUniqueId(){
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = { generateDueDate, generateUniqueId };