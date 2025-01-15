import { LocationClient, SearchPlaceIndexForTextCommand } from "@aws-sdk/client-location";
import { NextResponse } from 'next/server';

const client = new LocationClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const indexName = process.env.AWS_LOCATION_INDEX_NAME;

  if (!query || !indexName) {
    return NextResponse.json({ error: 'Missing query or index name' }, { status: 400 });
  }

  try {
    const command = new SearchPlaceIndexForTextCommand({
      IndexName: indexName,
      Text: query,
    });

    const response = await client.send(command);
    return NextResponse.json(response.Results);
  } catch (error) {
    console.error('Error searching places:', error);
    return NextResponse.json({ error: 'Failed to search places' }, { status: 500 });
  }
}

