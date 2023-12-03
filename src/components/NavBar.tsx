import { Button } from "@tremor/react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface NavBarProps {
  displayLoginRegister?: boolean;
}

const NavBar = ({ displayLoginRegister }: NavBarProps) => {
  const navigate = useNavigate();

  const isOnDashboard = useMemo(() => window.location.pathname === "/dashboard", []);
  return (
    <div className="flex justify-center w-full">
      <div className="flex items-center justify-between w-4/5 h-14">
        <div className="text-4xl font-extrabold text-tremor-metric text-tremor-brand">
          IoT Dashboard
        </div>
        {displayLoginRegister !== false ? (
          <div className="flex">
            <Button size="lg" className="mr-8" onClick={() => navigate("/login")}>
              Log in
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate("/register")}>
              Register
            </Button>
          </div>
        ) : (
          <div className="flex">
            <Button
              size="lg"
              className="mr-8"
              variant={isOnDashboard ? "primary" : "secondary"}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              size="lg"
              variant={!isOnDashboard ? "primary" : "secondary"}
              onClick={() => navigate("/insights")}
            >
              Insights
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
