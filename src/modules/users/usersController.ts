import { Request, Response } from 'express';
import usersService from '@modules/users/usersService';
import { UserCreateDto } from '@modules/users/dto/userDTO';

class UsersController {
  createUser = async (req: Request, res: Response) => {
    const UserCreateDto: UserCreateDto = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      type: req.body.type,
    };
    const user = await usersService.createUser(UserCreateDto);
    res.status(201).json(user);
  };
}

export default new UsersController();
