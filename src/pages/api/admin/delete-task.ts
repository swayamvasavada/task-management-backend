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

    const taskId = req.body;
    
    const user = await db?.collection('tasks').findOne({_id: new ObjectId(taskId)}, {projection: {assignedUserId: 1}});

    const result = await db?.collection('tasks').deleteOne({_id: new ObjectId(taskId)});

    if (result?.deletedCount) {
        await db?.collection('users').updateOne({_id: new ObjectId(user?.assignedUserId)}, {$set: {assignedTask: false}});
    }

    res.json(result);
}