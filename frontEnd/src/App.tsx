import React from "react";
import {
  Link,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import DefaultLayout from "./layout";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));

export default function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "*",
          element: <NoMatch />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

function NoMatch() {
  return (
    <div>
      <h2>Oops. Nothing to see here!</h2>
      <p>
        <Link to="/">Go to Dashboard</Link>
      </p>
    </div>
  );
}
