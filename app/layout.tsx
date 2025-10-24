export const metadata = {
  title: 'LinkedIn Sidekick',
  description: 'Gera posts reflexivos em PT-PT com 1 link no final.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body style={{ margin: 0, background: '#f8fafc', fontFamily: 'Inter, system-ui, Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
