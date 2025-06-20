import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const protectedRoutes = [
    '/api/recipes',
    '/api/recipes/create',
    '/api/recipes/update',
    '/api/recipes/delete',
];


export async function middleware(req) {
    const session = await auth();
    const isLoggedIn = !!session?.user;
    const url = req.nextUrl.clone();
    const { pathname } = url.pathname;


    if (!isLoggedIn && protectedRoutes.some(route => pathname.startsWith(route))) {
        return new NextResponse('Unauthorized', { status: 401 });
    }


    if (isLoggedIn && (pathname === '/login' || pathname === '/signin')) {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/:path*',
        '/login',
        '/signin'
    ]
};