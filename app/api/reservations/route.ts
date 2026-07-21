import { after, NextResponse } from "next/server";
import { serializeCourseQuestions } from "@/lib/data/serialize";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { syncReservationsSheet } from "@/lib/integrations/reservations-sheet";
import { reservationSchema } from "@/lib/validators/reservation";
import { Course } from "@/models/Course";
import { Reservation } from "@/models/Reservation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = reservationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  if (!hasDatabaseConfig()) {
    return NextResponse.json(
      { error: "Le service de reservation n'est pas disponible pour le moment." },
      { status: 503 }
    );
  }

  await connectToDatabase();

  const { answers: submittedAnswers, ...reservationData } = parsed.data;

  const courseDoc = await Course.findById(reservationData.courseId)
    .select("questions")
    .lean();
  const questions = serializeCourseQuestions(
    (courseDoc as { questions?: unknown } | null)?.questions
  );
  const answerMap = new Map(
    submittedAnswers.map((answer) => [answer.questionId, answer.value])
  );

  const storedAnswers: {
    questionId: string;
    label: string;
    type: "text" | "select";
    value: string[];
  }[] = [];

  for (const question of questions) {
    const rawValue = (answerMap.get(question.id) ?? [])
      .map((item) => item.trim())
      .filter(Boolean);
    const value =
      question.type === "select"
        ? rawValue.filter((item) => question.options.includes(item))
        : rawValue;

    if (question.required && value.length === 0) {
      return NextResponse.json(
        { error: `La question « ${question.label} » est obligatoire.` },
        { status: 422 }
      );
    }

    if (value.length > 0) {
      storedAnswers.push({
        questionId: question.id,
        label: question.label,
        type: question.type,
        value
      });
    }
  }

  try {
    const reservation = await Reservation.create({
      ...reservationData,
      answers: storedAnswers,
      status: "pending"
    });

    after(() => syncReservationsSheet());

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    console.error("[dentova] Reservation create failed:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer la reservation pour le moment." },
      { status: 500 }
    );
  }
}
