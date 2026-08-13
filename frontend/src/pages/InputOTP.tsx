import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useVerifyVerificationCode, useSendVerificationCode } from "@/hooks/useUserQueries"
import toast from "react-hot-toast"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/components/ui/input-otp"

export function OTPPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const [otp, setOtp] = useState("")

    const { mutate: verifyCode, isPending: isVerifying } = useVerifyVerificationCode()
    const { mutate: sendCode, isPending: isSending } = useSendVerificationCode()

    const email = location.state?.email

    useEffect(() => {
        if (!email) {
            navigate("/signup")
            return
        }
    }, [email, navigate])

    const handleResendCode = () => {
        sendCode(email, {
            onSuccess: () => {
                toast.success("Verification code sent successfully!")
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || "Failed to send code")
            }
        })
    }

    const handleVerify = () => {
        if (otp.length !== 6) {
            toast.error("Please enter a 6-digit code")
            return
        }

        const otpNumber = parseInt(otp, 10)

        if (isNaN(otpNumber)) {
            toast.error("Invalid verification code")
            return
        }

        verifyCode(
            { email, providedCode: otpNumber },
            {
                onSuccess: (res: any) => {
                    // Show success toast with longer duration
                    toast.success(res?.message || "Email verified successfully!", {
                        duration: 3000, // 3 seconds
                    })

                    // Wait longer before navigation to ensure user sees the toast
                    setTimeout(() => {
                        navigate("/signin", {
                            state: { 
                                message: "Your account has been verified. Please sign in.",
                                showToast: true // Add flag for signin page to show toast
                            },
                        })
                    }, 2000) // 2 seconds delay
                },
                onError: (err: any) => {
                    console.error("Verification error:", err); // Add console log for debugging
                    toast.error(err?.response?.data?.message || "Verification failed")
                    setOtp("")
                },
            }
        )
    }

    if (!email) {
        return null
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="space-y-4 text-center pb-2">
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            Verify Your Email
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Enter the 6-digit code sent to{" "}
                            <span className="font-medium text-foreground">{email}</span>
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="flex justify-center">
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(value) => setOtp(value)}
                            disabled={isVerifying}
                            autoFocus
                        >
                            <InputOTPGroup className="gap-2">
                                <InputOTPSlot index={0} className="w-12 h-12 text-lg border-2" />
                                <InputOTPSlot index={1} className="w-12 h-12 text-lg border-2" />
                                <InputOTPSlot index={2} className="w-12 h-12 text-lg border-2" />
                                <InputOTPSeparator />
                                <InputOTPSlot index={3} className="w-12 h-12 text-lg border-2" />
                                <InputOTPSlot index={4} className="w-12 h-12 text-lg border-2" />
                                <InputOTPSlot index={5} className="w-12 h-12 text-lg border-2" />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        {otp === "" ? (
                            <>Enter your verification code</>
                        ) : (
                            <>You entered: <span className="font-mono font-bold text-foreground">{otp}</span></>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex-col gap-4 pt-4">
                    <Button
                        className="w-full bg-primary hover:bg-primary/90 h-11 text-sm font-medium"
                        onClick={handleVerify}
                        disabled={isVerifying || otp.length !== 6}
                    >
                        {isVerifying ? "Verifying..." : "Verify Email"}
                    </Button>

                    <div className="text-center">
                        <Button
                            variant="link"
                            className="text-sm text-primary hover:text-primary/80"
                            onClick={handleResendCode}
                            disabled={isSending}
                        >
                            {isSending ? "Sending..." : "Didn't receive code? Resend"}
                        </Button>
                    </div>

                    <div className="text-center">
                        <Button
                            variant="link"
                            className="text-sm text-muted-foreground hover:text-foreground"
                            onClick={() => navigate("/signup")}
                        >
                            Use different email
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}