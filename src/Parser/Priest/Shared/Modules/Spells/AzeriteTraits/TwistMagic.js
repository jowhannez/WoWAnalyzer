import React from 'react';
import Analyzer from 'Parser/Core/Analyzer';

import SPELLS from 'common/SPELLS';
import TraitStatisticBox, { STATISTIC_ORDER } from 'Interface/Others/TraitStatisticBox';
import { formatThousands } from 'common/format';
import ItemHealingDone from 'Interface/Others/ItemHealingDone';

// Example Log: https://www.warcraftlogs.com/reports/aTBGZk3w4q1JQrKW#fight=5&type=summary&source=9&translate=true
class TwistMagic extends Analyzer {
  twistMagicHealing = 0;
  totalDispels = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrait(SPELLS.TWIST_MAGIC_TRAIT.id);
  }

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;
    if (spellId === SPELLS.TWIST_MAGIC_HEAL.id) {
      this.twistMagicHealing += event.amount;
    }
  }

  on_dispel(event) {
    if (!this.owner.byPlayer(event)) {
      return;
    }

    const spellId = event.ability.guid;
    if (spellId === SPELLS.PURIFY.id || spellId === SPELLS.DISPEL_MAGIC.id || spellId === SPELLS.MASS_DISPEL.id) {
      this.totalDispels++;
    }
  }

  statistic() {
    return (
      <TraitStatisticBox
        position={STATISTIC_ORDER.OPTIONAL()}
        trait={SPELLS.TWIST_MAGIC_TRAIT.id}
        value={(
          <React.Fragment>
            <ItemHealingDone amount={this.twistMagicHealing} /><br />
          </React.Fragment>
        )}
        tooltip={`
          ${formatThousands(this.twistMagicHealing)} Total Healing<br />
          ${formatThousands(this.totalDispels)} Total Dispels
        `}
      />
    );
  }
}

export default TwistMagic;
