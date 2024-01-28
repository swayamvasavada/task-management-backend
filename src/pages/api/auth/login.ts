// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from 'nextjs-cors';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    enteredData = JSON.parse(enteredData)

    const userData = await db.collection('users').findOne({ email: enteredData.email });

    if (!userData) {
        return res.json({
            message: 'User does not exist',
            hasError: true
        });
    }

    const passwordAreEqual = await bcrypt.compare(enteredData.password, userData.password);

    if (!passwordAreEqual) {
        return res.json({
            message: 'Incorrect password!',
            hasError: true
        });
    }   

    const token = jwt.sign({ data: { id: userData._id, isAdmin: userData.isAdmin } }, 'super-secret')

    res.status(200).json({
        token: token,
        isAdmin: userData.isAdmin
    });
}