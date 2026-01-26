import { use, useEffect } from "react";
import api from "./api/axios";

function App() {
  useEffect(() => {
    api.get("/auth/test")
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
}, []);

  return <h1>React connected to backend</h1>

}

export default App;
