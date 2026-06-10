import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FileUpload } from "@/components/ui/FileUpload";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function WorkshopImageForm() {
  return (
    <form className="max-w-2xl space-y-5 rounded-lg border border-dentova-graphite/10 bg-white p-6 shadow-card">
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Title *</span>
        <Input placeholder="Workshop image title" />
      </label>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">
          Description
        </span>
        <Textarea placeholder="Short image description" />
      </label>
      <div>
        <span className="mb-2 block font-bold text-dentova-navy">Image</span>
        <FileUpload />
      </div>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">
          Or enter image URL
        </span>
        <Input placeholder="https://example.com/image.jpg" />
      </label>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Order</span>
        <Input min="0" placeholder="1" type="number" />
      </label>
      <label className="flex items-center gap-2 font-semibold text-dentova-ink">
        <Checkbox defaultChecked /> Active
      </label>
      <Button className="w-full" type="submit">
        Save Workshop Image
      </Button>
    </form>
  );
}
