// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from 'nextjs-cors';
import { ObjectId } from "mongodb";

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
    const db = database?.db("task-management");

    let enteredData = req.body;
    enteredData = JSON.parse(enteredData);

    const taskId = enteredData.taskId;

    const userId = new ObjectId(enteredData.userId);


    const previousData = await db?.collection('tasks').findOne({ _id: new ObjectId(taskId) });

    if (previousData?.assignedUserId !== enteredData.userId) {
        await db?.collection('users').updateOne({ _id: new ObjectId(previousData?.assignedUserId) }, { $set: { assignedTask: false } });
    }

    let user = await db?.collection('users').findOne({ _id: userId });



    const taskData = {
        taskName: enteredData.taskName,
        taskDesc: enteredData.taskDesc,
        refferenceUrl: enteredData.refferenceUrl,
        deadline: new Date(enteredData.deadline),
        assignedUserId: enteredData.userId,
        assignedUser: user?.name
    };

    const result = await db?.collection('tasks').updateOne({ _id: new ObjectId(taskId) }, { $set: taskData });

    const userResult = await db?.collection('users').updateOne({ _id: userId }, { $set: { assignedTask: new ObjectId(taskId) } });

    res.json(result);
}