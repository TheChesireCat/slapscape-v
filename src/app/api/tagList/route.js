import { getAllTags } from '@/app/lib/actionsSupa';

export async function GET() {
    try {
      const tags = await getAllTags();
      
      // console.log('tags', tags);
      return new Response(JSON.stringify(tags.map(obj => obj.tag)
      ), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }