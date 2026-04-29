import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import routes from "../utils/routes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, i) => {
          if (route.children && route.children.length > 0) {
            return (
              <Route key={i} path={route.path} element={route.element}>
                {route.children.map((child, j) => (
                  <Route key={j} path={child.path} element={child.element} />
                ))}
              </Route>
            );
          }
          return <Route key={i} path={route.path} element={route.element} />;
        })}
        {/* Catch-all redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}