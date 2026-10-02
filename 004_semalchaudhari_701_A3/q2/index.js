import express from 'express';
import session from 'express-session';
import FileStoreFactory from 'session-file-store';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File store
const FileStore = FileStoreFactory(session);

// Middleware
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(
    session({
        store: new FileStore({
            path: './sessions'
        }),
        secret: 'my-secret-key',
        resave: false,
        saveUninitialized: false
    })
);


// Login page
app.get('/', (req, res) => {
    res.render('login', {
        error: null
    });
});


// Login
app.post('/login', (req, res) => {

    const { username, password } = req.body;

    // Simple hardcoded user
    if (username === 'admin' && password === '12345') {

        req.session.user = {
            username: username
        };

        res.redirect('/dashboard');

    } else {

        res.render('login', {
            error: 'Invalid username or password'
        });
    }
});


// Authentication middleware
function isAuthenticated(req, res, next) {

    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
}


// Protected Route 1
app.get('/dashboard', isAuthenticated, (req, res) => {

    res.render('dashboard', {
        username: req.session.user.username
    });

});


// Protected Route 2
app.get('/profile', isAuthenticated, (req, res) => {

    res.render('profile', {
        username: req.session.user.username
    });

});


// Logout
app.get('/logout', (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.send('Unable to logout');
        }

        res.redirect('/');

    });

});


app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});