import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Price Drop CRM — Українська CRM-система для товарного бізнесу',
  description: 'Зручна та проста CRM для обліку товарів, контролю продажів, генерації ТТН та фінансової аналітики. Створено для українських підприємців. Спробуйте безкоштовно!',
  keywords: ['crm система', 'українська crm', 'price drop crm', 'crm для товарного бізнесу', 'облік товарів', 'програма для складу', 'crm для інтернет магазину', 'срм система'],
  openGraph: {
    title: 'Price Drop CRM — Твій бізнес під контролем',
    description: 'Проста та зручна CRM для інтернет-магазинів та товарного бізнесу.',
    url: 'https://pricedropcrm.com.ua',
    siteName: 'Price Drop CRM',
    locale: 'uk_UA',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body>
        {children}
      </body>
    </html>
  );
} 