import React from "react";
import { BrandPanel } from "../auth/BrandPanel";
import { AuthPanel } from "../auth/AuthPanel";

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[2fr_1.8fr] pl-8">
      <div className="hidden lg:block">
        <BrandPanel />
      </div>
      <AuthPanel onLogin={onLogin} />
    </div>
  );
};