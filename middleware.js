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
    const pathname = url.pathname;


    if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }


    if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/:path*',
        '/login',
        '/register',
        '/recipes/create',
        '/recipes/edit/:id',
        '/recipes/delete/:id',
        '/recipes/:id',
        '/forgot',
    ],
};