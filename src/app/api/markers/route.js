import { getPostsInBounds } from '@/app/lib/actionsSupa';   

export async function POST(request) {
    try {
        const data = await request.json();
        const { ne, sw } = data;

        if (!ne || !sw) {
            return new Response(JSON.stringify({ error: 'NE and SW coordinates are required' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const posts = await getPostsInBounds(ne.lat, ne.lng, sw.lat, sw.lng);
        // console.log('posts', posts);

        return new Response(JSON.stringify(posts), {
            status: 200,
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
