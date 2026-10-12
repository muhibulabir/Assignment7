import type { Category, Product } from "@/types/bazardor";

const PRIMARY_URL =
  process.env.BAZARDOR_API_URL ?? "https://api.api-store.workers.dev/api/bazardor";

interface RequestFailure {
  baseUrl: string;
  status?: number;
  message: string;
}

export class ApiRequestError extends Error {
  constructor(
    readonly path: string,
    readonly failures: RequestFailure[],
  ) {
    super(
      `BazarDor API request failed for ${path}. ${failures
        .map(({ baseUrl, status, message }) =>
          `${baseUrl}: ${status ? `HTTP ${status}` : message}`,
        )
        .join("; ")}`,
    );
    this.name = "ApiRequestError";
  }

  get isNotFound(): boolean {
    return this.failures.length > 0 && this.failures.every(({ status }) => status === 404);
  }
}

async function request<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${PRIMARY_URL.replace(/\/$/, "")}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      throw new ApiRequestError(path, [{
        baseUrl: PRIMARY_URL,
        status: response.status,
        message: response.statusText,
      }]);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiRequestError) throw error;
    throw new ApiRequestError(path, [{
      baseUrl: PRIMARY_URL,
      message: error instanceof Error ? error.message : "request failed",
    }]);
  }
}

export async function getProducts(category?: string): Promise<Product[]> {
  const path = category
    ? `/products?category=${encodeURIComponent(category)}`
    : "/products";
  return request<Product[]>(path);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProducts();
  const listedProduct = products.find((product) => product.slug === slug);
  if (!listedProduct) return null;

  return request<Product>(`/products/${listedProduct.id}`);
}

export async function getCategories(): Promise<Category[]> {
  return request<Category[]>("/categories");
}

export async function getCategory(slug: string): Promise<Category | null> {
  return request<Category | null>(`/categories/${encodeURIComponent(slug)}`).catch(
    (error: unknown) => {
      if (error instanceof ApiRequestError && error.isNotFound) return null;
      throw error;
    },
  );
}

export function getProductDescription(product: Product): string {
  return `${product.nameBn} — বাংলাদেশের বিভিন্ন বাজারে নিত্যপ্রয়োজনীয় পণ্যের আজকের দর ও বাজারভিত্তিক মূল্য এখানে দেখুন।`;
}
