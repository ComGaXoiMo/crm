import Input6VerifyCode from "@components/Inputs/InputVerifyCode/Input6VerifyCode"
import PhoneInput from "@components/Inputs/PhoneInput/PhoneInput"
import { L } from "@lib/abpUtility"
import { firebaseConfig, StepOTPVariable } from "@lib/appconst"
import { Button, Modal, Row, Col, Form } from "antd"
import React from "react"
import firebase from "firebase"
import tokenAuthService from "@services/tokenAuth/tokenAuthService"
import { notifyError } from "@lib/helper"

interface Props {
  visible: boolean;
  handleClose: () => void;
  phoneNumberAsUserName: string;
  handleChangeUsername: (values) => void;
}

const ModalChangePhoneNumber = (props: Props) => {
  const [stepOTP, setStepOTP] = React.useState(StepOTPVariable.newPhoneNumber)
  const [newOTPCode, setNewOTPCode] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")
  const [formPhoneNumber] = Form.useForm()
  const [verifyId, setVerifyId] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  React.useEffect(() => {
    initRecapt()
  }, [props.phoneNumberAsUserName, props.visible])

  const initFireBase = () => {
    firebase.initializeApp(firebaseConfig)
    firebase.auth().languageCode = "vi"
  }

  const initRecapt = async () => {
    return // Return because not using in this app ! == Long ==
    if (!firebase.apps.length) initFireBase()
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptButton",
      {
        size: "invisible",
      }
    )
  }
  const handleSendNewOTP = async (handleSuccess) => {
    setLoading(true)
    const values = await formPhoneNumber.validateFields()
    const phoneNumber = values.prefix + values.phoneNumber
    const res = await tokenAuthService.checkPhoneNumber(phoneNumber)
    if (res.state) {
      if (res.state === 1) {
        notifyError(L("PHONE_NUMBER_ALREADY_EXIST"), "")
      } else {
        const applicationVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
          }
        )
        const provider = new firebase.auth.PhoneAuthProvider()
        await provider
          .verifyPhoneNumber(phoneNumber, applicationVerifier)
          .then(function (verificationId) {
            setVerifyId(verificationId)
          })
          .then(() => handleSuccess())
          .catch((error) => {
            setErrorMessage(error.message)
            window.recaptchaVerifier.render().then(function (widgetId) {
              grecaptcha.reset(widgetId)
            })
          })
      }
    }
    setLoading(false)
  }
  const handleUpdatePhoneNumber = async () => {
    setLoading(true)
    const phoneCredential = firebase.auth.PhoneAuthProvider.credential(
      verifyId,
      newOTPCode
    )
    return firebase
      .auth()
      .signInWithCredential(phoneCredential)
      .then((user: any) => {
        if (user.user.Aa)
          props.handleChangeUsername({
            idToken: user.user.Aa,
            phoneNumber: user.user.phoneNumber,
          })
        setLoading(false)
      })
      .catch((error) => {
        setErrorMessage(error.message)
        setLoading(false)
        window.recaptchaVerifier.render().then(function (widgetId) {
          grecaptcha.reset(widgetId)
        })
      })
  }
  return (
    <Modal
      title={L("SET_UP_NEW_PHONE_NUMBER_AS_USER_NAME")}
      visible={props.visible}
      footer={
        <>
          {stepOTP === StepOTPVariable.otpNewPhone && (
            <Button
              loading={loading}
              type="primary"
              onClick={async () => {
                handleUpdatePhoneNumber()
              }}
            >
              {L("VERIFY_CODE")}
            </Button>
          )}
          {stepOTP === StepOTPVariable.newPhoneNumber && (
            <Button
              loading={loading}
              type="primary"
              id="recaptButton"
              onClick={() =>
                handleSendNewOTP(() => setStepOTP(StepOTPVariable.otpNewPhone))
              }
            >
              {L("SEND_VERIFY_CODE")}
            </Button>
          )}
          <Button
            onClick={() => {
              setStepOTP(StepOTPVariable.newPhoneNumber)
              props.handleClose()
            }}
          >
            {L("BTN_CLOSE")}
          </Button>
        </>
      }
      centered
      closable={false}
    >
      <div className="w-100">
        <div className="text-danger w-100" id="recaptcha-container">
          {errorMessage}
        </div>
        {stepOTP === StepOTPVariable.newPhoneNumber && (
          <Row>
            <Col span={24}>
              <Form form={formPhoneNumber} layout="vertical">
                <PhoneInput onChange={() => console.log("login")} />
              </Form>
            </Col>
          </Row>
        )}
        {stepOTP === StepOTPVariable.otpNewPhone && (
          <Row>
            <Col span={24}>
              <Input6VerifyCode onChange={setNewOTPCode} />
            </Col>
          </Row>
        )}
      </div>
    </Modal>
  )
}

export default ModalChangePhoneNumber
