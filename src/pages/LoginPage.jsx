import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoginPage({ onLogin }) {
    const [mode, setMode] = useState('login');
    const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const isLogin = mode === 'login';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : { email: formData.email, password: formData.password, fullName: formData.fullName };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                onLogin(data.user);
            } else {
                setError(data.error || 'Authentication failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="w-full max-w-md">
                {/* Logo and Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
                        <Sparkles className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Meleys</h1>
                    <p className="text-muted-foreground">Your thoughts, structured.</p>
                </div>

                {/* Auth Card */}
                <Card className="border-0 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            {isLogin ? 'Welcome back' : 'Create account'}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {isLogin
                                ? 'Enter your credentials to access your notes'
                                : 'Enter your information to get started'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Mode Toggle */}
                        <div className="flex rounded-lg bg-muted p-1">
                            <Button
                                variant={isLogin ? "default" : "ghost"}
                                size="sm"
                                className="flex-1"
                                onClick={() => setMode('login')}
                            >
                                Login
                            </Button>
                            <Button
                                variant={!isLogin ? "default" : "ghost"}
                                size="sm"
                                className="flex-1"
                                onClick={() => setMode('create')}
                            >
                                Sign Up
                            </Button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        className="transition-all duration-200 focus:scale-[1.02]"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="pl-10 transition-all duration-200 focus:scale-[1.02]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        className="pl-10 pr-10 transition-all duration-200 focus:scale-[1.02]"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1 h-8 w-8 p-0"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in-0 slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <Button variant="outline" className="w-full">
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    {isLogin ? (
                        <>
                            Don't have an account?{' '}
                            <button
                                onClick={() => setMode('create')}
                                className="font-medium text-primary hover:underline transition-colors"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button
                                onClick={() => setMode('login')}
                                className="font-medium text-primary hover:underline transition-colors"
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}


            <section className="auth-card" aria-label="Authentication form">
                <div className="brand-mark" aria-hidden="true">
                    <LogoMark />
                </div>
                <h1>Meleys</h1>
                <p className="tagline">Your thoughts, structured.</p>

                <div className="segmented-control" role="tablist" aria-label="Authentication mode">
                    <button
                        type="button"
                        className={isLogin ? 'segmented-button active' : 'segmented-button'}
                        onClick={() => setMode('login')}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={!isLogin ? 'segmented-button active' : 'segmented-button'}
                        onClick={() => setMode('create')}
                    >
                        Create Account
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <label className="field">
                            <span>Full Name</span>
                            <div className="input-shell">
                                <MailIcon />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="John Doe"
                                    aria-label="Full name"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </label>
                    )}

                    <label className="field">
                        <span>Email Address</span>
                        <div className="input-shell">
                            <MailIcon />
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                aria-label="Email address"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </label>

                    <label className="field field-password">
                        <span>Password</span>
                        <div className="input-shell">
                            <LockIcon />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                aria-label="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                className="icon-button"
                                aria-label="Show password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <EyeIcon />
                            </button>
                        </div>
                    </label>

                    {error && (
                        <div className="error-message" style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>
                            {error}
                        </div>
                    )}

                    {isLogin && (
                        <a href="/" className="forgot-link forgot-link--below" onClick={(event) => event.preventDefault()}>
                            Forgot?
                        </a>
                    )}

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={isLoading}
                    >
                        <span>{isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
                        <ArrowIcon />
                    </button>
                </form>

                <div className="divider">
                    <span>OR CONTINUE WITH</span>
                </div>

                <div className="social-row">
                    {socialButtons.map((button) => (
                        <button type="button" className="social-button" key={button.label}>
                            {button.icon}
                            <span>{button.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            <aside className="testimonial-card promo-card-bottom">
                <div className="testimonial-header">
                    <SparkIcon />
                    <h2>Smart Organizing</h2>
                </div>
                <p className="testimonial-copy">
                    &quot;Meleys completely changed how I track my research projects. The digital paper feel
                    is unmatched.&quot;
                </p>
                <div className="testimonial-author">
                    <div className="avatar" aria-hidden="true">
                        EV
                    </div>
                    <div>
                        <strong>Elena Vance, Designer</strong>
                    </div>
                </div>
            </aside>
        </section >

    <footer className="auth-footer">
        <span>© 2024 Meleys Corporation. All rights reserved.</span>
        <nav>
            <a href="/" onClick={(event) => event.preventDefault()}>
                Privacy Policy
            </a>
            <a href="/" onClick={(event) => event.preventDefault()}>
                Terms of Service
            </a>
            <a href="/" onClick={(event) => event.preventDefault()}>
                Help Center
            </a>
        </nav>
    </footer>
    </main >
);
}
