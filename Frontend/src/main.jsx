import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { HomePage, SignUpPage, SignInPage, VideoUploadPage, ProfilePage } from './pages'
import {VideoPlayer} from './components'



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <HomePage/>
      },
      {
        path : "register",
        element: <SignUpPage/>
      },
      {
        path: "login",
        element: <SignInPage/>
      },
      {
        path: "upload",
        element:<VideoUploadPage/>
      },
      {
        path: "/videos/v/:videoId",
        element: <VideoPlayer/>
      },
      {
        path: "/current-user",
        element:<ProfilePage/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </>,
)
