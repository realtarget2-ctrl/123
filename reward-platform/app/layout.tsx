import './globals.css'; // Tailwind CSS 적용을 위한 임포트

export const metadata = {
  title: '리워드 오더 관리 플랫폼',
  description: '유저 오더 등록 및 관리 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
