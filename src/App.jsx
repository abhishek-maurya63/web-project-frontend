import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Mainroutes from "./mainroutes/Mainroutes";
import { checkAuthStatus } from "./store/reducers/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const { initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#0f1419] text-slate-300 flex items-center justify-center">
        Checking your civic session...
      </div>
    );
  }

  return (
    <div className="app">
      <Mainroutes />
    </div>
  );
};

export default App;
