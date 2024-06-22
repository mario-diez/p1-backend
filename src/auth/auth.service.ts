import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { comparePassword } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(authPayload: AuthDto) {
    const foundUser = await this.userService.getUserByEmail(authPayload.email);
    if (foundUser) {
      const matched = comparePassword(authPayload.password, foundUser.password);
      if (matched) {
        const user = {
          id: foundUser.id,
          email: foundUser.email,
          role: foundUser.role,
        };

        return { access_token: this.jwtService.sign(user) };
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
