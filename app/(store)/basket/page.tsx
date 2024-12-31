'use client';

import createCheckoutSession, { Metadata } from "@/actions/createCheckoutSession";
import AddToBasketButton from "@/components/AddToBasketButton";
import { imageUrl } from "@/lib/imageUrl";
import useBasketStore from "@/store/store";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function BasketPage() {
  const groupedItems = useBasketStore(state => state.getGroupedItems());

  const { isSignedIn } = useUser();
  const { user } = useUser();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />
  }

  if (groupedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">Basket</h1>
        <p className="text-xl text-gray-600">Your basket is empty</p>
      </div>
    );
  }
  // console.log(groupedItems);
  const handleCheckout = async () => {
    if (!isSignedIn) return;
    setIsLoading(true);

    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0].emailAddress ?? "Unknown",
        clerkUserId: user!.id,
      };

      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <h1 className="text-2xl font-bold my-2">Your Basket</h1>
      <div className="flex flex-col lg:flex-row lg:space-x-4">
        <div className="flex-grow">
          {groupedItems.map(item => (
            <div
              key={item.product._id}
              className="mb-4 p-4 border rounded flex items-center 
              cursor-pointer flex-1 min-w-0 justify-between"
              onClick={() => router.push(`/product/${item.product.slug?.current}`)}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
                {item.product.image && (
                  <Image
                    src={imageUrl(item.product.image).url()}
                    alt={item.product.name ?? "Product Image"}
                    className="w-full h-full object-cover rounded"
                    width={96}
                    height={96}
                  />
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h2 className="text-md sm:text-xl font-semibold truncate">
                  {item.product.name}
                </h2>
                <p className="text-sm sm:text-base">
                  Price:$
                  {(item.product.price ?? 0 * item.quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center flex-shrink-0 scale-75">
                <AddToBasketButton product={item.product} />
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border
         rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">
          <h3 className="text-xl font-semibold">Order Summary</h3>
          <div className="mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Items:</span>
              <span>
                {groupedItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </p>
            <p className="flex justify-between text-2xl font-bold border-t pt-2">
              <span>Total:</span>
              <span>
                ${useBasketStore.getState().getTotalPrice().toFixed(2)}
              </span>
            </p>
          </div>
          {
            isSignedIn ? (
              <button
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white
                rounded px-4 py-2 disabled:bg-gray-400"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Checkout"}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white
                  rounded px-4 py-2"
                >
                  Sign in to Checkout
                </button>
              </SignInButton>
            )
          }
        </div>
        <div className="h-64 lg:h-0">
          {/* Space for fixed heckout on mobile */}
        </div>
      </div>
    </div >
  )
}

export default BasketPage
