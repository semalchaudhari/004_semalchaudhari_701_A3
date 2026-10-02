import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

import {
    body,
    validationResult
} from 'express-validator';

const app = express();


// --------------------------------------------------
// ES MODULE __dirname equivalent
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// --------------------------------------------------
// EJS
// --------------------------------------------------

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(
    path.join(__dirname, 'uploads')
));


// --------------------------------------------------
// Multer configuration
// --------------------------------------------------

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        if (file.fieldname === 'profilePic') {

            cb(null, path.join(__dirname, 'uploads/profilepic'));

        } else {

            cb(null, path.join(__dirname, 'uploads/other'));

        }
    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});


// --------------------------------------------------
// File validation
// --------------------------------------------------

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp'
    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error('Only JPG, JPEG, PNG and WEBP images are allowed.'));
    }
};


// --------------------------------------------------
// Multer middleware
// --------------------------------------------------

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB
        files: 6
    }

});


// --------------------------------------------------
// GET registration form
// --------------------------------------------------

app.get('/', (req, res) => {

    res.render('form', {

        errors: [],

        oldData: {}

    });

});


// --------------------------------------------------
// POST registration
// --------------------------------------------------

app.post(

    '/register',

    upload.fields([
        {
            name: 'profilePic',
            maxCount: 1
        },
        {
            name: 'otherPics',
            maxCount: 5
        }
    ]),

    [

        // Username
        body('username')
            .trim()
            .notEmpty()
            .withMessage('Username is required.')
            .isLength({ min: 3, max: 20 })
            .withMessage('Username must be between 3 and 20 characters.'),

        // Password
        body('password')
            .notEmpty()
            .withMessage('Password is required.')
            .isLength({ min: 6 })
            .withMessage('Password must contain at least 6 characters.'),

        // Confirm password
        body('confirmPassword')
            .custom((value, { req }) => {

                if (value !== req.body.password) {

                    throw new Error('Passwords do not match.');
                }

                return true;
            }),

        // Email
        body('email')
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email address.'),

        // Gender
        body('gender')
            .notEmpty()
            .withMessage('Please select your gender.')
            .isIn(['male', 'female', 'other'])
            .withMessage('Invalid gender selected.'),

        // Hobbies
        body('hobbies')
            .custom((value) => {

                if (!value) {
                    throw new Error('Please select at least one hobby.');
                }

                return true;
            })

    ],

    (req, res) => {

        const errors = validationResult(req);

        // --------------------------------------------------
        // Validation failed
        // --------------------------------------------------

        if (!errors.isEmpty()) {

            return res.status(400).render('form', {

                errors: errors.array(),

                oldData: req.body

            });

        }


        // --------------------------------------------------
        // File validation
        // --------------------------------------------------

        if (!req.files?.profilePic) {

            return res.status(400).render('form', {

                errors: [
                    {
                        msg: 'Profile picture is required.'
                    }
                ],

                oldData: req.body

            });

        }


        // --------------------------------------------------
        // Everything valid
        // --------------------------------------------------

        const profilePic = req.files.profilePic[0];

        const otherPics = req.files.otherPics || [];


        const userData = {

            username: req.body.username,

            email: req.body.email,

            gender: req.body.gender,

            hobbies: Array.isArray(req.body.hobbies)
                ? req.body.hobbies
                : [req.body.hobbies],

            profilePic: profilePic,

            otherPics: otherPics

        };


        console.log(userData);


        res.render('result', {

            userData: userData

        });

    }

);


// --------------------------------------------------
// Download route
// --------------------------------------------------

app.get('/download/:type/:filename', (req, res) => {

    const { type, filename } = req.params;


    let folder;


    if (type === 'profile') {

        folder = 'profilepic';

    } else if (type === 'other') {

        folder = 'other';

    } else {

        return res.status(400).send('Invalid file type.');
    }


    const filePath = path.join(
        __dirname,
        'uploads',
        folder,
        filename
    );


    res.download(filePath, (err) => {

        if (err) {

            console.log(err);

        }

    });

});


// --------------------------------------------------
// Error handler
// --------------------------------------------------

app.use((err, req, res, next) => {

    console.log(err);

    let message = 'Something went wrong.';


    if (err instanceof multer.MulterError) {

        if (err.code === 'LIMIT_FILE_SIZE') {

            message = 'Each image must be less than 2 MB.';

        } else if (err.code === 'LIMIT_FILE_COUNT') {

            message = 'Maximum 6 files are allowed.';

        } else {

            message = err.message;
        }

    } else if (err.message) {

        message = err.message;

    }


    res.status(400).render('form', {

        errors: [
            {
                msg: message
            }
        ],

        oldData: req.body || {}

    });

});


// --------------------------------------------------
// Start server
// --------------------------------------------------

app.listen(3000, () => {

    console.log('Server running at http://localhost:3000');

});