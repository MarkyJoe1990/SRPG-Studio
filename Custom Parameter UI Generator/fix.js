const fs = require("fs");
const dir = "$user-interface/index.html";

console.log("Fixing all urls inside index.html to be relative.");
fs.readFile(dir, 'utf-8', (err, data) => {
    console.log("Successfully opened file");
    if (err !== null) {
        throw err;
    };

    var newData = data.replaceAll("/_next", "./_next");
    fs.writeFile(dir, newData, 'utf-8', (err) => {
        if (err !== null) {
            throw err
        };

        console.log("Successfully wrote changes to file");
    })
});