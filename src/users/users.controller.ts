import { Controller, Post, HttpCode, Body, Get, UseGuards, Req, Param,Query, Delete, Put } from "@nestjs/common";
import { ApiResponse, ApiForbiddenResponse, ApiUnauthorizedResponse, ApiNotFoundResponse } from "@nestjs/swagger";
import { ROLE } from "src/enums/role.enum";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { UserFilters } from "./dto/user-filters";
import { UserDto } from "./dto/user.dto";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/guards/jwt.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/decorators/roles.decorator";


@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @HttpCode(204)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin)
  @ApiResponse({
    status: 200,
    type: Array<UserDto>,
  })
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  getUsers(@Query() userFilters: UserFilters): Promise<UserDto[]> {
    return this.usersService.getUsers(userFilters);
  }

  @Get(':userId')
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.User)
  getUserById(@Req() request: Request, @Param('userId') userId: string): Promise<UserDto> {
    return this.usersService.getUserById(userId, request['user'] as UserDto);
  }

  @Delete(':userId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles()
  deleteUser(@Req() request: Request, @Param('userId') userId: string): Promise<UserDto> {
    return this.usersService.deleteUser(userId, request['user'] as UserDto);
  }

  @Put(':userId/roles')
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin)
  updateUserRole(@Param('userId') userId: string, @Body() updateRoleDto: UpdateRoleDto): Promise<UserDto> {
    return this.usersService.updateUserRole(userId, updateRoleDto);
  }

  @Put(':userId/ban')
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin)
  banUser(@Param('userId') userId: string): Promise<UserDto> {
    return this.usersService.banUser(userId);
  }

  @Delete(':userId/ban')
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin)
  unbanUser(@Param('userId') userId: string): Promise<UserDto> {
    return this.usersService.unbanUser(userId);
  }

  @Put(':userId/password')
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.User)
  updateUserPassword(@Req() request: Request, @Param('userId') userId: string, @Body() updatePasswordDto: UpdatePasswordDto): Promise<UserDto> {
    return this.usersService.updateUserPassword(userId, request['user'] as UserDto, updatePasswordDto);
  }
}
