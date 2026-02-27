import express from "express"; // lets us make a server
import cors from "cors";       // allows our frontend to talk to our backend
import dotenv from "dotenv";   // keeps API key secret
import OpenAI from "openai";   // OpenAI library
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port= 4000;

app.use(express.json());

app.use(cors());

app.use(express.static(path.join(__dirname, "Front-end")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Front-end", "index.html"));
});

const openai = new OpenAI ({
    apiKey: process.env.OPENAI_API_KEY
});

//route for chat messages 
//post req from client(user) to server(openai) and vice versa 

app.post("/chat", async(req,res) => {

    const{message} =req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: message}]
        });

        res.json({ reply: response.choices[0].message.content});

    } catch(err) {

        console.error(err);
        res.status(500).json({ reply:"Oops, something went wrong!"});

    }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
