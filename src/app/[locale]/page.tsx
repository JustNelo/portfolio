import type { Metadata } from 'next';
import { setRequestLocale, getMessages } from 'next-intl/server';
import AboutSection from "@/app/[locale]/about/_components/AboutSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const metadata = messages.metadata as { title: string; description: string; ogAlt: string };

  return {
    title: {
      absolute: metadata.title,
    },
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      locale: locale === 'en' ? 'en_US' : 'fr_FR',
    },
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative z-10 min-h-screen">
      <AboutSection />
    </main>
  );
}
