

export async function migrateSystemVersion(fromVersion, toVersion)
{
    console.log("Migration System : " + fromVersion + " => " + toVersion);

    if (foundry.utils.isNewerVersion("0.1.2", toVersion)) {
        console.log("Migration System :  => " + toVersion);
        game.actors.forEach(a => {
            a.update({
                "system.values.seuilDefense.val": a.system.seuilDefense,
                "system.values.coutPeEsquive.val": a.system.coutPeEsquive,
                "system.values.seuilCritique.val": a.system.seuilCritique.val,
                "system.values.seuilCritique.temp": a.system.seuilCritique.temp,
            });

            a.update({
                "system.seuilDefense": null,
                "system.coutPeEsquive": null,
                "system.seuilCritique.val": null,
                "system.seuilCritique.temp": null,
            });
        });
    }
}