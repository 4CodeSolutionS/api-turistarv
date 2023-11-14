import { z } from "zod";
import 'dotenv/config'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3333),
    HOST: z.string().default('0.0.0.0'),
    DATABASE_URL: z.string(),
    JWT_SECRET_ACCESS_TOKEN: z.string(),
    JWT_SECRET_REFRESH_TOKEN: z.string(),
    JWT_EXPIRES_IN_REFRESH_TOKEN: z.string(),
    JWT_EXPIRES_IN_ACCESS_TOKEN: z.string(),
    SENDGRID_API_KEY: z.string(),
    APP_URL_DEVLOPMENT: z.string().optional(),
    APP_URL_PRODUCTION: z.string().optional(),
    REDIS_URL: z.string(),
    CHARACTERS: z.string(),
    FIREBASE_PROJECT_ID: z.string(),
    FIREBASE_CLIENT_EMAIL: z.string().email(),
    FIREBASE_PRIVATE_KEY: z.string(),
    FIREBASE_BUCKET: z.string(),
    FOLDER_TMP_DEVELOPMENT: z.string(),
    FOLDER_TMP_PRODUCTION: z.string(),
    SENTRY_DSN: z.string(),
})

const _env = envSchema.safeParse(process.env)

if(_env.success !== true){
    console.error('Error converting environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data