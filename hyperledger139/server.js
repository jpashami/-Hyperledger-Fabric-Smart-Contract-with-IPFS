const express = require("express");
const app = express();
const PORT=9139;

// express server static folder
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`)
});