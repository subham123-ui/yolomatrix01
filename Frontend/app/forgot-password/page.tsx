"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/language-context"
import Logo from "@/components/logo"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const { theme } = useTheme()
  const { t } = useLanguage()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle password reset logic here
    console.log("Password reset request for:", email)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header with Back Button */}
      <div className="p-4">
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("back")}
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo className="w-[150px] h-auto" />
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
            {!submitted ? (
              <>
                {/* Reset Password Form */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t("forgotPassword.title")}
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {t("forgotPassword.description")}
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("forgotPassword.email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("forgotPassword.emailPlaceholder")}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-700 focus:ring-blue-600 dark:focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    {t("forgotPassword.resetButton")}
                  </Button>
                </form>
              </>
            ) : (
              <>
                {/* Success Message */}
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t("forgotPassword.checkEmail")}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t("forgotPassword.emailSent").replace("{email}", email)}
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="w-full py-5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {t("forgotPassword.tryDifferentEmail")}
                    </Button>
                    <Link href="/login">
                      <Button
                        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        {t("forgotPassword.backToLogin")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
            
            {/* Return to Login */}
            {!submitted && (
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("forgotPassword.rememberedPassword")}{" "}
                  <Link 
                    href="/login" 
                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    {t("forgotPassword.signIn")}
                  </Link>
                </p>
              </div>
            )}
          </div>
          
          {/* Help Section */}
          {!submitted && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("forgotPassword.needHelp")}{" "}
                <Link 
                  href="/contact" 
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  {t("forgotPassword.contactSupport")}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}