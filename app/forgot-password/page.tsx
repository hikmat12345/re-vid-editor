import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center text-center">
                    <Link href="/">
                        <img src="/logos/header.png" alt="Neuclip Logo" className="h-12 w-auto mb-6" />
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Reset password</h1>
                    <p className="mt-2 text-sm text-zinc-400">
                        Enter your email to receive a password reset link
                    </p>
                </div>

                <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Forgot Password</CardTitle>
                        <CardDescription className="text-zinc-400">
                            We&apos;ll send you an email with instructions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:ring-zinc-700"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full bg-white text-black hover:bg-zinc-200 transition-all font-semibold py-6">
                            Send Reset Link
                        </Button>
                        <Link
                            href="/login"
                            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to Sign In
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
