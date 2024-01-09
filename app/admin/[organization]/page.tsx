export default function Page({ params }: { params: { organization: string } }) {
  return <div>My Post: {params.organization}</div>;
}
