import { FormEvent, useState } from "react";
import { Button, TextInput } from "@tremor/react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formError, setFormError] = useState<string>();
  const navigate = useNavigate();

  const handleResponseStatus = (httpCode: number) => {
    if (httpCode === 200) {
      navigate("/dashboard");
    }
    if (httpCode === 409) {
      setFormError("User already exists, try to log in");
    }
    if (httpCode === 500) {
      setFormError("Something went wrong, try again");
    }
  };

  const handleRegistration = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(undefined);
    const response = await fetch(import.meta.env.VITE_REGISTER_FUNCTION_URL, {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, password, email }),
    });
    handleResponseStatus(response.status);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Registration</h2>
        <form onSubmit={handleRegistration}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">First Name</label>
            <TextInput
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">Last Name</label>
            <TextInput
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
            <TextInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">Password</label>
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
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
