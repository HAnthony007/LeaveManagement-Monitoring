import React from "react";

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="d-flex justify-center items-center h-full w-screen">
            {children}
        </div>
    );
}
