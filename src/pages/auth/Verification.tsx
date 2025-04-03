
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { REQUIRE_EMAIL_VERIFICATION } from "@/context/AuthContext";

const Verification = () => {
  return (
    <div className="min-h-screen bg-[#F2FCE2] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link to="/" className="flex items-center gap-2 mb-6 text-[#221F26] hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"></path>
            <path d="M19 12H5"></path>
          </svg>
          Back to home
        </Link>

        <Card className="border-[#E8F5E9] shadow-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D724D]">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <CardTitle className="font-serif text-2xl">
              {REQUIRE_EMAIL_VERIFICATION ? "Check Your Email" : "Account Created"}
            </CardTitle>
            <CardDescription>
              {REQUIRE_EMAIL_VERIFICATION 
                ? "We've sent a verification link to your email address"
                : "Your account has been successfully created"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {REQUIRE_EMAIL_VERIFICATION ? (
              <>
                <p className="text-gray-600">
                  Please click on the verification link in the email we just sent you to complete your registration.
                </p>
                <p className="text-sm text-gray-500">
                  If you don't see the email in your inbox, please check your spam folder.
                </p>
              </>
            ) : (
              <p className="text-gray-600">
                Email verification is currently disabled. You can proceed to login with your credentials.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {REQUIRE_EMAIL_VERIFICATION && (
              <Button variant="link" className="text-[#4D724D]">
                Resend verification email
              </Button>
            )}
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
              {REQUIRE_EMAIL_VERIFICATION ? "Return to login" : "Proceed to login"}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Verification;
