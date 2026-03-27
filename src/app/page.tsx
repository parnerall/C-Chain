"use client";
import React, { useState } from 'react';
import { LandingPage } from '@/components/auth/landing-page';
import { RegistrationForm } from '@/components/auth/registration-form';
import { Dashboard } from '@/components/dashboard/dashboard';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { LoginForm } from '@/components/auth/login-form';
import { EmailVerificationScreen } from '@/components/auth/email-verification-screen';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const [authView, setAuthView] = useState<'landing' | 'register' | 'login'>('landing');

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setAuthView('landing'); 
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>A carregar...</p>
      </div>
    );
  }
  
  if (user) {
    // If user is logged in, check if email is verified
    if (!user.emailVerified && !user.isAnonymous) {
      return <EmailVerificationScreen onLogout={handleLogout} />;
    }
    // If verified or anonymous, show dashboard
    return <Dashboard onLogout={handleLogout} />;
  }

  switch(authView) {
    case 'register':
      return <RegistrationForm onComplete={() => setAuthView('login')} onLoginClick={() => setAuthView('login')} />;
    case 'login':
      return <LoginForm onBack={() => setAuthView('landing')} onRegisterClick={() => setAuthView('register')} />;
    default:
      return <LandingPage onRegister={() => setAuthView('register')} onLogin={() => setAuthView('login')} />;
  }
}
