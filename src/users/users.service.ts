import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { UserFilters } from "./dto/user-filters";
import { UserDto } from "./dto/user.dto";
import { User } from "./schemas/user.schema";
import { ROLE } from "src/enums/role.enum";
import { hashPassword } from "src/utils/bcrypt";
import { isOwner } from "src/utils/is-owner";


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(createUserDTO: CreateUserDto): Promise<UserDto> {
    try {
      const passwd = hashPassword(createUserDTO.password);
      const newUser = new this.userModel({ ...createUserDTO, password: passwd, roles: ROLE.User });
      console.log(newUser);
      const createdUser = await newUser.save();

      return plainToInstance(UserDto, createdUser, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error.code == 11000) {
        throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
      }
    }
  }

  async getUserByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async getUsers(userFilters: UserFilters): Promise<UserDto[]> {
    const query = this.parseFilters(userFilters);

    const foundUsers = await this.userModel.find(query).skip(userFilters.offset).limit(userFilters.limit).exec();

    return plainToInstance(UserDto, foundUsers, {
      excludeExtraneousValues: true,
    });
  }

  async getUserById(userId: string, userDto: UserDto): Promise<UserDto> {
    const foundUser = await this.userModel.findById(userId).exec();

    if (!isOwner(true, foundUser.id, userDto)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    /* TODO: Maybe all plain return on controller */
    return plainToInstance(UserDto, foundUser, {
      excludeExtraneousValues: true,
    });
  }

  async deleteUser(userId: string, userDto: UserDto) {
    if (!isOwner(true, userId, userDto)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const foundUser = await this.userModel.findByIdAndDelete(userId).exec();

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(UserDto, foundUser, {
      excludeExtraneousValues: true,
    });
  }

  async updateUserRole(userId: string, updateRoleDto: UpdateRoleDto): Promise<UserDto> {
    const foundUser = await this.userModel.findByIdAndUpdate(userId, { role: updateRoleDto.role }, { new: true }).exec();

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(UserDto, foundUser, {
      excludeExtraneousValues: true,
    });
  }

  async banUser(userId: string): Promise<UserDto> {
    const foundUser = await this.userModel.findByIdAndUpdate(userId, { ban: true }, { new: true }).exec();

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(UserDto, foundUser, {
      excludeExtraneousValues: true,
    });
  }

  async unbanUser(userId: string): Promise<UserDto> {
    const foundUser = await this.userModel.findByIdAndUpdate(userId, { ban: false }, { new: true }).exec();

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(UserDto, foundUser, {
      excludeExtraneousValues: true,
    });
  }

  async updateUserPassword(userId: string, userDto: UserDto, updatePasswordDto: UpdatePasswordDto): Promise<UserDto> {
    if (!isOwner(true, userId, userDto)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const hashedPassword = hashPassword(updatePasswordDto.password);
    const foundUser = await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true }).exec();

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(UserDto, foundUser, {
      excludeExtraneousValues: true,
    });
  }

  private parseFilters(userFilters: UserFilters) {
    const query: any = { ...userFilters, offset: undefined, limit: undefined };

    if (userFilters.email) {
      query['email'] = { $regex: userFilters.email, $options: 'i' };
    }

    return query;
  }
}
