import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth/client-react'
import { useEffect, useState } from 'react'

type AuthFormType = 'login' | 'register' | 'reset-password'
type DefaultAuthFormProps = {
  type: AuthFormType
  token?: string
}
type ResetPasswordProps = {
  type: 'reset-password'
  token: string
}
type AuthFormProps =
  | DefaultAuthFormProps
  | ResetPasswordProps

export function AuthForm({ type, token }: AuthFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async () => {
    if (type !== 'reset-password' && !email) {
      setErrorMessage('Email is required')
      return
    }
    if (type !== 'reset-password' && !email.includes('@')) {
      setErrorMessage('Please enter a valid email address')
      return
    }
    if (!password) {
      setErrorMessage('Password is required')
      return
    }
    if (type === 'register' && !name) {
      setErrorMessage('Name is required')
      return
    }
    if (type === 'reset-password' && !confirmPassword) {
      setErrorMessage('Confirm Password is required')
      return
    }
    if (
      type === 'reset-password' &&
      password !== confirmPassword
    ) {
      setErrorMessage('Passwords do not match')
      return
    }
    setErrorMessage('')

    if (type === 'login') {
      await handleLogin()
    } else if (type === 'register') {
      await handleRegister()
    } else if (type === 'reset-password') {
      await handleResetPassword()
    }
  }

  const handleLogin = async () => {
    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: '/app',
    })

    if (error?.message) {
      setErrorMessage(error.message)
    }
  }

  const handleRegister = async () => {
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: '/app',
    })

    if (error?.message) {
      setErrorMessage(error.message)
    }
  }

  const handleResetPassword = async () => {
    const { error } = await authClient.resetPassword({
      token,
      newPassword: password,
    })

    if (error?.message) {
      setErrorMessage(error.message)
      return
    }
    window.location.href = '/login'
  }

  const sendResetEmail = async () => {
    if (!email) {
      setErrorMessage('Email is required to reset password')
      return
    }
    if (!email.includes('@')) {
      setErrorMessage(
        'Please enter a valid email address to reset password',
      )
      return
    }
    setErrorMessage('')

    await authClient.requestPasswordReset({
      email,
      redirectTo: '/reset-password',
    })
    setErrorMessage(
      'If that email address is registered, you will receive a password reset link shortly.',
    )
  }

  useEffect(() => {
    if (
      type === 'reset-password' &&
      password !== confirmPassword
    ) {
      setErrorMessage('Passwords do not match')
      return
    }
  }, [confirmPassword])

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {type === 'login'
              ? 'Login to your account'
              : type === 'register'
                ? 'Create a new account'
                : 'Reset your password'}
          </CardTitle>
          <CardDescription>
            {type === 'login'
              ? 'Welcome back! Please enter your credentials to continue.'
              : type === 'register'
                ? 'Join us today! Fill in your details to create a new account.'
                : 'Enter your new password below to reset it.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              {type === 'register' ? (
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                  />
                </div>
              ) : null}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@magicace.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />
                  {type === 'login' ? (
                    <span
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          sendResetEmail()
                        }
                      }}
                      aria-label="Reset Password"
                      onClick={sendResetEmail}
                      className="inline-block cursor-pointer text-xs italic underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </span>
                  ) : null}
                </div>
              </div>
              {type === 'reset-password' ? (
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="confirm-password">
                      Confirm Password
                    </Label>
                  </div>
                  <div>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault()
                    handleSubmit()
                  }}
                  disabled={!email || !password}
                >
                  {type === 'login'
                    ? 'Login'
                    : type === 'register'
                      ? 'Register'
                      : 'Reset Password'}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              {type === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <a
                    href="/auth/register"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </a>
                </>
              ) : null}
              {type === 'register' ? (
                <>
                  Already have an account?{' '}
                  <a
                    href="/auth/login"
                    className="underline underline-offset-4"
                  >
                    Login
                  </a>
                </>
              ) : null}
            </div>
            {errorMessage ? (
              <div className="mt-4 text-center text-sm text-red-500">
                {errorMessage}
              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
