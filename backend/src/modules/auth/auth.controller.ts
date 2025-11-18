import { Controller, Post, Request, UseGuards, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    this.logger.log(`Login attempt for user: ${req.user?.username || 'unknown'}`);
    try {
      const result = await this.authService.login(req.user);
      this.logger.debug(`Login successful for user: ${req.user.username}`);
      return result;
    } catch (error) {
      this.logger.error(`Login failed for user: ${req.user?.username || 'unknown'}`, error.stack);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Reset user password' })
  @ApiBody({ type: ResetPasswordDto })
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    this.logger.log(`Password reset request for: ${resetPasswordDto.usernameOrEmail}`);
    try {
      const result = await this.authService.resetPassword(
        resetPasswordDto.usernameOrEmail, 
        resetPasswordDto.newPassword
      );
      this.logger.debug(`Password reset successful for: ${resetPasswordDto.usernameOrEmail}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Password reset failed for: ${resetPasswordDto.usernameOrEmail}`, 
        error.stack
      );
      throw error;
    }
  }
}
