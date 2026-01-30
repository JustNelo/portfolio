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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  return {
    title: {
      absolute: metadata.title,
    },
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: `${baseUrl}/${locale}`,
      siteName: 'Léon Gallet',
      locale: locale === 'en' ? 'en_US' : 'fr_FR',
      alternateLocale: locale === 'en' ? 'fr_FR' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: metadata.ogAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [`${baseUrl}/og-image.png`],
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
