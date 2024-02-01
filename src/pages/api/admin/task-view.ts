// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from 'nextjs-cors';

import db_connect from "../../../data/database";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    await NextCors(req, res, {
        methods: ['GET'],
        origin: '*',
    });

    const database = await db_connect;
    const db = database?.db("task-management");

    const tasks = await db?.collection('tasks').find({}, {projection: {taskName: 1, taskDesc: 1, deadline: 1, status: 1}}).toArray();

    res.json(tasks);
}