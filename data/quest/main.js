const fs = require('fs');
const path = require('path');

/*

    Output
        [number mapping to act number]
            [quest name mapping to a quest]
                quest name
                act
                directGems (quest rewards)
                    [mapping of class names to list of gems available for this class via this quest]
                indirectGems (unlocked by quest but not direct reward)
                    [mapping of class names to list of gems available for this class via this quest]

*/

// sorry for the IIFE
(async function() {
    const raw = fs.readFileSync('gems.json')
    const data = JSON.parse(raw)
     
    const out = {
        1: {},
        2: {},
        3: {},
        4: {},
    }

    const processDataCluster = (cluster, gem, mode) => {
        if (cluster.quest === 'A Fixture of Fate' || cluster.quest === 'Fallen from Grace') {
            console.error('[ERROR] =================================================')
            console.error('[ERROR] Catch-all quest passed to data cluster processing')
            console.error('[ERROR] Gem:', cluster.name)
            console.error('[ERROR] =================================================')
        }

        if (!out[cluster.actId][cluster.quest]) {
            out[cluster.actId][cluster.quest] = {
                directGems: {
                    Witch: [],
                    Marauder: [],
                    Duelist: [],
                    Ranger: [],
                    Scion: [],
                    Templar: [],
                    Shadow: [],
                },
                indirectGems: {
                    Witch: [],
                    Marauder: [],
                    Duelist: [],
                    Ranger: [],
                    Scion: [],
                    Templar: [],
                    Shadow: [],
                },
            }
        }

        cluster.classes.forEach(cl => {
            out[cluster.actId][cluster.quest][mode][cl].push(gem)
        })
    }

    data.forEach(gem => {
        // step 1: quest rewards
        if (gem.quest_rewards.length > 0) {
            processDataCluster(gem.quest_rewards[0], gem.name, 'directGems')
        }
        if (gem.vendor_rewards.length > 0) {
            const nonCatchAll = gem.vendor_rewards.filter(g => (g.quest !== 'Fallen from Grace' && g.quest !== 'A Fixture of Fate'))
            if (nonCatchAll.length > 0) {
                processDataCluster(nonCatchAll[0], gem.name, 'indirectGems')
            }
        }
    })

    fs.writeFile('./dist/quest.json', JSON.stringify(out, null, 2), () => {})

})();
