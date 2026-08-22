import { Receipt, UserRound, Eye } from 'lucide-react';
import type { KejaListing } from '../../types/listings';
import { Card, CardTitle, FactRow, formatKES } from './parts';

interface ListingCostProps {
  listing: KejaListing;
}

/**
 * What it actually costs to move in — the one number Kenyan renters get
 * ambushed by, and the page's signature.
 *
 * `agent_fee` and `viewing_fee` are real NOT NULL columns written at post time
 * that were never mapped into the app until Phase 1, so "estimated upfront
 * cost" had always been just rent + deposit. Naming each component is the
 * point: a listing with no agent fee earns "No agent fee" as a genuine
 * positive, not as a silent default.
 *
 * Replaces `ListingPricingSummary`, which was five cards. Two of them —
 * "Availability" and a deposit-warning note — duplicated the overview pill and
 * the contact card's warning respectively; a third repeated rent and deposit
 * that its own header had already shown; and it also listed Water and
 * Electricity, which are recurring utilities rather than upfront costs and
 * appeared twice more in the amenities section. Those now live once, in the
 * house card.
 */
export default function ListingCost({ listing }: ListingCostProps) {
  const rent = listing.rent;
  const deposit = listing.deposit;
  const agentFee = listing.agentFee ?? 0;
  const viewingFee = listing.viewingFee ?? 0;
  const total = rent + deposit + agentFee + viewingFee;

  return (
    <Card className="space-y-4">
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">
          {formatKES(rent)}
        </span>
        <span className="text-xs font-bold uppercase tracking-tight text-neutral-550 dark:text-stone-400">
          per month
        </span>
      </div>

      <div>
        <CardTitle>To move in</CardTitle>
        <div className="mt-1">
          <FactRow icon={Receipt} label="Deposit" value={formatKES(deposit)} />
          <FactRow
            icon={UserRound}
            label="Agent fee"
            value={agentFee === 0 ? 'None' : formatKES(agentFee)}
          />
          <FactRow
            icon={Eye}
            label="Viewing fee"
            value={viewingFee === 0 ? 'None' : formatKES(viewingFee)}
          />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3">
        <span className="text-2xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          Total before you move
        </span>
        <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
          {formatKES(total)}
        </span>
      </div>
    </Card>
  );
}
