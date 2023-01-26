import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { User } from '../user/user.entity';
import { Authentication } from '../common/decorators/authentication.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { UserSigninDto } from './dto/user-signin.dto';
import { UserSignupDto } from './dto/user-signup.dto';
import { LocalAuthGuard } from './local-auth-guard';
import { UserDto } from './dto/user.dto';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiResponse({ status: HttpStatus.OK, type: UserDto })
	@Throttle(64, 60)
	@Authentication()
	@Get('me')
	reveal(@CurrentUser() user: User): Promise<User | null> {
		return this.authService.find(user.username);
	}

	@Throttle(8, 60)
	@Post('signup')
	signup(@Body() signupRequest: UserSignupDto): Promise<User> {
		return this.authService.signup(signupRequest.username, signupRequest.password);
	}

	@Throttle(8, 60)
	@UseGuards(LocalAuthGuard)
	@Post('signin')
	signin(@Body() signinRequest: UserSigninDto): { access_token: string } {
		return this.authService.signin(signinRequest.username, signinRequest.password);
	}
}
