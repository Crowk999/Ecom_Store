export type Categories = {
    id: number;
    name: string;
    slug: string;
};

export type Products = {
    id: number;
    category: Categories;
    name: string;
    description: string;
    price: string;
    image: string | null;
    created_at: string;
    updated_at: string;
}

