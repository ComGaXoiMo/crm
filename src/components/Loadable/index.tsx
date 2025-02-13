import React, { Suspense, lazy } from "react"
import Loading from "./../Loading/index"

const LoadableComponent = (importFunc: any) => {
  const LazyComponent = lazy(importFunc)
  return (props: any) => (
    <Suspense fallback={<Loading />}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

export default LoadableComponent
