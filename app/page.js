// app/page.js
import { getProducts } from '../lib/stripe'
import ClientPage from '../components/ClientPage'

// This array should be replaced with your actual Stripe product IDs
const PRODUCT_IDS = [
  "prod_RmFFWuLe3Kemur",
  "prod_RmFF4iFBV1gSSP",
  "prod_RmFFTkDQHF65jO",
  "prod_RmFFFVzzmovGTH",
  "prod_RmFFz5t7Yvxu2G",
  "prod_RmFFWtX2rBcvLR"
];

async function getData() {
  const products = await getProducts(PRODUCT_IDS);
  return products;
}

// This is a server component
export default async function ExpertPage() {
  const products = await getData();

  return <ClientPage initialProducts={products} />;
}