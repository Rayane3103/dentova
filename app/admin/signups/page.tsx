import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/Card";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { ClientSignup } from "@/models/ClientSignup";

export default async function SignupsPage() {
  let signups: Array<Record<string, unknown>> = [];

  if (await tryConnectToDatabase()) {
    signups = await ClientSignup.find({}).sort({ createdAt: -1 }).lean();
  }

  return (
    <AdminShell>
      <AdminHeader title="Inscriptions clients" />
      <div className="mt-8 space-y-4">
        {signups.length === 0 ? (
          <Card className="p-6 text-dentova-muted">Aucune inscription recue.</Card>
        ) : (
          signups.map((signup) => (
            <Card className="p-5" key={String(signup._id)}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-dentova-navy">{String(signup.fullName)}</p>
                  <p className="text-sm text-dentova-muted">
                    {String(signup.email)} • {String(signup.phone)}
                  </p>
                  <p className="mt-2 text-sm text-dentova-ink">
                    {String(signup.profession)} • {String(signup.wilaya)}
                  </p>
                  {signup.courseInterest ? (
                    <p className="text-sm text-dentova-muted">
                      Formation: {String(signup.courseInterest)}
                    </p>
                  ) : null}
                  {signup.message ? (
                    <p className="mt-2 text-sm leading-relaxed text-dentova-ink">
                      {String(signup.message)}
                    </p>
                  ) : null}
                </div>
                <span className="rounded-full bg-dentova-ice px-3 py-1 text-xs font-bold uppercase text-dentova-navy">
                  {String(signup.status)}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </AdminShell>
  );
}
