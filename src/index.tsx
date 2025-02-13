import * as ReactDOM from "react-dom/client" // Import from "react-dom/client"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "mobx-react"
import Utils from "./utils/utils"
import initializeStores from "./stores/storeInitializer"
import registerServiceWorker from "./registerServiceWorker"
import appDataService from "@services/appDataService"
import "./index.css"
import "./styles/custom-bootstrap.less"
import "./styles/custom-ant.less"
import "./styles/app.less"
import { ErrorBoundary } from "@components/ErrorBoundary"
import { ConfigProvider } from "antd"
import { ThemeConfig } from "antd/es/config-provider/context"

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#6ebac4",
    colorLink: "#6ebac4",
    colorPrimaryText: "#6ebac4",
    colorPrimaryTextActive: "#6ebac4",
  },
}

Utils.setLocalization()
appDataService.getAppConfiguration().then(async () => {
  const stores = initializeStores()
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  )
  root.render(
    <Provider {...stores}>
      <ConfigProvider theme={theme}>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  )

  registerServiceWorker()
})
