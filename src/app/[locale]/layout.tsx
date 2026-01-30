import type { Metadata } from "next";
import { Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { anton, jetbrainsMono } from "@/app/fonts";
import "@/app/globals.css";
import Scene from "@/components/Scene";
import TransitionOverlay from "@/components/ui/TransitionOverlay";
import SceneFallback from "@/components/ui/SceneFallback";
import { ErrorBoundary, SceneErrorFallback } from "@/components/ui/ErrorBoundary";
import { locales, type Locale } from '@/lib/i18n/config';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();
  const metadata = messages.metadata as { title: string; description: string; ogAlt: string };
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  return {
    metadataBase: new URL(baseUrl),
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: './',
      languages: {
        'fr': '/fr',
        'en': '/en',
      },
    },
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

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${anton.variable} ${jetbrainsMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ErrorBoundary fallback={<SceneErrorFallback />}>
            <Suspense fallback={<SceneFallback />}>
              <Scene />
            </Suspense>
          </ErrorBoundary>
          <TransitionOverlay />
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
