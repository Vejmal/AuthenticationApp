import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';
import { dateNow } from '../utils';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const sessionToken = req.cookies['TOMASZ-AUTH'];
    if (!sessionToken) {
      console.log(`${dateNow}, No cookies.`);
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    if (existingUser) {
      console.log(`${dateNow}, No cookies.`);
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });
    return next();

  } catch (error) {
    console.log(`${dateNow}, An error occured during authentication: ${error}`);
    return res.sendStatus(400);
  }
};

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as string;
    if(!currentUserId) {
    return res.sendStatus(403);
    }

    if(currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(`${dateNow}, An error occurred while verifying your account: ${error}`);
    return res.sendStatus(400);
  }
}