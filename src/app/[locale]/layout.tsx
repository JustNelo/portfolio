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
  const metadata = messages.metadata as { title: string; description: string };

  return {
    title: metadata.title,
    description: metadata.description,
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
      </body>
    </html>
  );
}
