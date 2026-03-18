const io = require('socket.io')(3000, {
    cors: { origin: "*" },
    host: '0.0.0.0'
});

console.log("server is running");

io.on('connection', (socket) => {
    // בלוג של המחשב שלך תראה את ה-ID של מי שהתחבר
    console.log("identify connection, new user: " + socket.id);

    socket.on('new_message', (messageData) => {
        // --- החלק שרק אתה רואה (בטרמינל של ה-VS Code) ---
        // כאן נדפיס את השם האמיתי ואת ה-ID
        console.log(`[LOG] messeage from: ${messageData.userName || 'unknow'} (ID: ${socket.id}): ${messageData.text}`);

        // 1. שליחה לכולם כהודעה אנונימית (מוחקים פרטים מזהים)
        // אנחנו בונים אובייקט חדש שבו השם תמיד יהיה "משתמש אנונימי"
        const anonymousData = { 
            text: messageData.text, 
            userName: "anunimus user",
            isMe: false // זה יעזור לאפליקציה בצד השני לעצב את הבועה
        };

        // broadcast שולח לכל המשתמשים חוץ מזה ששלח את ההודעה
        socket.broadcast.emit('receive_message', anonymousData);
    });

    socket.on('disconnect', () => {
        console.log("user logout: " + socket.id);
    });
});