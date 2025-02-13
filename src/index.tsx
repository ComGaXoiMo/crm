import * as React from "react"
import * as ReactDOM from "react-dom"

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

Utils.setLocalization()
appDataService.getAppConfiguration().then(async () => {
  const stores = initializeStores()
  ReactDOM.render(
    <Provider {...stores}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>,
    document.getElementById("root") as HTMLElement
  )

  registerServiceWorker()
})
