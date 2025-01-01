import { formatCurrency } from "@/lib/formatCurrency";
import { getMyOrders } from "@/sanity/lib/orders/getMyOrders";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";


async function OrderPage() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const orders = await getMyOrders(userId);

  return (
    <div className="flex flex-col items-center justify-center
    min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-4 sm:p-8 rounded-xl
      shadow-md w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900
        tracking-tight mb-8">
          Orders
        </h1>
        {orders.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Yout have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {orders.map(order => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-gray-200 border-b rounded-lg">
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <p className="text-sm font-bold mb-1 text-gray-600">
                        Order number
                      </p>
                      <p className="font-mono text-sm text-green-600 break-all">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-gray-600 mb-1">
                        Order date
                      </p>
                      <p className="font-medium">
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString("en-US")
                          : "No date"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6">
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm 
                        ${order.status === "paid"
                          ? "text-green-800 bg-green-100"
                          : "text-gray-800 bg-gray-100"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="font-bold text-lg">
                      {formatCurrency(order.totalPrice ?? 0, order.currency)}
                    </p>
                  </div>
                </div>

                {order.amountDiscount ? (
                  <div className="mt4 p-3 sm:p-4 bg-red-50 rounded-lg">
                    <p className="text-red-600 text-sm font-medium mb-1 sm:text-base">
                      Discount Applied:{" "}
                      <span className="font-bold">
                        {formatCurrency(order.amountDiscount, order.currency)}
                      </span>{" "}
                      on this order!
                    </p>
                    <p className="text-sm text-gray-600">
                      Original Subtotal:{" "}
                      {formatCurrency(
                        (order.totalPrice ?? 0) + (order.amountDiscount ?? 0),
                        order.currency)}
                    </p>
                  </div>
                ) : null}
                <div className="px-4 py-3 sm:px-6 sm:py-4">
                  <p className="text-sm font-semibold text-gray-600 mb-3 sm:mb-4">
                    Order Items
                  </p>

                  <div className="space-y-3 s,:space-y-4">
                    {order.products?.map(product => (
                      <div
                        key={product.product?._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between
                        gap-3 py-2 border-b last:border-b-0"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          {product.product?.image && (
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0
                            rounded-md overflow-hidden">
                              <Image
                                src={imageUrl(product.product?.image).url()}
                                alt={product.product?.name ?? ""}
                                className="object-cover"
                                fill
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {product.product?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {product.quantity ?? " N/A"}
                            </p>
                          </div>
                        </div>
                        <p className="text-right font-bold">
                          {product.product?.price && product.quantity
                            ? formatCurrency(
                              product.product.price * product.quantity,
                              order.currency)
                            : "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderPage