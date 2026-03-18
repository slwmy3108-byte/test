const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: { origin: "*" }
});

// הגדרת פורט דינמי עבור הענן
const PORT = process.env.PORT || 3000;

console.log("Starting Executive Chat Server...");

io.on('connection', (socket) => {
    console.log("New connection identified: " + socket.id);

    socket.on('new_message', (messageData) => {
        // בטרמינל של השרת אתה תראה הכל (זהוב/שחור)
        console.log(`[LOG] Real Name: ${messageData.userName || 'Unknown'} | Msg: ${messageData.text}`);

        // יצירת אובייקט אנונימי לשאר המשתמשים
        const anonymousData = { 
            text: messageData.text, 
            userName: "Anonymous User",
            isMe: false 
        };

        // שליחה לכולם חוץ מהשולח
        socket.broadcast.emit('receive_message', anonymousData);
    });

    socket.on('disconnect', () => {
        console.log("User disconnected: " + socket.id);
    });
});

// הפעלת השרת
server.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
});
