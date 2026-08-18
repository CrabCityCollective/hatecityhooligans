"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store/use-game-store";

export function EquipmentPanel() {
  const roster = useGameStore((state) => state.gang.roster);
  const inventory = useGameStore((state) => state.gang.inventory);
  const assignEquipment = useGameStore((state) => state.assignEquipment);
  const unassignEquipment = useGameStore((state) => state.unassignEquipment);

  const [selectedInstanceId, setSelectedInstanceId] = useState("");

  const assignableHooligans = roster.filter((hooligan) => hooligan.status === "available");

  return (
    <section aria-label="Uitrusting toewijzen">
      <h2>Uitrusting</h2>

      <h3>Inventaris (nog niet toegewezen)</h3>
      {inventory.length === 0 ? (
        <p>Geen uitrusting op voorraad.</p>
      ) : (
        <ul>
          {inventory.map((item) => (
            <li key={item.instanceId}>{item.name}</li>
          ))}
        </ul>
      )}

      <h3>Roster</h3>
      {assignableHooligans.length === 0 && <p>Geen beschikbare hooligans.</p>}
      <ul>
        {assignableHooligans.map((hooligan) => (
          <li key={hooligan.id}>
            <strong>{hooligan.name}</strong>{" "}
            {hooligan.equipment.length > 0 && (
              <span>
                (
                {hooligan.equipment
                  .map((item) => item.name)
                  .join(", ")}
                )
              </span>
            )}
            <ul>
              {hooligan.equipment.map((item) => (
                <li key={item.instanceId}>
                  {item.name}{" "}
                  <button
                    type="button"
                    onClick={() => unassignEquipment(hooligan.id, item.instanceId)}
                  >
                    Terug naar inventaris
                  </button>
                </li>
              ))}
            </ul>
            {inventory.length > 0 && (
              <p>
                <label>
                  Toewijzen:{" "}
                  <select
                    value={selectedInstanceId}
                    onChange={(event) => setSelectedInstanceId(event.target.value)}
                  >
                    <option value="">— kies uitrusting —</option>
                    {inventory.map((item) => (
                      <option key={item.instanceId} value={item.instanceId}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>{" "}
                <button
                  type="button"
                  disabled={!selectedInstanceId}
                  onClick={() => {
                    if (!selectedInstanceId) return;
                    assignEquipment(hooligan.id, selectedInstanceId);
                    setSelectedInstanceId("");
                  }}
                >
                  Toewijzen
                </button>
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
