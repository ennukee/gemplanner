import './App.css';
import quest from './quest.json';
import questOrder from './questOrder.json';

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
          <div id="quest-name">{questOrder[act][questIndex]}</div>
        </div>
        <div
          className="directional-button"
          id="next-button"
          onClick={handleIncrement}
        >
          {">"}
        </div>
      </div>
    </div>
  );
}

export default App;
