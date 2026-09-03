import { useEffect, useState } from "react";
import Landing from "./components/Landing";
import type { LandingProps } from "./types/PropTypes";
import type { User } from "./types/DataTypes";

export default function App() {
  const dummyUser: User =
  {
    "email": "calvin@mail.com",
    "password": "1234",
    "id": 1,
  }

const [loginStatus, toggleLogin] = useState<boolean>(false);
const [user, setUser] = useState<User>(dummyUser);

const landingProps: LandingProps = {
  callbackToggle: (toggle) => toggleLogin(toggle),
  callbackUser: (user) => setUser(user)
}

useEffect(() => { handlePageSwitch }, [loginStatus])

function handlePageSwitch() {
  if (!loginStatus) {
    return <Landing {...landingProps} />
  } else {
  }
}

return (
  <>
    {handlePageSwitch()}
  </>
)
}