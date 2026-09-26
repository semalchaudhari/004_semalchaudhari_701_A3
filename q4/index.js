import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

import Employee from './models/employee.js';

const app = express();


// =========================
// MongoDB Connection
// =========================

mongoose.connect('mongodb://127.0.0.1:27017/erpdb')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.log('MongoDB error:', err);
    });


// =========================
// Middleware
// =========================

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');


app.use(
    session({
        secret: 'erp-secret-key',
        resave: false,
        saveUninitialized: false
    })
);


// =========================
// Admin Login
// =========================

app.get('/', (req, res) => {

    res.render('login', {
        error: null
    });

});


app.post('/login', (req, res) => {

    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {

        req.session.admin = true;

        res.redirect('/dashboard');

    } else {

        res.render('login', {
            error: 'Invalid username or password'
        });

    }

});


// =========================
// Authentication Middleware
// =========================

function isAdmin(req, res, next) {

    if (req.session.admin) {
        next();
    } else {
        res.redirect('/');
    }

}


// =========================
// Dashboard
// =========================

app.get('/dashboard', isAdmin, (req, res) => {

    res.render('dashboard');

});


// =========================
// Employee List
// =========================

app.get('/employees', isAdmin, async (req, res) => {

    const employees = await Employee.find();

    res.render('employees', {
        employees
    });

});


// =========================
// Add Employee Page
// =========================

app.get('/employees/add', isAdmin, (req, res) => {

    res.render('addEmployee');

});


// =========================
// Generate Employee ID
// =========================

function generateEmpId() {

    return 'EMP' + Date.now();

}


// =========================
// Generate Password
// =========================

function generatePassword() {

    return Math.random().toString(36).slice(-8);

}


// =========================
// Add Employee
// =========================

app.post('/employees/add', isAdmin, async (req, res) => {

    try {

        const {
            name,
            email,
            basicSalary
        } = req.body;


        const empid = generateEmpId();

        const plainPassword = generatePassword();


        // Salary calculation

        const basic = Number(basicSalary);

        const hra = basic * 0.20;

        const da = basic * 0.10;

        const grossSalary = basic + hra + da;


        // Encrypt password

        const hashedPassword = await bcrypt.hash(
            plainPassword,
            10
        );


        // Create employee

        const employee = new Employee({

            empid: empid,

            name: name,

            email: email,

            password: hashedPassword,

            basicSalary: basic,

            hra: hra,

            da: da,

            grossSalary: grossSalary

        });


        await employee.save();


        // Send email

        await sendEmployeeEmail(
            email,
            name,
            empid,
            plainPassword
        );


        res.redirect('/employees');


    } catch (error) {

        console.log(error);

        res.send('Error adding employee');

    }

});


// =========================
// Edit Employee Page
// =========================

app.get('/employees/edit/:id', isAdmin, async (req, res) => {

    const employee = await Employee.findById(req.params.id);

    res.render('editEmployee', {
        employee
    });

});
//vgne nkbp kloy bkda


// =========================
// Update Employee
// =========================

app.post('/employees/edit/:id', isAdmin, async (req, res) => {

    const {
        name,
        email,
        basicSalary
    } = req.body;


    const basic = Number(basicSalary);

    const hra = basic * 0.20;

    const da = basic * 0.10;

    const grossSalary = basic + hra + da;


    await Employee.findByIdAndUpdate(
        req.params.id,
        {
            name,
            email,
            basicSalary: basic,
            hra,
            da,
            grossSalary
        }
    );


    res.redirect('/employees');

});


// =========================
// Delete Employee
// =========================

app.get('/employees/delete/:id', isAdmin, async (req, res) => {

    await Employee.findByIdAndDelete(req.params.id);

    res.redirect('/employees');

});


// =========================
// Send Email
// =========================

const transporter = nodemailer.createTransport({

    service: 'gmail',

    auth: {
        user: 'semalchaudhari00@gmail.com',
        pass: 'vgnenkbpkloybkda'
    }

});


async function sendEmployeeEmail(
    email,
    name,
    empid,
    password
) {

    await transporter.sendMail({

        from: 'semalchaudhari00@gmail.com',

        to: email,

        subject: 'ERP Employee Account',

        html: `
            <h2>Welcome ${name}</h2>

            <p>Your employee account has been created.</p>

            <p>
                <b>Employee ID:</b> ${empid}
            </p>

            <p>
                <b>Password:</b> ${password}
            </p>

            <p>Please keep these credentials safe.</p>
        `

    });

}


// =========================
// Logout
// =========================

app.get('/logout', (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.send('Logout failed');
        }

        res.redirect('/');

    });

});


// =========================
// Server
// =========================

app.listen(3000, () => {

    console.log(
        'Server running at http://localhost:3000'
    );

});