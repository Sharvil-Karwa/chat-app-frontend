import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Chat from "./components/Chat";
import Room from "./pages/Room";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/chats",
        element: <Chat />,
      },
      {
        path: "/room/:roomId",
        element: <Room />,
      },
    ],
  },
]);
export default router;
