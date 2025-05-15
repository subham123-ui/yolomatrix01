"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import Logo from "@/components/logo"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api-client"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [agreeToMarketing, setAgreeToMarketing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { t } = useLanguage()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error when user starts typing again
    if (error) setError("")
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form first
    if (formData.password !== formData.confirmPassword) {
      setError(t("signup.passwordsDoNotMatch"))
      return
    }
    
    if (!agreeToTerms) {
      setError(t("signup.mustAgreeToTerms"))
      return
    }
    
    try {
      setIsLoading(true)
      setError("")
      
      // Prepare data for API - match the backend expected format
      const apiData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        agreeTerm: agreeToTerms,
        agreeMarketing: agreeToMarketing
      }

      console.log("Sending registration request with data:", apiData);

      // Use the authAPI client instead of direct fetch
      const { data } = await authAPI.register(apiData);
      
      console.log("Success response:", data);
      
      // Successful registration
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        router.push("/dashboard"); // Redirect to dashboard if token is provided
      } else {
        router.push("/login"); // Redirect to login if no token
      }
      
    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle different types of errors
      if (err.message === 'Network error. Please check your connection and try again.') {
        setError("Cannot connect to the server. Please check your internet connection and try again.");
      } else if (err.message === 'Request timeout. Please try again.') {
        setError("The request took too long to complete. Please try again.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Password strength checker (basic example)
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "" }
    
    let strength = 0
    // Add points based on criteria
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    
    let text = ""
    if (strength === 1) text = t("signup.passwordWeak")
    else if (strength === 2) text = t("signup.passwordMedium")
    else if (strength === 3) text = t("signup.passwordGood")
    else if (strength === 4) text = t("signup.passwordStrong")
    
    return { strength, text }
  }
  
  const passwordStrength = getPasswordStrength(formData.password)
  const passwordsMatch = formData.password && formData.confirmPassword && 
    formData.password === formData.confirmPassword

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-950">
      
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo className="w-[150px] h-auto" />
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
            {/* Title */}
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              {t("signup.createAccount")}
            </h1>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields - Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("signup.firstName")}
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 focus:ring-blue-600 dark:focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("signup.lastName")}
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 focus:ring-blue-600 dark:focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("signup.email")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 focus:ring-blue-600 dark:focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("signup.password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 focus:ring-blue-600 dark:focus:ring-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-300",
                            passwordStrength.strength === 1 && "bg-red-500 w-1/4",
                            passwordStrength.strength === 2 && "bg-yellow-500 w-1/2",
                            passwordStrength.strength === 3 && "bg-blue-500 w-3/4",
                            passwordStrength.strength === 4 && "bg-green-500 w-full"
                          )}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {passwordStrength.text}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("signup.confirmPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={cn(
                      "w-full rounded-lg border-gray-300 dark:border-gray-700 focus:ring-blue-600 dark:focus:ring-blue-500 pr-10",
                      formData.confirmPassword && !passwordsMatch && "border-red-500 dark:border-red-500"
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-sm text-red-500 dark:text-red-400">
                    {t("signup.passwordsDoNotMatch")}
                  </p>
                )}
              </div>
              
              {/* Terms and Marketing Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={setAgreeToTerms}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    {t("signup.agreeToTerms")}
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={agreeToMarketing}
                    onCheckedChange={setAgreeToMarketing}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="marketing"
                    className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    {t("signup.agreeToMarketing")}
                  </Label>
                </div>
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    {t("common.loading")}
                  </>
                ) : (
                  t("signup.createAccount")
                )}
              </Button>
            </form>
            
            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              {t("signup.alreadyHaveAccount")}{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {t("signup.signIn")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}