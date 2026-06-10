import { Container } from "@/components/ui/Container";

export function LegalPage({
  paragraphs,
  title
}: {
  paragraphs: string[];
  title: string;
}) {
  return (
    <main className="bg-dentova-canvas py-20">
      <Container>
        <article className="mx-auto max-w-3xl rounded-lg border border-dentova-graphite/10 bg-white p-8 shadow-luxe">
          <h1 className="text-5xl font-extrabold text-dentova-graphite">{title}</h1>
          <div className="mt-6 space-y-5 text-xl leading-8 text-dentova-muted">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </Container>
    </main>
  );
}
