import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FileUpload } from "@/components/ui/FileUpload";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { placeholderCategories } from "@/lib/constants";

export function CourseForm() {
  return (
    <form className="max-w-2xl space-y-5 rounded-lg border border-dentova-graphite/10 bg-white p-6 shadow-card">
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">Title *</span>
        <Input placeholder="Course title" />
      </label>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">
          Description *
        </span>
        <Textarea className="min-h-40" placeholder="Course description" />
      </label>
      <div>
        <span className="mb-2 block font-bold text-dentova-navy">
          Course Image
        </span>
        <FileUpload />
      </div>
      <label className="block">
        <span className="mb-2 block font-bold text-dentova-navy">
          Or enter image URL
        </span>
        <Input placeholder="https://example.com/image.jpg" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">
            Category *
          </span>
          <Select defaultValue="">
            <option value="" disabled>
              Select a category
            </option>
            {placeholderCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">
            Instructor *
          </span>
          <Input placeholder="Instructor name" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">Date *</span>
          <Input type="date" />
        </label>
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">Time *</span>
          <Input type="time" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">
            Location *
          </span>
          <Input placeholder="Course location" />
        </label>
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">
            Price (DA) *
          </span>
          <Input min="0" placeholder="0" type="number" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">
            Contact Phone *
          </span>
          <Input placeholder="Phone number" />
        </label>
        <label className="block">
          <span className="mb-2 block font-bold text-dentova-navy">
            Contact Email *
          </span>
          <Input placeholder="Email address" type="email" />
        </label>
      </div>
      <div className="space-y-3">
        <label className="flex items-center gap-2 font-semibold text-dentova-ink">
          <Checkbox /> Featured Course
        </label>
        <label className="flex items-center gap-2 font-semibold text-dentova-ink">
          <Checkbox /> Show on Homepage
        </label>
        <label className="flex items-center gap-2 font-semibold text-dentova-ink">
          <Checkbox defaultChecked /> Published
        </label>
      </div>
      <Button className="w-full" type="submit">
        Create Course
      </Button>
    </form>
  );
}
