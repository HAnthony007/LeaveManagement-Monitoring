"use client"
import { useAllDepartement } from "@/hooks/useDepartement";
import { useAuthStore } from "@/stores/AuthStore";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { departements } = useAllDepartement();
  console.log(departements);
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1>Hello Admin {user?.email_empl} {user?.nom_empl} {user?.prenom_empl}</h1>
        <h1  >Make&nbsp;</h1>
        <h1 >beautiful&nbsp;</h1>
        <br />
        <h1  >
          websites regardless of your design experience.
        </h1>
        <h2 >
          Beautiful, fast and modern React UI library.
        </h2>
      </div>

      <div className="flex gap-3">
        <Link href={""}        >
          Documentation
        </Link>
        <Link href={""}        >
          GitHub
        </Link>
      </div>

      <div className="mt-8">
      </div>
    </section>
  );
}
