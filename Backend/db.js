const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.mongoose_url)
.then(() => {
    console.log('Database Connected!');
}).catch((err) => {
    console.log('Something went wrong: ' + err);
});

const UserSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },

});

const user_todos = mongoose.model('user_todos', UserSchema);

module.exports = {
    todos : user_todos
}  
