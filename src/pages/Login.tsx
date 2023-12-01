import { FormEvent, useState } from "react";
import { TextInput, Button } from "@tremor/react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string>();
  const navigate = useNavigate();
  const { setToken } = useToken();

  const handleResponseStatus = (httpCode: number) => {
    if (httpCode === 200) {
      navigate("/dashboard");
    }
    if (httpCode === 400) {
      setFormError("Wrong credentials, try again");
    }
    if (httpCode === 500) {
      setFormError("Something went wrong, try again");
    }
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(undefined);
    const response = await fetch(import.meta.env.VITE_LOGIN_FUNCTION_URL, {
      method: "POST",
      body: JSON.stringify({ password, email }),
    });
    const data = await response.json();
    const token = data?.user?.token;
    if (token) setToken({ token });
    handleResponseStatus(response.status);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="mb-4 text-2xl font-semibold">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">Email</label>
            <TextInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">Password</label>
            <TextInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <span className="text-red-500">{formError}</span>
          <Button type="submit" className="w-full mt-8">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
