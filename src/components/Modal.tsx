import "./Modal.css";
import { IRestaurant, ITime } from "./Restaurant";

import { add, format, isBefore } from "date-fns";
import { useEffect, useState } from "react";

type Props = {
  show: boolean;
  restaurant: IRestaurant;
  onClose: VoidFunction;
};

export default function Modal({ show, restaurant, onClose }: Props) {
  const [restaurantAvailability, setAvailability] = useState<ITime>();
  const [operationHours, setOperationHours] = useState<ITime>();

  useEffect(() => {
    if (show && restaurant) {
      const today = format(new Date(), "eeee").toLowerCase();
      const { hours } = restaurant;
      const availability: ITime = hours[today];
      setOperationHours(availability);

      const date = new Date(Date.now());
      date.setHours(0, 0, 0);

      const opensAtIn24h = convertTime12to24(availability.opens_at as string);
      const closesAtIn24h = convertTime12to24(availability.closes_at as string);

      const availabilityIn24 = {
        ...availability,
        opens_at: add(date, {
          hours: opensAtIn24h.hours,
          minutes: opensAtIn24h.minutes,
        }),
        closes_at: add(date, {
          hours: closesAtIn24h.hours,
          minutes: closesAtIn24h.minutes,
        }),
      };

      availabilityIn24.is_closed = isBefore(
        availabilityIn24.closes_at,
        new Date(Date.now())
      );

      setAvailability(availabilityIn24);
    }
  }, [show, restaurant]);

  if (!show) {
    return null;
  }

  const convertTime12to24 = (
    time12h: string
  ): { hours: number; minutes: number } => {
    const [time, modifier] = time12h.split(" ");

    let [hours, minutes] = time.split(":");
    let time24: number = parseInt(hours, 10);

    if (hours === "12") {
      time24 = 0;
    }

    if (modifier === "PM") {
      time24 = parseInt(hours, 10) + 12;
    }

    return { hours: time24, minutes: parseInt(minutes, 10) };
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title">{restaurant.name}</h4>
        </div>
        <div className="modal-body">
          <div className="modal__enlarged">
            <img
              className="logo"
              src={restaurant?.logo}
              alt="Restaurant Logo"
            />
            <div className="operational-hours">
              <span
                className="chip"
                style={{
                  backgroundColor: restaurantAvailability?.is_closed
                    ? "var(--color-red)"
                    : "var(--color-green)",
                }}
              >
                <>{restaurantAvailability?.is_closed ? "Closed" : "Open!"}</>
              </span>
              <span>
                <>
                  Opening hours: {"  "}
                  {operationHours?.opens_at} {" - "}
                  {operationHours?.closes_at}
                </>
              </span>
            </div>

            <span className="review-title">Review</span>
            <p className="review">{restaurant?.review}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
