import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import ChatMirac from "./pages/ChatMirac";
import ChatSefa from "./pages/ChatSefa";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,

      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "",
          element: <Home />,
        },
        {
          path: "chat-mirac",
          element: <ChatMirac />,
        },
        {
          path: "chat-sefa",
          element: <ChatSefa />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
