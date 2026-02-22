import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EyeOff, Eye, LogIn } from 'lucide-react';
import logoPrimary from '@/assets/logo-primary.png';

const LoginPage = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) setError(err);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo Area */}
        <div className="text-center mb-8">
          <img src={logoPrimary} alt="Akhand Jyoti Eye Hospital" className="w-32 h-32 mx-auto mb-2 object-contain" />
          <p className="text-sm text-muted-foreground mt-1">
            Eye Outreach Program
          </p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="pb-4 pt-6 px-6">
            <h2 className="text-lg font-semibold text-foreground text-center">Staff Login</h2>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="staff@akhandjyoti.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full h-11" disabled={loading}>
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? 'Signing in...' : 'Login'}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Authorized personnel only
            </p>
          </CardContent>
        </Card>

        <p className="text-[10px] text-muted-foreground text-center mt-6">
          A Unit of Yugrishi Shriram Sharma Acharya Charitable Trust
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
