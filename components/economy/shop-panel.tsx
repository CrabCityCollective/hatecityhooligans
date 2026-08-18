"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store/use-game-store";
import { BOUWMARKT_ITEMS, DARK_WEB_ITEMS, type ShopItem } from "@/lib/economy/shop-items";

interface OrderLogEntry {
  id: string;
  message: string;
}

export function ShopPanel() {
  const money = useGameStore((state) => state.gang.money);
  const roster = useGameStore((state) => state.gang.roster);
  const buyBouwmarktItem = useGameStore((state) => state.buyBouwmarktItem);
  const buyDarkWebItem = useGameStore((state) => state.buyDarkWebItem);

  const [receiverByItem, setReceiverByItem] = useState<Record<string, string>>({});
  const [log, setLog] = useState<OrderLogEntry[]>([]);

  const availableHooligans = roster.filter((hooligan) => hooligan.status === "available");

  function logMessage(message: string) {
    setLog((prev) => [{ id: `${Date.now()}-${prev.length}`, message }, ...prev]);
  }

  function kopenBouwmarkt(item: ShopItem) {
    if (money < item.price) return;
    buyBouwmarktItem(item.id);
    logMessage(`${item.name} gekocht voor €${item.price}.`);
  }

  function bestelDarkWeb(item: ShopItem) {
    const receiverId = receiverByItem[item.id];
    if (!receiverId || money < item.price) return;

    const receiver = availableHooligans.find((hooligan) => hooligan.id === receiverId);
    const result = buyDarkWebItem(item.id, receiverId);
    if (!result) return;

    if (result.intercepted && result.arrest) {
      logMessage(
        `Onderschept! ${result.arrest.hooliganName} opgepakt (${result.arrest.reasons.join("; ")}). Bestelling kwijt.`,
      );
    } else {
      logMessage(`${item.name} veilig geleverd aan ${receiver?.name ?? "de ontvanger"}.`);
    }
  }

  return (
    <section aria-label="Winkel">
      <h2>Winkel</h2>

      <section aria-label="Bouwmarkt">
        <h3>Bouwmarkt (geen risico)</h3>
        <ul>
          {BOUWMARKT_ITEMS.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong> — €{item.price} — {item.description}{" "}
              <button
                type="button"
                disabled={money < item.price}
                onClick={() => kopenBouwmarkt(item)}
              >
                Kopen
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Dark web">
        <h3>Dark web (duurder, risico op onderschepping)</h3>
        {availableHooligans.length === 0 && <p>Geen beschikbare hooligans om als ontvanger aan te wijzen.</p>}
        <ul>
          {DARK_WEB_ITEMS.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong> — €{item.price} — {item.description}{" "}
              <span>
                (kans op onderschepping: {Math.round((item.interceptionChance ?? 0) * 100)}%)
              </span>
              <div>
                <label>
                  Ontvanger:{" "}
                  <select
                    value={receiverByItem[item.id] ?? ""}
                    onChange={(event) =>
                      setReceiverByItem((prev) => ({ ...prev, [item.id]: event.target.value }))
                    }
                  >
                    <option value="">— kies een hooligan —</option>
                    {availableHooligans.map((hooligan) => (
                      <option key={hooligan.id} value={hooligan.id}>
                        {hooligan.name}
                      </option>
                    ))}
                  </select>
                </label>{" "}
                <button
                  type="button"
                  disabled={money < item.price || !receiverByItem[item.id]}
                  onClick={() => bestelDarkWeb(item)}
                >
                  Bestellen
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {log.length > 0 && (
        <section aria-label="Bestelgeschiedenis">
          <h3>Laatste bestellingen</h3>
          <ul>
            {log.map((entry) => (
              <li key={entry.id}>{entry.message}</li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
