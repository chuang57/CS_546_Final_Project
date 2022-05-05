import Input from "../components/Input";

export default function SignUp() {
  const signupHandler = (e) => {
    e.preventDefault();
    const email = e.target.Email.value;
    const username = e.target.Username.value;
    const password = e.target.Password.value;
    const phonenumber = e.target.Phonenumber.value;
    const city = e.target.City.value;
    const gender = e.target.Gender.value;
    console.log(email);
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        email,
        username,
        password,
        phonenumber,
        city,
        gender,
      }),
    }).catch((e) => {
      console.log(e);
    });
  };
  return (
    <div>
      <form onSubmit={signupHandler}>
        <Input name="Email" required />
        <Input name="Username" required />
        <Input name="Password" required />
        <Input name="Phonenumber" />
        <Input name="City" />
        <Input name="Gender" required />

        <button type="submit">signup</button>
      </form>
      <a href="/">"Already have an account? Click here to log-in"</a>
    </div>
  );
}
