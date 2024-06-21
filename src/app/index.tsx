import { router } from 'routes';
import "./index.scss"

import { withProviders } from "./providers";
import { RouterProvider } from 'react-router-dom';

export const App = withProviders(() => {
  return (
    <div className="app">
        <RouterProvider router={router}/>
    </div>
  )
})
