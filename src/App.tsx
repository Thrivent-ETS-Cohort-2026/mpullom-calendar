import { useEffect, useState } from "react";
import Landing from "./components/Landing";
import type { LandingProps, DashboardProps } from "./types/PropTypes";
import type { User } from "./types/DataTypes";
import Dashboard from "./components/Dashboard";

export default function App() {
  const dummyUser: User =
  {
    "name": "Dummy",
    "email": "dummy@mail.com",
    "password": "1234",
    "eventList": [2, 3],
    "iRequests": [1],
    "id": 1
  }

  const [loginStatus, toggleLogin] = useState<boolean>(false);
  const [user, setUser] = useState<User>(dummyUser);

  const landingProps: LandingProps = {
    callbackToggle: (toggle) => toggleLogin(toggle),
    callbackUser: (user) => setUser(user)
  }

  const dashboardProps: DashboardProps = {
    currentUser: user,
    callbackAssignEvent: assignEvent
  }

  useEffect(() => { handlePageSwitch }, [loginStatus])

  function handlePageSwitch() {
    if (!loginStatus) {
      return <Landing {...landingProps} />
    } else {
      return <Dashboard {...dashboardProps} />
    }
  }

  // Assign an event to a user
async function assignEvent(eventID: number): Promise<void> {
    try {
      console.log(user.eventList)
      const updatedEventList = [...user.eventList, eventID];
      console.log(updatedEventList)
      const updates: Partial<User> = { eventList: updatedEventList };

      const response = await fetch(`http://localhost:3002/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("PATCH request failed.");

      const updatedUser: User = {
        name: user.name,
        email: user.email,
        password: user.password,
        eventList: updatedEventList,
        iRequests: user.iRequests,
        id: user.id
      }

      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user events:", error);
    }
  }

  return (
    <>
      {handlePageSwitch()}
    </>
  )
}