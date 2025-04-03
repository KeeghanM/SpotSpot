import {
  sqliteTable,
  text,
  integer,
  type AnySQLiteColumn,
} from 'drizzle-orm/sqlite-core'

// Core tables
export const list = sqliteTable('list', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  parentId: integer('parent_id').references(
    (): AnySQLiteColumn => list.id,
  ),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const spot = sqliteTable('spot', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  visited: integer({ mode: 'boolean' }),
  rating: integer('rating'),
  notes: text('notes'),
  locationName: text('location_name'),
  locationAddress: text('location_address'),
  locationLink: text('location_link'),
  listId: integer('listId')
    .notNull()
    .references(() => list.id, { onDelete: 'cascade' }),
})

// Auth Tables
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', {
    mode: 'boolean',
  }).notNull(),
  image: text('image'),
  createdAt: integer('created_at', {
    mode: 'timestamp',
  }).notNull(),
  updatedAt: integer('updated_at', {
    mode: 'timestamp',
  }).notNull(),
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', {
    mode: 'timestamp',
  }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', {
    mode: 'timestamp',
  }).notNull(),
  updatedAt: integer('updated_at', {
    mode: 'timestamp',
  }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', {
    mode: 'timestamp',
  }),
  refreshTokenExpiresAt: integer(
    'refresh_token_expires_at',
    { mode: 'timestamp' },
  ),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', {
    mode: 'timestamp',
  }).notNull(),
  updatedAt: integer('updated_at', {
    mode: 'timestamp',
  }).notNull(),
})

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', {
    mode: 'timestamp',
  }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
})
