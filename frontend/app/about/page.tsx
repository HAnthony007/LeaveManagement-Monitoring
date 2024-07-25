import EmployeListe from "@/components/employe_list";
import { title } from "@/components/primitives";

export default function AboutPage() {
  return (
    <div>
      <h1 className={title()}>About</h1>
      <EmployeListe />
    </div>
  );
}
