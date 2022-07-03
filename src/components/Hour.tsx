import { IHour } from "./Restaurant";

type Props = {
  hour: IHour;
};

export default function Hour({ hour }: Props) {
  console.log("hour", hour);

  return <div>Hour</div>;
}
