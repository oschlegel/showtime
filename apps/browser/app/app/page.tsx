'use client';
import { IndexPage, TrpcProvider } from '@showtime/browser-feature';

export default function Index() {
  return (
    <TrpcProvider>
      <IndexPage />
    </TrpcProvider>
  );
}
