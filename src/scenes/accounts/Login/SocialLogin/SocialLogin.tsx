import { L } from "@lib/abpUtility"
import { Button } from "antd"
import React from "react"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth"
import AuthenticationStore from "@stores/authenticationStore"
import { useNavigate, useLocation } from "react-router-dom"
import { userLayout } from "@components/Layout/Router/router.config"
import { firebaseConfig } from "@lib/appconst"

interface Props {
  loginMethodsAllow: {
    allowSelfRegistration: boolean
    isAppleAuthenticatorEnabled: boolean
    isEmailProviderEnabled: boolean
    isGoogleAuthenticatorEnabled: boolean
    isMicrosoftAuthenticatorEnabled: boolean
    isSmsProviderEnabled: boolean
    useCaptchaOnRegistration: boolean
  }
  authenticationStore?: AuthenticationStore
  location?: any
}

const SocialLogin = (props: Props) => {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  auth.languageCode = "vi"

  const navigate = useNavigate()

  const location: any = useLocation()
  const handleLogin = async (body) => {
    const checkFirst = await props.authenticationStore!.checkSocial(body)
    if (checkFirst.state === 1) {
      await props.authenticationStore!.loginSocial(body)
      if (location?.state?.from.pathname === "/logout") {
        return (window.location.href = "/")
      }
      return (window.location =
        location.state && location.state.from.pathname !== "/"
          ? location.state.from.pathname
          : "/")
    } else if (checkFirst.state === 3) {
      navigate(userLayout.registerPhoneForSocial.path)
    }
  }
  const handleSignInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider()
    try {
      const result: any = await signInWithPopup(auth, googleProvider)
      const body = {
        authProvider: result.credential.signInMethod,
        providerKey: result.user.uid,
        providerAccessCode: result.user.accessToken,
      }
      await handleLogin(body)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAppleLogin = async () => {
    const appleProvider = new OAuthProvider("apple.com")
    appleProvider.addScope("email")
    appleProvider.addScope("name")
    try {
      const result: any = await signInWithPopup(auth, appleProvider)
      const body = {
        authProvider: result.providerId,
        providerKey: result.user.uid,
        providerAccessCode: result.user.accessToken,
      }
      await handleLogin(body)
    } catch (error) {
      console.error(error)
    }
  }
  const handleMicrosoftLogin = async () => {
    const microsoftProvider = new OAuthProvider("microsoft.com")
    microsoftProvider.addScope("mail.read")
    microsoftProvider.addScope("calendars.read")
    try {
      const result: any = await signInWithPopup(auth, microsoftProvider)
      const body = {
        authProvider: result.providerId,
        providerKey: result.user.uid,
        providerAccessCode: result.user.accessToken,
      }
      await handleLogin(body)
    } catch (error) {
      console.error(error)
    }
  }

  const GoogleIcon = (
    <img src="/assets/icons/GoogleIcon.svg" height="20px" className="mx-3" />
  )
  const AppleIcon = (
    <img src="/assets/icons/AppleIcon.svg" height="20px" className="mx-3" />
  )
  const MicrosoftIcon = (
    <img src="/assets/icons/MicrosoftIcon.svg" height="20px" className="mx-3" />
  )

  const notAllowSocialLogin = [
    props.loginMethodsAllow.isAppleAuthenticatorEnabled,
    props.loginMethodsAllow.isGoogleAuthenticatorEnabled,
    props.loginMethodsAllow.isMicrosoftAuthenticatorEnabled,
  ].every((method) => method === false)
  return (
    <div className="text-center w-100">
      {props.loginMethodsAllow.isAppleAuthenticatorEnabled && (
        <div className="d-inline-block  w-100 mx-1">
          <Button
            shape="round"
            icon={AppleIcon}
            className="w-100 my-1 text-left"
            onClick={() => handleAppleLogin()}
          >
            {L("CONTINUE_WITH_APPLE")}
          </Button>
        </div>
      )}
      {props.loginMethodsAllow.isGoogleAuthenticatorEnabled && (
        <div className="d-inline-block w-100 mx-1">
          <Button
            shape="round"
            icon={GoogleIcon}
            className="w-100 my-1 text-left"
            onClick={() => handleSignInWithGoogle()}
          >
            {L("CONTINUE_WITH_GOOGLE")}
          </Button>
        </div>
      )}
      {props.loginMethodsAllow.isMicrosoftAuthenticatorEnabled && (
        <div className="d-inline-block  w-100 mx-1">
          <Button
            shape="round"
            icon={MicrosoftIcon}
            className="w-100 my-1 text-left"
            onClick={() => handleMicrosoftLogin()}
          >
            {L("CONTINUE_WITH_MICROSOFT")}
          </Button>
        </div>
      )}
      {!notAllowSocialLogin && <div className="w-100 border my-3" />}
    </div>
  )
}

export default SocialLogin
