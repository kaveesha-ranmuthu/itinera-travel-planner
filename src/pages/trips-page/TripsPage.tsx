import Button from "../../components/Button";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useHotToast } from "../../hooks/useHotToast";
import { useNavigate } from "react-router-dom";

const TripsPage = () => {
  const { notify } = useHotToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch {
      notify("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className="p-10">
      <Button.Secondary onClick={handleLogout}>Log out</Button.Secondary>
    </div>
  );
};

export default TripsPage;
