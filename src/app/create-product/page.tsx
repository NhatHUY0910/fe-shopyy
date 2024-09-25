'use client'

import React from 'react'
import CreateProductForm from "@/components/CreateProductForm";

const CreateProductPage: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
            <main>
                <h1 className="text-2xl font-bold my-4">Create New Product</h1>
                <CreateProductForm />
            </main>
        </div>
    )
}

export default CreateProductPage;