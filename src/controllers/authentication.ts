import express from 'express';

import { dateNow } from '../utils';
import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers/index';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log(`${dateNow}, Email or password is missing.`);
      return res.sendStatus(400)
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    if (!user) {
      console.log(`${dateNow}, Login is missing.`);
      return res.sendStatus(400)
    }

    const expectedHash = authentication(user.authentication.salt, password);
    const hashToString = expectedHash.toString();
    if (user.authentication.password !== hashToString) {
      console.log(`${dateNow}, Access forbidden.`);
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sesstionToken = (authentication(salt, user._id.toString())).toString();
    await user.save();

    res.cookie('TOMASZ-AUTH', user.authentication.sesstionToken, { domain: 'localhost',  path: '/'});
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(`${dateNow}, An error occured during registration: ${error}`);
    return res.sendStatus(400);
  }
};


export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      console.log(`${dateNow}, One or more required parameters are missing.`);
      return res.sendStatus(400)
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log(`${dateNow}, User Exists.`);
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password)
      }
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(`${dateNow}, An error occured during registration: ${error}`);
    return res.sendStatus(400);
  }
}