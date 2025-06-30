import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SearchBar from "@/components/SearchBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SearchPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-muted/40 py-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="shadow-sm border">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Cari Resep</CardTitle>
                            <CardDescription>
                                Temukan resep berdasarkan nama, bahan, atau kategori.
                            </CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent className="py-6">
                            <SearchBar />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </>
    );
}
