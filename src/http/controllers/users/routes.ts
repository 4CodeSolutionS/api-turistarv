import { FastifyInstance } from 'fastify'
import { RegisterUser } from './register/register-user-controller'
import { LoginUser } from './login/login-user-controller'
import { VerifyEmail } from './verify-email/verify-email-controller'
import { verifyTokenJWT } from '@/http/middlewares/verify-token-jwt'
import { SendForgotPassword } from './send-forgot-password/send-forgot-password'
import { ResetPassword } from './reset-password/reset-password-controller'
import { FindUser } from './find/find-user-controller'
import { DeleteUser } from './delete/delete-user-controller'
import { UpdateUser } from './update-full/update-user-controller'
import { LogoutUser } from './logout/logout-user-controller'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { AccessAdminUser } from './access-admin/access-admin-users-controller'
import { EmailExists } from './email-exists/email-exists-controller'
import { RefreshToken } from './refresh-token/refresh-token-users-controller'
export async function usersRoutes(fastifyApp: FastifyInstance) {
    // register user
    fastifyApp.post('/', RegisterUser)

    // login user
    fastifyApp.post('/login', LoginUser)

    // email exists user
    fastifyApp.get('/email-exists', EmailExists)

    // refresh token
    fastifyApp.post('/refresh-token', RefreshToken)

    // logout user
    fastifyApp.post('/logout', {onRequest: [verifyTokenJWT]}, LogoutUser)

    // verify e-mail user
    fastifyApp.patch('/verify-email', VerifyEmail)

    // send forgot password user
    fastifyApp.post('/forgot-password', SendForgotPassword)

    // reset password user
    fastifyApp.patch('/reset-password', ResetPassword)

    // find user
    fastifyApp.get('/:id', {onRequest: [verifyTokenJWT]}, FindUser)

    // update user
    fastifyApp.put('/', {onRequest: [verifyTokenJWT]}, UpdateUser)

    // delete user
    fastifyApp.delete('/:id', {onRequest: [verifyTokenJWT]}, DeleteUser)

    // access admin user
    fastifyApp.patch('/access-admin', {onRequest: [verifyTokenJWT, verifyUserRole('SUPER')]}, AccessAdminUser)


}
