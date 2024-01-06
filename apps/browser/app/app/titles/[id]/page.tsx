import { TitleDetailsPage, TrpcProvider } from '@showtime/browser-feature';

interface TitleDetailsProps {
  params: {
    id: string;
  };
}

export default async function TitleDetails({ params }: TitleDetailsProps) {
  return (
    <TrpcProvider>
      <TitleDetailsPage id={params.id} />
    </TrpcProvider>
  );
}
