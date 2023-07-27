// Complete Events Exercise
const http = require("http");
const path = require("path");
const fs = require("fs");
const { EventEmitter } = require("events");
const PORT = 5555;
let newsLetterEmmit = new EventEmitter();

const csvFilePath = path.join(__dirname, 'newsletter.csv');

const server = http.createServer((req, res) => {
    const { method, url } = req;
    const chunks = [];
    req.on("data", (packet) => {
        chunks.push(packet);
    });
    
    req.on("end", () => {
        if (url == "/newsletter_signup" && method == "POST"){
            const postData = JSON.parse(Buffer.concat(chunks).toString());
            console.log("postData:", postData);
            newsLetterEmmit.emit("newsletter_signup", postData);
            res.writeHead(200, {"content-type": "text/html"});
            res.write("User signed up");
            res.end(); 
        }   else {
            res.writeHead(404, {"content-type": "text/html"});
            res.write("No resource at endpoint");
            res.end
        }
    });


    newsLetterEmmit.on("newsletter_signup", (contact) => {
        fs.writeFile("newsletterUsers.csv", JSON.stringify(contact), (err) => {
            if (err){
                console.error(err);
            } else {
                console.log(`Added ${contact} to CSV file.`);
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});