import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both username and password',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);

    if (success) {
      toast({
        title: 'Welcome!',
        description: 'You have successfully logged in',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mb-8">
            <span className="text-3xl font-bold">M</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">MicroFinance Pro</h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Complete loan management solution for microfinance institutions. Manage borrowers, track loans, and streamline collections.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-primary-foreground/10">
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm text-primary-foreground/70">Active Loans</p>
            </div>
            <div className="p-4 rounded-xl bg-primary-foreground/10">
              <p className="text-2xl font-bold">₹2.5Cr</p>
              <p className="text-sm text-primary-foreground/70">Total Disbursed</p>
            </div>
            <div className="p-4 rounded-xl bg-primary-foreground/10">
              <p className="text-2xl font-bold">98%</p>
              <p className="text-sm text-primary-foreground/70">Collection Rate</p>
            </div>
            <div className="p-4 rounded-xl bg-primary-foreground/10">
              <p className="text-2xl font-bold">15</p>
              <p className="text-sm text-primary-foreground/70">Team Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">M</span>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 mt-6" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs">
                <p><span className="font-medium">Admin:</span> admin / admin123</p>
                <p><span className="font-medium">Staff:</span> staff1 / staff123</p>
                <p><span className="font-medium">Agent:</span> agent1 / agent123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
