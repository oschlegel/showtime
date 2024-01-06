import { RegisterPage, TrpcProvider } from '@showtime/browser-feature';

export default async function Register() {
  return (
    <TrpcProvider>
      <RegisterPage />
    </TrpcProvider>
  );
}
