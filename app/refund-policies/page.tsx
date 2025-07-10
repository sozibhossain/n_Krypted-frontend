// import { PageHeader } from "@/Shared/PageHeader";

// export default function RefundPoliciesPage() {
//   return (
//     <div className=" ">
//       <PageHeader
//         title="Report Infringement"
//         imge="/assets/herobg.png"

//       />
//       <div className="container mx-auto px-4 py-8 mt-[80px] mb-[120px] text-white">
//         <h1 className="text-3xl font-bold mb-6">Refund Policies</h1>

//         <p className="mb-6">
//           At Walk Through, we want you to be completely satisfied with your purchase. If for any reason you are not
//           satisfied, we offer the following refund and return policy.
//         </p>

//         <div className="space-y-8">
//           <section>
//             <h2 className="text-xl font-semibold mb-2">1. Eligibility for Refunds/Returns</h2>
//             <ul className="list-disc pl-6 space-y-2">
//               <li>Returns are accepted within [14] days from the date of purchase for most items.</li>
//               <li>Items must be in new, unused condition with original packaging, tags, and receipts.</li>
//             </ul>
//           </section>

//           <section>
//             <h2 className="text-xl font-semibold mb-2">2. Return Process</h2>
//             <ul className="list-disc pl-6 space-y-2">
//               <li>
//                 To initiate a return, please contact our customer service team at [customer service email or phone
//                 number] to receive a Return Authorization (RA).
//               </li>
//               <li>Returns without an RA# will not be accepted.</li>
//               <li>
//                 Return shipping costs are the responsibility of the customer unless the product is defective or we made
//                 an error in the order.
//               </li>
//             </ul>
//           </section>

//           <section>
//             <h2 className="text-xl font-semibold mb-2">3. Refund Process</h2>
//             <ul className="list-disc pl-6 space-y-2">
//               <li>
//                 Once we receive and inspect your returned item, we will issue a refund to the original payment method.
//                 Please allow [14] business days for the refund to be processed.
//               </li>
//               <li>
//                 Shipping fees are non-refundable, unless the return is due to an error on our part (e.g. wrong item
//                 shipped, damaged goods).
//               </li>
//               <li>A restocking fee may be issued for items that are returned opened or used.</li>
//             </ul>
//           </section>

//           <section>
//             <h2 className="text-xl font-semibold mb-2">4. Exchanges</h2>
//             <ul className="list-disc pl-6 space-y-2">
//               <li>
//                 If you wish to exchange an item for a different size or color, please follow the same process as a
//                 return and place a new order for the exchange item.
//               </li>
//               <li>You will be responsible for any difference in price and return shipping costs.</li>
//             </ul>
//           </section>

//           <section>
//             <h2 className="text-xl font-semibold mb-2">5. Damaged or Defective Items</h2>
//             <ul className="list-disc pl-6 space-y-2">
//               <li>
//                 If you receive a damaged or defective item, please contact us within [14] days of receipt. We will
//                 arrange for a replacement or refund at no additional cost to you.
//               </li>
//               <li>Please provide photos of the damage/defect to expedite the process.</li>
//             </ul>
//           </section>

//           <section>
//             <h2 className="text-xl font-semibold mb-2">6. Late or Missing Refunds</h2>
//             <ul className="list-disc pl-6 space-y-2">
//               <li>
//                 If you haven&apos;t received a refund within [14] business days, please check with your payment provider or
//                 bank. It may take additional time to reflect in your account.
//               </li>
//               <li>
//                 If you still have not received your refund, please contact us at [customer service email or phone
//                 number].
//               </li>
//             </ul>
//           </section>

//           <section>
//             <h2 className="text-xl font-semibold mb-2">7. Sale Items</h2>
//             <ul className="list-disc pl-6 space-y-2">
//               <li>
//                 Regularly-priced items are eligible for a refund. Sale items are non-refundable unless they are
//                 defective or damaged.
//               </li>
//             </ul>
//           </section>

//           <section>
//             <h2 className="text-xl font-semibold mb-2">8. Cancellation of Orders</h2>
//             <ul className="list-disc pl-6 space-y-2">
//               <li>
//                 Orders can be canceled within X hours after placement. After this period, cancellations may not be
//                 possible due to our processing system. Please contact us immediately if you wish to cancel your order.
//               </li>
//             </ul>
//           </section>
//         </div>
//       </div>
//     </div>
//   )
// }

import { PageHeader } from "@/Shared/PageHeader";
import Link from "next/link";

