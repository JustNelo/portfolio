import { setRequestLocale } from 'next-intl/server';
import AboutSection from "@/app/[locale]/about/_components/AboutSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative z-10 min-h-screen">
      <AboutSection />
    </main>
  );
}
