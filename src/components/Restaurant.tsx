import "./Restaurant.css";

export interface ITime {
  opens_at: string | Date;
  closes_at: string | Date;
  is_closed: boolean;
}

export interface IHour {
  [key: string]: ITime;
}

export interface IRestaurant {
  address: string;
  description: string;
  hours: IHour[];
  id: number;
  logo: string;
  name: string;
  phone_number: string;
  review: string;
  type: string;
  uid: string;
}

type Props = {
  restaurant: IRestaurant;
  onClick: VoidFunction;
};

export default function Restaurant({ restaurant, onClick }: Props) {
  return (
    <div className="dashboard__card" onClick={onClick}>
      <img className="logo" src={restaurant.logo} alt="Restaurant Logo" />
      <span className="name">{restaurant.name}</span>
      <div className="chip">{restaurant.type}</div>
      <div className="description">{restaurant.description}</div>
    </div>
  );
}
