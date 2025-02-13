import { useHistory, useLocation, useParams } from "react-router-dom"

export default function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const location = useLocation()
    const history = useHistory()
    const params = useParams()
    return (
      <Component
        {...props}
        location={location}
        params={params}
        history={history}
      />
    )
  }

  return ComponentWithRouterProp
}