export default function RefundPoliciesPage() {
  return (
    <div className=" ">
      <PageHeader title="Datenschutzerklärung" imge="/assets/dan.jpg" />
      <div className="container mx-auto px-4 py-8 mt-[80px] mb-[120px] text-white">
        <h1 className="text-3xl font-bold mb-6">Datenschutzerklärung</h1>

        <p className="mb-6">
          Walk Throughz
          <br />
          Töngesgasse 39, 60311 Frankfurt am Main
          <br />
          Stand: Juni 2025
        </p>

        <p className="mb-6">
          Der Schutz deiner personenbezogenen Daten ist uns ein wichtiges
          Anliegen. Wir behandeln deine Daten vertraulich und entsprechend der
          gesetzlichen Datenschutzvorschriften, insbesondere der
          EU-Datenschutz-Grundverordnung (DSGVO) sowie des
          Bundesdatenschutzgesetzes (BDSG).
        </p>
        <p className="mb-6">
          Im Folgenden informieren wir dich darüber, welche Daten wir erheben,
          wie wir sie verwenden und welche Rechte du in Bezug auf deine Daten
          hast.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Verantwortlicher</h2>
            <p className="mb-2">Verantwortlich im Sinne der DSGVO ist:</p>
            <p>
              Walk Throughz
              <br />
              Töngesgasse 39
              <br />
              60311 Frankfurt am Main
              <br />
              E-Mail:{" "}
              <Link href="mailto:info@walkthroughz.com" className="underline">
                info@walkthroughz.com
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              2. Erhebung und Speicherung personenbezogener Daten
            </h2>
            <h3 className="text-lg font-semibold mb-2">
              a) Beim Besuch der Website
            </h3>
            <p className="mb-2">
              Beim Aufrufen unserer Website werden durch den Browser deines
              Endgeräts automatisch folgende Informationen an unseren Server
              übermittelt:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP-Adresse</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Name der aufgerufenen Seite</li>
              <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
              <li>Browsertyp und ggf. Betriebssystem</li>
            </ul>
            <p className="mb-4">
              Diese Daten dienen der technischen Auslieferung und Stabilität der
              Website und werden nicht zur Identifikation deiner Person
              verwendet.
            </p>

            <h3 className="text-lg font-semibold mb-2">
              b) Bei Registrierung eines Benutzerprofils
            </h3>
            <p className="mb-2">
              Wenn du ein Profil bei uns anlegst, erfassen wir folgende Daten:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vor- und Nachname</li>
              <li>E-Mail-Adresse</li>
              <li>Passwort (verschlüsselt gespeichert)</li>
              <li>ggf. Telefonnummer</li>
              <li>bevorzugte Sprache und Stadt (optional)</li>
            </ul>
            <p className="mb-4">
              Die Verarbeitung erfolgt zum Zweck der Vertragsdurchführung,
              Kundenverwaltung sowie zur Bereitstellung personalisierter
              Inhalte.
            </p>

            <h3 className="text-lg font-semibold mb-2">
              c) Bei Buchungen und Zahlungen
            </h3>
            <p className="mb-2">Im Rahmen von Buchungen verarbeiten wir:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Buchungsdaten (Datum, Zeit, Anzahl Personen, gewählte Location)
              </li>
              <li>
                Zahlungsdaten (z. B. Kreditkarte, PayPal, Klarna – jeweils via
                externer Zahlungsanbieter)
              </li>
              <li>Rechnungsadresse (falls erforderlich)</li>
            </ul>
            <p>
              Zahlungsabwicklungen erfolgen über externe Anbieter (z. B. Stripe,
              PayPal). Deine Zahlungsdaten werden dabei nicht auf unseren
              Servern gespeichert, sondern direkt beim jeweiligen Anbieter
              verarbeitet. Es gelten deren Datenschutzrichtlinien zusätzlich.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              3. Zweck und Rechtsgrundlage der Verarbeitung
            </h2>
            <p className="mb-2">
              Wir verarbeiten personenbezogene Daten zu folgenden Zwecken:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                zur Durchführung von Buchungen und Veranstaltungen (Art. 6 Abs.
                1 lit. b DSGVO)
              </li>
              <li>
                zur technischen Bereitstellung der Website (Art. 6 Abs. 1 lit. f
                DSGVO)
              </li>
              <li>
                zur Nutzerverwaltung und Profilerstellung (Art. 6 Abs. 1 lit. a
                &amp; b DSGVO)
              </li>
              <li>zur Zahlungsabwicklung (Art. 6 Abs. 1 lit. b DSGVO)</li>
              <li>
                zur Kommunikation mit dir bei Anfragen oder Änderungen (Art. 6
                Abs. 1 lit. a &amp; b DSGVO)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              4. Weitergabe von Daten
            </h2>
            <p className="mb-2">
              Wir geben deine Daten nur dann weiter, wenn dies gesetzlich
              erlaubt ist oder du ausdrücklich eingewilligt hast, insbesondere:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>an Zahlungsdienstleister zur Abwicklung deiner Buchung</li>
              <li>
                an Locations/Anbieter zur Durchführung des gebuchten Walk
                Throughs
              </li>
              <li>
                an IT-Dienstleister, die uns bei Betrieb und Wartung der
                Plattform unterstützen
              </li>
            </ul>
            <p>
              Eine Übermittlung in Drittstaaten außerhalb der EU erfolgt nur,
              wenn dort ein angemessenes Datenschutzniveau besteht oder du
              eingewilligt hast.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Speicherdauer</h2>
            <p className="mb-2">
              Wir speichern deine Daten nur so lange, wie sie zur Erfüllung der
              oben genannten Zwecke erforderlich sind oder gesetzliche
              Aufbewahrungsfristen bestehen.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Buchungs- und Zahlungsdaten: bis zu 10 Jahre (steuerrechtlich)
              </li>
              <li>
                Profildaten: bis zur Löschung durch dich oder deinen Widerruf
              </li>
              <li>Kommunikationsdaten: max. 3 Jahre</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              6. Deine Rechte als betroffene Person
            </h2>
            <p className="mb-2">Du hast jederzeit das Recht:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Auskunft über deine gespeicherten Daten zu erhalten (Art. 15
                DSGVO)
              </li>
              <li>
                Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO)
              </li>
              <li>die Löschung deiner Daten zu beantragen (Art. 17 DSGVO)</li>
              <li>
                die Einschränkung der Verarbeitung zu verlangen (Art. 18 DSGVO)
              </li>
              <li>
                Widerspruch gegen die Verarbeitung einzulegen (Art. 21 DSGVO)
              </li>
              <li>
                deine Daten in einem übertragbaren Format zu erhalten (Art. 20
                DSGVO)
              </li>
              <li>
                eine erteilte Einwilligung jederzeit zu widerrufen (Art. 7 Abs.
                3 DSGVO)
              </li>
            </ul>
            <p className="mb-2">
              Bitte wende dich zur Ausübung deiner Rechte an:{" "}
              <Link href="mailto:info@walkthroughz.com" className="underline">
                info@walkthroughz.com
              </Link>
            </p>
            <p>
              Du hast außerdem das Recht, dich bei einer
              Datenschutzaufsichtsbehörde zu beschweren, z. B.:
              <br />
              Der Hessische Beauftragte für Datenschutz und Informationsfreiheit
              <br />
              Gustav-Stresemann-Ring 1, 65189 Wiesbaden
              <br />
              <Link
                href="https://www.datenschutz.hessen.de"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                www.datenschutz.hessen.de
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              7. Cookies und Tracking
            </h2>
            <p>
              Unsere Website verwendet Cookies, um die Nutzung zu analysieren
              und die Benutzerfreundlichkeit zu verbessern. Du kannst der
              Nutzung zustimmen oder sie ablehnen. Details findest du in unserer
              separaten Cookie-Richtlinie.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              8. Profil und Kommunikation
            </h2>
            <p>
              Mit der Erstellung eines Profils stimmst du der Verarbeitung
              deiner Daten zur Personalisierung zu. Du kannst diese
              Einstellungen jederzeit in deinem Nutzerbereich anpassen oder dein
              Konto löschen.
            </p>
            <p>
              Wir kontaktieren dich ggf. per E-Mail über Änderungen,
              Buchungsinformationen oder relevante Angebote. Du kannst dem
              jederzeit widersprechen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">9. Datensicherheit</h2>
            <p>
              Wir setzen aktuelle technische und organisatorische
              Sicherheitsmaßnahmen ein, um deine Daten gegen Verlust, Missbrauch
              oder unbefugten Zugriff zu schützen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              10. Änderungen dieser Datenschutzerklärung
            </h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um
              sie rechtlichen Anforderungen oder Änderungen unserer Leistungen
              anzupassen. Die jeweils aktuelle Version findest du auf unserer
              Website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
