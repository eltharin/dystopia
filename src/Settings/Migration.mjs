

export async function migrateSystemVersion(fromVersion, toVersion)
{
    console.log("Migration System : " + fromVersion + " => " + toVersion);

    if (foundry.utils.isNewerVersion("0.0.1", toVersion)) {
        console.log("Migration System :  => " + toVersion);
    }
}