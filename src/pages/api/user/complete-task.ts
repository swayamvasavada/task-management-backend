// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from 'nextjs-cors';
const jwt = require('jsonwebtoken');

import db_connect from "../../../data/database";
import { ObjectId } from "mongodb";

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

    let formData = req.body;
    formData = JSON.parse(formData);
    const {token, taskId} = formData;

    const decryptedData = jwt.verify(token, 'super-secret');

    const userData = await db.collection('users').updateOne({ _id: new ObjectId(decryptedData.data.id) }, {$set: {assignedTask: false}});    
    
    const result = await db.collection('tasks').updateOne({ _id: new ObjectId(taskId) }, {$set: {status: 'Complete'}});
    
    res.json(result);
}