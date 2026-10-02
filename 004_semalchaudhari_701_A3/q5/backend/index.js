import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import Employee from './models/Employee.js';
import Leave from './models/Leave.js';

import { authMiddleware } from './middlewares/authMiddleware.js';

const app = express();

const JWT_SECRET = 'my-secret-key';


// Middleware

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// MongoDB

mongoose.connect('mongodb://127.0.0.1:27017/erpdb')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(error => {
        console.log(error);
    });


// =================================
// Employee Login
// =================================

app.post('/api/login', async (req, res) => {

    // console.log(req.body);

    try {

        const { empid, password } = req.body;

        const employee = await Employee.findOne({
            empid: empid
        });

        if (!employee) {

            return res.status(401).json({
                message: 'Invalid employee ID'
            });

        }


        const isPasswordCorrect = await bcrypt.compare(
            password,
            employee.password
        );


        if (!isPasswordCorrect) {

            return res.status(401).json({
                message: 'Invalid password'
            });

        }


        const token = jwt.sign(
            {
                employeeId: employee._id
            },
            JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );


        res.json({
            message: 'Login successful',
            token
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server error'
        });

    }

});


// =================================
// Page 1 - Employee Profile
// =================================

app.get(
    '/api/profile',
    authMiddleware,
    async (req, res) => {

        try {

            const employee = await Employee.findById(
                req.employeeId
            ).select('-password');


            if (!employee) {

                return res.status(404).json({
                    message: 'Employee not found'
                });

            }


            res.json(employee);


        } catch (error) {

            res.status(500).json({
                message: 'Server error'
            });

        }

    }
);


// =================================
// Page 2 - Add Leave
// =================================

app.post(
    '/api/leaves',
    authMiddleware,
    async (req, res) => {

        try {

            const {
                date,
                reason
            } = req.body;


            const leave = await Leave.create({

                employeeId: req.employeeId,

                date: date,

                reason: reason,

                grant: 'no'

            });


            res.status(201).json({

                message: 'Leave application submitted',

                leave

            });


        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: 'Server error'
            });

        }

    }
);


// =================================
// List Employee Leaves
// =================================

app.get(
    '/api/leaves',
    authMiddleware,
    async (req, res) => {

        try {

            const leaves = await Leave.find({
                employeeId: req.employeeId
            }).sort({
                date: -1
            });


            res.json(leaves);


        } catch (error) {

            res.status(500).json({
                message: 'Server error'
            });

        }

    }
);


// =================================

app.listen(5000, () => {

    console.log(
        'Server running on http://localhost:5000'
    );

});