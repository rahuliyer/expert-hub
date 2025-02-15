#!/bin/bash

# Your Stripe secret key from environment variable
STRIPE_KEY="${STRIPE_API_KEY}"

# Array to store product IDs
declare -a PRODUCT_IDS

# Function to create a product
create_product() {
   local title="$1"
   local description="$2"
   local price="$3"
   local image="$4"
   local instructor="$5"
   local duration="$6"
   local level="$7"
   local category="$8"

   local response=$(curl -s https://api.stripe.com/v1/products \
       -u "${STRIPE_KEY}:" \
       -d name="${title}" \
       -d description="${description}" \
       -d "metadata[price]=${price}" \
       -d "metadata[instructor]=${instructor}" \
       -d "metadata[duration]=${duration}" \
       -d "metadata[level]=${level}" \
       -d "metadata[category]=${category}" \
       -d "images[]=${image}")

   # Extract and return the product ID
   echo $(echo $response | jq -r '.id')
}

# Function to create a price
create_price() {
   local product_id="$1"
   local amount="$2"

   # Convert price to cents
   local amount_cents=$(echo "$amount * 100" | bc | sed 's/\..*$//')

   curl -s https://api.stripe.com/v1/prices \
       -u "${STRIPE_KEY}:" \
       -d "currency=usd" \
       -d "unit_amount=${amount_cents}" \
       -d "product=${product_id}"
}

echo "Creating products and their prices..."

# Create Time Travel product and price
product_id=$(create_product \
   'Time Travel and DeLorean Maintenance' \
   'A comprehensive study of temporal physics and classic car maintenance featuring the DeLorean DMC-12.' \
   '399.99' \
   'https://expert-hub-coral.vercel.app/Back_To_The_Future.jpg' \
   'Dr. Emmett Brown, Temporal Physicist' \
   '116 minutes' \
   'Advanced' \
   'Science')
PRODUCT_IDS+=($product_id)
echo "Created Time Travel product with ID: $product_id"
create_price "$product_id" "399.99"
echo "Created price for Time Travel product"

# Create Mean Girls product and price
product_id=$(create_product \
   'Mean Girls Leadership Academy' \
   'A tactical exploration of high school social hierarchies and power dynamics.' \
   '299.99' \
   'https://expert-hub-coral.vercel.app/Mean_Girls.jpg' \
   'Regina George, Queen Bee Emeritus' \
   '97 minutes' \
   'Intermediate' \
   'Social Dynamics')
PRODUCT_IDS+=($product_id)
echo "Created Mean Girls product with ID: $product_id"
create_price "$product_id" "299.99"
echo "Created price for Mean Girls product"

# Create Satellite Systems product and price
product_id=$(create_product \
   'Satellite Systems and Cyber Defense' \
   'A comprehensive course on satellite communications and innovative approaches to network security.' \
   '149.99' \
   'https://expert-hub-coral.vercel.app/Independence_Day.jpg' \
   'David Levinson, Cable Repair Specialist' \
   '145 minutes' \
   'Advanced' \
   'Technology')
PRODUCT_IDS+=($product_id)
echo "Created Satellite Systems product with ID: $product_id"
create_price "$product_id" "149.99"
echo "Created price for Satellite Systems product"

# Create Creative Problem Solving product and price
product_id=$(create_product \
   'Creative Problem Solving' \
   'An introduction to improvised home security techniques using household items.' \
   '249.99' \
   'https://expert-hub-coral.vercel.app/Home_Alone.jpg' \
   'Kevin McCallister, Home Defense Specialist' \
   '103 minutes' \
   'Beginner' \
   'Security')
PRODUCT_IDS+=($product_id)
echo "Created Creative Problem Solving product with ID: $product_id"
create_price "$product_id" "249.99"
echo "Created price for Creative Problem Solving product"

# Create Corporate Theft Prevention product and price
product_id=$(create_product \
   'Corporate Theft Prevention' \
   'A detailed analysis of high-stakes casino security protocols and risk assessment.' \
   '511.99' \
   'https://expert-hub-coral.vercel.app/Oceans_Eleven.jpg' \
   'Danny Ocean and Rusty Ryan, Security Consultants' \
   '116 minutes' \
   'Advanced' \
   'Business')
PRODUCT_IDS+=($product_id)
echo "Created Corporate Theft Prevention product with ID: $product_id"
create_price "$product_id" "511.99"
echo "Created price for Corporate Theft Prevention product"

# Create Fashion product and price
product_id=$(create_product \
   'Fashion and Florals for Spring' \
   'An essential overview of fashion industry standards and contemporary color theory.' \
   '299.99' \
   'https://expert-hub-coral.vercel.app/The_Devil_Wears_Prada.jpg' \
   'Miranda Priestly, Editor-in-Chief' \
   '109 minutes' \
   'Intermediate' \
   'Fashion')
PRODUCT_IDS+=($product_id)
echo "Created Fashion product with ID: $product_id"
create_price "$product_id" "299.99"
echo "Created price for Fashion product"

echo -e "\nAll products and prices have been created!"
echo -e "\nProduct IDs:"
for id in "${PRODUCT_IDS[@]}"
do
   echo "$id"
done