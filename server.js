const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

// הגדרת Socket.io עם הרשאות CORS
const io = require('socket.io')(server, {
    cors: { origin: "*" }
});

// קריטי לענן: שימוש בפורט שהשרת מקצה או 3000 כברירת מחדל
const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    // זיהוי חיבור חדש בטרמינל של השרת
    console.log("Identify connection, new user ID: " + socket.id);

    socket.on('new_message', (messageData) => {
        // לוג למנהל המערכת (אתה תראה את זה ב-Render Logs)
        const realName = messageData.userName || 'Unknown';
        console.log(`[LOG] Message from: ${realName} (ID: ${socket.id}): ${messageData.text}`);

        // יצירת אובייקט אנונימי לשאר המשתמשים
        const anonymousData = { 
            text: messageData.text, 
            userName: "Anonymous User", // השם שכולם יראו
            isMe: false 
        };

        // שליחה לכל המשתמשים חוץ מהשולח
        socket.broadcast.emit('receive_message', anonymousData);
    });

    socket.on('disconnect', () => {
        console.log("User disconnected: " + socket.id);
    });
});

// הפעלת השרת על הפורט הנכון
server.listen(PORT, () => {
    console.log(`Executive Chat Server is running on port ${PORT}`);
});
