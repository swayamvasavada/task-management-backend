// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from 'nextjs-cors';

const bcrypt = require('bcrypt');

import db_connect from "../../../data/database";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    
    await NextCors(req, res, {
        methods: ['POST'],
        origin: '*',
    });
    
    const database = await db_connect;
    const db = database.db("task-management");   
    
    let enteredData = req.body;
    enteredData = JSON.parse(enteredData);
    
    if (enteredData.password !== enteredData.confirmPassword) {
        return res.json({
            message: 'Password does not match',
            hasError: true
        });
    }

    const userExist = await db.collection('users').findOne({ email: enteredData.email });

    if (userExist) {
        return res.json({
            message: 'User already exists!',
            hasError: true
        })
    }

    const hasedPassword = await bcrypt.hash(enteredData.password, 12);

    const userData = {
        name: enteredData.name,
        email: enteredData.email,
        password: hasedPassword,
        assignedTask: false,
        isAdmin: false
    }

    const result = await db.collection('users').insertOne(userData);

    res.status(200).json(result);
}