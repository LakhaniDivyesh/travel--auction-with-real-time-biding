import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
// import Navbar from "./components/Navbar";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Page404 from "./components/Page404";
import Protected from "./utils/protected.config";
import Navbar from "./components/Navbar";
import { DarkModeContextProvider } from "./Context/DarkMode";
import Provider from "./components/Provider";
import AddPackage from "./components/AddPackage";
import ViewDetails from "./components/ViewDetails";
import Auction from "./components/Auction";
import MyBid from "./components/MyBid";
import MyProfile from "./components/MyProfile";

import socketIO from 'socket.io-client';

function App() {

  // var user = JSON.parse(localStorage.getItem('user') || '[]');
  // return (
  //   <BrowserRouter>
  //     {/* <Navbar/> */}
  //     <Routes>
  //       <Route path="/login" element={[<Login />]} />
  //       <Route path="/signup" element={[<Signup />]} />
  //       <Route path="/" element={
  //         <Protected>
  //           <Navbar /><Home />
  //         </Protected>
  //       } />

  //       <Route path="/add-post" element={
  //         <Protected>
  //           <Navbar /><AddPost />
  //         </Protected>
  //       } />

  //       <Route path="/post-details/:username/:post_id" element={[<ViewPost />]} />
  //       <Route path="*" element={[<Page404 />]} />
  //     </Routes>
  //   </BrowserRouter>
  // );

  //socket.io
  
const socket = socketIO.connect('http://localhost:3051');

  const Layout = () => {
    return (
      <div>
        <DarkModeContextProvider>
          <Navbar />
          <Outlet />
        </DarkModeContextProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Protected>
              <Layout />
          </Protected>
        </>
      ),
      children: [
        {
          path: "/",
          element: [<Home />],
        },
        {
          path: "/provider",
          element: [<Provider />],
        },
        {
          path: "/add-package",
          element: [<AddPackage />],
        },
        {
          path: "/view-details",
          element: [<ViewDetails />],
        },
        {
          path: "/auction",
          element: [<Auction  socket={socket}/>],
        },
        {
          path: "/my-bid",
          element: [<MyBid />],
        },
        {
          path: "/my-profile",
          element: [<MyProfile />],
        }
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    { 
      path:"*",
      element:<Page404 /> 
    }
  ]);

  return <RouterProvider router={router} />;

}

export default App;
