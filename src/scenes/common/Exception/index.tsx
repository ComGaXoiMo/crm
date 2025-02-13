import "./index.less"
import React, { useState, useEffect } from "react"
import { Button, Image, Row } from "antd"
import { useNavigate, useLocation } from "react-router-dom"
import error401 from "../../../assets/images/401.png"
import error404 from "../../../assets/images/404.png"
import error500 from "../../../assets/images/500.png"
import underMaintenance from "../../../assets/images/under-maintenance.png"
import { L } from "@lib/abpUtility"

const exceptions = {
  undefined: {
    errorCode: "UNHANDLED_ERROR",
    errorImg: error404,
    errorTitle: "UNHANDLED_ERROR_TITLE",
  },
  "404": {
    errorCode: "404",
    errorImg: error404,
    errorTitle: "404_ERROR_TITLE",
  },
  "401": {
    errorCode: "401",
    errorImg: error401,
    errorTitle: "401_ERROR_TITLE",
  },
  "500": {
    errorCode: "500",
    errorImg: error500,
    errorTitle: "500_ERROR_TITLE",
  },
}

const Exception: React.FC<{ fromErrorBoundary?: boolean }> = ({
  fromErrorBoundary,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [exception, setException] = useState<any>({})

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const type = params.get("type") || "undefined"
    setException(exceptions[type] || {})
    console.log(exception)
  }, [location.search])

  const handleBack = () => {
    if (fromErrorBoundary) {
      window.location.reload()
    } else {
      navigate("/")
    }
  }

  return (
    <Row style={{ marginTop: 120 }} gutter={[16, 16]}>
      <div className="w-100 d-flex flex-column align-items-center">
        <div className="ml-3">
          <Image preview={false} width="328px" src={underMaintenance} />
        </div>
        <div style={{ fontWeight: 700, fontSize: 36 }}>Under Maintenance</div>
        <div>
          The page you are looking for is currently under maintenance and will
          be back soon.
        </div>
        <Button type="primary" onClick={handleBack}>
          {L("BACK")}
        </Button>
      </div>
    </Row>
  )
}

export default Exception
