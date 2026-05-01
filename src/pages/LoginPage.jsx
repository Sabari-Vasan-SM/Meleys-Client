import { useState } from 'react';
import { ArrowIcon, EyeIcon, GoogleIcon, LockIcon, LogoMark, MailIcon, SparkIcon } from '../components/Icons';

const socialButtons = [
    { label: 'Google', icon: <GoogleIcon /> },
];

export function LoginPage({ onLogin }) {
    const [mode, setMode] = useState('login');
    const isLogin = mode === 'login';

    return (
        <main className="auth-shell">
            <div className="background-orb background-orb-left" />
            <div className="background-orb background-orb-right" />
            <section className="auth-stage auth-stage--login">
                <aside className="promo-card promo-card-top">
                    <div className="promo-icon promo-icon-right">
                        <SparkIcon />
                    </div>
                    <h2>Notes Transformed</h2>
                    <p>
                        Turn your messy scribbles into beautiful, searchable documents with Meleys&apos; AI
                        integration.
                    </p>
                </aside>

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

                    <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
                        <label className="field">
                            <span>Email Address</span>
                            <div className="input-shell">
                                <MailIcon />
                                <input type="email" placeholder="name@company.com" aria-label="Email address" />
                            </div>
                        </label>

                        <label className="field field-password">
                            <span>Password</span>
                            <div className="input-shell">
                                <LockIcon />
                                <input type="password" value="••••••••" readOnly aria-label="Password" />
                                <button type="button" className="icon-button" aria-label="Show password">
                                    <EyeIcon />
                                </button>
                            </div>
                        </label>

                        <a href="/" className="forgot-link forgot-link--below" onClick={(event) => event.preventDefault()}>
                            Forgot?
                        </a>

                        <button type="button" className="primary-button" onClick={onLogin}>
                            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
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
            </section>

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
        </main>
    );
}
