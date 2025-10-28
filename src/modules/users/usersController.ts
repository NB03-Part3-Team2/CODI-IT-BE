import { Request, Response } from 'express';
import usersService from '@modules/users/usersService';
import { CreateUserDto } from '@modules/users/dto/usersDTO';

class UsersController {
  /**
   * @description
   * 새로운 유저를 생성합니다.
   *
   * 아이디, 이름, 비밀번호 정보를 받아 새로운 유저를 생성합니다.
   * 데이터가 잘못되었거나 이메일 또는 이름이 중복될 경우 에러를 발생시킵니다.
   * 서버 오류로 인해 유저 생성에 실패할 수 있습니다.
   *
   * @param {Object} req - 요청 객체
   * @param {Object} res - 응답 객체
   *
   * @returns {Object} 생성된 유저 정보 (HTTP 201)
   *
   * @throws {ApiError} 400 - 잘못된 요청 데이터
   * @throws {ApiError} 409 - 이메일 또는 이름 중복
   * @throws {ApiError} 500 - 서버 내부 오류
   */

  createUser = async (req: Request, res: Response) => {
    const createUserDto: CreateUserDto = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      type: req.body.type,
    };
    const user = await usersService.createUser(createUserDto);
    res.status(201).json(user);
  };

  getUser = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const user = await usersService.getUser(userId);
    res.status(200).json(user);
  };
}

export default new UsersController();
