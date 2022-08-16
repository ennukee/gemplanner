import './App.css';
import quest from './quest.json';
import questOrder from './questOrder.json';
import gemDetails from './gemDetails.json';
import gemToTechnicalName from './gemToTechnicalName.json';
import questHelp from './questHelp.json';

import { useState, useCallback } from 'react';

const classes = [
  'Witch',
  'Shadow',
  'Ranger',
  'Duelist',
  'Marauder',
  'Templar',
  'Scion',
]

// TODO: componentize this code a bit, it was a quick 4 hour side
// project that escalated rapidly into a large single file
function App() {
  const [userClass, setUserClass] = useState('Witch');
  const [act, setAct] = useState(1);
  const [questIndex, setQuestIndex] = useState(0);
  const [showQuestHelp, setShowQuestHelp] = useState(true);

  const handleDecrement = useCallback(() => {
    const newIndex = questIndex - 1
    if (!questOrder[act][newIndex]) {
      const newAct = act - 1

      // If we're at the end of the acts, reset back to beginning
      if (!questOrder[newAct]) {
        setAct(4)
        setQuestIndex(questOrder[4].length - 1)
      } else {
        setAct(newAct)
        setQuestIndex(questOrder[newAct].length - 1)
      }

      
    } else {
      setQuestIndex(questIndex - 1)
    }
  }, [questIndex, act])

  const handleIncrement = useCallback(() => {
    const newIndex = questIndex + 1
    console.log(act, newIndex)
    if (!questOrder[act][newIndex]) {
      const newAct = act + 1

      // If we're at the end of the acts, reset back to beginning
      if (!questOrder[newAct]) {
        setAct(1)
      } else {
        setAct(newAct)
      }

      setQuestIndex(0)
    } else {
      setQuestIndex(questIndex + 1)
    }
  }, [questIndex, act])

  const handleClassChange = (cl) => {
    setUserClass(cl)
  }

  const handleToggleQuestHelp = useCallback(() => {
    setShowQuestHelp(!showQuestHelp)
  }, [showQuestHelp])

  return (
    <div className="page">
      <div id="class-selector">
        {classes.map(cl => (
          <div
            key={cl}
            className={`class-selector-button${userClass === cl ? ' active' : ''}`}
            onClick={() => handleClassChange(cl)}
            id={cl}
          >
            {cl}
          </div>
        ))}
      </div>
      <div id="quest-header">
        <div
          className="directional-button"
          id="previous-button"
          onClick={handleDecrement}
        >
          {"<"}
        </div>
        <div id="quest-info">
          <div id="act-number">Act {act}</div>
          <div id="quest-name">
            <div>{questOrder[act][questIndex]}</div>
            <div id="toggle-quest-help" onClick={handleToggleQuestHelp}>{'?'}</div>
          </div>
        </div>
        <div
          className="directional-button"
          id="next-button"
          onClick={handleIncrement}
        >
          {">"}
        </div>
      </div>
      {showQuestHelp && (
        <div id="quest-helper">
          <div id="quest-help-box">
            {questHelp[questOrder[act][questIndex]]}
          </div>
        </div>
      )}
      <div id="gem-display-section">
        <RewardPanel
          title="Direct Rewards"
          subtitle="You can pick one of these from the quest reward"
          data={quest[act][questOrder[act][questIndex]].directGems[userClass]}
        />
        <RewardPanel
          title="Additional Vendor Gems"
          subtitle="In addition to the direct, you can also buy these from a vendor after completion"
          data={quest[act][questOrder[act][questIndex]].indirectGems[userClass]}
          ignore={quest[act][questOrder[act][questIndex]].directGems[userClass]}
        />
      </div>
    </div>
  );
}

function RewardPanel({
  title,
  subtitle,
  data,
  ignore,
}) {
  let newData;
  if (ignore) {
    newData = data.filter(i => !ignore.includes(i))
  } else {
    newData = data;
  }
  return (
    <div id="direct-gems">
      <div className="gem-labels" id="direct-gem-labels">
        <div className="gem-title">
          {title}
        </div>
        <div className="gem-subtitle">
          {subtitle}
        </div>
      </div>
      <div className="gem-list">
        {newData.map(gem => (
          <Gem key={gem} gemName={gem} />
        ))}
      </div>
    </div>
  )
}

function Gem({
  gemName,
}) {
  const tags = gemDetails[gemToTechnicalName[gemName]]?.tags || []

  return (
    // <div></div>
    <div className={`gem-name ${tags?.join(' ')}`}>{gemName}</div>
  )
}

export default App;
