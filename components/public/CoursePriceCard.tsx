import { SeatsLeftBadge } from "@/components/public/SeatsLeftBadge";
import { Card } from "@/components/ui/Card";
import { formatMetaSelectablePrice } from "@/lib/format";

type CoursePriceCardProps = {
  price: number;
  maxSeats?: number;
  seatsLeft?: number | null;
};

export function CoursePriceCard({
  price,
  maxSeats,
  seatsLeft
}: CoursePriceCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-dentova-graphite px-6 py-5 text-center text-white">
        <p className="text-sm font-semibold text-white/60">Prix de la formation</p>
        <p className="price mt-1 text-3xl font-extrabold">
          {formatMetaSelectablePrice(price)}
        </p>
        {maxSeats ? (
          <p className="mt-1.5 text-xs font-medium text-white/50">
            Places limitées — {maxSeats} participants maximum
          </p>
        ) : null}
      </div>
      {seatsLeft != null ? (
        <div className="flex justify-center bg-white px-6 py-3">
          <SeatsLeftBadge seatsLeft={seatsLeft} variant="inline" />
        </div>
      ) : null}
    </Card>
  );
}
