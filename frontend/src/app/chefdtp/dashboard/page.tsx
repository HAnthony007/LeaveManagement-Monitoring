"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { toast as ToastShadcn } from "@/components/ui/use-toast";
import { useAllMyEmployes } from "@/hooks/useAllEmploye";
import { useMyProfile } from "@/hooks/useEmploye";
import { useAuthStore } from "@/stores/AuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DashboardPage() {
  const { myProfile, error } = useMyProfile();

  const { myEmployes } = useAllMyEmployes()

  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = () => {
    toast.success("Deconnexion reussie");
    logout();
    router.push('/authentification');
    // window.location.reload();
  }

  if (error) {
    ToastShadcn({
      variant: "destructive",
      title: "Uh oh! Quelque chose ne va pas.",
      description: "Impossible de recuperer votre information.",
      action: <ToastAction onClick={handleLogout} altText="Reconnecter">Reconnecter</ToastAction>,
    })
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employe 
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{myEmployes.length}</div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conge En attente
            </CardTitle>
            {/* <Users className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            {/* <CreditCard className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            {/* <Activity className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}