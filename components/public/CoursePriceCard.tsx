import { Card } from "@/components/ui/Card";
import { formatMetaSelectablePrice } from "@/lib/format";

type CoursePriceCardProps = {
  price: number;
  maxSeats?: number;
};

export function CoursePriceCard({ price, maxSeats }: CoursePriceCardProps) {
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
    </Card>
  );
}
