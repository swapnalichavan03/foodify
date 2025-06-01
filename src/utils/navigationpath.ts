export interface navigationpathProps {
    signin: string,
    signup: string,
    userfind: string,
    otpverify: string,
    forgotpassword: string,
}

export const navigationpath: navigationpathProps = {
    signin: "auth/signin",
    signup: "auth/signup",
    userfind: "otp/verification",
    otpverify: "forgot/password",
    forgotpassword: "user/find"
}