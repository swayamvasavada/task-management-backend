// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import NextCors from 'nextjs-cors';

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

    const taskId = req.body;    

    const tasks = await db?.collection('tasks').findOne({_id: new ObjectId(taskId)});

    res.json(tasks);
}