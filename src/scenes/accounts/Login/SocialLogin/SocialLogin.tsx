import { L } from "@lib/abpUtility"
import { Button, Spin } from "antd"
import React, { useEffect } from "react"
import firebase from "firebase/app"
import "firebase/auth"
import { firebaseConfig } from "@lib/appconst"
import AuthenticationStore from "@stores/authenticationStore"
import { useHistory, useLocation } from "react-router-dom"
import { userLayout } from "@components/Layout/Router/router.config"

interface Props {
  loginMethodsAllow: {
    allowSelfRegistration: boolean;
    isAppleAuthenticatorEnabled: boolean;
    isEmailProviderEnabled: boolean;
    isGoogleAuthenticatorEnabled: boolean;
    isMicrosoftAuthenticatorEnabled: boolean;
    isSmsProviderEnabled: boolean;
    useCaptchaOnRegistration: boolean;
  };
  authenticationStore?: AuthenticationStore;
  location?: any;
}

const SocialLogin = (props: Props) => {
  const [loading, setIsLoading] = React.useState(false)
  useEffect(() => {
    if (!firebase.apps.length) initFireBase()
  }, [])
  const history = useHistory()

  const initFireBase = () => {
    firebase.initializeApp(firebaseConfig)
    firebase.auth().languageCode = "vi"
    setIsLoading(false)
  }
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
      history.push(userLayout.registerPhoneForSocial.path)
    }
  }
  const handleSignInWithGoogle = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then(async (result: any) => {
        const body = {
          authProvider: result.credential.signInMethod,
          providerKey: result.user.uid,
          providerAccessCode: result.user.Aa,
        }
        await handleLogin(body)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const handleAppleLogin = () => {
    const appleProvider = new firebase.auth.OAuthProvider("apple.com")
    appleProvider.addScope("email")
    appleProvider.addScope("name")
    firebase
      .auth()
      .signInWithPopup(appleProvider)
      .then(async (result: any) => {
        const body = {
          authProvider: result.credential.signInMethod,
          providerKey: result.user.uid,
          providerAccessCode: result.user.Aa,
        }
        await handleLogin(body)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const handleMicrosoftLogin = () => {
    const microsoftProvider = new firebase.auth.OAuthProvider("microsoft.com")
    microsoftProvider.addScope("mail.read")
    microsoftProvider.addScope("calendars.read")
    firebase
      .auth()
      .signInWithPopup(microsoftProvider)
      .then(async (result: any) => {
        const body = {
          authProvider: result.credential.signInMethod,
          providerKey: result.user.uid,
          providerAccessCode: result.user.Aa,
        }
        await handleLogin(body)
      })
      .catch((error) => {
        console.log(error)
      })
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
  return loading ? (
    <Spin />
  ) : (
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
