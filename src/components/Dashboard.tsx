import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../_config/env";
import "./Dashboard.css";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../_config/auth";
import Restaurant, { IRestaurant } from "./Restaurant";
import Modal from "./Modal";

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [completeList, setCompleteList] = useState<IRestaurant[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [user, loading] = useAuthState(auth);
  const [show, setShow] = useState(false);
  const [restaurant, setRestaurant] = useState<IRestaurant>();

  const navigate = useNavigate();

  const handleSelected = (restaurant: IRestaurant) => {
    setRestaurant(restaurant);
    setShow(true);
  };

  const handleFiltered = useCallback(
    (type: string) => {
      if (type === "ALL") {
        setRestaurants(completeList);
        return;
      }

      const filteredData = restaurants.filter((r) => r.type === type);
      setRestaurants(filteredData);
    },
    [completeList, restaurants]
  );

  useEffect(() => {
    if (loading) return;

    if (!user) return navigate("/");
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(
          "https://random-data-api.com/api/restaurant/random_restaurant?size=100"
        );
        const data: IRestaurant[] = await res.json();
        const types = data.reduce<string[]>((prev, current) => {
          if (!prev.includes(current.type)) {
            prev.push(current.type);
          }

          return prev;
        }, []);
        setTypes(types);
        setCompleteList(data);
        setRestaurants(data);
      } catch (err) {}
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard__sidebar">
        <button type="button" className="dashboard__btn" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="dashboard__container">
        <div className="dashboard__toolbar">
          <>
            <label htmlFor="types">Restaurant types:</label>

            <select
              name="types"
              id="types"
              onChange={(_) => handleFiltered(_.target.value)}
            >
              <option value="ALL" key="all">
                all
              </option>
              {types.map((t) => (
                <option value={t} key={t}>
                  {t}
                </option>
              ))}
            </select>
          </>
        </div>
        <div className="dashboard__list">
          {restaurants &&
            restaurants.map((restaurant) => (
              <Restaurant
                restaurant={restaurant}
                key={restaurant.uid}
                onClick={() => handleSelected(restaurant)}
              />
            ))}
        </div>
      </div>
      <Modal
        show={show}
        onClose={() => setShow(false)}
        restaurant={restaurant!}
      />
    </div>
  );
}
