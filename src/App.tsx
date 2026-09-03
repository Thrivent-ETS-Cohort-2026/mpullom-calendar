import { useEffect, useState } from "react";
import Landing from "./components/Landing";
import type { LandingProps, DashboardProps } from "./types/PropTypes";
import type { User } from "./types/DataTypes";
import Dashboard from "./components/Dashboard";

export default function App() {
  const dummyUser: User =
  {
    "email": "matt@mail.com",
    "password": "1234",
    "eventList": [2, 3],
    "id": 1
  }

const [loginStatus, toggleLogin] = useState<boolean>(false);
const [user, setUser] = useState<User>(dummyUser);

const landingProps: LandingProps = {
  callbackToggle: (toggle) => toggleLogin(toggle),
  callbackUser: (user) => setUser(user)
}

const dashboardProps: DashboardProps = {
  currentUser: user
}

useEffect(() => { handlePageSwitch }, [loginStatus])

function handlePageSwitch() {
  if (!loginStatus) {
    return <Landing {...landingProps} />
  } else {
    return <Dashboard {...dashboardProps}/>
  } 
}

return (
  <>
    {handlePageSwitch()}
  </>
)
}