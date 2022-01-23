import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import bcryptjs from 'bcryptjs';

interface UpdatedUser {
  id: number;

  firstName: string;

  lastName: string;

  email: string;
}
export const getAll = async (): Promise<User[]> => {
  const repository = getManager().getRepository(User);

  const users: User[] = await repository.find();

  return users;
};

export const saveUser = async (firstName: string, lastName: string, email: string, password: string): Promise<User> => {
  const repository = getManager().getRepository(User);

  const user: User = await repository.save({
    firstName,
    lastName,
    email,
    password: await bcryptjs.hash(password, 10),
  });

  return user;
};

export const getOne = async (email: string): Promise<User | undefined> => {
  const repository = getManager().getRepository(User);

  const user: User | undefined = await repository.findOne({ email });

  return user;
};

export const getOneById = async (id: number): Promise<User | undefined> => {
  const repository = getManager().getRepository(User);

  const user: User | undefined = await repository.findOne({ id });

  return user;
};

export const update = async (id: number, user: UpdatedUser): Promise<void> => {
  const repository = getManager().getRepository(User);

  await repository.update(id, user);
};

export const updatePassword = async (id: number, password: string): Promise<void> => {
  const repository = getManager().getRepository(User);

  await repository.update(id, { password: await bcryptjs.hash(password, 10) });
};
