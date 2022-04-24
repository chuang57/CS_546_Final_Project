import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
  const navigate = useNavigate();
  const signinHandler = (e) => {
    e.preventDefault();
    const email = e.target.Email.value;
    const password = e.target.Password.value;

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(() => {
        navigate("/");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div>
      <form onSubmit={signinHandler}>
        <Input name="Email" required />
        <Input name="Password" required />

        <button type="submit">login</button>
      </form>
      <a href="/sign-up">Need to creat ID?</a>
    </div>
  );
}
