import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function CategoryForm() {
  return (
    <form className="max-w-xl space-y-5 rounded-lg border border-dentova-graphite/10 bg-white p-6 shadow-card">
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Name *</span>
        <Input placeholder="Category name" />
      </label>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">
          Description
        </span>
        <Textarea placeholder="Category description" />
      </label>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">
          Sort order
        </span>
        <Input min="0" placeholder="0" type="number" />
      </label>
      <Button type="submit">Save Category</Button>
    </form>
  );
}
