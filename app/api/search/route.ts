import { NextResponse } from 'next/server';
import { search, SafeSearchType } from 'duck-duck-scrape';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    
    if (!q) {
      return NextResponse.json({ results: [] });
    }

    // Perform free web search scraping using DuckDuckGo
    const searchResults = await search(q, {
      safeSearch: SafeSearchType.MODERATE 
    });

    // Map duck-duck-scrape output to a standard format
    const results = searchResults.results.map(r => ({
      title: r.title,
      url: r.url,
      snippet: r.description
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: 'Search failed to fetch results.' }, { status: 500 });
  }
}
