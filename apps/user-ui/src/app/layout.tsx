import Header from '../shared/widgets/header/header';
import { Poppins } from 'next/font/google';
import Providers from './providers';
import './global.css';
import Footer from '../shared/widgets/Footer';

export const metadata = {
  title: 'Doko Mart',
  description: 'Carry your shopping with ease',
  icons: {
    icon: '/favicon.svg',
  },
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`} suppressHydrationWarning={true}>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
