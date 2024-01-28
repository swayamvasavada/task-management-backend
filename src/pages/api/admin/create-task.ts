// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from 'nextjs-cors';
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
    const db = database?.db("task-management");

    let enteredData = req.body;
    enteredData = JSON.parse(enteredData);
    
    const userId = new ObjectId(enteredData.userId);

    let user = await db?.collection('users').findOne({ _id: userId });

    const taskData = {
        taskName: enteredData.taskName,
        taskDesc: enteredData.taskDesc,
        refferenceUrl: enteredData.refferenceUrl,
        deadline: new Date(enteredData.deadline),
        assignedUserId: enteredData.userId,
        assignedUser: user?.name,
        status: 'Pending'
    };

    const result = await db?.collection('tasks').insertOne(taskData);

    const userResult = await db?.collection('users').updateOne({ _id: userId }, { $set: { assignedTask: result?.insertedId } });

    res.json(result);
}