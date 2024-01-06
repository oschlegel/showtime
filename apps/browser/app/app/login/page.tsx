import { LoginPage, TrpcProvider } from '@showtime/browser-feature';

export default async function Login() {
  return (
    <TrpcProvider>
      <LoginPage />
    </TrpcProvider>
  );
}
