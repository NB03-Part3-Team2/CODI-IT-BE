import { Request, Response } from 'express';
import usersService from '@modules/users/usersService';
import { CreateUserDto } from '@modules/users/dto/userDTO';

class UsersController {
  createUser = async (req: Request, res: Response) => {
    const CreateUserDto: CreateUserDto = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      type: req.body.type,
    };
    const user = await usersService.createUser(CreateUserDto);
    res.status(201).json(user);
  };
}

export default new UsersController();
