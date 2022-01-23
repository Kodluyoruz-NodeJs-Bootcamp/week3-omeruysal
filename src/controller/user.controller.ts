import { Response, Request } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import { getAll } from '../service/user.service';

export const Users = async (req: Request, res: Response) => {
  try {
    const repository = getManager().getRepository(User);

    const users = await getAll();
    res.status(200).send(
      users.map((user) => {
        const { password, ...data } = user;
        return data;
      })
    );
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
