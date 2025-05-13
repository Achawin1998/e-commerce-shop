import { stripe } from "src/app/utils/stripe";
 
async function lineItem(products, cartDetails) {  
  const lineItems = [];

  for (const [productId, product] of Object.entries(cartDetails)) {
    const productData = products.find((p) => p.id === productId);  
    if (productData) {
      lineItems.push({
        price_data: {
          currency: productData.currency,
          product_data: {
            name: productData.name,
            images: [productData.image],
          },
          unit_amount: productData.price,
        },
        quantity: product.quantity,
      });
    }
  }
  return lineItems;
}

export async function POST(req) {
  try {
    const cartDetails = await req.json();
    const inventory = await stripe.products.list({ expand: ['data.default_price'] });
    const products = inventory.data.map((product) => {
      const price = product.default_price;
      return {
        currency: price.currency,
        id: product.id,
        name: product.name,
        price: price.unit_amount,
        image: product.images[0],
      };
    });
    const lineItems = await lineItem(products, cartDetails);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
    });

    const response = new NextResponse(JSON.stringify(session), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.log(error);
    if (error.type === 'StripeInvalidRequestError') {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new NextResponse(JSON.stringify({ statusCode: 500, message: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
  return response;
}