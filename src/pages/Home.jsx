import { useDispatch, useSelector } from "react-redux";
import { setAdminInfo } from "../features/admin/adminSlice";

const Home = () => {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin.adminInfo);

  const handleClick = () => {
    dispatch(setAdminInfo({ name: "Super Admin" }));
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Set Admin
      </button>

      {admin && (
        <div className="mt-4 text-green-600 font-semibold">
          Logged in as: {admin.name}
        </div>
      )}
    </div>
  );
};

export default Home;
