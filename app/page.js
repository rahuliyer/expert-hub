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

// Fisher-Yates (Knuth) shuffle algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function getData() {
  const products = await getProducts(PRODUCT_IDS);
  return shuffleArray(products);
}

// This is a server component
export default async function ExpertPage() {
  const products = await getData();

  return <ClientPage initialProducts={products} />;
}