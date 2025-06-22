import { PageHeader } from "@/Shared/PageHeader";

export default function RefundPoliciesPage() {
  return (
    <div className=" ">
      <PageHeader
        title="Report Infringement"
        imge="/assets/herobg.png"
       
      />
      <div className="container mx-auto px-4 py-8 mt-[80px] mb-[120px] text-white">
        <h1 className="text-3xl font-bold mb-6">Refund Policies</h1>

        <p className="mb-6">
          At Walk Through, we want you to be completely satisfied with your purchase. If for any reason you are not
          satisfied, we offer the following refund and return policy.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Eligibility for Refunds/Returns</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Returns are accepted within [14] days from the date of purchase for most items.</li>
              <li>Items must be in new, unused condition with original packaging, tags, and receipts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Return Process</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                To initiate a return, please contact our customer service team at [customer service email or phone
                number] to receive a Return Authorization (RA).
              </li>
              <li>Returns without an RA# will not be accepted.</li>
              <li>
                Return shipping costs are the responsibility of the customer unless the product is defective or we made
                an error in the order.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Refund Process</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Once we receive and inspect your returned item, we will issue a refund to the original payment method.
                Please allow [14] business days for the refund to be processed.
              </li>
              <li>
                Shipping fees are non-refundable, unless the return is due to an error on our part (e.g. wrong item
                shipped, damaged goods).
              </li>
              <li>A restocking fee may be issued for items that are returned opened or used.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Exchanges</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                If you wish to exchange an item for a different size or color, please follow the same process as a
                return and place a new order for the exchange item.
              </li>
              <li>You will be responsible for any difference in price and return shipping costs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Damaged or Defective Items</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                If you receive a damaged or defective item, please contact us within [14] days of receipt. We will
                arrange for a replacement or refund at no additional cost to you.
              </li>
              <li>Please provide photos of the damage/defect to expedite the process.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Late or Missing Refunds</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                If you haven&apos;t received a refund within [14] business days, please check with your payment provider or
                bank. It may take additional time to reflect in your account.
              </li>
              <li>
                If you still have not received your refund, please contact us at [customer service email or phone
                number].
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Sale Items</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Regularly-priced items are eligible for a refund. Sale items are non-refundable unless they are
                defective or damaged.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Cancellation of Orders</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Orders can be canceled within X hours after placement. After this period, cancellations may not be
                possible due to our processing system. Please contact us immediately if you wish to cancel your order.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
